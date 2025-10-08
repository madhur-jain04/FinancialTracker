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
