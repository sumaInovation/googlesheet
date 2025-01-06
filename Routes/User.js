const jwt = require('jsonwebtoken');
const express = require('express');

require('dotenv').config();
   
const router = express.Router();

// Secret key for signing JWT
const SECRET_KEY = process.env.PRIVATE_SECRET_KEY;
   router.post('/login',(req,res)=>{
         
       res.json(req.body)      
   }) 
   
   
  

  
module.exports = router



