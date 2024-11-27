import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { format } from "date-fns";

export function DashboardScreen() {
    const navigate = useNavigate();
    const { transactions, budgets } = useStore();
    const [totalBalance, setTotalBalance] = React.useState(0);
    const [monthlyExpenses, setMonthlyExpenses] = React.useState(0);
    const [monthlyIncome, setMonthlyIncome] = React.useState(0);

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
                        {transactions.slice(0, 5).map((tx, index) => (
                            <div key={index} className="flex justify-between items-center p-2 hover:bg-[#2a2a2a] rounded-lg">
                                <div>
                                    <p className="text-white font-medium">{tx.description}</p>
                                    <p className="text-gray-400 text-sm">
                                        {format(new Date(tx.date), 'MMM d, yyyy')}
                                    </p>
                                </div>
                                <p className={`text-lg ${tx.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                    ${tx.amount.toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Budget Overview */}
                <div className="bg-[#1a1a1a] rounded-xl p-4">
                    <h2 className="text-xl font-semibold text-white mb-4">Budget Overview</h2>
                    <div className="space-y-4">
                        {budgets.map((budget, index) => {
                            const spent = transactions
                                .filter(tx => tx.category === budget.category && tx.type === 'expense')
                                .reduce((acc, tx) => acc + tx.amount, 0);
                            const percentage = (spent / budget.amount) * 100;

                            return (
                                <div key={index} className="space-y-1">
                                    <div className="flex justify-between text-white">
                                        <span>{budget.category}</span>
                                        <span>${spent.toFixed(2)} / ${budget.amount.toFixed(2)}</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${percentage > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}