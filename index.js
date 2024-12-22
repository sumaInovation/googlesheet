
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const { WriteDataOnGoogleSheet } = require('./Writedata');
const PORT = 5000;
// Create an Express app
const app = express();

// Enable CORS with credentials
const corsOptions = {
  origin: '*', // Allow requests from this domain
  credentials: true, // Allow sending cookies with the request
};

app.use(cors(corsOptions));
// Middleware to parse incoming JSON data
app.use(express.json()); // This is crucial for parsing JSON in the body of POST requests
// Create an HTTP server and attach it to the Express app
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
      const incomming_message = JSON.parse(message);
      try{

        const{reason}=incomming_message;
        if(reason!=undefined){
         await  WriteDataOnGoogleSheet(incomming_message)
        }
        
      }catch{
       console.log("Cannot Write on google sheet")
      }
      
        //Update runtime on google sheet and get today runtime and brokent time and aloso moth value
  
      
      // Broadcast the message to all other clients except the sender
      wss.clients.forEach((client) => {
        // Exclude the client that sent the message (skip the sender)
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);


        }
         
        
      })

    } catch (error) {
      console.log("Error")
    }

  });
  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

//Handle Post reques
app.post('/',async(req,res)=>{
  const { starttime, endtime } = req.body; // Extract parameters from the request body
  const result=await Filterdata("Sheet1",starttime,endtime)
  console.log(result)
  res.json(result);
   
})

// Start the HTTP server on port 3000
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});






