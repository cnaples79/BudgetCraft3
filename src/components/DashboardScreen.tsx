import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { format } from "date-fns";
import { Transaction } from "../types";
import { toast } from "react-hot-toast";

export function DashboardScreen() {
    const navigate = useNavigate();
    const { transactions, budgets, categories, addBudget, updateBudget, deleteBudget, editTransaction, deleteTransaction } = useStore();
    const [totalBalance, setTotalBalance] = React.useState(0);
    const [monthlyExpenses, setMonthlyExpenses] = React.useState(0);
    const [monthlyIncome, setMonthlyIncome] = React.useState(0);
    const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
    const [showBudgetForm, setShowBudgetForm] = React.useState(false);
    const [newBudget, setNewBudget] = React.useState({ category: '', amount: '', period: 'monthly' });

    React.useEffect(() => {
        const currentMonth = new Date().getMonth();
        const monthlyTxs = transactions.filter(
            tx => new Date(tx.date).getMonth() === currentMonth
        );

        const income = monthlyTxs
            .filter(tx => tx.type === 'income')
            .reduce((acc, tx) => acc + tx.amount, 0);

        const expenses = monthlyTxs
            .filter(tx => tx.type === 'expense')
            .reduce((acc, tx) => acc + tx.amount, 0);

        setMonthlyIncome(income);
        setMonthlyExpenses(expenses);
        setTotalBalance(income - expenses);
    }, [transactions]);

    const handleEditTransaction = (transaction: Transaction) => {
        setEditingTransaction(transaction);
    };

    const handleUpdateTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTransaction) return;

        editTransaction(editingTransaction.id, editingTransaction);
        setEditingTransaction(null);
    };

    const handleDeleteTransaction = (id: string) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            deleteTransaction(id);
        }
    };

    const handleAddBudget = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(newBudget.amount);
        if (!newBudget.category || isNaN(amount) || amount <= 0) {
            toast.error('Please enter valid budget details');
            return;
        }

        addBudget({
            id: Date.now().toString(),
            category: newBudget.category,
            amount,
            period: newBudget.period as 'monthly' | 'yearly'
        });

        setNewBudget({ category: '', amount: '', period: 'monthly' });
        setShowBudgetForm(false);
    };

    return (
        <div className="min-h-screen bg-black p-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white text-center mb-4">
                    BudgetCraft
                </h1>

                {/* Balance Card */}
                <div className="bg-[#1a1a1a] rounded-xl p-4 mb-4">
                    <p className="text-gray-400">Total Balance</p>
                    <p className="text-2xl font-bold text-white">
                        ${totalBalance.toFixed(2)}
                    </p>
                </div>

                {/* Income/Expense Summary */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-[#1a1a1a] rounded-xl p-4">
                        <p className="text-green-500">Income</p>
                        <p className="text-xl text-white">
                            ${monthlyIncome.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-xl p-4">
                        <p className="text-red-500">Expenses</p>
                        <p className="text-xl text-white">
                            ${monthlyExpenses.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-[#1a1a1a] rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
                        <button
                            onClick={() => navigate('/add-transaction')}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Add Transaction
                        </button>
                    </div>
                    <div className="space-y-2">
                        {transactions.slice(0, 5).map((tx) => (
                            <div key={tx.id} className="flex justify-between items-center p-2 hover:bg-[#2a2a2a] rounded-lg">
                                {editingTransaction?.id === tx.id ? (
                                    <form onSubmit={handleUpdateTransaction} className="w-full flex gap-2">
                                        <input
                                            type="number"
                                            value={editingTransaction.amount}
                                            onChange={(e) => setEditingTransaction({
                                                ...editingTransaction,
                                                amount: parseFloat(e.target.value)
                                            })}
                                            className="bg-[#2a2a2a] text-white rounded px-2 py-1 w-24"
                                        />
                                        <input
                                            type="text"
                                            value={editingTransaction.description}
                                            onChange={(e) => setEditingTransaction({
                                                ...editingTransaction,
                                                description: e.target.value
                                            })}
                                            className="bg-[#2a2a2a] text-white rounded px-2 py-1 flex-1"
                                        />
                                        <button type="submit" className="text-green-500 px-2">Save</button>
                                        <button type="button" onClick={() => setEditingTransaction(null)} className="text-red-500 px-2">Cancel</button>
                                    </form>
                                ) : (
                                    <>
                                        <div>
                                            <p className="text-white font-medium">{tx.description}</p>
                                            <p className="text-gray-400 text-sm">
                                                {format(new Date(tx.date), 'MMM d, yyyy')}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className={`text-lg ${tx.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                                ${tx.amount.toFixed(2)}
                                            </p>
                                            <button
                                                onClick={() => handleEditTransaction(tx)}
                                                className="text-blue-500 hover:text-blue-400"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTransaction(tx.id)}
                                                className="text-red-500 hover:text-red-400"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Budget Overview */}
                <div className="bg-[#1a1a1a] rounded-xl p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Budget Overview</h2>
                        <button
                            onClick={() => setShowBudgetForm(!showBudgetForm)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            {showBudgetForm ? 'Cancel' : 'Add Budget'}
                        </button>
                    </div>

                    {showBudgetForm && (
                        <form onSubmit={handleAddBudget} className="mb-4 space-y-2">
                            <select
                                value={newBudget.category}
                                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                                className="w-full p-2 rounded bg-[#2a2a2a] text-white mb-2"
                            >
                                <option value="">Select Category</option>
                                {categories.filter(cat => !budgets.some(b => b.category === cat)).map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={newBudget.amount}
                                onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                                placeholder="Amount"
                                className="w-full p-2 rounded bg-[#2a2a2a] text-white mb-2"
                            />
                            <select
                                value={newBudget.period}
                                onChange={(e) => setNewBudget({ ...newBudget, period: e.target.value })}
                                className="w-full p-2 rounded bg-[#2a2a2a] text-white mb-2"
                            >
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                            >
                                Add Budget
                            </button>
                        </form>
                    )}

                    <div className="space-y-4">
                        {budgets.map((budget) => {
                            const spent = transactions
                                .filter(tx => 
                                    tx.category === budget.category && 
                                    tx.type === 'expense' &&
                                    (budget.period === 'monthly' 
                                        ? new Date(tx.date).getMonth() === new Date().getMonth()
                                        : new Date(tx.date).getFullYear() === new Date().getFullYear())
                                )
                                .reduce((acc, tx) => acc + tx.amount, 0);
                            const percentage = (spent / budget.amount) * 100;

                            return (
                                <div key={budget.id} className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-white">{budget.category}</span>
                                            <span className="text-gray-400 text-sm ml-2">({budget.period})</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-white">${spent.toFixed(2)} / ${budget.amount.toFixed(2)}</span>
                                            <button
                                                onClick={() => deleteBudget(budget.id)}
                                                className="text-red-500 hover:text-red-400"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${percentage > 100 ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {budgets.length === 0 && !showBudgetForm && (
                            <p className="text-gray-400 text-center">No budgets set. Add a budget to start tracking your spending!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}