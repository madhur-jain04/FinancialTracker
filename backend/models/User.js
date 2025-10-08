// // backend/models/User.js
// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const userSchema = mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Method to compare entered password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // Middleware: Hash password before saving
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// const User = mongoose.model('User', userSchema);

// export default User;

// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// // 1. Define the User Schema
// const UserSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: [true, 'Email is required'],
//         unique: true,
//         lowercase: true,
//         trim: true,
//     },
//     password: {
//         type: String,
//         required: [true, 'Password is required'],
//         minlength: 6,
//     },
// }, {
//     timestamps: true
// });

// // 2. Mongoose Pre-Save Hook for Password Hashing (Runs before user is saved)
// UserSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) {
//         return next();
//     }
//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//         next();
//     } catch (err) {
//         next(err);
//     }
// });

// // 3. Method for Comparing Passwords (Used in login controller)
// UserSchema.methods.matchPassword = async function(enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// // module.exports = mongoose.model('User', UserSchema);

// const User = mongoose.model('User', UserSchema);

// export default User;


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model("User", userSchema);
