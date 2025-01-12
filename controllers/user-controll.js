const User = require('../Model/User.js')
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
// Create a new OAuth2Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const SECRET_KEY = "sumaautomation"
const singup = async (req, res, next) => {
    const { token } = req.body;
    try {
        // Verify the token using google-auth-library
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        // Extract the payload from the token
        const payload = ticket.getPayload();
        //Access user info
        const { sub, email, name, picture } = payload;
        //Check user is Exit
        let user = await User.findOne({ googleId: sub });
        if (user) return res.status(200).json({ message: 'Already Exit User' });
        if (!user) {
            // If user doesn't exist, create a new one
            user = new User({
                googleId: sub,
                name,
                email,
                picture,
            });
            await user.save(); // Save the user in MongoDB
        }

    return res.status(200).json({ message: 'Login successful', user: { sub, email, name, picture } });
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}


const login = async (req, res, next) => {
    const { token } = req.body;
    try {
        // Verify the token using google-auth-library
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        // Extract the payload from the token
        const payload1 = ticket.getPayload();
        //Access user info
        const { sub, email, name, picture } = payload1;
        //Check user is Exit
        let user = await User.findOne({ googleId: sub });
        if (user) {

            const payload = {
                userId: sub,
                username: email,
            };

        
            const options = {
                expiresIn: '1h',  // The token will expire in 1 hour
            };
          
            const newtoken = jwt.sign(payload, SECRET_KEY, options);
        
          //  res.cookie(String(payload.userId), newtoken, {
            res.cookie("User", newtoken, {
                httpOnly: true,    // Prevents client-side scripts from accessing the cookie
                secure: true, 
                sameSite:'None',     // Ensures the cookie is sent over HTTPS only
                  maxAge: 1000 * 60*60, // Sets the cookie to expire in 60 seconds
              });
           
            return res.status(200).json({ "Message": "Successful Loged in", newtoken },)
        } else {
            res.status(400).json({ "Error": "User Name Or Password Error" });
        }
  
    } catch {
        res.status(401).json({ "Message": "Invalid Reuest" });
    }

}

const tokenverify = async (req, res, next) => {
    try{

    
const token=req.headers.cookie.split("=")[1]
console.log(req.headers.cookie)
    // const headers = req.headers['authorization'];
    // const token=headers.split(' ')[1];
        
if(!token)return res.status(200).json({"Messgae":"No Valid Token Found!"});
     
         jwt.verify(String(token),SECRET_KEY,(err,user)=>{
          if(err)return res.status(200).json("Invalid Token")
        req.user=user;
       next();
          
    })
  
    }catch(error){
        console.log('Cookies not set')
    }
}

const getUser=async(req,res,next)=>{
      
     const googleId=req.user.userId;
    
     let user;
     try{
       user=await User.findOne({googleId});
      
     }catch(err){
        console.log('Error1')
    }
    console.log(user)
    return res.status(200).json(user);

}


exports.singup = singup;
exports.login = login;
exports.getUser=getUser;
exports.tokenverify = tokenverify;

