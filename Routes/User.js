const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const router = express.Router();


// Replace with your Google OAuth Client ID
//const GOOGLE_CLIENT_ID = "your_google_client_id.apps.googleusercontent.com";
const SECRET_KEY = "your_secret_key"; // Use a secure secret key
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Endpoint to handle login
router.post("/login", async (req, res) => {
  const { id_token } = req.body; // Frontend sends the Google ID token

  if (!id_token) {   
    return res.status(400).json({ error: "ID token is required" });
  }

  try {
    // Verify the ID token with Google
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload(); // Extract user info from the token
    const { name, picture, email } = payload;

    // Filter the user data to include only what you need
    const userData = { name, picture, email, role: "Admin" };

    // Generate a JWT containing filtered user data
    const token = jwt.sign(userData, SECRET_KEY, { expiresIn: "1h" });

    // Set the JWT as an HTTP-only cookie
    res.cookie("authToken", token, {
        httpOnly:true,
        //secure:true,//when We use HTTPS set as true else false
        secure:process.env.NODE_EVN==='production',
        sameSite:'none'//when we use HTTPS use this else not use
    });
      /*
      {
  "name": "Sumanga Wimaladasa",
  "picture": "https://lh3.googleusercontent.com/a/ACg8ocLPujXP3VanApX-9iIaLvd9UvHCjZddxauMsXWoa_2FaA3G8Mg=s96-c",
  "email": "sumanga0000@gmail.com",
  "role": "user",
  "iat": 1736225474,
  "exp": 1736229074
}
       
       */
    res.status(200).json({ message: "Login successful!" });
  } catch (error) {
    console.error("Error verifying Google token:", error.message);
    res.status(401).json({ error: "Invalid Google token" });
  }
});

// API to retrieve user info (using the JWT in the cookie)
router.get("/profile", (req, res) => {
  const { authToken } = req.cookies;
     
  if (!authToken) {
    console.log("no token")
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Decode and verify the JWT
    const userData = jwt.verify(authToken, SECRET_KEY);
    console.log(userData)
    res.status(200).json(userData); // Send user data to the frontend
  } catch (error) {
    console.log(error)
    return res.status(401).json({ error: "Invalid token" });
  }
});

router.post('/logout',async(req,res)=>{
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/', // Match the path of the original cookie
    });
    
    res.json({"message":"Logout successfully"})
    
    
    }) 

module.exports = router