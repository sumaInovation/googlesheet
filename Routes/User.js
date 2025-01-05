const express = require('express');
const jwt =require('jsonwebtoken')
require('dotenv').config();
const router = express.Router();

// Define routes
router.post('/login', (req, res) => {
      const username=req.body.username;
      const user={name:username}
      const token=jwt.sign(user,process.env.PRIVATE_SECRET_KEY,{expiresIn:'10s'});
      res.send({token});
});






module.exports = router;