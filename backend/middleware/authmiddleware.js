// // backend/middleware/authMiddleware.js
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
// import asyncHandler from 'express-async-handler'; // Ensure you install this: npm install express-async-handler

// const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   // Check for 'Bearer' token in the Authorization header
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     try {
//       // Get token from header
//       token = req.headers.authorization.split(' ')[1];

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Get user from the token payload (excluding password)
//       // Attach the full user object to the request. You can access req.user._id
//       req.user = await User.findById(decoded.id).select('-password'); 
      
//       // We will also attach the ID directly for cleaner use in controllers
//       req.userId = req.user._id; 

//       next();
//     } catch (error) {
//       console.error('Token verification failed:', error);
//       res.status(401); // Unauthorized
//       throw new Error('Not authorized, token failed');
//     }
//   }

//   if (!token) {
//     res.status(401);
//     throw new Error('Not authorized, no token');
//   }
// });

// export { protect };

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// NOTE: Use the SAME secret key as in authController.js
const JWT_SECRET = 'YOUR_SUPER_SECRET_KEY_12345'; 

// Middleware to protect routes
export const protect = async (req, res, next) => {
    let token;

    // 1. Check if token exists in the Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            const decoded = jwt.verify(token, JWT_SECRET);

            // 3. Find user by ID from the token payload and attach to request
            // This ensures the user ID is always available in protected routes via req.user._id
            req.user = await User.findById(decoded.id).select('-password'); 
            
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user in token not found' });
            }

            next(); // Authorization successful, proceed to route handler
        } catch (error) {
            console.error('JWT Verification Error:', error);
            res.status(401).json({ message: 'Not authorized, token failed or expired' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// module.exports = { protect };

// export { protect };
