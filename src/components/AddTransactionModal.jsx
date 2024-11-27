import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useStore } from '../store'
import { createTransaction } from '../api'
import toast from 'react-hot-toast'

export function AddTransactionModal() {
  const { setAddTransactionOpen } = useStore()
  const queryClient = useQueryClient()
  const [form, setForm] = React.useState({
    amount: '',
    description: '',
    category: '',
    type: 'expense'
  })

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      setAddTransactionOpen(false)
      toast.success('Transaction added successfully!')
    },
    onError: () => {
      toast.error('Failed to add transaction')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({
      ...form,
      amount: parseFloat(form.amount),
      date: new Date().toISOString()
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add Transaction</h2>
          <button
            onClick={() => setAddTransactionOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              type="button"
              className={`p-2 rounded-lg ${
                form.type === 'expense'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
              onClick={() => setForm({ ...form, type: 'expense' })}
            >
              Expense
            </button>
            <button
              type="button"
              className={`p-2 rounded-lg ${
                form.type === 'income'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
              onClick={() => setForm({ ...form, type: 'income' })}
            >
              Income
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full bg-gray-800 rounded-lg p-2 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Description
              </label>
              <input
                type="text"
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-gray-800 rounded-lg p-2 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Category
              </label>
              <input
                type="text"
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-gray-800 rounded-lg p-2 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}