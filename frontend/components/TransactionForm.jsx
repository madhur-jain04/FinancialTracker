// frontend/src/components/TransactionForm.jsx
import React from 'react';
import { useState } from 'react';
import axios from 'axios';

// Define categories for the form dropdown
const categories = {
  Income: ['Salary', 'Investment', 'Other Income'],
  Expense: ['Groceries', 'Rent', 'Utilities', 'Transportation', 'Dining Out', 'Entertainment', 'Other Expense']
};

export default function TransactionForm({ onTransactionCreated, API_BASE_URL, initialData = {} }) {
  const [formData, setFormData] = useState({
    type: 'Expense',
    amount: '',
    date: new Date().toISOString().substring(0, 10), // YYYY-MM-DD
    description: '',
    category: 'Groceries',
    ...initialData,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      // Reset category if the type field changes
      ...(name === 'type' && { category: categories[value][0] })
    }));
    setError(null); // Clear error on change
  };

  const validateForm = () => {
    if (!formData.type) return 'Type is required.';
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) return 'Amount must be a positive number.';
    if (!formData.date || !/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) return 'Date must be in YYYY-MM-DD format.';
    if (!formData.category) return 'Category is required.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/transactions`, {
        ...formData,
        amount: parseFloat(formData.amount), 
        source: 'Manual'
      });
      
      onTransactionCreated(response.data); 
      
      // Reset form fields
      setFormData({
        type: 'Expense',
        amount: '',
        date: new Date().toISOString().substring(0, 10),
        description: '',
        category: 'Groceries',
      });
    } catch (error) {
      console.error("Submission Error:", error.response?.data || error.message);
      setError(`Failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const currentCategories = categories[formData.type] || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {/* Type (Income / Expense) */}
      <label className="block text-sm font-medium text-gray-700">Type</label>
      <select name="type" value={formData.type} onChange={handleChange} required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
      </select>

      {/* Amount */}
      <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
      <input type="number" name="amount" value={formData.amount} onChange={handleChange}
          required min="0.01" step="0.01" placeholder="e.g., 45.99"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />

      {/* Category */}
      <label className="block text-sm font-medium text-gray-700">Category</label>
      <select name="category" value={formData.category} onChange={handleChange} required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          {currentCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
      </select>

      {/* Date */}
      <label className="block text-sm font-medium text-gray-700">Date</label>
      <input type="date" name="date" value={formData.date} onChange={handleChange}
          required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />

      {/* Description */}
      <label className="block text-sm font-medium text-gray-700">Description</label>
      <input type="text" name="description" value={formData.description} onChange={handleChange}
          placeholder="e.g., Dinner at Thai Place"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      
      {/* Submit Button */}
      <button type="submit" disabled={submitting}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
        {submitting ? 'Saving...' : 'Add Transaction'}
      </button>
    </form>
  );
}