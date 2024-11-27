import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useStore } from '../store'
import { fetchTransactions, fetchBudgets } from '../api'

export function Dashboard() {
  const { setAddTransactionOpen } = useStore()
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions
  })
  const { data: budgets = [] } = useQuery({
    queryKey: ['budgets'],
    queryFn: fetchBudgets
  })

  const totalBalance = transactions.reduce((acc, tx) => 
    tx.type === 'income' ? acc + tx.amount : acc - tx.amount, 0)

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">BudgetCraft</h1>
        <button
          onClick={() => setAddTransactionOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full"
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 mb-6">
        <p className="text-gray-400 mb-1">Total Balance</p>
        <p className="text-3xl font-bold">
          ${totalBalance.toFixed(2)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="flex justify-between items-center mb-3">
              <div>
                <p className="font-medium">{tx.description}</p>
                <p className="text-sm text-gray-400">
                  {format(new Date(tx.date), 'MMM dd, yyyy')}
                </p>
              </div>
              <p className={tx.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Budget Overview</h2>
          {budgets.map((budget) => (
            <div key={budget.id} className="mb-4">
              <div className="flex justify-between mb-1">
                <p>{budget.category}</p>
                <p>${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}</p>
              </div>
              <div className="h-2 bg-gray-700 rounded-full">
                <div
                  className={`h-full rounded-full ${
                    budget.spent > budget.amount ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{
                    width: `${Math.min((budget.spent / budget.amount) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}