
const express = require('express');
const cookieParser = require("cookie-parser");
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const helmet = require('helmet');
const { WriteDataOnGoogleSheet } = require('./Googlesheet/Writedata');
const { FetchData } = require('./Googlesheet/Fetchdatas');
const bodyparser = require('body-parser');
const User =require('./Routes/User')
const session=require('express-session')
const PORT = 5000;  
// Create an Express app
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Opti
app.use(bodyparser.json());






// Configure CORS
app.use(cors({
 // origin: "http://localhost:3000", // Your frontend's origin
  origin: ["http://localhost:3000","https://pptinovation.vercel.app"], // Your frontend's origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies or Authorization headers
}));
app.use('/user',User);

  
const server = http.createServer(app);

// Create a WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

// Keep track of connected clients
let clients = [];
// WebSocket connection handler
wss.on('connection', async (ws) => {
  console.log('A new client connected,Total no of Clients', wss.clients.size);
  clients.push(ws);

  // Listen for messages from the client
  ws.on('message', async (message) => {
    try {
      const dataFromClient = JSON.stringify(message.toString());
      const { reason } = JSON.parse(JSON.parse(dataFromClient));
      //Updates Googlesheet when Any state change
      if (reason != undefined) {
        WriteDataOnGoogleSheet(JSON.parse(JSON.parse(dataFromClient)))
      }


      wss.clients.forEach((client) => {
        // Exclude the client that sent the message (skip the sender)
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(dataFromClient);

        }
        //  console.log(message.toString())
      })

    } catch (e) {
      console.log("Error :", e);
    }


  });
  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.get('/distributedata',async(req,res)=>{
  try{
     const data=await FetchData("sheet1");
     
     const fileterdata=data.filter(item=>{
      if(new Date(item[0]).toLocaleDateString()==new Date().toLocaleDateString())return item

     })
    
     res.json(fileterdata);
  }catch(error){
    console.log(error);
    res.json("Error Data Ocurs");
  }
  
})
app.get('/userdata',async(req,res) => {
  
try{
  const data=await FetchData("Sheet1");
  res.json(data);

}catch(error){
  console.error(error);
  res.json(error)
}

})


// Configure express-session
app.use(
  session({
    secret: 'your-secret-key', // A secret key used to sign the session ID cookie
    resave: false,             // Avoid resaving session data if not modified
    saveUninitialized: true,   // Save uninitialized sessions
    cookie: {
      secure: true, // Use true in production with HTTPS
      httpOnly: true, // Prevent client-side JavaScript from accessing cookies
      sameSite: "None", // Required for cross-site cookies
    },
  })
);

// Route to set a session value
app.get('/set-session', (req, res) => {
  req.session.username = 'JohnDoe';
  res.json({"message":"session value set"});
});

// Route to retrieve the session value
app.get('/get-session', (req, res) => {
  if (req.session.username) {
    res.json({"session":req.session.username});
  } else {
    res.send('No session value set.');
  }
});

// Route to destroy the session
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error destroying session');
    }
    res.send('Session destroyed!');
  });
});


// Start the HTTP server on port 3000
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});






