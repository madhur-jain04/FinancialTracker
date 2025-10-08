// backend/server.js
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import connectDB from "./config/db.js";
require('dotenv').config();

import mongoose from 'mongoose';
import cors from 'cors';
// We need to create this file next:
import transactionRoutes from './routes/transactionRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
// connectDB(); // Connect to the database
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json()); // Allows parsing of JSON request bodies
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/transactions', transactionRoutes); // Transaction routes

// 1. Database Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// 2. Routes (API Endpoints) - You must create the routes folder and file!
// For now, let's add a simple default route to test the server first
app.get('/', (req, res) => {
    res.send('Server is alive!');
});

// Ensure uploads directory exists so multer won't error
import fs from 'fs';
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// 3. Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
