import 'dotenv';
import path from 'pathe';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';

const sqlite = new Database('database.db');

const db = drizzle(sqlite);
migrate(db, {
  migrationsFolder: path.resolve(process.cwd(), 'src/database/migrations'),
});

export { db };
