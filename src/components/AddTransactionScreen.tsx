import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { useStore } from "../store/useStore";

export function AddTransactionScreen({ navigation }) {
    const { addTransaction, categories } = useStore();
    const [amount, setAmount] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [type, setType] = React.useState<'income' | 'expense'>('expense');

    const handleSubmit = () => {
        if (!amount || !description || !category) return;

        const transaction = {
            id: Date.now().toString(),
            amount: parseFloat(amount),
            description,
            category,
            type,
            date: new Date().toISOString(),
        };

        addTransaction(transaction);
        navigation.goBack();
    };

    return (
        <scrollView className="bg-black p-4">
            <stackLayout>
                <label className="text-2xl font-bold text-white mb-4">
                    Add Transaction
                </label>

                {/* Transaction Type Toggle */}
                <gridLayout columns="*, *" className="mb-4">
                    <button
                        col="0"
                        className={`p-2 rounded-l-xl ${type === 'expense' ? 'bg-blue-500' : 'bg-[#1a1a1a]'}`}
                        onTap={() => setType('expense')}
                    >
                        <label className="text-white">Expense</label>
                    </button>
                    <button
                        col="1"
                        className={`p-2 rounded-r-xl ${type === 'income' ? 'bg-blue-500' : 'bg-[#1a1a1a]'}`}
                        onTap={() => setType('income')}
                    >
                        <label className="text-white">Income</label>
                    </button>
                </gridLayout>

                {/* Amount Input */}
                <stackLayout className="bg-[#1a1a1a] rounded-xl p-4 mb-4">
                    <label className="text-gray-400 mb-1">Amount</label>
                    <textField
                        keyboardType="number"
                        text={amount}
                        hint="Enter amount"
                        className="text-white text-lg"
                        onTextChange={(e) => setAmount(e.value)}
                    />
                </stackLayout>

                {/* Description Input */}
                <stackLayout className="bg-[#1a1a1a] rounded-xl p-4 mb-4">
                    <label className="text-gray-400 mb-1">Description</label>
                    <textField
                        text={description}
                        hint="Enter description"
                        className="text-white text-lg"
                        onTextChange={(e) => setDescription(e.value)}
                    />
                </stackLayout>

                {/* Category Selection */}
                <label className="text-gray-400 mb-2">Category</label>
                <wrapLayout className="mb-4">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`m-1 p-2 rounded-xl ${category === cat.name ? 'bg-blue-500' : 'bg-[#1a1a1a]'}`}
                            onTap={() => setCategory(cat.name)}
                        >
                            <stackLayout>
                                <label className="text-2xl text-center">{cat.icon}</label>
                                <label className="text-white">{cat.name}</label>
                            </stackLayout>
                        </button>
                    ))}
                </wrapLayout>

                {/* Submit Button */}
                <button
                    className="bg-blue-500 p-4 rounded-xl"
                    onTap={handleSubmit}
                >
                    <label className="text-white text-lg font-bold">Add Transaction</label>
                </button>
            </stackLayout>
        </scrollView>
    );
}