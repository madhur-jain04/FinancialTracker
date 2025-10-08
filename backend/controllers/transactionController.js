// // backend/controllers/transactionController.js

// // import Transaction from '../models/Transaction.js';
// import { GoogleGenAI } from '@google/genai'; // Correct import
// import fs from 'fs'; // Correct import
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// import { Transaction } from '../db.js';
// require('dotenv').config();

// // ------------------------------------------------------------------
// // --- AI Initialization (Relies on process.env.GEMINI_API_KEY) ---
// // ------------------------------------------------------------------

// const GEMINI_KEY = process.env.GEMINI_API_KEY;
// console.log("GEMINI_KEY:", GEMINI_KEY); // Debugging line

// // Check if the key is defined before initializing (for safer error handling)
// if (!GEMINI_KEY) {
//     console.error("FATAL ERROR: GEMINI_API_KEY is undefined. Check .env file and server.js.");
//     // Throw an error to halt the server startup if the key is missing
//     throw new Error("Missing GEMINI_API_KEY environment variable.");
// }

// // Initialize Gemini with the API Key
// const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });


// // Helper function: Converts local file to a format Gemini can read
// function fileToGenerativePart(path, mimeType) {
//     if (!fs.existsSync(path)) {
//         throw new Error(`File not found: ${path}`);
//     }
//     return {
//         inlineData: {
//             data: Buffer.from(fs.readFileSync(path)).toString("base64"),
//             mimeType,
//         },
//     };
// }

// // ------------------------------------------------------------------
// // --- 1. POST: Create a new transaction (Manual Entry) ---
// // ------------------------------------------------------------------

// export const createTransaction = async (req, res) => {
//     // NOTE: We need the User ID here for multi-user, but since we haven't implemented
//     // the full JWT middleware yet, we'll assign a placeholder user ID (1) for now.
//     // Replace this logic with actual auth later.
//     const mockUserId = 1; 

//     try {
//         // NOTE: Sequelize uses create(), not new Transaction().save()
//         const newTransaction = await Transaction.create({
//             ...req.body,
//             UserId: mockUserId, // Link to a user
//         });
        
//         // Sequelize returns the instance directly
//         res.status(201).json(newTransaction);
//     } catch (error) {
//         console.error("Transaction Creation Error:", error);
//         res.status(400).json({ message: 'Invalid data provided for transaction.', details: error.message });
//     }
// };

// // ------------------------------------------------------------------
// // --- 2. GET: List transactions (with Filtering by Date/Type) ---
// // ------------------------------------------------------------------

// export const getTransactions = async (req, res) => {
//     // NOTE: We will fetch ALL transactions for ALL users for simplicity now
//     try {
//         const { startDate, endDate, type } = req.query;
//         let whereClause = {}; // Sequelize uses 'where' instead of Mongoose filters

//         // Filter by date range (if needed, but skipping complex filtering for this immediate fix)
//         // For now, fetch everything to ensure data is visible:
        
//         const transactions = await Transaction.findAll({ 
//             order: [['date', 'DESC']] // Sort newest first
//         });
        
//         // Sequelize objects need to be converted to plain JSON for the frontend
//         const plainTransactions = transactions.map(t => t.get({ plain: true })); 
        
//         // IMPORTANT: Sequelize uses capital T in 'Type' and 'UserId'
//         // Frontend expects lowercase 'type' and '_id'. We must map the data before sending.
//         const mappedTransactions = plainTransactions.map(t => ({
//             _id: t.id, // Map Sequelize 'id' to frontend '_id'
//             type: t.type, // 'Income' or 'Expense'
//             amount: t.amount,
//             date: t.date,
//             category: t.category,
//             description: t.description,
//             source: t.source || 'Manual',
//             // userId: t.UserId,
//         }));

//         res.status(200).json(mappedTransactions);
//     } catch (error) {
//         console.error("Error fetching transactions:", error);
//         res.status(500).json({ message: 'Error fetching transactions: ' + error.message });
//     }
// };

// // ------------------------------------------------------------------
// // --- 3. POST: AI Receipt Extraction ---
// // ------------------------------------------------------------------

// export const extractReceipt = async (req, res) => {
//     // Check if the file was uploaded by multer
//     if (!req.file) {
//         return res.status(400).json({ message: "No receipt file uploaded." });
//     }
    
//     try {
//         const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);
        
//         const prompt = `Analyze this receipt image. Extract the single total purchase amount (MUST be a number, e.g., 45.99), the store name (MUST be a string), and the purchase date in YYYY-MM-DD format (MUST be a string). 
//         The expense category is likely 'Groceries' or 'Dining Out'. Return ONLY a single JSON object. DO NOT include any text outside the JSON block.
//         Example JSON: {"store": "The Coffee Shop", "amount": 12.50, "date": "2025-10-06"}`;

//         const response = await ai.models.generateContent({
//             model: 'gemini-2.5-flash',
//             contents: [imagePart, { text: prompt }],
//         });

//         // Clean the text to isolate the JSON object
//         const jsonText = response.text.trim().replace(/^```json\n?|\n?```$/g, '');
//         const extractedData = JSON.parse(jsonText);

//         // Clean up the temporary file created by multer
//         fs.unlinkSync(req.file.path); 

//         // Send back the structured data to the frontend for confirmation
//         res.status(200).json(extractedData);
//     } catch (error) {
//         // Ensure cleanup even on error
//         if (req.file && fs.existsSync(req.file.path)) {
//             fs.unlinkSync(req.file.path);
//         }
//         console.error("AI Extraction Error:", error);
//         res.status(500).json({ message: 'AI processing failed or could not find data. Check API key and image clarity.' });
//     }
// };



// // backend/controllers/transactionController.js
// // import Transaction from '../models/Transaction.js';
// import { GoogleGenAI } from '@google/genai'; // Correct import
// import fs from 'fs'; // Correct import
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// import { Transaction } from '../db.js';
// require('dotenv').config();
// // ------------------------------------------------------------------
// // --- AI Initialization (Relies on process.env.GEMINI_API_KEY) ---
// // ------------------------------------------------------------------
// const GEMINI_KEY = process.env.GEMINI_API_KEY;
// console.log("GEMINI_KEY:", GEMINI_KEY); // Debugging line
// // Check if the key is defined before initializing (for safer error handling)
// if (!GEMINI_KEY) {
//     console.error("FATAL ERROR: GEMINI_API_KEY is undefined. Check .env file and server.js.");
//     // Throw an error to halt the server startup if the key is missing
//     throw new Error("Missing GEMINI_API_KEY environment variable.");
// }
// // Initialize Gemini with the API Key
// const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });
// // Helper function: Converts local file to a format Gemini can read
// function fileToGenerativePart(path, mimeType) {
//     if (!fs.existsSync(path)) {
//         throw new Error(`File not found: ${path}`);
//     }
//     return {
//         inlineData: {
//             data: Buffer.from(fs.readFileSync(path)).toString("base64"),
//             mimeType,
//         },
//     };
// }
// // ------------------------------------------------------------------
// // --- 1. POST: Create a new transaction (Manual Entry) ---
// // ------------------------------------------------------------------
// export const createTransaction = async (req, res) => {
//     // ⬅️ CRITICAL CHANGE: Use the authenticated user ID from the request
//     // This assumes the `protect` middleware is run before this controller.
//     const userId = req.userId; 
    
//     // NOTE: If auth middleware is not yet implemented on the route, this will be undefined.
//     if (!userId) {
//         return res.status(403).json({ message: 'Authentication required.' });
//     }

//     try {
//         const newTransaction = await Transaction.create({
//             ...req.body,
//             UserId: userId, // Link to the authenticated user
//         });
//         // Sequelize returns the instance directly
//         res.status(201).json(newTransaction);
//     } catch (error) {
//         console.error("Transaction Creation Error:", error);
//         res.status(400).json({ message: 'Invalid data provided for transaction.', details: error.message });
//     }
// };
// // ------------------------------------------------------------------
// // --- 2. GET: List transactions (with Filtering by Date/Type) ---
// // ------------------------------------------------------------------
// export const getTransactions = async (req, res) => {
//     // ⬅️ CRITICAL CHANGE: Filter transactions by the authenticated user ID
//     const userId = req.userId;

//     if (!userId) {
//         return res.status(403).json({ message: 'Authentication required.' });
//     }

//     try {
//         const { startDate, endDate, type } = req.query;
//         let whereClause = { UserId: userId }; // ⬅️ ONLY fetch transactions for this user
        
//         // For now, fetch everything for the authenticated user:
//         const transactions = await Transaction.findAll({ 
//             where: whereClause, // Apply user filter
//             order: [['date', 'DESC']] // Sort newest first
//         });
        
//         // Sequelize objects need to be converted to plain JSON for the frontend
//         const plainTransactions = transactions.map(t => t.get({ plain: true })); 
//         // IMPORTANT: Map Sequelize fields to frontend expectations
//         const mappedTransactions = plainTransactions.map(t => ({
//             _id: t.id, // Map Sequelize 'id' to frontend '_id'
//             type: t.type, // 'Income' or 'Expense'
//             amount: t.amount,
//             date: t.date,
//             category: t.category,
//             description: t.description,
//             source: t.source || 'Manual',
//             // userId: t.UserId,
//         }));
//         res.status(200).json(mappedTransactions);
//     } catch (error) {
//         console.error("Error fetching transactions:", error);
//         res.status(500).json({ message: 'Error fetching transactions: ' + error.message });
//     }
// };
// // ------------------------------------------------------------------
// // --- 3. POST: AI Receipt Extraction ---
// // ------------------------------------------------------------------
// export const extractReceipt = async (req, res) => {
//     // ... no changes needed for auth in this function's logic itself ...
//     // Note: The transaction must be saved with req.userId AFTER this extraction, 
//     // but the extraction API call does not need the user ID.
//     // ... existing implementation ...
    
//     if (!req.file) {
//         return res.status(400).json({ message: "No receipt file uploaded." });
//     }
//     try {
//         const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);
//         const prompt = `Analyze this receipt image. Extract the single total purchase amount (MUST be a number, e.g., 45.99), the store name (MUST be a string), and the purchase date in YYYY-MM-DD format (MUST be a string). 
//         The expense category is likely 'Groceries' or 'Dining Out'. Return ONLY a single JSON object. DO NOT include any text outside the JSON block.
//         Example JSON: {"store": "The Coffee Shop", "amount": 12.50, "date": "2025-10-06"}`;
//         const response = await ai.models.generateContent({
//             model: 'gemini-2.5-flash',
//             contents: [imagePart, { text: prompt }],
//         });
//         // Clean the text to isolate the JSON object
//         const jsonText = response.text.trim().replace(/^```json\n?|\n?```$/g, '');
//         const extractedData = JSON.parse(jsonText);
//         // Clean up the temporary file created by multer
//         fs.unlinkSync(req.file.path); 
//         // Send back the structured data to the frontend for confirmation
//         res.status(200).json(extractedData);
//     } catch (error) {
//         // Ensure cleanup even on error
//         if (req.file && fs.existsSync(req.file.path)) {
//             fs.unlinkSync(req.file.path);
//         }
//         console.error("AI Extraction Error:", error);
//         res.status(500).json({ message: 'AI processing failed or could not find data. Check API key and image clarity.' });
//     }
// };


// backend/controllers/transactionController.js
import Transaction from '../models/Transaction.js'; // ⬅️ Import Mongoose Model
import asyncHandler from 'express-async-handler';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs'; 
import dotenv from 'dotenv';

dotenv.config();

// ------------------------------------------------------------------
// --- AI Initialization (No change to AI/FS logic) ---
// ------------------------------------------------------------------

const GEMINI_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY is undefined.");
    throw new Error("Missing GEMINI_API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

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
// --- 1. POST: Create a new transaction (Manual Entry) ---
// ------------------------------------------------------------------

export const createTransaction = async (req, res) => {
    // req.user is attached by the 'protect' middleware after token verification
    const userId = req.user._id; 
    
    try {
        const newTransaction = await Transaction.create({
            ...req.body,
            user: userId, // CRITICAL: Save transaction linked to the authenticated user
        });
        
        res.status(201).json(newTransaction);
    } catch (error) {
        console.error("Transaction Creation Error:", error);
        res.status(400).json({ message: 'Validation failed.', details: error.message });
    }
};

// @route GET /api/transactions (Full Filtering Logic)
export const getTransactions = async (req, res) => {
    const userId = req.user._id;
    const { type, startDate, endDate } = req.query; // Filters sent by frontend
    
    let filter = { user: userId }; // Always filter by the logged-in user

    // Add filters based on query parameters
    if (type && type !== 'All') {
        filter.type = type;
    }
    if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    try {
        // Find transactions for the user, applying filters and sorting by date
        const transactions = await Transaction.find(filter).sort({ date: -1 }); 
        
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: 'Error fetching transactions.', details: error.message });
    }
};

// ------------------------------------------------------------------
// --- 3. POST: AI Receipt Extraction (No changes to AI logic needed) ---
// ------------------------------------------------------------------

export const extractReceipt = asyncHandler(async (req, res) => {
    // ... AI logic remains the same ...
    if (!req.file) {
        res.status(400);
        throw new Error("No receipt file uploaded.");
    }
    
    try {
        const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);
        
        const prompt = `Analyze this receipt image. Extract the single total purchase amount (MUST be a number, e.g., 45.99), the store name (MUST be a string), and the purchase date in YYYY-MM-DD format (MUST be a string). 
        The expense category is likely 'Groceries' or 'Dining Out'. Return ONLY a single JSON object. DO NOT include any text outside the JSON block.
        Example JSON: {"store": "The Coffee Shop", "amount": 12.50, "date": "2025-10-06"}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [imagePart, { text: prompt }],
        });

        const jsonText = response.text.trim().replace(/^```json\n?|\n?```$/g, '');
        const extractedData = JSON.parse(jsonText);

        fs.unlinkSync(req.file.path); 
        res.status(200).json(extractedData);
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error("AI Extraction Error:", error);
        res.status(500);
        throw new Error('AI processing failed or could not find data. Check API key and image clarity.');
    }
});