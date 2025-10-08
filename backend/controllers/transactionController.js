// backend/controllers/transactionController.js

import Transaction from '../models/Transaction.js';  // Mongoose model for transactions
import asyncHandler from 'express-async-handler';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// ------------------------------------------------------------------
// --- AI Initialization (Gemini API setup using environment variable) ---
// ------------------------------------------------------------------

// Load the Gemini API key from .env file (optional)
const GEMINI_KEY = process.env.GEMINI_API_KEY || null;

// Initialize the Google Gemini AI client only if a key exists
let ai = null;
if (GEMINI_KEY) {
    try {
        ai = new GoogleGenAI({ apiKey: GEMINI_KEY });
    } catch (err) {
        console.warn('Could not initialize Gemini AI client:', err.message);
        ai = null;
    }
} else {
    console.warn('GEMINI_API_KEY not set; AI receipt extraction route will return a helpful error.');
}

// Utility function to convert uploaded files into Gemini-compatible input
function fileToGenerativePart(path, mimeType) {
    if (!fs.existsSync(path)) {
        throw new Error(`File not found: ${path}`);
    }
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType,
        },
    };
}

// ------------------------------------------------------------------
// --- 1. POST /api/transactions - Create a new transaction ---
// ------------------------------------------------------------------

/**
 * @desc    Create a new transaction for the authenticated user
 * @route   POST /api/transactions
 * @access  Private (Requires JWT authentication)
 */
export const createTransaction = async (req, res) => {
    // `req.user` is attached by the authentication middleware after JWT verification
    const userId = req.user._id;

    try {
        // Create a new transaction linked to the logged-in user
        const newTransaction = await Transaction.create({
            ...req.body,
            user: userId,
        });

        res.status(201).json(newTransaction);
    } catch (error) {
        console.error("Transaction Creation Error:", error);
        res.status(400).json({
            message: 'Validation failed while creating transaction.',
            details: error.message,
        });
    }
};

// ------------------------------------------------------------------
// --- 2. GET /api/transactions - Get all transactions with filters ---
// ------------------------------------------------------------------

/**
 * @desc    Retrieve all transactions for the authenticated user
 *          Supports optional filters by type, start date, and end date
 * @route   GET /api/transactions
 * @access  Private (Requires JWT authentication)
 */
export const getTransactions = async (req, res) => {
    const userId = req.user._id;
    const { type, startDate, endDate } = req.query;

    // Always fetch transactions belonging to the logged-in user
    let filter = { user: userId };

    // Apply optional filters if provided
    if (type && type !== 'All') {
        filter.type = type;
    }
    if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
    }

    try {
        // Fetch and sort transactions by date (newest first)
        const transactions = await Transaction.find(filter).sort({ date: -1 });

        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({
            message: 'Error fetching transactions.',
            details: error.message,
        });
    }
};

// ------------------------------------------------------------------
// --- 3. POST /api/transactions/extract - AI Receipt Extraction ---
// ------------------------------------------------------------------

/**
 * @desc    Use Google Gemini AI to analyze an uploaded receipt image
 *          Extracts store name, total amount, and date as structured data
 * @route   POST /api/transactions/extract
 * @access  Private (Requires JWT authentication)
 */
export const extractReceipt = asyncHandler(async (req, res) => {
    // Ensure a file was uploaded via multer middleware
    if (!req.file) {
        res.status(400);
        throw new Error("No receipt file uploaded.");
    }

    try {
        if (!ai) {
            // If AI client isn't configured, respond with a helpful error
            return res.status(503).json({ message: 'AI service not configured on server. Set GEMINI_API_KEY to enable this feature.' });
        }
        // Convert the uploaded image into a Gemini-compatible format
        const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);

        // Define the AI prompt to extract specific structured data
        const prompt = `
            Analyze this receipt image. Extract:
            1. Total purchase amount (number)
            2. Store name (string)
            3. Purchase date in YYYY-MM-DD format (string)
            The expense category is likely 'Groceries' or 'Dining Out'.
            Return ONLY a JSON object in the format:
            {"store": "The Coffee Shop", "amount": 12.50, "date": "2025-10-06"}
        `;

        // Send image and prompt to Gemini API
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [imagePart, { text: prompt }],
        });

        // Parse and clean the response to get the JSON data
        const jsonText = response.text.trim().replace(/^```json\n?|\n?```$/g, '');
    const extractedData = JSON.parse(jsonText);

        // Delete the uploaded temporary file after processing
        fs.unlinkSync(req.file.path);

        res.status(200).json(extractedData);
    } catch (error) {
        // Clean up the uploaded file in case of failure
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        console.error("AI Extraction Error:", error);
        res.status(500);
        throw new Error('AI processing failed or could not extract data. Check API key or image clarity.');
    }
});


// import pdf from 'pdf-parse'; // Library for PDF parsing
// import fs from 'fs';
// const Transaction = require('./models/Transaction'); // MongoDB Model

const parseBankStatementText = (filePath) => {
    // In the real implementation:
    // 1. Read the file: fs.readFileSync(filePath);
    // 2. Parse the PDF: const data = await pdf(dataBuffer);
    // 3. Apply regex/logic to data.text to extract transactions
    console.log(`[Backend] Simulating parsing of file: ${filePath}`);

    // Return mock structured data ready for MongoDB
    return [
        { date: '2024-10-01', description: 'Utility Bill Payment', amount: -85.50, type: 'DEBIT' },
        { date: '2024-10-02', description: 'Online Store Refund', amount: 35.00, type: 'CREDIT' },
    ];
};

// 1. Controller for extracting and saving
export const extractAndSaveTransactions = async (req, res) => {
    // Check if the file was uploaded by the multer middleware
    if (!req.file) {
        return res.status(400).json({ message: 'No PDF file uploaded.' });
    }

    const { originalname, path: filePath } = req.file;
    const userId = req.body.userId; // Assuming userId is passed in the request body/form data

    try {
        // --- Extraction ---
        const extractedEntries = parseBankStatementText(filePath); 

        if (extractedEntries.length === 0) {
            fs.unlinkSync(filePath); // Cleanup file
            return res.status(200).json({ message: 'No entries found in statement.', count: 0 });
        }

        // --- Prepare for MongoDB ---
        const transactionsToInsert = extractedEntries.map(entry => ({
            user: userId ? mongoose.Types.ObjectId(userId) : new mongoose.Types.ObjectId('60d5ec49c6f2a80015b4f8d1'),
            type: entry.type === 'CREDIT' ? 'Income' : 'Expense',
            amount: Math.abs(entry.amount),
            date: entry.date ? new Date(entry.date) : new Date(),
            description: entry.description || '',
            category: entry.category || 'Uncategorized',
            source: originalname || 'bank-statement.pdf'
        }));

        // --- MongoDB Save ---
    const savedTransactions = await Transaction.insertMany(transactionsToInsert);
        
        // --- Cleanup ---
        fs.unlinkSync(filePath); // Delete the temporary file

        res.status(201).json({ 
            message: 'Transactions extracted and saved successfully.', 
            count: savedTransactions.length,
            data: savedTransactions 
        });

    } catch (error) {
        // Ensure temporary file is cleaned up on error
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath); 
        console.error('Extraction Error:', error);
        res.status(500).json({ message: 'Failed to process PDF.', error: error.message });
    }
};

// Keep existing named exports for other controllers (createTransaction, getTransactions, extractReceipt)
