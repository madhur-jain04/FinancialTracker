// frontend/src/components/TransactionList.jsx (Updated)
import React from "react";
import { useState } from 'react';

// Options for the filter dropdowns
const filterOptions = {
    type: ['All', 'Income', 'Expense'],
};

export default function TransactionList({ transactions, onFilterChange, loading }) {
  const [filters, setFilters] = useState({ type: 'All', startDate: '', endDate: '', search: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    const activeFilters = {};
    
    if (filters.type !== 'All') activeFilters.type = filters.type;
    if (filters.startDate) activeFilters.startDate = filters.startDate;
    if (filters.endDate) activeFilters.endDate = filters.endDate;
    
    // Perform description filtering locally for simplicity (Backend search is complex)
    let filteredList = transactions.filter(t => {
      // Apply backend filters first (though the API call does this)
      
      // Local Search Filter
      if (filters.search) {
        return t.description.toLowerCase().includes(filters.search.toLowerCase());
      }
      return true;
    });

    // Call the parent function to fetch the filtered data from the API
    onFilterChange(activeFilters); 
    // Note: The local search is for demonstration; the API call handles the date/type filtering.
  };
  
  // Temporary local filter to show search results immediately
  const locallyFiltered = transactions.filter(t => {
      if (!filters.search) return true;
      return t.description?.toLowerCase().includes(filters.search.toLowerCase());
  });


  return (
    <div className="space-y-6">
      
      {/* Filter Form (Required Feature: Filtering by Type and Date Range) */}
      <form onSubmit={applyFilters} className="flex flex-wrap items-end gap-3 bg-indigo-50 p-4 rounded-xl shadow-lg border border-indigo-100">
        
        {/* Search Description */}
        <div className="flex-grow min-w-[150px] max-w-sm">
          <label className="block text-xs font-bold text-gray-600 mb-1">Search Description</label>
          <input type="text" name="search" value={filters.search} onChange={handleChange} 
              placeholder="e.g., Coffee Shop"
              // Adding p-2 and shadow-sm for a clean input look
              className="w-full rounded-lg border-gray-300 text-sm shadow-sm p-2" /> 
        </div>
        
        {/* Type Filter */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Type</label>
          <select name="type" value={filters.type} onChange={handleChange} 
              className="rounded-lg border-gray-300 text-sm shadow-sm p-2 h-10"> {/* Added height for consistency */}
              {filterOptions.type.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        {/* Start Date Filter */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Start Date</label>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} 
              className="rounded-lg border-gray-300 text-sm shadow-sm p-2 h-10" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">End Date</label>
          <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} 
              className="rounded-lg border-gray-300 text-sm shadow-sm p-2 h-10" />
        </div>

        {/* Filter and Reset Buttons (Fixed Visibility and Padding) */}
        <div className='flex space-x-2 pt-4 sm:pt-0'>
            <button type="submit" disabled={loading}
              // CRUCIAL: Ensuring text is visible and button has clear padding/background
              className="py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50 shadow-md">
              Filter
            </button>
            <button type="button" onClick={() => onFilterChange({})} 
              className="py-2.5 px-4 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition shadow-md">
              Reset
            </button>
        </div>
      </form>

      {/* Transaction List Display */}
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
        {/* ... (Loading/No results logic remains the same) ... */}
        {loading ? (
            <p className="text-center py-8 text-gray-500">Loading transactions...</p>
        ) : locallyFiltered.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No transactions found for the selected filter.</p>
        ) : (
            <ul className="divide-y divide-gray-200">
                {locallyFiltered.map(t => (
                    <li key={t._id} className="py-3 px-4 flex justify-between items-center hover:bg-indigo-50 transition-colors cursor-pointer">
                        <div className="flex-1 min-w-0 pr-4">
                            <p className="text-base font-medium text-gray-900 truncate">
                                {t.description || 'No Description'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {new Date(t.date).toLocaleDateString()} &middot; {t.category}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className={`text-lg font-extrabold ${t.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                                {t.type === 'Expense' ? '-' : '+'}${t.amount.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-400">({t.source})</p>
                        </div>
                    </li>
                ))}
            </ul>
        )}
      </div>
    </div>
  );
}