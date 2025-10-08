// // // backend/controllers/authController.js
// // import { User } from '../db.js';
// // import jwt from 'jsonwebtoken';

// // const generateToken = (id) => {
// //     return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret', { 
// //         expiresIn: '30d' 
// //     });
// // };

// // // @route POST /api/auth/register
// // export const registerUser = async (req, res) => {
// //     const { email, password } = req.body; 
// //     try {
// //         const userExists = await User.findOne({ where: { username: email } }); 
// //         if (userExists) {
// //             return res.status(400).json({ message: 'User already exists' });
// //         }
        
// //         const user = await User.create({ username: email, password }); 
        
// //         res.status(201).json({ 
// //             _id: user.id, 
// //             username: user.username,
// //             token: generateToken(user.id)
// //         });
// //     } catch (error) {
// //         console.error("Registration Error:", error.message);
// //         res.status(500).json({ message: 'Internal Server Error during registration.' });
// //     }
// // };

// // // @route POST /api/auth/login
// // export const loginUser = async (req, res) => {
// //     const { email, password } = req.body;
// //     try {
// //         const user = await User.findOne({ where: { username: email } });

// //         if (user && (await user.matchPassword(password))) {
// //             res.json({
// //                 _id: user.id,
// //                 username: user.username,
// //                 token: generateToken(user.id)
// //             });
// //         } else {
// //             res.status(401).json({ message: 'Invalid email or password' });
// //         }
// //     } catch (error) {
// //         console.error("Login Error:", error.message);
// //         res.status(500).json({ message: 'Internal Server Error during login.' });
// //     }
// // };


// // backend/controllers/authController.js
// import { User } from '../db.js'; // Assuming you have a User model in db.js
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// require('dotenv').config();

// // Get the secret key from environment variables
// // IMPORTANT: Ensure JWT_SECRET is set in your .env file
// const JWT_SECRET = process.env.JWT_SECRET || 'your-very-strong-secret-key'; 

// // Function to handle user registration (POST /api/auth/register)
// export const registerUser = async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         // 1. Check if user already exists
//         const existingUser = await User.findOne({ where: { username } });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists.' });
//         }

//         // 2. Hash the password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // 3. Create the new user in the database
//         const newUser = await User.create({
//             username,
//             password: hashedPassword,
//         });

//         // 4. Generate JWT
//         const token = jwt.sign(
//             { id: newUser.id, username: newUser.username },
//             JWT_SECRET,
//             { expiresIn: '1h' } // Token expires in 1 hour
//         );

//         // 5. Send success response
//         res.status(201).json({
//             token,
//             user: { id: newUser.id, username: newUser.username },
//         });
//     } catch (error) {
//         console.error('Registration Error:', error);
//         res.status(500).json({ message: 'Server error during registration.' });
//     }
// };

// // Function to handle user login (POST /api/auth/login)
// export const loginUser = async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         // 1. Find the user by username
//         const user = await User.findOne({ where: { username } });
//         if (!user) {
//             return res.status(401).json({ message: 'Invalid credentials.' }); 
//         }

//         // 2. Compare the provided password with the hashed password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({ message: 'Invalid credentials.' }); 
//         }

//         // 3. Generate JWT
//         const token = jwt.sign(
//             { id: user.id, username: user.username },
//             JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         // 4. Send success response
//         res.status(200).json({
//             token,
//             user: { id: user.id, username: user.username }, // Send non-sensitive data
//         });
//     } catch (error) {
//         console.error('Login Error:', error);
//         res.status(500).json({ message: 'Server error during login.' });
//     }
// };

// backend/controllers/authController.js
// import { User } from '../db.js'; // Assuming you have a User model in db.js
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// require('dotenv').config();

// const JWT_SECRET = process.env.JWT_SECRET || 'your-very-strong-secret-key'; 

// // Function to handle user registration (POST /api/auth/register)
// export const registerUser = async (req, res) => {
//     const { username, password } = req.body;
//     console.log(`[AUTH] Attempting registration for: ${username}`);
    
//     // ⚠️ Added check for missing data
//     if (!username || !password) {
//         return res.status(400).json({ message: 'Username and password are required.' });
//     }

//     try {
//         // 1. Check if user already exists
//         const existingUser = await User.findOne({ where: { username } });
//         if (existingUser) {
//             console.log(`[AUTH] Registration failed: User ${username} already exists.`);
//             return res.status(400).json({ message: 'User already exists.' });
//         }
        
//         // 2. Hash the password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // 3. Create the new user in the database
//         const newUser = await User.create({
//             username,
//             password: hashedPassword, // Save the HASHED password
//         });

//         // 4. Generate JWT
//         const token = jwt.sign(
//             { id: newUser.id, username: newUser.username },
//             JWT_SECRET,
//             { expiresIn: '1h' } 
//         );

//         console.log(`[AUTH] Registration successful for: ${username}`);
//         res.status(201).json({
//             token,
//             user: { id: newUser.id, username: newUser.username },
//         });
//     } catch (error) {
//         // ⚠️ This catch block is critical for Sign Up errors (validation, DB connection, etc.)
//         console.error('*** REGISTRATION ERROR (Check DB connection/model validation) ***:', error); 
//         res.status(500).json({ message: 'Server error during registration. Check logs for validation details.' });
//     }
// };

// // Function to handle user login (POST /api/auth/login)
// export const loginUser = async (req, res) => {
//     const { username, password } = req.body;
//     console.log(`[AUTH] Attempting login for: ${username}`);

//     try {
//         // 1. Find the user by username
//         // 🚨 CRITICAL FIX: Ensure 'password' is retrieved even if hidden by defaultScope.
//         const user = await User.findOne({ 
//             where: { username },
//             attributes: ['id', 'username', 'password'], // ⬅️ FIX: Explicitly include password hash
//         });
        
//         if (!user) {
//             console.log(`[AUTH] Login failed: User ${username} not found.`);
//             return res.status(401).json({ message: 'Invalid credentials.' }); 
//         }

//         // 2. Compare the provided password with the hashed password
//         const isMatch = await bcrypt.compare(password, user.password);
        
//         if (!isMatch) {
//             console.log(`[AUTH] Login failed: Password mismatch for ${username}.`);
//             // For security, still return vague message
//             return res.status(401).json({ message: 'Invalid credentials.' }); 
//         }

//         // 3. Generate JWT
//         const token = jwt.sign(
//             { id: user.id, username: user.username },
//             JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         console.log(`[AUTH] Login successful for: ${username}`);
//         res.status(200).json({
//             token,
//             user: { id: user.id, username: user.username }, 
//         });
//     } catch (error) {
//         console.error('*** LOGIN ERROR (Check Sequelize/Bcrypt config) ***:', error);
//         res.status(500).json({ message: 'Server error during login.' });
//     }
// };

// import User from '../models/User.js';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SUPER_SECRET_KEY_12345';
// const JWT_EXPIRATION = '30d';

// const createToken = (id, email) => {
//     return jwt.sign({ id, email }, JWT_SECRET, {
//         expiresIn: JWT_EXPIRATION,
//     });
// };

// // @route   POST /api/auth/signup
// export const registerUser = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         let user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         user = await User.create({ email, password }); // Password is auto-hashed
//         const token = createToken(user._id, user.email);

//         res.status(201).json({
//             _id: user._id,
//             email: user.email,
//             token, // Send JWT back to client
//             message: 'Registration successful!'
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error during registration', error: error.message });
//     }
// };

// // @route   POST /api/auth/login
// export const loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });

//         if (user && (await user.matchPassword(password))) {
//             const token = createToken(user._id, user.email);

//             res.json({
//                 _id: user._id,
//                 email: user.email,
//                 token, // Send JWT back to client
//                 message: 'Login successful!'
//             });
//         } else {
//             res.status(401).json({ message: 'Invalid credentials' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Server error during login', error: error.message });
//     }
// };


import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
