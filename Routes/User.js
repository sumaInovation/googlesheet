const jwt = require('jsonwebtoken');
const express = require('express');

require('dotenv').config();

const router = express.Router();

// Secret key for signing JWT
const SECRET_KEY = process.env.PRIVATE_SECRET_KEY;
   router.post('/login',(req,res)=>{
   
    const decode=jwt.decode(req.body.token);
    const user={name:decode.name,profile:decode.picture}
    const token=jwt.sign(user,SECRET_KEY);
    // Store token in a cookie
    res.cookie("authToken", token, {
      httpOnly: true,                // Prevent access to the cookie from JavaScript
      secure: process.env.NODE_ENV === "production",  // Only send over HTTPS in production
      sameSite: "None",              // Allow cross-origin requests
      maxAge: 3600000,               // Cookie expires in 1 hour
    });
  console.log("Login success")
  res.status(200).json({ message: "Login successful", token });
     
   }) 
   
   router.get('/profile',async(req,res)=>{
    const token = req.cookies.authToken; // Extract the token from the cookie
        try{
          const decoded = jwt.verify(token, SECRET_KEY); // Verify the token
          res.send(decoded) 
          console.log(decoded)   
        }catch(error){
          console.log(error) 
          return res.status(401)
          
        }  

   })

   router.post("/logout", (req, res) => {
    // Clear the session cookie
    res.clearCookie("authToken", { 
      httpOnly: true,          // Ensure it can't be accessed by client-side JavaScript
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "Strict",      // Prevent CSRF
    });
  
    res.status(200).json({ message: "Logout successful" });
  });

module.exports = router