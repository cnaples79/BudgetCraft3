import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { useStore } from "../store/useStore";
import { format } from "date-fns";

export function DashboardScreen() {
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
        <scrollView className="bg-black">
            <stackLayout className="p-4">
                <label className="text-3xl font-bold text-white text-center mb-4">
                    BudgetCraft
                </label>

                {/* Balance Card */}
                <stackLayout className="bg-[#1a1a1a] rounded-xl p-4 mb-4">
                    <label className="text-gray-400">Total Balance</label>
                    <label className="text-2xl font-bold text-white">
                        ${totalBalance.toFixed(2)}
                    </label>
                </stackLayout>

                {/* Income/Expense Summary */}
                <gridLayout columns="*, *" className="mb-4">
                    <stackLayout col="0" className="bg-[#1a1a1a] rounded-xl p-4 m-1">
                        <label className="text-green-500">Income</label>
                        <label className="text-xl text-white">
                            ${monthlyIncome.toFixed(2)}
                        </label>
                    </stackLayout>
                    <stackLayout col="1" className="bg-[#1a1a1a] rounded-xl p-4 m-1">
                        <label className="text-red-500">Expenses</label>
                        <label className="text-xl text-white">
                            ${monthlyExpenses.toFixed(2)}
                        </label>
                    </stackLayout>
                </gridLayout>

                {/* Recent Transactions */}
                <label className="text-xl font-bold text-white mb-2">
                    Recent Transactions
                </label>
                <stackLayout className="bg-[#1a1a1a] rounded-xl p-4">
                    {transactions.slice(0, 5).map(tx => (
                        <gridLayout key={tx.id} columns="*, auto" className="mb-2">
                            <stackLayout col="0">
                                <label className="text-white">{tx.description}</label>
                                <label className="text-gray-400 text-sm">
                                    {format(new Date(tx.date), 'MMM dd, yyyy')}
                                </label>
                            </stackLayout>
                            <label col="1" className={tx.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                                {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                            </label>
                        </gridLayout>
                    ))}
                </stackLayout>

                {/* Budget Overview */}
                <label className="text-xl font-bold text-white mt-4 mb-2">
                    Budget Overview
                </label>
                <stackLayout className="bg-[#1a1a1a] rounded-xl p-4">
                    {budgets.map(budget => (
                        <stackLayout key={budget.id} className="mb-2">
                            <gridLayout columns="*, auto">
                                <label col="0" className="text-white">{budget.category}</label>
                                <label col="1" className="text-white">
                                    ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                                </label>
                            </gridLayout>
                            <progress 
                                value={budget.spent / budget.amount * 100} 
                                maxValue={100}
                                className={budget.spent > budget.amount ? 'bg-red-500' : 'bg-blue-500'}
                            />
                        </stackLayout>
                    ))}
                </stackLayout>
            </stackLayout>
        </scrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        backgroundColor: "#000000",
    }
});