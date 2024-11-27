import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

export const fetchTransactions = () => 
  api.get('/transactions').then(res => res.data)

export const createTransaction = (transaction) =>
  api.post('/transactions', transaction).then(res => res.data)

export const fetchBudgets = () =>
  api.get('/budgets').then(res => res.data)

export const createBudget = (budget) =>
  api.post('/budgets', budget).then(res => res.data)