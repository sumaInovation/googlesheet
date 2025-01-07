const jwt = require('jsonwebtoken');
const express = require('express');
const { OAuth2Client } = require("google-auth-library");

require('dotenv').config();
   
const router = express.Router();
// Replace with your Google OAuth Client ID
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
// Secret key for signing JWT
const SECRET_KEY = process.env.PRIVATE_SECRET_KEY;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);


   router.post('/login',async(req,res)=>{
    const { id_token } = req.body; // Frontend sends the Google ID token

    if (!id_token) {
      return res.status(400).json({ error: "ID token is required" });
    }
  
    try {
      // Verify the ID token with Google
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: GOOGLE_CLIENT_ID,
      });
  
      const payload = ticket.getPayload(); // Extract user info from the token
      const { name, picture, email } = payload;
  
      // Filter the user data to include only what you need
      const userData = { name, picture, email, role: "user" };
  
      // Generate a JWT containing filtered user data
      const token = jwt.sign(userData, SECRET_KEY, { expiresIn: "1h" });
       res.cookie("authToken",token,{
            httpOnly:true,
            secure:true,//when We use HTTPS set as true else false
            sameSite:'none'//when we use HTTPS use this else not use
         })
   res.status(200).json({ message: "Login successful!" });
  } catch (error) {
    console.error("Error verifying Google token:", error.message);
    res.status(401).json({ error: "Invalid Google token" });
  }

          
   }) 
   
   router.get('/profile',async(req,res)=>{
    const { authToken } = req.cookies;

    if (!authToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    try {
      // Decode and verify the JWT
      const userData = jwt.verify(authToken, SECRET_KEY);
      res.status(200).json(userData); // Send user data to the frontend
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
   
   })
  
router.post('/logout',async(req,res)=>{
res.clearCookie('auth');
console.log("involked")
res.json({"message":"Logout successfully"})


})
  
module.exports = router


