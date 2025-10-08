import React, { useState, useEffect, useMemo,useCallback} from 'react';
import PdfUploader  from '../components/PdfUploader';
import { LogOut, TrendingUp, Wallet, User, PlusCircle, Receipt, CheckCircle, FileText, LayoutDashboard, Search, Calendar, Filter, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Note: axios is removed and replaced with a mocked data fetch using Promises for asynchronous behavior simulation.
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for conditional amount coloring
const getAmountColor = (type) => (type === 'Income' ? 'text-green-600' : 'text-red-600');

const mockDatabase = JSON.parse(localStorage.getItem('mockUsers')) || [];
const saveMockDatabase = (db) => localStorage.setItem('mockUsers', JSON.stringify(db));

// Using a simple Base64/JSON string for demo purposes instead of bcrypt/real JWT for client-side compatibility.
const mockHash = (password) => btoa(password + 'salt');
const mockVerify = (password, hash) => mockHash(password) === hash;

const createMockToken = (userId) => {
  const payload = { id: userId, iat: Date.now() };
  // Simulate token as base64-encoded user ID
  return btoa(JSON.stringify(payload));
};

const verifyMockToken = (token) => {
    try {
        const payload = JSON.parse(atob(token));
        // A basic check to ensure the payload structure is present
        if (payload && payload.id) {
            return payload.id;
        }
    } catch (e) {
        return null; // Invalid token format
    }
    return null;
};

// Tailwind CSS Utility Classes for the new compact design
const cardClass = "bg-white p-6 rounded-2xl shadow-xl transition-shadow duration-300 hover:shadow-2xl border border-gray-100";
const cardCompactClass = "bg-white p-4 rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl border border-gray-100";

// Sample Data to simulate a backend response
const initialSampleTransactions = [
  // Jan - Jun 2025 Data (for charts)
  { _id: 'jan_inc1', type: 'Income', amount: 5000, date: '2025-01-15', category: 'Salary', description: 'Jan Salary', source: 'Manual' },
  { _id: 'jan_exp1', type: 'Expense', amount: 1450, date: '2025-01-20', category: 'Food', description: 'Groceries', source: 'Manual' },
  { _id: 'feb_inc1', type: 'Income', amount: 5500, date: '2025-02-15', category: 'Salary', description: 'Feb Salary', source: 'Manual' },
  { _id: 'feb_exp1', type: 'Expense', amount: 1600, date: '2025-02-20', category: 'Rent', description: 'Monthly Rent', source: 'Manual' },
  { _id: 'mar_inc1', type: 'Income', amount: 6000, date: '2025-03-15', category: 'Freelance', description: 'Project Alpha', source: 'Manual' },
  { _id: 'mar_exp1', type: 'Expense', amount: 2000, date: '2025-03-20', category: 'Travel', description: 'Weekend Trip', source: 'Manual' },
  { _id: 'apr_inc1', type: 'Income', amount: 5000, date: '2025-04-15', category: 'Salary', description: 'Apr Salary', source: 'Manual' },
  { _id: 'apr_exp1', type: 'Expense', amount: 1200, date: '2025-04-20', category: 'Utilities', description: 'Electric & Gas', source: 'Manual' },
  { _id: 'may_inc1', type: 'Income', amount: 7000, date: '2025-05-15', category: 'Bonus', description: 'Quarterly Bonus', source: 'Manual' },
  { _id: 'may_exp1', type: 'Expense', amount: 1800, date: '2025-05-20', category: 'Food', description: 'Dining Out', source: 'Manual' },
  { _id: 'jun_inc1', type: 'Income', amount: 8500, date: '2025-06-15', category: 'Salary', description: 'Jun Salary', source: 'Manual' },
  { _id: 'jun_exp1', type: 'Expense', amount: 175, date: '2025-06-15', category: 'Other', description: 'Misc Supplies', source: 'Manual' },
  // Oct 2025 Data (matching second image for recent activity)
  { _id: 'oct_inc1', type: 'Income', amount: 500.00, date: '2025-10-07', category: 'Salary', description: 'Consulting Fee', source: 'Manual' },
  { _id: 'oct_exp1', type: 'Expense', amount: 10.00, date: '2025-10-07', category: 'Groceries', description: 'Morning Coffee', source: 'Manual' },
  { _id: 'oct_exp2', type: 'Expense', amount: 200.00, date: '2025-10-06', category: 'Rent', description: 'Parking Payment', source: 'Manual' },
  { _id: 'oct_exp3', type: 'Expense', amount: 75.50, date: '2025-10-05', category: 'Food', description: 'Dinner Delivery', source: 'Manual' },
];

// --- STUBBED COMPONENTS (Original imports) ---

const AuthForm = ({ onLogin }) => {
  const handleDemoLogin = () => {
    // Mock user data
    const userData = {
      token: 'mock-token-123',
      email: 'demo@user.com',
    };
    onLogin(userData);
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-500 text-sm">
        Since we don't have a live backend, you can use the demo button below.
      </p>
      <button
        onClick={handleDemoLogin}
        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition duration-150"
      >
        Sign In / Sign Up (Demo)
      </button>
    </div>
  );
};

const TransactionForm = ({ onTransactionCreated }) => {
  const [formData, setFormData] = useState({
    type: 'Expense', amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.amount && formData.description) {
      const newTransaction = {
        ...formData,
        _id: crypto.randomUUID(),
        amount: parseFloat(formData.amount),
        source: 'Manual'
      };
      // Simulate API call success
      onTransactionCreated(newTransaction);
      setFormData({ type: 'Expense', amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] });
      alert('Transaction added successfully!');
    } else {
      alert('Please fill out all fields.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500">
            <option>Expense</option>
            <option>Income</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="50.00" step="0.01" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500">
          <option>Food</option><option>Salary</option><option>Rent</option><option>Travel</option><option>Utilities</option><option>Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="e.g., Coffee at Starbucks" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" required />
      </div>
      <button type="submit" className="w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150">
        Record Entry
      </button>
    </form>
  );
};

const TransactionList = ({ transactions, loading, getAmountColor }) => {
  const [filters, setFilters] = useState({ search: '', type: 'All', startDate: '', endDate: '' });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({ search: '', type: 'All', startDate: '', endDate: '' });
  };

  const filteredTransactions = useMemo(() => {
    let list = transactions;

    if (filters.search) {
      list = list.filter(t => t.description.toLowerCase().includes(filters.search.toLowerCase()));
    }
    if (filters.type !== 'All') {
      list = list.filter(t => t.type === filters.type);
    }
    // Simple date filtering (assuming '2025-10-07' format)
    if (filters.startDate) {
      list = list.filter(t => t.date >= filters.startDate);
    }
    if (filters.endDate) {
      list = list.filter(t => t.date <= filters.endDate);
    }

    // Sort by date descending
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, filters]);

  // Combined Filters UI (matching the filter block in App component)
  const FiltersUI = (
    <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
        {/* Search */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-xs font-medium text-gray-500 mb-1">Search Description</label>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              name="search"
              value={filters.search}
              // onChange={handleFilterChange}
              placeholder="e.g., Coffee Shop"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
        </div>
        
        {/* Type Filter */}
        <div>
          <label htmlFor="type" className="block text-xs font-medium text-gray-500 mb-1">Type</label>
          <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm">
            <option value="All">All</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="flex space-x-2 sm:col-span-2 lg:col-span-1">
          <div className="w-1/2">
            <label htmlFor="startDate" className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>
          <div className="w-1/2">
            <label htmlFor="endDate" className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="w-full lg:w-auto px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors text-sm col-span-1"
        >
          Reset
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden">{FiltersUI}</div> {/* Show filters outside the main app.jsx in the component */}

      {loading && (
        <div className="text-center py-8 text-indigo-500 font-medium">Loading transactions...</div>
      )}

      {!loading && filteredTransactions.length === 0 && (
        <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-xl bg-gray-50">
          No transactions found matching your criteria.
        </div>
      )}

      <div className="space-y-3">
        {filteredTransactions.map(t => (
          <div key={t._id} className="flex justify-between items-center p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${t.type === 'Income' ? 'bg-green-100' : 'bg-red-100'}`}>
                {t.type === 'Income' ? <ArrowUp className="w-4 h-4 text-green-600" /> : <ArrowDown className="w-4 h-4 text-red-600" />}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800 text-sm">{t.description}</span>
                <span className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString()} - {t.category}</span>
              </div>
            </div>
            <span className={`font-bold text-sm ${getAmountColor(t.type)}`}>
              {t.type === 'Income' ? '+' : '-'} ${t.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

const SummaryCards = ({ summary, transactions, cardClass }) => {
  const cards = [
    { title: 'Total Balance', value: summary.balance, icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Total Income', value: summary.totalIncome, icon: ArrowUp, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Total Expense', value: summary.totalExpense, icon: ArrowDown, color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'Entries', value: transactions.length, icon: Receipt, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <>
      {cards.map((card, index) => (
        <div key={index} className={cardClass}>
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg ${card.bg}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-sm font-medium text-gray-500">{card.title}</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {typeof card.value === 'number' ? `$${card.value.toFixed(2)}` : card.value}
          </p>
        </div>
      ))}
    </>
  );
};

const ChartContainer = ({ transactions, chartType }) => {
  // 1. Data Processing for Charts
  const chartData = useMemo(() => {
    if (!transactions.length) return { line: [], pie: [] };

    // Group by month for Line Chart
    const monthlyDataMap = transactions.reduce((acc, t) => {
      const monthYear = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      acc[monthYear] = acc[monthYear] || { month: monthYear, Income: 0, Expense: 0 };
      acc[monthYear][t.type] += t.amount;
      return acc;
    }, {});

    const monthlyLineData = Object.values(monthlyDataMap).sort((a, b) => new Date(a.month) - new Date(b.month));

    // Group by category for Pie Chart (Expenses only)
    const categoryDataMap = transactions
      .filter(t => t.type === 'Expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const categoryPieData = Object.entries(categoryDataMap).map(([name, value]) => ({ name, value }));

    return { line: monthlyLineData, pie: categoryPieData };
  }, [transactions]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        No data available to display charts. Please add some transactions!
      </div>
    );
  }

  // 2. Line Chart Component
  const MonthlyTrendChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData.line} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
        <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
        <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} tickFormatter={(value) => `$${value.toFixed(0)}`} />
        <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
        <Legend />
        <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );

  // 3. Pie Chart Component
  const CategoryPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData.pie}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        >
          {chartData.pie.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
        <Legend align="center" verticalAlign="bottom" layout="horizontal" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div>
      {chartType === 'line' ? <MonthlyTrendChart /> : <CategoryPieChart />}
    </div>
  );
};

const ReceiptUploader = ({ onTransactionCreated }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = () => {
    if (!file) return alert('Please select a file.');
    setLoading(true);
    setExtractedData(null);

    // Simulate AI extraction delay
    setTimeout(() => {
      const mockExtraction = {
        description: 'Extracted: Grocery Store Purchase',
        amount: 45.99,
        category: 'Groceries',
        date: new Date().toISOString().split('T')[0],
      };
      setExtractedData(mockExtraction);
      setLoading(false);
    }, 2000);
  };

  const handleConfirm = () => {
    const newTransaction = {
      ...extractedData,
      _id: crypto.randomUUID(),
      type: 'Expense',
      amount: parseFloat(extractedData.amount),
      source: 'Receipt AI',
    };
    onTransactionCreated(newTransaction);
    setFile(null);
    setExtractedData(null);
    alert('Transaction imported and recorded!');
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-purple-300 bg-purple-50 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
        <input type="file" onChange={handleFileChange} className="hidden" id="receipt-upload" accept="image/*" />
        <label htmlFor="receipt-upload" className="block cursor-pointer">
          <Receipt className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <p className="text-purple-600 font-semibold">{file ? file.name : 'Click or drag a receipt image here'}</p>
          <p className="text-sm text-purple-400 mt-1">Supports JPG, PNG, PDF</p>
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 transition"
      >
        {loading ? 'Analyzing Receipt...' : 'Analyze Receipt with AI'}
      </button>

      {extractedData && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-bold text-green-800 mb-3 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>AI Extraction Complete</span>
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li><span className="font-medium">Description:</span> {extractedData.description}</li>
            <li><span className="font-medium">Amount:</span> ${extractedData.amount}</li>
            <li><span className="font-medium">Category:</span> {extractedData.category}</li>
            <li><span className="font-medium">Date:</span> {extractedData.date}</li>
          </ul>
          <button onClick={handleConfirm} className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
            Confirm and Add Transaction
          </button>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT (Modified to be self-contained) ---

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('userToken') || null);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [protectedData, setProtectedData] = useState('Awaiting authorization check...');

  const handleRegister = (email, password) => {
      setAuthError('');
      setIsLoading(true);
      // 1. Check if user exists (MongoDB logic)
      if (mockDatabase.find(u => u.email === email)) {
        setAuthError('User with this email already exists.');
        setIsLoading(false);
        return;
      }
  
      // 2. Hash password (Mongoose pre-save hook logic)
      const hashedPassword = mockHash(password);
      const newUser = {
        _id: Date.now().toString(),
        email,
        password: hashedPassword, // Store the mock hash
      };
  
      mockDatabase.push(newUser);
      saveMockDatabase(mockDatabase);
  
      // 3. Create token and respond (Controller logic)
      const newToken = createMockToken(newUser._id);
      localStorage.setItem('userToken', newToken);
      setToken(newToken);
      setUser({ id: newUser._id, email: newUser.email });
      setView('dashboard');
      setIsLoading(false);
    };
  
    const handleLogin = (email, password) => {
      setAuthError('');
      setIsLoading(true);
      // 1. Find user (MongoDB logic)
      const user = mockDatabase.find(u => u.email === email);
      if (!user) {
        setAuthError('Invalid credentials.');
        setIsLoading(false);
        return;
      }
  
      // 2. Match password (UserSchema.methods.matchPassword logic)
      if (!mockVerify(password, user.password)) {
        setAuthError('Invalid credentials.');
        setIsLoading(false);
        return;
      }
  
      // 3. Create token and respond (Controller logic)
      const newToken = createMockToken(user._id);
      localStorage.setItem('userToken', newToken);
      setToken(newToken);
      setUser({ id: user._id, email: user.email });
      setView('dashboard');
      setIsLoading(false);
    };
    
    const handleLogout = () => {
      localStorage.removeItem('userToken');
      setToken(null);
      setUser(null);
      setProtectedData('Awaiting authorization check...');
      setView('login');
    };
    
  
    // --- Protected Route Simulation (Middleware Logic) ---
  
    const accessProtectedResource = useCallback(() => {
      if (!token) {
        setProtectedData('Authorization Denied: No token provided.');
        return;
      }
  
      // Simulate sending token in the request header
      // const headers = { 'Authorization': `Bearer ${token}` };
  
      // 1. Run Auth Middleware (middleware/authMiddleware.js logic)
      const userId = verifyMockToken(token); 
  
      if (!userId) {
          setProtectedData('Authorization Denied: Invalid or expired token.');
          handleLogout();
          return;
      }
      
      // 2. Successful Authorization: Fetch data for req.user.id (Controller logic)
      setProtectedData(`✅ Access Granted! Successfully fetched financial data for user ID: ${userId}`);
  
    }, [token, handleLogout]);

    useEffect(() => {
        if (token) {
            const userId = verifyMockToken(token);
            if (userId) {
                // Find user details (simulating database lookup after token verification)
                const userData = mockDatabase.find(u => u._id === userId);
                if (userData) {
                    setUser({ id: userData._id, email: userData.email });
                    setView('dashboard');
                } else {
                    // Token is valid but user ID not found in DB
                    handleLogout();
                }
            } else {
                handleLogout();
            }
        } else {
          setView('login');
        }
      }, [token]);
    
      // Re-run protected access check when dashboard is visible
      useEffect(() => {
          if (view === 'dashboard' && token) {
              accessProtectedResource();
          }
      }, [view, token, accessProtectedResource]);

  // Mocked fetchTransactions using local storage and sample data
  const fetchTransactions = async (filters = {}) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    try {
      // In a real app, this would be an API call
      // const response = await axios.get(`${API_BASE_URL}/transactions?${queryString}`);
      // const data = response.data;
      
      const storedData = localStorage.getItem('mockTransactions');
      let data = storedData ? JSON.parse(storedData) : initialSampleTransactions;

      setTransactions(data);
      return data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const handleNewTransaction = (newTransaction) => {
    setTransactions(prev => {
      const newTxList = [newTransaction, ...prev];
      // Persist mock data
      // localStorage.setItem('mockTransactions', JSON.stringify(newTxList));
      return newTxList;
    });
  };

  const summary = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    return { totalIncome, totalExpense, balance };
  }, [transactions]);
  const AuthForm = ({ type }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = (e) => {
      e.preventDefault();
      if (type === 'login') {
        handleLogin(email, password);
      } else {
        handleRegister(email, password);
      }
    };

    const title = type === 'login' ? 'Sign In' : 'Sign Up';
    const action = type === 'login' ? 'Login' : 'Register';

    return (
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">{title}</h2>
        {authError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error</p>
            <p className="text-sm">{authError}</p>
          </div>
        )}
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {isLoading ? 'Processing...' : action}
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          {type === 'login' ? "Don't have an account?" : "Already have an account?"}
          <button 
            type="button"
            onClick={() => setView(type === 'login' ? 'register' : 'login')}
            className="text-blue-600 hover:text-blue-800 font-semibold ml-1"
          >
            {type === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </form>
    );
  };

  const Dashboard = () => (
    <div className="w-full max-w-3xl bg-white p-10 rounded-xl shadow-2xl">
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-4xl font-bold text-gray-900">Financial Dashboard</h2>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-md"
        >
          Sign Out
        </button>
      </div>

      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-lg font-semibold text-blue-800">Welcome, {user?.email}!</p>
        <p className="text-sm text-gray-600 mt-1">Your MERN stack authentication is working.</p>
        <p className="text-xs font-mono text-gray-500 mt-2 break-all">
          Token: <span className="font-bold text-blue-600">{token?.substring(0, 50)}...</span>
        </p>
      </div>

      <div className="p-6 bg-green-50 rounded-lg border-2 border-green-300">
        <h3 className="text-xl font-bold text-green-800 mb-3">Protected API Route (`/api/transactions`)</h3>
        <p className="text-gray-700 font-mono text-sm">{protectedData}</p>
        <p className="mt-3 text-sm text-gray-600">This simulates your Express server verifying the token using middleware and fetching data for `req.user.id`.</p>
      </div>
    </div>
  );
  
  if (!user) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {view === 'login' && <AuthForm type="login" />}
      {view === 'register' && <AuthForm type="register" />}
    </div>
  );
}


  // Navigation tabs data
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add', label: 'Add Entry', icon: PlusCircle },
    { id: 'transactions', label: 'Transactions', icon: Wallet },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'receipts', label: 'Receipts', icon: Receipt },
    // { id: 'pdf', label: 'PDF Upload', icon: FileText },
    { id: 'pdf', label: 'PDF Upload', icon: FileText, content: <PdfUploader onTransactionCreated={handleNewTransaction} API_BASE_URL={API_BASE_URL} /> },
  ];

  

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Bar Header - Minimal */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14"> {/* Adjusted height */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Finance Assistant
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700 hidden sm:inline">{user.email || user.username || 'Demo User'}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation Block - Bold and Prominent */}
      <nav className="bg-white shadow-md border-b border-gray-100 sticky top-14 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1.5 overflow-x-auto py-2.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = view === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-4 rounded-xl transition-all duration-200 whitespace-nowrap text-sm font-medium ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200/50'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Dashboard View */}
        {view === 'dashboard' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Dashboard Overview</h2>
            
            {/* Summary Cards - Compact Layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCards summary={summary} transactions={transactions} cardClass={cardCompactClass} />
            </div>

            {/* Charts - Styled to be contained/clean */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Monthly Trend (Larger for line chart) */}
              <div className={`${cardClass} lg:col-span-2`}>
                <h3 className="mb-4 text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <span>Monthly Trend</span>
                </h3>
                <ChartContainer transactions={transactions} chartType="line" />
              </div>
              
              {/* Expense Categories (Smaller for pie chart) */}
              <div className={cardClass}>
                <h3 className="mb-4 text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-purple-600" />
                  <span>Expense Categories</span>
                </h3>
                <ChartContainer transactions={transactions} chartType="pie" />
              </div>
            </div>

            {/* Recent Transactions Section */}
            <div className={cardClass}>
              <h2 className="mb-6 text-xl font-bold text-gray-800 flex items-center space-x-3">
                <Wallet className="w-6 h-6 text-indigo-600" />
                <span>Recent Transactions</span>
                <button 
                  onClick={() => setView('transactions')}
                  className="ml-auto text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  View All &rarr;
                </button>
              </h2>
              
              {/* Transaction List (Displaying only the first 5 transactions) */}
              <TransactionList
                transactions={transactions.slice(0, 5)}
                loading={loading}
                // onFilterChange={handleFilterChange}
                getAmountColor={getAmountColor}
              />
            </div>
          </div>
        )}

        {/* Add Entry View */}
        {view === 'add' && (
          <div className="max-w-2xl mx-auto">
            <div className={cardClass}>
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="flex items-center space-x-3 text-2xl font-bold text-gray-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                    <PlusCircle className="w-6 h-6 text-white" />
                  </div>
                  <span>Add Transaction</span>
                </h2>
                <p className="text-gray-500 mt-2 text-sm">Record a new income or expense entry manually</p>
              </div>
              <TransactionForm onTransactionCreated={handleNewTransaction} API_BASE_URL={API_BASE_URL} />
            </div>
          </div>
        )}

        {/* Transactions View (Full History with Filters) */}
        {view === 'transactions' && (
          <div className={cardClass}>
            <h2 className="mb-6 text-xl font-bold text-gray-800 flex items-center space-x-3">
              <Wallet className="w-6 h-6 text-indigo-600" />
              <span>All Transactions History</span>
            </h2>
            
            {/* The TransactionList component now includes the filter UI logic internally */}
            <TransactionList
              transactions={transactions}
              loading={loading}
              getAmountColor={getAmountColor}
              // onFilterChange={handleFilterChange}
            />
          </div>
        )}

        {/* Analytics View */}
        {view === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-900">Financial Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={cardClass}>
                <h3 className="mb-6 text-gray-700 flex items-center space-x-2 font-semibold text-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Monthly Trend Analysis</span>
                </h3>
                <ChartContainer transactions={transactions} chartType="line" />
              </div>
              <div className={cardClass}>
                <h3 className="mb-6 text-gray-700 flex items-center space-x-2 font-semibold text-lg">
                  <Filter className="w-5 h-5 text-purple-600" />
                  <span>Expense Categories Distribution</span>
                </h3>
                <ChartContainer transactions={transactions} chartType="pie" />
              </div>
            </div>
          </div>
        )}

        {/* Receipts View */}
        {view === 'receipts' && (
          <div className="max-w-2xl mx-auto">
            <div className={cardClass}>
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="flex items-center space-x-3 text-2xl font-bold text-gray-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Receipt className="w-6 h-6 text-white" />
                  </div>
                  <span>Receipt Upload</span>
                </h2>
                <p className="text-gray-500 mt-2 text-sm">Upload receipts to automatically extract expense data using AI (Mock Feature)</p>
              </div>
              <ReceiptUploader onTransactionCreated={handleNewTransaction} API_BASE_URL={API_BASE_URL} />
            </div>
          </div>
        )}

        {/* PDF Upload View (Stub) */}
        {view === 'pdf' && (
          <div className="max-w-2xl mx-auto">
            <div className={cardClass}>
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="flex items-center space-x-3 text-2xl font-bold text-gray-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <span>PDF Transaction History Upload</span>
                </h2>
                <p className="text-gray-500 mt-2 text-sm">Upload PDF bank statements to import transaction history (Mock Feature)</p>
              </div>
              <div className="border-2 border-dashed border-indigo-300 bg-indigo-50 rounded-xl p-12 text-center hover:border-indigo-500 transition-colors cursor-pointer">
                <FileText className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                <p className="text-indigo-600 font-semibold">Click or drag a PDF statement here</p>
                <PdfUploader onTransactionCreated={handleNewTransaction} API_BASE_URL={API_BASE_URL} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
