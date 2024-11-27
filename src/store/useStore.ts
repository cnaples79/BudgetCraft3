import { create } from 'zustand';
import { Transaction, Budget } from '../types';
import { toast } from 'react-hot-toast';

interface State {
  transactions: Transaction[];
  budgets: Budget[];
  categories: string[];
  addTransaction: (transaction: Transaction) => void;
  editTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  loadData: () => Promise<void>;
}

export const useStore = create<State>((set, get) => ({
  transactions: [],
  budgets: [],
  categories: [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Healthcare',
    'Education',
    'Salary',
    'Investment',
    'Other'
  ],

  addTransaction: (transaction) => {
    set((state) => ({
      transactions: [...state.transactions, transaction],
    }));
    localStorage.setItem('transactions', JSON.stringify(get().transactions));
    toast.success('Transaction added successfully');
  },

  editTransaction: (id, updatedFields) => {
    set((state) => ({
      transactions: state.transactions.map((t) => 
        t.id === id ? { ...t, ...updatedFields } : t
      ),
    }));
    localStorage.setItem('transactions', JSON.stringify(get().transactions));
    toast.success('Transaction updated successfully');
  },

  deleteTransaction: (id) => {
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
    localStorage.setItem('transactions', JSON.stringify(get().transactions));
    toast.success('Transaction deleted successfully');
  },

  addBudget: (budget) => {
    // Check if budget for this category already exists
    const existingBudget = get().budgets.find(b => b.category === budget.category);
    if (existingBudget) {
      toast.error('Budget for this category already exists');
      return;
    }
    set((state) => ({
      budgets: [...state.budgets, budget],
    }));
    localStorage.setItem('budgets', JSON.stringify(get().budgets));
    toast.success('Budget added successfully');
  },

  updateBudget: (budget) => {
    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === budget.id ? budget : b)),
    }));
    localStorage.setItem('budgets', JSON.stringify(get().budgets));
    toast.success('Budget updated successfully');
  },

  deleteBudget: (id) => {
    set((state) => ({
      budgets: state.budgets.filter((b) => b.id !== id),
    }));
    localStorage.setItem('budgets', JSON.stringify(get().budgets));
    toast.success('Budget deleted successfully');
  },

  loadData: async () => {
    try {
      const transactions = localStorage.getItem('transactions');
      const budgets = localStorage.getItem('budgets');

      set({
        transactions: transactions ? JSON.parse(transactions) : [],
        budgets: budgets ? JSON.parse(budgets) : [],
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading data');
    }
  },
}));