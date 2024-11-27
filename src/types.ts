export interface Transaction {
    id: string;
    amount: number;
    description: string;
    category: string;
    type: 'income' | 'expense';
    date: string;
}

export interface Budget {
    id: string;
    category: string;
    amount: number;
    period: 'monthly' | 'yearly';
}
