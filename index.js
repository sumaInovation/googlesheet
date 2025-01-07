
// const express = require('express');
// const cookieParser = require("cookie-parser");
// const http = require('http');
// const WebSocket = require('ws');
// const cors = require('cors');
// const helmet = require('helmet');
// const { WriteDataOnGoogleSheet } = require('./Googlesheet/Writedata');
// const { FetchData } = require('./Googlesheet/Fetchdatas');
// const bodyparser = require('body-parser');
// const User =require('./Routes/User')

// const PORT = 5000;  
// // Create an Express app
// const app = express();
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // Opti
// app.use(bodyparser.json());

// app.use((req, res, next) => {
//   // Add COOP and COEP headers to the response
//   res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); // or 'unsafe-none' if you need less strict policy
//   res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // or 'unsafe-none' if you need less strict policy

//   next();
// });

// // Configure CORS
// app.use(cors({
//  // origin: "http://localhost:3000", // Your frontend's origin
//   origin: ["http://localhost:3000","https://pptinovation.vercel.app"], // Your frontend's origin
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true, // Allow cookies or Authorization headers
// }));
// app.use('/user',User);

  
// const server = http.createServer(app);

// // Create a WebSocket server attached to the HTTP server
// const wss = new WebSocket.Server({ server });

// // Keep track of connected clients
// let clients = [];
// // WebSocket connection handler
// wss.on('connection', async (ws) => {
//   console.log('A new client connected,Total no of Clients', wss.clients.size);
//   clients.push(ws);

//   // Listen for messages from the client
//   ws.on('message', async (message) => {
//     try {
//       const dataFromClient = JSON.stringify(message.toString());
//       const { reason } = JSON.parse(JSON.parse(dataFromClient));
//       //Updates Googlesheet when Any state change
//       if (reason != undefined) {
//         WriteDataOnGoogleSheet(JSON.parse(JSON.parse(dataFromClient)))
//       }


//       wss.clients.forEach((client) => {
//         // Exclude the client that sent the message (skip the sender)
//         if (client !== ws && client.readyState === WebSocket.OPEN) {
//           client.send(dataFromClient);

//         }
//         //  console.log(message.toString())
//       })

//     } catch (e) {
//       console.log("Error :", e);
//     }


//   });
//   // Handle client disconnection
//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
// });

// app.get('/distributedata',async(req,res)=>{
//   try{
//      const data=await FetchData("sheet1");
     
//      const fileterdata=data.filter(item=>{
//       if(new Date(item[0]).toLocaleDateString()==new Date().toLocaleDateString())return item

//      })
    
//      res.json(fileterdata);
//   }catch(error){
//     console.log(error);
//     res.json("Error Data Ocurs");
//   }
  
// })
// app.get('/userdata',async(req,res) => {
  
// try{
//   const data=await FetchData("Sheet1");
//   res.json(data);

// }catch(error){
//   console.error(error);
//   res.json(error)
// }

// })


// // Start the HTTP server on port 3000
// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });



require("dotenv").config();
const cors = require("cors");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();
app.use(
  cors({
    origin: "https://pptinovation.vercel.app", // React frontend URL
    credentials: true, // To allow cookies and sessions to be sent
  })
);
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000, // 1 hour
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://googlesheet-yuetcisb.b4a.run/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));



app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
  //res.redirect("/profile");
 //res.json({"Message":"successful"});
 res.redirect("https://pptinovation.vercel.app/singup");
}
);

app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({"user":req.user})
  } else {
    res.redirect("/");
  }
});
app.get('/',(req,res)=>{
res.redirect("/auth/google")

})
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});

app.get('/test',(req,res)=>{
  res.json({"Message":"Hello Wumanga"});
})
app.listen(5000, () => {
  console.log(`Server is running at port 5000`);
});
