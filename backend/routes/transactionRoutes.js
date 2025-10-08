// backend/routes/transactionRoutes.js (CLEANED AND PROTECTED)

import express from 'express';
import multer from 'multer';
import fs from 'fs';
import {protect} from '../middleware/authmiddleware.js'; // <-- CORRECT IMPORT

import { 
    createTransaction, 
    getTransactions, 
    extractReceipt 
} from '../controllers/transactionController.js'; 

// --- Multer Setup (remains the same) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

const router = express.Router();

// 1. POST route to create a new transaction (REQUIRES LOGIN)
router.post('/transactions', protect, createTransaction);

// 2. GET route to list all transactions (REQUIRES LOGIN)
router.get('/transactions', protect, getTransactions);

// 3. AI Route (REQUIRES LOGIN - file upload first)
router.post('/ai/extract-receipt', protect, upload.single('image'), extractReceipt);

export default router;