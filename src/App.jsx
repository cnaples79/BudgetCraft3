import React from 'react'
import { Dashboard } from './components/Dashboard'
import { AddTransactionModal } from './components/AddTransactionModal'
import { useStore } from './store'

function App() {
  const { isAddTransactionOpen } = useStore()

  return (
    <div className="min-h-screen bg-black text-white">
      <Dashboard />
      {isAddTransactionOpen && <AddTransactionModal />}
    </div>
  )
}

export default App