// // backend/models/Transaction.js
// import mongoose from 'mongoose';

// const transactionSchema = new mongoose.Schema({
//     // Core Fields
//     type: { type: String, enum: ['Income', 'Expense'], required: true },
//     amount: { type: Number, required: true, min: 0.01 },
//     date: { type: Date, default: Date.now },
//     description: { type: String, trim: true },
    
//     // Categorization
//     category: { 
//         type: String, 
//         required: true, 
//         enum: [
//             'Salary', 'Investment', 'Other Income',
//             'Groceries', 'Rent', 'Utilities', 'Transportation', 'Dining Out', 'Entertainment', 'Other Expense'
//         ]
//     },
    
//     // Source tracking
//     source: { type: String, enum: ['Manual', 'Receipt Image'], default: 'Manual' },
    
// }, { timestamps: true });

// const Transaction = mongoose.model('Transaction', transactionSchema);

// export default Transaction;

import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["Income", "Expense"], required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: "Uncategorized" },
  description: { type: String },
  date: { type: Date, default: Date.now },
  source: { type: String, default: "Manual Entry" },
});

export default mongoose.model("Transaction", transactionSchema);
