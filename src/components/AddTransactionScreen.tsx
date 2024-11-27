import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { toast } from "react-hot-toast";

export function AddTransactionScreen() {
    const navigate = useNavigate();
    const { addTransaction, categories } = useStore();
    const [amount, setAmount] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [type, setType] = React.useState<'income' | 'expense'>('expense');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description || !category) {
            toast.error("Please fill in all fields");
            return;
        }

        const transaction = {
            id: Date.now().toString(),
            amount: parseFloat(amount),
            description,
            category,
            type,
            date: new Date().toISOString(),
        };

        addTransaction(transaction);
        toast.success("Transaction added successfully");
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-black p-4">
            <div className="max-w-lg mx-auto">
                <h1 className="text-2xl font-bold text-white mb-4">
                    Add Transaction
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Transaction Type Toggle */}
                    <div className="flex rounded-xl overflow-hidden">
                        <button
                            type="button"
                            className={`flex-1 p-3 ${type === 'expense' ? 'bg-blue-500' : 'bg-[#1a1a1a]'} text-white transition-colors`}
                            onClick={() => setType('expense')}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            className={`flex-1 p-3 ${type === 'income' ? 'bg-blue-500' : 'bg-[#1a1a1a]'} text-white transition-colors`}
                            onClick={() => setType('income')}
                        >
                            Income
                        </button>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-1">
                        <label className="text-gray-400">Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-3 rounded-xl bg-[#1a1a1a] text-white border-2 border-gray-700 focus:border-blue-500 focus:outline-none"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Description Input */}
                    <div className="space-y-1">
                        <label className="text-gray-400">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 rounded-xl bg-[#1a1a1a] text-white border-2 border-gray-700 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter description"
                        />
                    </div>

                    {/* Category Select */}
                    <div className="space-y-1">
                        <label className="text-gray-400">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-3 rounded-xl bg-[#1a1a1a] text-white border-2 border-gray-700 focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="flex-1 p-3 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 p-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                            Add Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}