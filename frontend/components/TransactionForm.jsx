// frontend/src/components/TransactionForm.jsx
import React from 'react';
import { useState } from 'react';
import axios from 'axios';

// Predefined categories for the dropdown based on transaction type
const categories = {
  Income: ['Salary', 'Investment', 'Other Income'],
  Expense: ['Groceries', 'Rent', 'Utilities', 'Transportation', 'Dining Out', 'Entertainment', 'Other Expense']
};

// TransactionForm component handles adding new transactions
export default function TransactionForm({ onTransactionCreated, API_BASE_URL, initialData = {} }) {
  // Initialize form state, allowing pre-filled data from `initialData` (e.g., for editing)
  const [formData, setFormData] = useState({
    type: 'Expense', // Default type
    amount: '',      // Amount field
    date: new Date().toISOString().substring(0, 10), // Default to today in YYYY-MM-DD
    description: '', // Optional description
    category: 'Groceries', // Default category for Expense
    ...initialData, // Override defaults with any initial data
  });

  const [submitting, setSubmitting] = useState(false); // Loading state for submission
  const [error, setError] = useState(null); // Error message state

  // Update formData whenever a field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      // If user changes the type, reset the category to the first option of the new type
      ...(name === 'type' && { category: categories[value][0] })
    }));

    setError(null); // Clear any previous error when user edits the form
  };

  // Simple client-side validation before submitting
  const validateForm = () => {
    if (!formData.type) return 'Type is required.';
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) 
      return 'Amount must be a positive number.';
    if (!formData.date || !/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) 
      return 'Date must be in YYYY-MM-DD format.';
    if (!formData.category) return 'Category is required.';
    return null; // No validation errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    const validationError = validateForm(); // Validate form
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true); // Show loading state
    setError(null);

    try {
      // Send transaction data to backend
      const response = await axios.post(`${API_BASE_URL}/transactions`, {
        ...formData,
        amount: parseFloat(formData.amount), // Ensure amount is a number
        source: 'Manual' // Mark transaction as manually added
      });
      
      onTransactionCreated(response.data); // Notify parent about new transaction
      
      // Reset form fields to defaults after successful submission
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
      setSubmitting(false); // Remove loading state
    }
  };

  // Dynamically get the categories based on current type
  const currentCategories = categories[formData.type] || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Display validation or API error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Transaction Type Dropdown */}
      <label className="block text-sm font-medium text-gray-700">Type</label>
      <select name="type" value={formData.type} onChange={handleChange} required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
      </select>

      {/* Amount Input */}
      <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
      <input type="number" name="amount" value={formData.amount} onChange={handleChange}
          required min="0.01" step="0.01" placeholder="e.g., 45.99"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />

      {/* Category Dropdown */}
      <label className="block text-sm font-medium text-gray-700">Category</label>
      <select name="category" value={formData.category} onChange={handleChange} required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          {currentCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
      </select>

      {/* Date Input */}
      <label className="block text-sm font-medium text-gray-700">Date</label>
      <input type="date" name="date" value={formData.date} onChange={handleChange}
          required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />

      {/* Description Input */}
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
