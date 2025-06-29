import 'dotenv';
import path from 'pathe';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import 'dotenv/config';

const sqlite = new Database(
  path.resolve(process.cwd(), process.env.DATABASE_URL!),
  { fileMustExist: false }
);

const db = drizzle(sqlite);
migrate(db, {
  migrationsFolder: path.resolve(process.cwd(), 'src/database/migrations'),
});

export { db };
