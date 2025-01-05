
const express = require('express');
const cookieParser = require("cookie-parser");
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const { WriteDataOnGoogleSheet } = require('./Googlesheet/Writedata');
const { FetchData } = require('./Googlesheet/Fetchdatas');
const { json } = require('body-parser');
const User =require('./Routes/User')

const PORT = 5000;  
// Create an Express app
const app = express();
app.use(cookieParser());
const corsOptions = {
  origin: "*", // Replace with your frontend's origin
  credentials: true, // Allow cookies to be sent in cross-origin requests
};
         
app.use(cors(corsOptions)); // Enable CORS with specified options
// Middleware to parse incoming JSON data
app.use(express.json()); // This is crucial for parsing JSON in the body of POST requests
// Create an HTTP server and attach it to the Express app
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


// Start the HTTP server on port 3000
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});







