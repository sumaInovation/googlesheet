const express = require('express');
const jwt =require('jsonwebtoken');
const cookieParser = require("cookie-parser");
require('dotenv').config();
const router = express.Router();

// Secret key for signing JWT
const SECRET_KEY = process.env.PRIVATE_SECRET_KEY;

// Login route
router.post("/login", (req, res) => {
  const { credential } = req.body;
  const decodedData = jwt.decode(credential); // Decode the token

  // Create a signed JWT token
  const token = jwt.sign({ ...decodedData }, SECRET_KEY, { expiresIn: "7d" });

  // Send token in an httpOnly cookie
  res.cookie("sessionToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Login successful" });
});

// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("sessionToken");
  res.status(200).json({ message: "Logout successful" });
});

// Example of a protected route
router.get("/profile", (req, res) => {
  const token = req.cookies.sessionToken;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const userData = jwt.verify(token, SECRET_KEY);
    res.json(userData);
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
});

module.exports = router