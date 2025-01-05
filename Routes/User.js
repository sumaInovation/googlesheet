const express = require('express');
const jwt =require('jsonwebtoken')
const router = express.Router();

// Define routes
router.post('/login', (req, res) => {
    res.send('List of users');
});







module.exports = router;