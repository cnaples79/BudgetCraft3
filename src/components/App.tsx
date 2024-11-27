import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { DashboardScreen } from './DashboardScreen';
import { AddTransactionScreen } from './AddTransactionScreen';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<DashboardScreen />} />
            <Route path="/add-transaction" element={<AddTransactionScreen />} />
          </Routes>
        </div>
      </Router>
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}
