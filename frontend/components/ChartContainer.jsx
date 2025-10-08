// frontend/src/components/ChartContainer.jsx
import React from 'react';
import { useMemo } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend, 
    CategoryScale, 
    LinearScale, 
    BarElement 
} from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const CHART_COLORS = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', 
    '#6A0572', '#AB83A1', '#C5CBE3', '#969AA8', '#A23B72', '#6465A5'
];


// Logic to process raw transactions into chart data
const processChartData = (transactions) => {
    const expenses = transactions.filter(t => t.type === 'Expense');
    
    // --- 1. Expenses by Category (for Pie Chart) ---
    const categoryTotals = expenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {});
    
    const categoryData = {
        labels: Object.keys(categoryTotals),
        datasets: [{
            data: Object.values(categoryTotals),
            backgroundColor: CHART_COLORS.slice(0, Object.keys(categoryTotals).length),
            hoverBackgroundColor: CHART_COLORS.slice(0, Object.keys(categoryTotals).length),
        }]
    };

    // --- 2. Expenses by Date (for Bar Chart) ---
    const dailyTotals = expenses.reduce((acc, t) => {
        // Use only the date part (YYYY-MM-DD)
        const dateKey = new Date(t.date).toISOString().substring(0, 10);
        acc[dateKey] = (acc[dateKey] || 0) + t.amount;
        return acc;
    }, {});
    
    // Sort dates for a proper timeline display
    const sortedDates = Object.keys(dailyTotals).sort();
    
    const dateData = {
        labels: sortedDates,
        datasets: [{
            label: 'Daily Spending',
            data: sortedDates.map(date => dailyTotals[date]),
            backgroundColor: '#FF6384',
        }]
    };
    
    return { categoryData, dateData };
};


export default function ChartContainer({ transactions ,chartType}) {
    
    const { categoryData, dateData } = useMemo(() => processChartData(transactions), [transactions]);

    if (transactions.filter(t => t.type === 'Expense').length === 0) {
        return (
            <p className="text-center py-8 text-gray-500">
                No expense data available to generate charts. Add an expense!
            </p>
        );
    }
    
    if (chartType === 'line') {
        // Line Chart (Monthly Trend)
        return (
            <div className="h-72"> {/* Fixed height for better alignment */}
                 <Bar 
                    data={dateData} 
                    options={{ 
                        responsive: true,
                        maintainAspectRatio: false, // Allows the chart to fill the container height
                        scales: { y: { beginAtZero: true } }
                    }} 
                />
            </div>
        );
    }

    // Pie Chart (Expense Categories)
    return (
        <div className="max-w-xs mx-auto h-72"> {/* Fixed height for better alignment */}
            <Pie data={categoryData} options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } } // Legend on the right side
            }} />
        </div>
    );
}