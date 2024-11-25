const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const {CreateNewSheet}=require('./CreateNewSheet')
const {FetchData}=require('./Fetchdatas')
const {WriteDataOnGoogleSheet}=require('./Writedata');
const{Gettodaydata}=require('./Gettodaydata')
const {Serchdata}=require('./Serchdata');
// Create an Express application
const app = express();
// Create an HTTP server using the Express app
const server = http.createServer(app);
// Create a WebSocket server and attach it to the HTTP server
const wss = new WebSocket.Server({ server });
// Start the HTTP server
const PORT =5000;
// WebSocket connection event
wss.on('connection', (ws) => {
  console.log('New client connected');
// Send a welcome message to the client when they connect
  ws.send('Welcome to the WebSocket server!');
// Event listener for receiving messages from the client
  ws.on('message', (message) => {
//console.log(`Received message: ${message}`);
    const receivedObject = JSON.parse(message);
    const {current_breaking_time, breake_value, run_value ,
      current_running_time, lenght} = receivedObject;
   if (run_value != undefined || breake_value!=undefined) {//update current time
    WriteDataOnGoogleSheet(receivedObject);
    console.log("updates google sheet");
    }
    if (current_running_time != undefined || current_breaking_time!=undefined || lenght!=undefined) {//update current_breaking
        wss.clients.forEach((client)=>{
          if(client.readyState===WebSocket.OPEN){
            client.send(JSON.stringify(receivedObject));
          }
        })
      
    }
    
    
    console.log(receivedObject)
// Respond to the client with the same message (echo)
    ws.send(`You said: ${message}`);
  });

  // Event listener for when the client disconnects
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});


server.listen(PORT, () => console.log(`Server is running on ${PORT}`));
