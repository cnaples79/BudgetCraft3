import express from 'express';
import { z } from 'zod';
import asyncHandler from 'express-async-handler';

const router = express.Router();

const TransactionSchema = z.object({
  amount: z.number().positive(),
  category: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['income', 'expense']),
  date: z.string().datetime()
});

export default (db) => {
  router.get('/', asyncHandler(async (req, res) => {
    const transactions = await db.all('SELECT * FROM transactions ORDER BY date DESC');
    res.json(transactions);
  }));

  router.post('/', asyncHandler(async (req, res) => {
    const transaction = TransactionSchema.parse(req.body);
    
    const result = await db.run(
      'INSERT INTO transactions (amount, category, description, type, date) VALUES (?, ?, ?, ?, ?)',
      [transaction.amount, transaction.category, transaction.description, transaction.type, transaction.date]
    );
    
    res.status(201).json({ id: result.lastID, ...transaction });
  }));

  router.delete('/:id', asyncHandler(async (req, res) => {
    await db.run('DELETE FROM transactions WHERE id = ?', req.params.id);
    res.status(204).send();
  }));

  return router;
};