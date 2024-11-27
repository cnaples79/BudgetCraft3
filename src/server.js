import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { getDatabase } from './db/index.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { z } from 'zod'

const app = express()
const port = process.env.PORT || 3000
const __dirname = dirname(fileURLToPath(import.meta.url))

// Middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist')))

// Schemas
const TransactionSchema = z.object({
  amount: z.number().positive(),
  category: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['income', 'expense']),
  date: z.string().datetime()
})

const BudgetSchema = z.object({
  category: z.string().min(1),
  amount: z.number().positive(),
  period: z.enum(['monthly', 'weekly'])
})

// Routes
app.get('/api/transactions', async (req, res) => {
  try {
    const db = await getDatabase
    const transactions = await db.all('SELECT * FROM transactions ORDER BY date DESC')
    res.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
})

app.post('/api/transactions', async (req, res) => {
  try {
    const db = await getDatabase
    const transaction = TransactionSchema.parse(req.body)
    
    const result = await db.run(
      'INSERT INTO transactions (amount, category, description, type, date) VALUES (?, ?, ?, ?, ?)',
      [transaction.amount, transaction.category, transaction.description, transaction.type, transaction.date]
    )
    
    res.status(201).json({ id: result.lastID, ...transaction })
  } catch (error) {
    console.error('Error creating transaction:', error)
    res.status(400).json({ error: error.message || 'Failed to create transaction' })
  }
})

app.get('/api/budgets', async (req, res) => {
  try {
    const db = await getDatabase
    const budgets = await db.all('SELECT * FROM budgets')
    res.json(budgets)
  } catch (error) {
    console.error('Error fetching budgets:', error)
    res.status(500).json({ error: 'Failed to fetch budgets' })
  }
})

app.post('/api/budgets', async (req, res) => {
  try {
    const db = await getDatabase
    const budget = BudgetSchema.parse(req.body)
    
    const result = await db.run(
      'INSERT INTO budgets (category, amount, period) VALUES (?, ?, ?)',
      [budget.category, budget.amount, budget.period]
    )
    
    res.status(201).json({ id: result.lastID, ...budget })
  } catch (error) {
    console.error('Error creating budget:', error)
    res.status(400).json({ error: error.message || 'Failed to create budget' })
  }
})

// Catch-all route to serve the frontend
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'))
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// Start server
getDatabase.then(() => {
  app.listen(port, () => {
    console.log(`BudgetCraft server running on port ${port}`)
  })
}).catch(console.error)