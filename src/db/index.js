import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function initializeDatabase() {
  const db = await open({
    filename: join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount DECIMAL NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      type TEXT CHECK(type IN ('income', 'expense')) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      amount DECIMAL NOT NULL,
      spent DECIMAL DEFAULT 0,
      period TEXT CHECK(period IN ('monthly', 'weekly')) NOT NULL
    );
  `)

  return db
}

export const getDatabase = initializeDatabase()