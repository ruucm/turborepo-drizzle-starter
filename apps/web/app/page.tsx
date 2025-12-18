import { db, usersTable } from "@repo/database";

export const dynamic = "force-dynamic";

export default async function IndexPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div>
        <h1>Hello World</h1>
        <p>
          DATABASE_URL is not set. Add it to your <code>.env</code> to enable
          database queries.
        </p>
      </div>
    );
  }

  const users = await db.select().from(usersTable);

  return (
    <div>
      <h1>Hello World</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}
