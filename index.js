// const express = require("express");
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// require('dotenv').config()
// const app = express();
// const PORT = 5000;

// const url="https://pptinovation.vercel.app"
// // Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({ origin: ["http://localhost:3000",url], credentials: true })); // Allow your React client to access the API

// // JWT Secret (use a secure key in production)
// const JWT_SECRET = "your_jwt_secret";

// // Passport Google Strategy (Replace with your credentials)
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID:process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "https://googlesheet-yuetcisb.b4a.run/auth/google/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       // Here, you'd typically save the user to the database
//       const user = {
//         id: profile.id,
//         name: profile.displayName,
//         email: profile.emails[0].value,
//         picture: profile.photos[0].value,
//       };

//       // Generate a JWT token
//       const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });

//       return done(null, { user, token });
//     }
//   )
// );

// // Initialize Passport
// app.use(passport.initialize());

// // Route: Start Google Login
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"], session: false ,prompt: "select_account",})
// );

// // Route: Google OAuth Callback
// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { session: false, failureRedirect: "/" }),
//   (req, res) => {
//     const { token } = req.user;

//     // Send JWT as a cookie to the client
//     res.cookie("token123", token, {
//       httpOnly: true, // Makes the cookie inaccessible to JavaScript
//       secure: true, // Set to rue in production with HTTPS
      
//     });

//     res.redirect("https://pptinovation.vercel.app/singup?name=sumanga"); // Redirect to your React client
//   }
// );


// app.use((req, res, next) => {
//   console.log(`Request URL: ${req.url}`);
//   console.log(`Cookies: ${JSON.stringify(req.cookies)}`);
//   next();
// });

// // Middleware to Verify JWT Token
// const authenticateJWT = (req, res, next) => {
//   console.log("Cookies received: ", req.cookies);

//   const token = req.cookies.token;
//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized: No token provided" });
//   }

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       console.error("JWT verification error: ", err);
//       return res.status(403).json({ message: "Invalid or expired token" });
//     }

//     req.user = user; // Attach the decoded user object to the request
//     next();
//   });
// };

// // Example Protected Route
// app.get("/protected", authenticateJWT, (req, res) => {
//   res.json({
//     message: "This is a protected route",
//     user: req.user, // User details decoded from the JWT
//   });
// });



// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });






// // // // const express = require('express');
// // // // const cookieParser = require("cookie-parser");
// // // // const http = require('http');
// // // // const WebSocket = require('ws');
// // // // const cors = require('cors');
// // // // const helmet = require('helmet');
// // // // const { WriteDataOnGoogleSheet } = require('./Googlesheet/Writedata');
// // // // const { FetchData } = require('./Googlesheet/Fetchdatas');
// // // // const bodyparser = require('body-parser');
// // // // const User =require('./Routes/User')
// // // // const session =require('express-session')

// // // // const PORT = 5000;  
// // // // // Create an Express app
// // // // const app = express();
// // // // app.use(cookieParser());
// // // // app.use(express.json());
// // // // app.use(express.urlencoded({ extended: true })); // Opti
// // // // app.use(bodyparser.json());

// // // // // app.use((req, res, next) => {
// // // // //   // Add COOP and COEP headers to the response
// // // // //   res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); // or 'unsafe-none' if you need less strict policy
// // // // //   res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // or 'unsafe-none' if you need less strict policy

// // // // //   next();
// // // // // });

// // // // // // Configure CORS
// // // // // app.use(cors({
// // // // //  // origin: "http://localhost:3000", // Your frontend's origin
// // // // //   origin: ["http://localhost:3000","https://pptinovation.vercel.app"], // Your frontend's origin
// // // // //   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// // // // //   allowedHeaders: ["Content-Type", "Authorization"],
// // // // //   credentials: true, // Allow cookies or Authorization headers
// // // // // }));
// // // // app.use('/user',User);

  
// // // // const server = http.createServer(app);

// // // // // Create a WebSocket server attached to the HTTP server
// // // // const wss = new WebSocket.Server({ server });

// // // // // Keep track of connected clients
// // // // let clients = [];
// // // // // WebSocket connection handler
// // // // wss.on('connection', async (ws) => {
// // // //   console.log('A new client connected,Total no of Clients', wss.clients.size);
// // // //   clients.push(ws);

// // // //   // Listen for messages from the client
// // // //   ws.on('message', async (message) => {
// // // //     try {
// // // //       const dataFromClient = JSON.stringify(message.toString());
// // // //       const { reason } = JSON.parse(JSON.parse(dataFromClient));
// // // //       //Updates Googlesheet when Any state change
// // // //       if (reason != undefined) {
// // // //         WriteDataOnGoogleSheet(JSON.parse(JSON.parse(dataFromClient)))
// // // //       }


// // // //       wss.clients.forEach((client) => {
// // // //         // Exclude the client that sent the message (skip the sender)
// // // //         if (client !== ws && client.readyState === WebSocket.OPEN) {
// // // //           client.send(dataFromClient);

// // // //         }
// // // //         //  console.log(message.toString())
// // // //       })

// // // //     } catch (e) {
// // // //       console.log("Error :", e);
// // // //     }


// // // //   });
// // // //   // Handle client disconnection
// // // //   ws.on('close', () => {
// // // //     console.log('Client disconnected');
// // // //   });
// // // // });

// // // // app.get('/distributedata',async(req,res)=>{
// // // //   try{
// // // //      const data=await FetchData("sheet1");
     
// // // //      const fileterdata=data.filter(item=>{
// // // //       if(new Date(item[0]).toLocaleDateString()==new Date().toLocaleDateString())return item

// // // //      })
    
// // // //      res.json(fileterdata);
// // // //   }catch(error){
// // // //     console.log(error);
// // // //     res.json("Error Data Ocurs");
// // // //   }
  
// // // // })
// // // // app.get('/userdata',async(req,res) => {
  
// // // // try{
// // // //   const data=await FetchData("Sheet1");
// // // //   res.json(data);

// // // // }catch(error){
// // // //   console.error(error);
// // // //   res.json(error)
// // // // }

// // // // })


// // // // // Enable JSON parsing
// // // // app.use(express.json());
// // // // app.use(cors({
// // // //   origin:"http://localhost:5001"
// // // // }))
// // // // const colors=[
// // // //   {
// // // //   "color": "red",
// // // //   "value": "#f00"
// // // //   },
// // // //   {
// // // //   "color": "green",
// // // //   "value": "#0f0"
// // // //   },
// // // //   {
// // // //   "color": "blue",
// // // //   "value": "#00f"
// // // //   },
// // // //   {
// // // //   "color": "cyan",
// // // //   "value": "#0ff"
// // // //   },
// // // //   {
// // // //   "color": "magenta",
// // // //   "value": "#f0f"
// // // //   },
// // // //   {
// // // //   "color": "yellow",
// // // //   "value": "#ff0"
// // // //   },
// // // //   {
// // // //   "color": "black",
// // // //   "value": "#000"
// // // //   }
// // // //   ]
// // // // app.get('/',(req,res)=>{
// // // //   console.log(colors)
// // // //   res.send('Welcome to NodeJS + Express CORS Server! 🎈')
// // // //   })
// // // //   app.get('/colors',(req,res)=>{
// // // //     res.set('Access-Control-Allow-Origin', '*');
// // // //     res.json(colors)
// // // //     })



// // // // // Start the HTTP server on port 3000
// // // // server.listen(PORT, () => {
// // // //   console.log(`Server running at http://localhost:${PORT}`);
// // // // });


// // // const express = require('express');
// // // const cookieParser = require('cookie-parser');
// // // const jwt = require("jsonwebtoken");
// // // const app = express();
// // // const cors = require('cors');
// // // const SECRET_KEY="sum@345mm"
// // // app.use(cors({ origin: 'https://pptinovation.vercel.app', credentials: true }));
// // // app.use(express.json());
// // // app.use(cookieParser());
// // // app.get('/', (req, res) => {
// // // 	res
// // // 		.status(202)
// // // 		.cookie('oldname', 'sumanga', {
// // // 			sameSite: 'strict',
// // // 			path: '/',
// // // 			expires: new Date(new Date().getTime() + 100 * 1000),
// // //             httpOnly: true,
// // // 		}).send("cookie being initialised")
// // // });
// // // app.get('/deleteCookie', (req, res) => {
// // // 	res
// // // 		.status(202)
// // // 		.clearCookie('Name').send("cookies cleared")
// // // });

// // // app.post('/login',(req,res)=>{
// // // const {name,email,picture}=req.body
// // // const payload={
// // //   Name:name,
// // //   Email:email,
// // //   Picture:picture
// // // }
// // //  // Sign the token with the payload and secret key, with an expiration time
// // //  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

// // // res
// // // 		.status(202)
// // // 		.cookie('token', token, {
// // // 			sameSite: 'None',
// // //       secure:true,
// // // 			path: '/',
// // // 			expires: new Date(new Date().getTime() + 100 * 1000),
// // //             httpOnly: true,
// // // 		}).send("Token has been sent!")

// // // })

// // // app.get('/profile',(req,res)=>{
// // //    console.log(req.cookies.token);
// // //    res.json({"token":req.cookies.token});

  
// // // })
// // // app.listen(5000,()=>console.log('sever is running on port:5000'));



// // const express = require('express');
// // const cookieParser = require('cookie-parser');
// // const cors = require('cors');

// // const app = express();
// // const PORT = 5000;

// // // Middleware
// // app.use(cors({ origin: 'https://pptinovation.vercel.app', credentials: true })); // Allow frontend origin
// // app.use(express.json());
// // app.use(cookieParser());

// // // Route to set a cookie
// // app.post('/set-cookie', (req, res) => {
// //     const { name, value } = req.body;

// //     // Setting a cookie
// //     res
// //         .cookie(name, value, {
// //             httpOnly: true,
// //             secure: process.env.NODE_ENV === 'production', // Set to true in production (HTTPS required)
// //             sameSite: 'none', // Adjust based on your cross-site requirements
// //             maxAge: 24 * 60 * 60 * 1000, // 1 day
// //         })
// //         .status(200)
// //         .json({ message: 'Cookie has been set!' });
// // });

// // // Route to get a cookie
// // app.get('/get-cookie', (req, res) => {
// //     const { name } = req.query;

// //     // Retrieving a cookie
// //     const cookieValue = req.cookies[name];
// //     if (cookieValue) {
// //         res.status(200).json({ name, value: cookieValue });
// //     } else {
// //         res.status(404).json({ message: 'Cookie not found' });
// //     }
// // });

// // // Start the server
// // app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


const express = require('express');
const app = express();

app.get('/', (req, res) => {
  // "name" and "value"
  res.cookie('sessionId', '12345678', {
    // "expires" - The cookie expires in 24 hours
    expires: new Date(Date.now() + 86400000), 
    // "path" - The cookie is accessible for APIs under the '/api' route
    path: '/', 
    // "domain" - The cookie belongs to the 'example.com' domain
    domain: 'pptinovation.vercel.app', 
    // "secure" - The cookie will be sent over HTTPS only
    secure: true, 
    // "HttpOnly" - The cookie cannot be accessed by client-side scripts
    httpOnly: true
  });

  // We can also use "maxAge" to specify expiration time in milliseconds
  res.cookie('preferences', 'dark_theme', {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true // For security, also set "httpOnly" flag
  });

  res.send('Cookies are set with different attributes.');
});

const server = app.listen(5000, () => {
  console.log('Server running on port 3000...');
});
