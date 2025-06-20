import { eq } from "drizzle-orm";
import { usersTable } from "../schema";
import { db } from "../database";
import bcrypt from "bcrypt";

export type UserInsert = typeof usersTable.$inferInsert;
export type UserSelect = typeof usersTable.$inferSelect;

export class UserRepository {
  static async create(
    user: Omit<UserInsert, "password"> & { password: string }
  ) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    return db
      .insert(usersTable)
      .values({
        ...user,
        password: hashedPassword,
      })
      .returning();
  }

  static async findByEmail(email: string) {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return users[0] || null;
  }

  static async findById(id: number) {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return users[0] || null;
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async getAllUsers() {
    return db.select().from(usersTable);
  }
}
