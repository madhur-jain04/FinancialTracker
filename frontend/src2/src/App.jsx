// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut, TrendingUp, Wallet, User, PlusCircle, Receipt, FileText, LayoutDashboard } from 'lucide-react';
import AuthForm from '../components/AuthForm.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionList from '../components/TransactionList.jsx';
import ChartContainer from '../components/ChartContainer.jsx';
import ReceiptUploader from '../components/ReceiptUploader.jsx';
import SummaryCards from '../components/SummaryCards.jsx';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('dashboard');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setView('dashboard');
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    setTransactions([]);
    setView('auth');
  };

  const fetchTransactions = async (filters = {}) => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(filters).toString();
      const response = await axios.get(`${API_BASE_URL}/transactions?${queryString}`);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      alert("Failed to load transactions. Check the server console.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewTransaction = (newTransaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleFilterChange = (filters) => {
    fetchTransactions(filters);
  };

  const calculateSummary = (transactions) => {
    const totalIncome = transactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    return { totalIncome, totalExpense, balance };
  };

  const summary = calculateSummary(transactions);

  // Show auth form if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/70 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Wallet className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Finance Assistant
            </h1>
            <AuthForm API_BASE_URL={API_BASE_URL} onLogin={handleLogin} />
          </div>
        </div>
      </div>
    );
  }

  // Navigation tabs data
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'manual', label: 'Add Entry', icon: PlusCircle },
    { id: 'transactions', label: 'Transactions', icon: Wallet },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'receipt', label: 'Receipts', icon: Receipt },
    { id: 'pdf_upload', label: 'PDF Upload', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Finance Assistant
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">{user.email || user.username || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white/50 backdrop-blur-sm p-1 rounded-xl shadow-lg inline-flex flex-wrap gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    view === tab.id
                      ? 'bg-white shadow-md text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard View */}
        {view === 'dashboard' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SummaryCards summary={summary} transactions={transactions} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
              <div className="lg:col-span-4 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
                <h3 className="mb-6 text-gray-700 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Monthly Trend</span>
                </h3>
                <ChartContainer transactions={transactions} chartType="line" />
              </div>
              <div className="lg:col-span-3 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
                <h3 className="mb-6 text-gray-700 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span>Expense Categories</span>
                </h3>
                <ChartContainer transactions={transactions} chartType="pie" />
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
              <h2 className="mb-6 text-gray-800 flex items-center space-x-2">
                <Wallet className="w-6 h-6 text-blue-600" />
                <span>All Transactions</span>
              </h2>
              <TransactionList
                transactions={transactions}
                onFilterChange={handleFilterChange}
                loading={loading}
              />
            </div>
          </div>
        )}

        {/* Transactions View */}
        {view === 'transactions' && (
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
              <h2 className="mb-6 text-gray-800 flex items-center space-x-2">
                <Wallet className="w-6 h-6 text-blue-600" />
                <span>All Transactions</span>
              </h2>
              <TransactionList
                transactions={transactions}
                onFilterChange={handleFilterChange}
                loading={loading}
              />
            </div>
          </div>
        )}

        {/* Analytics View */}
        {view === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
                <h3 className="mb-6 text-gray-700 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Monthly Trend</span>
                </h3>
                <ChartContainer transactions={transactions} chartType="line" />
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
                <h3 className="mb-6 text-gray-700 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span>Expense Categories</span>
                </h3>
                <ChartContainer transactions={transactions} chartType="pie" />
              </div>
            </div>
          </div>
        )}

        {/* Manual Entry View */}
        {view === 'manual' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
              <h2 className="mb-6 text-gray-800 flex items-center space-x-2">
                <PlusCircle className="w-6 h-6 text-blue-600" />
                <span>Add Manual Transaction</span>
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Record a new income or expense entry
              </p>
              <TransactionForm
                onTransactionCreated={handleNewTransaction}
                API_BASE_URL={API_BASE_URL}
              />
            </div>
          </div>
        )}

        {/* Receipt Upload View */}
        {view === 'receipt' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
              <h2 className="mb-6 text-gray-800 flex items-center space-x-2">
                <Receipt className="w-6 h-6 text-purple-600" />
                <span>Scan Receipt (AI)</span>
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Upload receipts to automatically extract expense data
              </p>
              <ReceiptUploader
                onTransactionCreated={handleNewTransaction}
                API_BASE_URL={API_BASE_URL}
              />
            </div>
          </div>
        )}

        {/* PDF Upload View */}
        {view === 'pdf_upload' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
              <h2 className="mb-6 text-gray-800 flex items-center space-x-2">
                <FileText className="w-6 h-6 text-indigo-600" />
                <span>PDF History Upload (Bonus)</span>
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Feature not implemented yet. This will be the third input mode.
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Upload PDF transaction history</p>
                {/* <ReceiptUploader
                    onTransactionCreated={handleNewTransaction}
                    API_BASE_URL={API_BASE_URL}
                /> */}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
