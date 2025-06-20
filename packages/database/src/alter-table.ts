import "dotenv/config";
import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!);

  try {
    console.log("Adding new columns to users table...");

    // Check if password column exists
    const columnCheck = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'password'`;

    if (columnCheck.length === 0) {
      // Add password column if it doesn't exist
      await sql`ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT 'changeme'`;
      console.log("Added password column");
    } else {
      console.log("Password column already exists");
    }

    // Check if isAdmin column exists
    const adminColumnCheck = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'is_admin'`;

    if (adminColumnCheck.length === 0) {
      // Add isAdmin column if it doesn't exist
      await sql`ALTER TABLE users ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false`;
      console.log("Added is_admin column");
    } else {
      console.log("isAdmin column already exists");
    }

    console.log("Table alterations completed successfully");
  } catch (error) {
    console.error("Error altering table:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
