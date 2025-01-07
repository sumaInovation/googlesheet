const jwt = require('jsonwebtoken');
const express = require('express');

require('dotenv').config();
   
const router = express.Router();

// Secret key for signing JWT
const SECRET_KEY = process.env.PRIVATE_SECRET_KEY;
   router.post('/login',(req,res)=>{
         const{token}=req.body;
         const decode=jwt.sign(token,SECRET_KEY);


         res.cookie('auth',decode,{
            httpOnly:true,
            secure:true,
            sameSite:'none'
         })


       res.json({"message":"cookies has been sent!"});      
   }) 
   
   router.get('/profile',async(req,res)=>{
         const token=req.cookies.auth
    try {
        const newtoken = jwt.verify(token, SECRET_KEY);
        console.log(newtoken)
        res.json({newtoken})
    } catch (err) {
        console.error('Invalid token:', err.message);
        res.json({"message":"Invalid Token"})
    }



   
   })
  
router.post('/logout',async(req,res)=>{
res.clearCookie('auth');
console.log("involked")
res.json({"message":"Logout successfully"})


})
  
module.exports = router


