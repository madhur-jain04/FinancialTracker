// frontend/src/components/ReceiptUploader.jsx
import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import TransactionForm from './TransactionForm'; // Reuse the form for final confirmation

export default function ReceiptUploader({ onTransactionCreated, API_BASE_URL }) {
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setExtractedData(null); // Clear previous data
    setError(null);
  };

  const handleExtract = async () => {
    if (!file) return alert("Please select an image file first.");

    const formData = new FormData();
    formData.append('image', file); // 'image' MUST match the name in backend route: upload.single('image')

    setLoading(true);
    setError(null);
    setExtractedData(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/ai/extract-receipt`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Map the extracted JSON to our form fields
      const data = response.data;
      setExtractedData({
        type: 'Expense', // Receipts are always expenses
        amount: data.amount ? parseFloat(data.amount).toFixed(2) : '',
        date: data.date || new Date().toISOString().substring(0, 10),
        description: data.store ? `Purchase at ${data.store}` : 'Receipt Upload',
        category: 'Groceries', // Default safe expense category
        source: 'Receipt Image'
      });
      
    } catch (err) {
      console.error("AI Extraction Failed:", err.response?.data || err.message);
      setError(`Extraction failed: ${err.response?.data?.message || 'Check server console for details.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (newTransaction) => {
    // Notify App.jsx and reset state
    onTransactionCreated(newTransaction);
    setFile(null);
    setExtractedData(null);
  };


  if (extractedData) {
    return (
      <div className="space-y-4">
        <p className="text-green-600 font-semibold">✅ Data Extracted! Review & Confirm:</p>
        {/* Pass extracted data to the TransactionForm for review/editing */}
        <TransactionForm 
            onTransactionCreated={handleFormSubmit} 
            API_BASE_URL={API_BASE_URL} 
            initialData={extractedData} 
        />
        <button 
            onClick={() => setExtractedData(null)} 
            className="w-full text-center text-sm text-gray-500 hover:text-gray-800"
        >
            Cancel Extraction
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/png, image/jpeg" // Restrict to supported image types
        onChange={handleFileChange}
        className="w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
      />
      {file && <p className="text-sm text-gray-500">Selected: {file.name}</p>}
      
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleExtract}
        disabled={!file || loading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50"
      >
        {loading ? 'Analyzing Receipt...' : 'Extract Data with AI'}
      </button>
    </div>
  );
}