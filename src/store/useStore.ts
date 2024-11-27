import { create } from 'zustand';
import { Transaction, Budget, Category } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface State {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
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
    { id: '1', name: 'Food', color: '#4287f5', icon: '🍔' },
    { id: '2', name: 'Transport', color: '#42f5a7', icon: '🚗' },
    { id: '3', name: 'Shopping', color: '#f542a1', icon: '🛍️' },
    { id: '4', name: 'Bills', color: '#f5d442', icon: '📃' },
    { id: '5', name: 'Salary', color: '#42f55a', icon: '💰' },
  ],

  addTransaction: async (transaction) => {
    set((state) => ({
      transactions: [...state.transactions, transaction],
    }));
    await AsyncStorage.setItem('transactions', JSON.stringify(get().transactions));
  },

  addBudget: async (budget) => {
    set((state) => ({
      budgets: [...state.budgets, budget],
    }));
    await AsyncStorage.setItem('budgets', JSON.stringify(get().budgets));
  },

  updateBudget: async (budget) => {
    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === budget.id ? budget : b)),
    }));
    await AsyncStorage.setItem('budgets', JSON.stringify(get().budgets));
  },

  deleteTransaction: async (id) => {
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
    await AsyncStorage.setItem('transactions', JSON.stringify(get().transactions));
  },

  loadData: async () => {
    const transactions = await AsyncStorage.getItem('transactions');
    const budgets = await AsyncStorage.getItem('budgets');
    set({
      transactions: transactions ? JSON.parse(transactions) : [],
      budgets: budgets ? JSON.parse(budgets) : [],
    });
  },
}));