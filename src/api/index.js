import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

export const fetchTransactions = async () => {
  try {
    const response = await api.get('/transactions')
    return response.data
  } catch (error) {
    console.error('Error fetching transactions:', error)
    throw new Error('Failed to fetch transactions')
  }
}

export const createTransaction = async (transaction) => {
  try {
    const response = await api.post('/transactions', transaction)
    return response.data
  } catch (error) {
    console.error('Error creating transaction:', error)
    throw new Error('Failed to create transaction')
  }
}

export const fetchBudgets = async () => {
  try {
    const response = await api.get('/budgets')
    return response.data
  } catch (error) {
    console.error('Error fetching budgets:', error)
    throw new Error('Failed to fetch budgets')
  }
}

export const createBudget = async (budget) => {
  try {
    const response = await api.post('/budgets', budget)
    return response.data
  } catch (error) {
    console.error('Error creating budget:', error)
    throw new Error('Failed to create budget')
  }
}