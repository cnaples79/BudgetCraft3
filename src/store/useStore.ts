import { create } from 'zustand';
import { Transaction, Budget } from '../types';

interface State {
  transactions: Transaction[];
  budgets: Budget[];
  categories: string[];
  addTransaction: (transaction: Transaction) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (budget: Budget) => void;
  deleteTransaction: (id: string) => void;
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
  },

  addBudget: (budget) => {
    set((state) => ({
      budgets: [...state.budgets, budget],
    }));
    localStorage.setItem('budgets', JSON.stringify(get().budgets));
  },

  updateBudget: (budget) => {
    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === budget.id ? budget : b)),
    }));
    localStorage.setItem('budgets', JSON.stringify(get().budgets));
  },

  deleteTransaction: (id) => {
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
    localStorage.setItem('transactions', JSON.stringify(get().transactions));
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
    }
  },
}));