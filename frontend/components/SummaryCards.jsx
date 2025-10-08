// frontend/src/components/SummaryCards.jsx (FINAL VERSION)
import React from 'react';

// Card component for a clean look (Reverting to the popular horizontal style)
const StatCard = ({ title, value, color, icon, unit = '$' }) => {
    // Determine color based on value (Balance) or fixed for Income/Expense
    const valueColor = color.text || (value >= 0 ? 'text-green-600' : 'text-red-600');
    const bgColor = color.bg || (value >= 0 ? 'bg-white' : 'bg-white');

    // Display expenses as a positive number in the card, but apply the expense color
    const displayValue = unit === '$' && value < 0 ? value * -1 : value;
    
    return (
        <div className={`flex flex-col items-start p-6 rounded-xl shadow-lg border-b-4 ${color.border} ${bgColor} hover:shadow-xl transition-shadow border border-gray-200`}>
            <div className="flex justify-between w-full items-start">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
                <span className={`text-xl ${valueColor}`}>{icon}</span>
            </div>
            
            <h3 className={`text-4xl font-extrabold ${valueColor} mt-2`}>
                {unit}{displayValue.toFixed(2)}
            </h3>
            
            {/* You can add the placeholder percentages here for aesthetics if needed */}
            <p className="text-sm text-gray-400 mt-1">
                {title === 'Net Balance' ? 'Goal: 15% savings' : ''}
            </p>
        </div>
    );
};

export default function SummaryCards({ summary, transactions }) {
    // Calculate Monthly Transaction Count (New Data Point)
    const transactionCount = transactions.length;

    return (
        // Grid structure is defined in App.jsx (e.g., grid-cols-4)
        <React.Fragment> 
            
            {/* 1. Net Balance (Primary focus) */}
            <StatCard 
                title="Net Balance" 
                value={summary.balance} 
                icon="💰"
                color={{ border: summary.balance >= 0 ? 'border-green-500' : 'border-red-500', text: summary.balance >= 0 ? 'text-green-600' : 'text-red-600' }} 
            />
            
            {/* 2. Total Income */}
            <StatCard 
                title="Total Income" 
                value={summary.totalIncome} 
                icon="⬆️"
                color={{ border: 'border-indigo-500', text: 'text-indigo-600' }} 
            />
            
            {/* 3. Total Expenses (Note: Displayed as negative in DB but positive here) */}
            <StatCard 
                title="Total Expenses" 
                value={summary.totalExpense} 
                icon="⬇️"
                color={{ border: 'border-red-500', text: 'text-red-600' }} 
            />
            
            {/* 4. Transaction Count (New Card) */}
            <StatCard 
                title="Transactions Count" 
                value={transactionCount} 
                icon="📑"
                unit=""
                color={{ border: 'border-blue-500', text: 'text-blue-600' }} 
            />
        </React.Fragment>
    );
}