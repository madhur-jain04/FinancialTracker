// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Use the same JWT secret key defined in your .env file (recommended)
// Ensure you have: JWT_SECRET=your_secret_key in backend/.env
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SUPER_SECRET_KEY_12345';

/**
 * Middleware to protect routes using JWT authentication.
 * Verifies the token and attaches the authenticated user to `req.user`.
 */
export const protect = async (req, res, next) => {
    let token;

    // Check if the Authorization header exists and starts with 'Bearer'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract the token from the header (after 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, JWT_SECRET);

            // Retrieve the user associated with the token payload (exclude password)
            req.user = await User.findById(decoded.id).select('-password');

            // If user not found (e.g., deleted account), deny access
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            console.error('JWT Verification Error:', error.message);
            res.status(401).json({ message: 'Not authorized, token invalid or expired' });
        }
    } else {
        // If no token is present in headers
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};
