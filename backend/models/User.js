import mongoose from "mongoose";

/**
 * User Schema
 * Defines the structure of the User documents in MongoDB.
 */
const userSchema = new mongoose.Schema({
  // Full name of the user (required)
  name: { 
    type: String, 
    required: true 
  },

  // Email address of the user (required and must be unique)
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  // Hashed password of the user (required)
  password: { 
    type: String, 
    required: true 
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Export the Mongoose model for use in controllers and middleware
export default mongoose.model("User", userSchema);
