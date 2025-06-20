import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { usersTable } from "./schema";
import bcrypt from "bcrypt";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  // Hash the admin password
  const hashedPassword = await bcrypt.hash("C#KW4!HK0O6qxr", 10);

  // Add a regular user
  const user = {
    name: "John",
    age: 30,
    email: "john@example.com",
    password: hashedPassword,
    is_admin: false,
  };

  // Add an admin user
  const adminUser = {
    name: "Admin",
    age: 35,
    email: "apartment.intherealmof.ripley@gmail.com",
    password: hashedPassword,
    is_admin: true,
  };

  try {
    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, adminUser.email));

    if (existingAdmin.length === 0) {
      // Insert the admin user
      await db.insert(usersTable).values(adminUser);
      console.log("Admin user created!");
    } else {
      console.log("Admin user already exists");
    }

    // Check if regular user already exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, user.email));

    if (existingUser.length === 0) {
      // Insert the regular user
      await db.insert(usersTable).values(user);
      console.log("Regular user created!");
    } else {
      console.log("Regular user already exists");
    }

    // Display all users
    const users = await db.select().from(usersTable);
    console.log(
      "All users in the database: ",
      users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        is_admin: u.is_admin,
      }))
    );
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
}

main().finally(() => {
  process.exit(0);
});
