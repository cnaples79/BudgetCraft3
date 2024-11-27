import express from 'express';
import { z } from 'zod';
import asyncHandler from 'express-async-handler';

const router = express.Router();

const BudgetSchema = z.object({
  category: z.string().min(1),
  amount: z.number().positive(),
  period: z.enum(['monthly', 'weekly'])
});

export default (db) => {
  router.get('/', asyncHandler(async (req, res) => {
    const budgets = await db.all('SELECT * FROM budgets');
    res.json(budgets);
  }));

  router.post('/', asyncHandler(async (req, res) => {
    const budget = BudgetSchema.parse(req.body);
    
    const result = await db.run(
      'INSERT INTO budgets (category, amount, period) VALUES (?, ?, ?)',
      [budget.category, budget.amount, budget.period]
    );
    
    res.status(201).json({ id: result.lastID, ...budget });
  }));

  router.put('/:id', asyncHandler(async (req, res) => {
    const budget = BudgetSchema.parse(req.body);
    
    await db.run(
      'UPDATE budgets SET category = ?, amount = ?, period = ? WHERE id = ?',
      [budget.category, budget.amount, budget.period, req.params.id]
    );
    
    res.json({ id: parseInt(req.params.id), ...budget });
  }));

  return router;
};