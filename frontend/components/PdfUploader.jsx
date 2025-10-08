// frontend/src/components/PdfUploader.jsx
import React, { useState } from 'react';
import axios from 'axios';
// import { Button } from './ui/button';
import { FileText, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:5000/api'; 
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Component to review and save extracted rows
const ExtractedReviewTable = ({ items, onTransactionCreated }) => {
    const [status, setStatus] = useState(items.map(() => 'pending'));

    const handleSave = async (item, index) => {
        if (status[index] === 'saving' || status[index] === 'saved') return;

        setStatus(prev => prev.map((s, i) => i === index ? 'saving' : s));

        const token = getToken();
        if (!token) {
            throw new Error('User not authenticated. Please log in.'); // Handles missing token
        }

        // ...
        // FIX: Including the Authorization header
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(dataToSend)
        });

        // try {
        //     // Data format cleanup (matching MongoDB schema)
        //     const dataToSend = {
        //         type: item.type === 'Income' ? 'Income' : 'Expense',
        //         amount: parseFloat(item.amount),
        //         category: item.category || 'Uncategorized',
        //         description: item.description || 'PDF Import Entry',
        //         date: item.date || new Date().toISOString(),
        //         source: 'PDF Upload',
        //     };

        //     const response = await axios.post(`${API_BASE_BASE}/transactions`, dataToSend);
            
        //     if (response.status === 201) {
        //         onTransactionCreated(response.data); 
        //         setStatus(prev => prev.map((s, i) => i === index ? 'saved' : s));
        //         toast.success(`Row ${index + 1} saved!`);
        //     } else {
        //         throw new Error(response.data?.message || 'DB save failed');
        //     }

        // } catch (error) {
        //     setStatus(prev => prev.map((s, i) => i === index ? 'error' : s));
        //     console.error(`Error saving row ${index + 1}:`, error);
        //     toast.error(`Error on row ${index + 1}`);
        // }
    };

    return (
        <div className="space-y-4">
            <h4 className="font-semibold text-green-700 border-b pb-2">✅ Review & Confirm {items.length} Transactions</h4>
            <div className="max-h-96 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100 sticky top-0">
                            <th className="p-2 text-left">Date</th>
                            <th className="text-left">Description</th>
                            <th className="text-right">Amount</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index} className="border-t hover:bg-gray-50">
                                <td className="p-2">{item.date}</td>
                                <td className="p-2">{item.description}</td>
                                <td className={`text-right p-2 font-semibold ${item.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.type === 'Income' ? '+' : '-'}${parseFloat(item.amount).toFixed(2)}
                                </td>
                                <td className="text-center p-2">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                        status[index] === 'saved' ? 'bg-green-100 text-green-800' : 
                                        status[index] === 'error' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-700'
                                    }`}>
                                        {status[index].toUpperCase()}
                                    </span>
                                </td>
                                <td className="text-center p-2">
                                    <button 
                                        onClick={() => handleSave(item, index)} 
                                        disabled={status[index] !== 'pending' && status[index] !== 'error'}
                                        size="sm"
                                    >
                                        {status[index] === 'saving' ? 'Saving...' : 'Save Row'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default function PdfUploader({ onTransactionCreated }) {
    const [file, setFile] = useState(null);
    const [extractedItems, setExtractedItems] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
            setError(`File is too large (${(selectedFile.size / 1024 / 1024).toFixed(2)}MB). Max size is 10MB.`);
            setFile(null);
            return;
        }
        setFile(selectedFile);
        setExtractedItems(null);
        setError(null);
    };

    const handleExtract = async () => {
        if (!file) return setError("Please select a PDF file first.");

        const formData = new FormData();
        formData.append('image', file); // Use 'image' key as backend uses upload.single('image')

        setLoading(true);
        setError(null);
        setExtractedItems(null);

        try {
            const response = await axios.post(`${API_BASE_URL}/ai/extract-receipt`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const dataArray = response.data; 

            if (!Array.isArray(dataArray) || dataArray.length === 0) {
                throw new Error("AI could not extract tabular data from the PDF.");
            }
            
            // Critical: Set the array of extracted items for the review table
            setExtractedItems(dataArray); 

        } catch (err) {
            console.error("AI Extraction Failed:", err.response?.data || err.message);
            setError(`Extraction failed: ${err.response?.data?.message || 'Check console.'}`);
        } finally {
            setLoading(false);
        }
    };

    if (extractedItems) {
        return <ExtractedReviewTable items={extractedItems} onTransactionCreated={onTransactionCreated} />;
    }

    return (
        <div className="space-y-4">
            <input
                type="file"
                accept="application/pdf" // ONLY accept PDF
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload-input"
            />
            <label htmlFor="pdf-upload-input" className="border-2 border-dashed border-indigo-300 bg-indigo-50 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer block">
                <FileText className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
                <p className="text-indigo-600 font-semibold">{file ? file.name : 'Click or drag a PDF statement here'}</p>
                <p className="text-sm text-indigo-400 mt-1">Maximum file size: 10MB</p>
            </label>
            
            {error && <p className="text-red-500 text-sm font-medium flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{error}</p>}

            <button
                onClick={handleExtract}
                disabled={!file || loading || !!error}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
                {loading ? 'Analyzing PDF...' : 'Extract Transactions'}
            </button>
        </div>
    );
}
