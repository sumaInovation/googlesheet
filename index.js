// // // const express = require("express");
// // // const passport = require("passport");
// // // const GoogleStrategy = require("passport-google-oauth20").Strategy;
// // // const jwt = require("jsonwebtoken");
// // // const cookieParser = require("cookie-parser");
// // // const cors = require("cors");
// // // require('dotenv').config()
// // // const app = express();
// // // const PORT = 5000;

// // // const url="https://pptinovation.vercel.app"
// // // // Middleware
// // // app.use(express.json());
// // // app.use(cookieParser());
// // // app.use(cors({ origin: ["http://localhost:3000",url], credentials: true })); // Allow your React client to access the API

// // // // JWT Secret (use a secure key in production)
// // // const JWT_SECRET = "your_jwt_secret";

// // // // Passport Google Strategy (Replace with your credentials)
// // // passport.use(
// // //   new GoogleStrategy(
// // //     {
// // //       clientID:process.env.GOOGLE_CLIENT_ID,
// // //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// // //       callbackURL: "https://googlesheet-yuetcisb.b4a.run/auth/google/callback",
// // //     },
// // //     (accessToken, refreshToken, profile, done) => {
// // //       // Here, you'd typically save the user to the database
// // //       const user = {
// // //         id: profile.id,
// // //         name: profile.displayName,
// // //         email: profile.emails[0].value,
// // //       };

// // //       // Generate a JWT token
// // //       const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });

// // //       return done(null, { user, token });
// // //     }
// // //   )
// // // );

// // // // Initialize Passport
// // // app.use(passport.initialize());

// // // // Route: Start Google Login
// // // app.get(
// // //   "/auth/google",
// // //   passport.authenticate("google", { scope: ["profile", "email"], session: false ,prompt: "select_account",})
// // // );

// // // // Route: Google OAuth Callback
// // // app.get(
// // //   "/auth/google/callback",
// // //   passport.authenticate("google", { session: false, failureRedirect: "/" }),
// // //   (req, res) => {
// // //     const { token } = req.user;

// // //     // Send JWT as a cookie to the client
// // //     res.cookie("token", token, {
// // //       httpOnly: true, // Makes the cookie inaccessible to JavaScript
// // //       secure: true, // Set to rue in production with HTTPS
      
// // //     });

// // //     res.redirect("https://pptinovation.vercel.app/singup"); // Redirect to your React client
// // //   }
// // // );

// // // const authenticateJWT = (req, res, next) => {
// // //   const token = req.cookies.token;  // Get token from cookies
// // //   if (token) {
// // //     jwt.verify(token, JWT_SECRET, (err, user) => {
// // //       if (err) {
// // //         console.error("JWT Verification Error:", err);
// // //         return res.status(403).json({ message: "Invalid or expired token" });
// // //       }
// // //       req.user = user;  // Attach user info to request
// // //       next();
// // //     });
// // //   } else {
// // //     res.status(401).json({ message: "Unauthorized" });  // No token, Unauthorized
// // //   }
// // // };


// // // // Example Protected Route
// // // app.get("/protected", authenticateJWT, (req, res) => {
// // //   res.json({
// // //     message: "This is a protected route",
// // //     user: req.user, // User details decoded from the JWT
// // //   });
// // // });

// // // // Start Server
// // // app.listen(PORT, () => {
// // //   console.log(`Server running on http://localhost:${PORT}`);
// // // });






// // // // // // const express = require('express');
// // // // // // const cookieParser = require("cookie-parser");
// // // // // // const http = require('http');
// // // // // // const WebSocket = require('ws');
// // // // // // const cors = require('cors');
// // // // // // const helmet = require('helmet');
// // // // // // const { WriteDataOnGoogleSheet } = require('./Googlesheet/Writedata');
// // // // // // const { FetchData } = require('./Googlesheet/Fetchdatas');
// // // // // // const bodyparser = require('body-parser');
// // // // // // const User =require('./Routes/User')
// // // // // // const session =require('express-session')

// // // // // // const PORT = 5000;  
// // // // // // // Create an Express app
// // // // // // const app = express();
// // // // // // app.use(cookieParser());
// // // // // // app.use(express.json());
// // // // // // app.use(express.urlencoded({ extended: true })); // Opti
// // // // // // app.use(bodyparser.json());

// // // // // // // app.use((req, res, next) => {
// // // // // // //   // Add COOP and COEP headers to the response
// // // // // // //   res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); // or 'unsafe-none' if you need less strict policy
// // // // // // //   res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // or 'unsafe-none' if you need less strict policy

// // // // // // //   next();
// // // // // // // });

// // // // // // // // Configure CORS
// // // // // // // app.use(cors({
// // // // // // //  // origin: "http://localhost:3000", // Your frontend's origin
// // // // // // //   origin: ["http://localhost:3000","https://pptinovation.vercel.app"], // Your frontend's origin
// // // // // // //   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// // // // // // //   allowedHeaders: ["Content-Type", "Authorization"],
// // // // // // //   credentials: true, // Allow cookies or Authorization headers
// // // // // // // }));
// // // // // // app.use('/user',User);

  
// // // // // // const server = http.createServer(app);

// // // // // // // Create a WebSocket server attached to the HTTP server
// // // // // // const wss = new WebSocket.Server({ server });

// // // // // // // Keep track of connected clients
// // // // // // let clients = [];
// // // // // // // WebSocket connection handler
// // // // // // wss.on('connection', async (ws) => {
// // // // // //   console.log('A new client connected,Total no of Clients', wss.clients.size);
// // // // // //   clients.push(ws);

// // // // // //   // Listen for messages from the client
// // // // // //   ws.on('message', async (message) => {
// // // // // //     try {
// // // // // //       const dataFromClient = JSON.stringify(message.toString());
// // // // // //       const { reason } = JSON.parse(JSON.parse(dataFromClient));
// // // // // //       //Updates Googlesheet when Any state change
// // // // // //       if (reason != undefined) {
// // // // // //         WriteDataOnGoogleSheet(JSON.parse(JSON.parse(dataFromClient)))
// // // // // //       }


// // // // // //       wss.clients.forEach((client) => {
// // // // // //         // Exclude the client that sent the message (skip the sender)
// // // // // //         if (client !== ws && client.readyState === WebSocket.OPEN) {
// // // // // //           client.send(dataFromClient);

// // // // // //         }
// // // // // //         //  console.log(message.toString())
// // // // // //       })

// // // // // //     } catch (e) {
// // // // // //       console.log("Error :", e);
// // // // // //     }


// // // // // //   });
// // // // // //   // Handle client disconnection
// // // // // //   ws.on('close', () => {
// // // // // //     console.log('Client disconnected');
// // // // // //   });
// // // // // // });

// // // // // // app.get('/distributedata',async(req,res)=>{
// // // // // //   try{
// // // // // //      const data=await FetchData("sheet1");
     
// // // // // //      const fileterdata=data.filter(item=>{
// // // // // //       if(new Date(item[0]).toLocaleDateString()==new Date().toLocaleDateString())return item

// // // // // //      })
    
// // // // // //      res.json(fileterdata);
// // // // // //   }catch(error){
// // // // // //     console.log(error);
// // // // // //     res.json("Error Data Ocurs");
// // // // // //   }
  
// // // // // // })
// // // // // // app.get('/userdata',async(req,res) => {
  
// // // // // // try{
// // // // // //   const data=await FetchData("Sheet1");
// // // // // //   res.json(data);

// // // // // // }catch(error){
// // // // // //   console.error(error);
// // // // // //   res.json(error)
// // // // // // }

// // // // // // })


// // // // // // // Enable JSON parsing
// // // // // // app.use(express.json());
// // // // // // app.use(cors({
// // // // // //   origin:"http://localhost:5001"
// // // // // // }))
// // // // // // const colors=[
// // // // // //   {
// // // // // //   "color": "red",
// // // // // //   "value": "#f00"
// // // // // //   },
// // // // // //   {
// // // // // //   "color": "green",
// // // // // //   "value": "#0f0"
// // // // // //   },
// // // // // //   {
// // // // // //   "color": "blue",
// // // // // //   "value": "#00f"
// // // // // //   },
// // // // // //   {
// // // // // //   "color": "cyan",
// // // // // //   "value": "#0ff"
// // // // // //   },
// // // // // //   {
// // // // // //   "color": "magenta",
// // // // // //   "value": "#f0f"
// // // // // //   },
// // // // // //   {
// // // // // //   "color": "yellow",
// // // // // //   "value": "#ff0"
// // // // // //   },
// // // // // //   {
// // // // // //   "color": "black",
// // // // // //   "value": "#000"
// // // // // //   }
// // // // // //   ]
// // // // // // app.get('/',(req,res)=>{
// // // // // //   console.log(colors)
// // // // // //   res.send('Welcome to NodeJS + Express CORS Server! 🎈')
// // // // // //   })
// // // // // //   app.get('/colors',(req,res)=>{
// // // // // //     res.set('Access-Control-Allow-Origin', '*');
// // // // // //     res.json(colors)
// // // // // //     })



// // // // // // // Start the HTTP server on port 3000
// // // // // // server.listen(PORT, () => {
// // // // // //   console.log(`Server running at http://localhost:${PORT}`);
// // // // // // });


// // // // // const express = require('express');
// // // // // const cookieParser = require('cookie-parser');
// // // // // const jwt = require("jsonwebtoken");
// // // // // const app = express();
// // // // // const cors = require('cors');
// // // // // const SECRET_KEY="sum@345mm"
// // // // // app.use(cors({ origin: 'https://pptinovation.vercel.app', credentials: true }));
// // // // // app.use(express.json());
// // // // // app.use(cookieParser());
// // // // // app.get('/', (req, res) => {
// // // // // 	res
// // // // // 		.status(202)
// // // // // 		.cookie('oldname', 'sumanga', {
// // // // // 			sameSite: 'strict',
// // // // // 			path: '/',
// // // // // 			expires: new Date(new Date().getTime() + 100 * 1000),
// // // // //             httpOnly: true,
// // // // // 		}).send("cookie being initialised")
// // // // // });
// // // // // app.get('/deleteCookie', (req, res) => {
// // // // // 	res
// // // // // 		.status(202)
// // // // // 		.clearCookie('Name').send("cookies cleared")
// // // // // });

// // // // // app.post('/login',(req,res)=>{
// // // // // const {name,email,picture}=req.body
// // // // // const payload={
// // // // //   Name:name,
// // // // //   Email:email,
// // // // //   Picture:picture
// // // // // }
// // // // //  // Sign the token with the payload and secret key, with an expiration time
// // // // //  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

// // // // // res
// // // // // 		.status(202)
// // // // // 		.cookie('token', token, {
// // // // // 			sameSite: 'None',
// // // // //       secure:true,
// // // // // 			path: '/',
// // // // // 			expires: new Date(new Date().getTime() + 100 * 1000),
// // // // //             httpOnly: true,
// // // // // 		}).send("Token has been sent!")

// // // // // })

// // // // // app.get('/profile',(req,res)=>{
// // // // //    console.log(req.cookies.token);
// // // // //    res.json({"token":req.cookies.token});

  
// // // // // })
// // // // // app.listen(5000,()=>console.log('sever is running on port:5000'));



// // // // const express = require('express');
// // // // const cookieParser = require('cookie-parser');
// // // // const cors = require('cors');

// // // // const app = express();
// // // // const PORT = 5000;

// // // // // Middleware
// // // // app.use(cors({ origin: 'https://pptinovation.vercel.app', credentials: true })); // Allow frontend origin
// // // // app.use(express.json());
// // // // app.use(cookieParser());

// // // // // Route to set a cookie
// // // // app.post('/set-cookie', (req, res) => {
// // // //     const { name, value } = req.body;

// // // //     // Setting a cookie
// // // //     res
// // // //         .cookie(name, value, {
// // // //             httpOnly: true,
// // // //             secure: process.env.NODE_ENV === 'production', // Set to true in production (HTTPS required)
// // // //             sameSite: 'none', // Adjust based on your cross-site requirements
// // // //             maxAge: 24 * 60 * 60 * 1000, // 1 day
// // // //         })
// // // //         .status(200)
// // // //         .json({ message: 'Cookie has been set!' });
// // // // });

// // // // // Route to get a cookie
// // // // app.get('/get-cookie', (req, res) => {
// // // //     const { name } = req.query;

// // // //     // Retrieving a cookie
// // // //     const cookieValue = req.cookies[name];
// // // //     if (cookieValue) {
// // // //         res.status(200).json({ name, value: cookieValue });
// // // //     } else {
// // // //         res.status(404).json({ message: 'Cookie not found' });
// // // //     }
// // // // });

// // // // // Start the server
// // // // app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


// // const express = require('express');
// // const passport = require('passport');
// // const GoogleStrategy = require('passport-google-oauth20').Strategy;
// // const jwt = require('jsonwebtoken');
// // const cookieParser = require('cookie-parser');
// // const cors = require('cors');
// // require('dotenv').config();

// // const app = express();
// // const PORT = 5000;

// // // Middleware
// // app.use(express.json());
// // app.use(cookieParser());
// // app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// // // Passport Google Strategy
// // passport.use(
// //   new GoogleStrategy(
// //     {
// //       clientID: process.env.GOOGLE_CLIENT_ID,
// //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// //       callbackURL: 'http://localhost:5000/auth/google/callback',
// //     },
// //     (accessToken, refreshToken, profile, done) => {
// //       const user = {
// //         id: profile.id,
// //         name: profile.displayName,
// //         email: profile.emails[0].value,
// //       };

// //       // Generate JWT token
// //       const token = jwt.sign(user, "process.env.JWT_SECRET", { expiresIn: '1h' });

// //       // Return the user and token to be stored
// //       return done(null, { user, token });
// //     }
// //   )
// // );

// // // Initialize Passport
// // app.use(passport.initialize());

// // // Serialization and Deserialization
// // passport.serializeUser((user, done) => {
// //   done(null, user.id);  // Save only the user ID to the session
// // });

// // passport.deserializeUser((id, done) => {
// //   done(null, { id });  // Rehydrate user with the ID
// // });

// // // Route to start Google login
// // app.get(
// //   '/auth/google',
// //   passport.authenticate('google', { scope: ['profile', 'email'],
// //     prompt: 'select_account', // Forces Google to show account selection
// //    })
// // );

// // // Google OAuth Callback route
// // app.get(
// //   '/auth/google/callback',
// //   passport.authenticate('google', { session: false, failureRedirect: '/' }),
// //   (req, res) => {
// //     const { token } = req.user;

// //     // Send the JWT token as a cookie to the client
// //     res.cookie('token', token, {
// //       httpOnly: true, 
// //       secure: false, // set to true if using HTTPS in production
      
// //     });

// //     // Redirect to frontend dashboard
// //     res.redirect('http://localhost:3000/singup');
// //   }
// // );

// // // Middleware to verify JWT token
// // const authenticateJWT = (req, res, next) => {
// //   const token = req.cookies.token;

// //   if (token) {
// //     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
// //       if (err) {
// //         return res.status(403).json({ message: 'Invalid or expired token' });
// //       }
// //       req.user = user;
// //       next();
// //     });
// //   } else {
// //     res.status(401).json({ message: 'Unauthorized' });
// //   }
// // };

// // // Protected route example
// // app.get('/protected', authenticateJWT, (req, res) => {
// //   res.json({ message: 'This is a protected route', user: req.user });
// // });

// // // Start the server
// // app.listen(PORT, () => {
// //   console.log(`Server running on http://localhost:${PORT}`);
// // });




// const express = require('express');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
// require('dotenv').config();

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(express.json());
// app.use(cookieParser());

// // Passport Google Strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: 'http://localhost:5000/auth/google/callback', // Change for production
//     },
//     (accessToken, refreshToken, profile, done) => {
//       const user = {
//         id: profile.id,
//         name: profile.displayName,
//         email: profile.emails[0].value,
//       };

//       // Generate JWT token
//       const token = jwt.sign(user, "kkljjlkjb4566", { expiresIn: '1h' });
    
//       // Return the user and token to be stored
//       return done(null, { user, token });
//     }
//   )
// );

// // Initialize Passport
// app.use(passport.initialize());

// // Serialization and Deserialization
// passport.serializeUser((user, done) => {
//   done(null, user.id); // Save only the user ID to the session
// });

// passport.deserializeUser((id, done) => {
//   done(null, { id }); // Rehydrate user with the ID
// });

// // Route to start Google login with prompt: select_account
// app.get(
//   '/auth/google',
//   passport.authenticate('google', {
//     scope: ['profile', 'email'],
//     prompt: 'select_account', // Forces Google to show account selection
//   })
// );

// // Google OAuth Callback route
// app.get(
//   '/auth/google/callback',
//   passport.authenticate('google', { session: false, failureRedirect: '/' }),
//   (req, res) => {
//     const { token } = req.user;

//     // Send the JWT token as a cookie to the client
//     res.cookie('token', token, {
//       httpOnly: true, 
//       secure: false, // set to true if using HTTPS in production
//       sameSite: 'lax',
//     });

//     // Redirect to a protected route
//     res.redirect('http://localhost:5000/protected');
//   }
// );

// // Middleware to verify JWT token
// const authenticateJWT = (req, res, next) => {
//   const token = req.cookies.token;

//   if (token) {
//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//       if (err) {
//         return res.status(403).json({ message: 'Invalid or expired token' });
//       }
//       req.user = user;
//       next();
//     });
//   } else {
//     res.status(401).json({ message: 'Unauthorized' });
//   }
// };

// // Protected route example
// app.get('/protected', authenticateJWT, (req, res) => {
//   res.json({ message: 'This is a protected route', user: req.user });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cors = require("cors");
require('dotenv').config()
const app = express();

// CORS middleware to allow React to access the API
app.use(
  cors({
    origin: "http://localhost:3000", // React frontend URL
    credentials: true, // Allow sending cookies
  })
);

// Set up session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Replace with your Google Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Replace with your Google Client Secret
      callbackURL: "/auth/google/callback", // The redirect URL you set in the Google Developer Console
    },
    (accessToken, refreshToken, profile, done) => {
      // Here, the user's profile info is available in 'profile'
      // You can store it in your database or just pass it to the session
      return done(null, profile);
    }
  )
);

// Serialize user information into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user information from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes

// Home route: A button to start the Google login process
app.get("/", (req, res) => {
  res.send(
    `<h1>Home Page</h1><a href="/auth/google">Login with Google</a>`
  );
});

// Google authentication route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback route: After successful authentication, redirect to profile
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication
    res.redirect("/profile");
  }
);

// Protected profile route: Shows user profile info
app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.send(`
    <h1>Profile Page</h1>
    <p>Welcome, ${req.user.displayName}</p>
    <p>Email: ${req.user.emails[0].value}</p>
    <a href="/logout">Logout</a>
  `);
});

// Logout route: Logs the user out of the session
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

// Start the server
const PORT = 5000; // Backend server running on port 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
