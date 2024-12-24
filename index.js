
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const { WriteDataOnGoogleSheet } = require('./Writedata');
const { FetchData } = require('./Fetchdatas');
const { json } = require('body-parser');
const PORT = 5000;
// Create an Express app
const app = express();

// Enable CORS with credentials
const corsOptions = {
  origin: '*', // Allow requests from this domain
  credentials: true, // Allow sending cookies with the request
};

app.use(cors());
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
       try{
        const dataFromClient = JSON.stringify(message.toString());
        const{reason}=JSON.parse(JSON.parse(dataFromClient));
        //Updates Googlesheet when Any state change
        if(reason!=undefined){
          WriteDataOnGoogleSheet(JSON.parse(JSON.parse(dataFromClient)))
        }
       
        
        wss.clients.forEach((client) => {
         // Exclude the client that sent the message (skip the sender)
         if (client !== ws && client.readyState === WebSocket.OPEN) {
           client.send(dataFromClient);
           
         }
        //  console.log(message.toString())
       })
        
       }catch(e){
        console.log("Error :",e);
       }
    
   
  });
  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});



//Updates today for Piechart 
app.post('/getdata',async(req,res)=>{
  const{start,end,day}=req.body;
  const googlesheetdata=await FetchData("Sheet1");
   
  if(day!=undefined){
   res.json(
    googlesheetdata.map(item=>{
      if(item[0]==day)return item
    })
   )
  }
  if(start!=undefined){
    const startTimestamp = new Date(start).getTime();
    const endTimestamp = new Date(end ).getTime();
    res.json(googlesheetdata.map(item=>{
      if (new Date(item[0]).getTime() >= startTimestamp && new Date(item[0]).getTime() <= endTimestamp)return item
    }))
  }
                                                          
})

// Start the HTTP server on port 3000
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});






