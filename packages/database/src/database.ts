import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const getEnvVariable = (name: string) => {
  const value = process.env[name];
  if (value == null || value.length === 0) {
    throw new Error(`environment variable ${name} not found`);
  }
  return value;
};

let _client: ReturnType<typeof postgres> | undefined;
let _db: PostgresJsDatabase<typeof schema> | undefined;

export const getClient = () => {
  if (_client) return _client;

  // Disable prefetch as it is not supported for "Transaction" pool mode
  _client = postgres(getEnvVariable("DATABASE_URL"), { prepare: false });
  return _client;
};

export const getDb = () => {
  if (_db) return _db;
  _db = drizzle(getClient(), { schema });
  return _db;
};

export const client: ReturnType<typeof postgres> = new Proxy({} as any, {
  get(_target, prop) {
    return (getClient() as any)[prop];
  },
  apply(_target, thisArg, argArray) {
    return (getClient() as any).apply(thisArg, argArray);
  },
});

export const db: PostgresJsDatabase<typeof schema> = new Proxy({} as any, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});
