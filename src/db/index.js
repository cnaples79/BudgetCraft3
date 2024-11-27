import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, 'database.sqlite')

export async function initializeDatabase() {
  // If database is corrupted, delete it
  try {
    const db = new sqlite3.Database(dbPath)
    db.close()
  } catch (error) {
    if (error.code === 'SQLITE_CORRUPT') {
      console.log('Database corrupted, creating new database...')
      try {
        fs.unlinkSync(dbPath)
      } catch (err) {
        // Ignore if file doesn't exist
      }
    }
  }

  const db = await open({
    filename: dbPath,
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