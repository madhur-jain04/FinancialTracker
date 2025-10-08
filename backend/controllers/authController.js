import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user and store the hashed password in the database
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    // Hash the password before saving to the database
    const hashed = await bcrypt.hash(password, 10);

    // Create a new user document in MongoDB
    const user = await User.create({ name, email, password: hashed });

    // Send success response
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    // Handle server or validation errors
    res.status(500).json({ message: err.message });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate an existing user and return a JWT token
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email in the database
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Compare entered password with hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate a signed JWT token valid for 7 days
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return the token and user details to the frontend
    res.json({ token, user });
  } catch (err) {
    // Handle any unexpected errors
    res.status(500).json({ message: err.message });
  }
};
