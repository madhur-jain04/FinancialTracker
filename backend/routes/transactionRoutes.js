// backend/routes/transactionRoutes.js (CLEANED AND PROTECTED)

import express from 'express';
import multer from 'multer';
// import router from 'express.router';
import upload from '../middleware/upload.js';
import fs from 'fs';
import {protect} from '../middleware/authmiddleware.js'; // <-- CORRECT IMPORT
import Transaction from '../models/Transaction.js';

import { 
    createTransaction, 
    getTransactions, 
    extractReceipt,
    extractAndSaveTransactions
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
// const upload = multer({ storage: storage });

const router = express.Router();

// 1. POST route to create a new transaction (REQUIRES LOGIN)
router.post('/', protect, createTransaction);

// 2. GET route to list all transactions (REQUIRES LOGIN)
router.get('/', protect, getTransactions);

// 3. AI Route (REQUIRES LOGIN - file upload first)
router.post('/ai/extract-receipt', protect, upload.single('image'), extractReceipt);

router.get('/categories/:category', protect, async(req,res)=>{
    const category = req.params.category;
    const sumThirty = new Date();
    sumThirty.setDate(sumThirty.getDate() - 30);
    try{
        const userId = req.user._id;
        const transactions = await Transaction.find({
            user: userId,
            category,
            date: { $gte: sumThirty}
        });

        const total = transactions.reduce((sum,t)=>sum+t.amount,0);

        res.json({total, transactions});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

// Mocking the route without actual multer dependency for concept
// Convenience route: accept a PDF (field name: 'pdf') and extract/save transactions
router.post('/extract', upload.single('pdf'), extractAndSaveTransactions);
// db.transaction.aggregate([
//     {$match : { userId:"123" , category:"Food", date: { $gte: sumThirty} } }, 
//     {$group :{
//         _id : category,
//         total : { $sum : "$amount"},
//         count : { $sum : 1}
//     }},
//     {$project : { _id:0, category:"$_id", total:1, count:1 } },
//     {$sort : { total : -1 } }
// ])

export default router;