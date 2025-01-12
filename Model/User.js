const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true }, // Google User ID
  name: { type: String, required: true },                  // User's name
  email: { type: String, required: true, unique: true },   // User's email
  picture: { type: String },                               // Profile picture URL
  createdAt: { type: Date, default: Date.now },            // Timestamp
});

const User = mongoose.model('User', userSchema);

module.exports = User;
