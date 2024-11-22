const http = require('http');
const WebSocket = require('ws');  
const express=require('express'); 
const cors = require('cors'); 
const App=express();

App.use(cors({
  origin:'*'
}));
const {CreateNewSheet}=require('./CreateNewSheet')
const {FetchData}=require('./Fetchdatas')
const {WriteDataOnGoogleSheet}=require('./Writedata');
const Serchdata=require('./Serchdata');
const {Gettodaydata}=require('./Gettodaydata')
// Middleware to parse JSON and URL-encoded data
App.use(express.json()); // Parse JSON data
App.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
App.use('/serchdata',Serchdata);
const server = require('http').createServer(App);
// Attach the WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server });
const dotenv = require('dotenv');
const { time } = require('console');
const date = new Date();
dotenv.config();

const PORT=process.env.PORT
   

  

// Event: When a client connects to the WebSocket server
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');

  // Event: When a message is received from a WebSocket client
  ws.on('message', (message) => {

    try{   
     const jsonData=JSON.parse(message);
     //console.log(JSON.parse(message).start);
      const currentDate = new Date();
    // Get the full year, month, and day
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');  // Get month (0-11) and pad with zero
      const day = String(currentDate.getDate()).padStart(2, '0');  // Pad day with zero if necessary
      // Format the date as YYYY/MM/DD
      const formattedDate = `${year}/${month}/${day}`;
      var FeedbackMessage="none";
      var jsonobject=JSON.parse({"Message":"No Data Comming"});
      if (jsonData.hasOwnProperty('start')){
        const data=[
          [formattedDate,     
          jsonData.start,
          jsonData.end,
          jsonData.elaps]
         ]
      const requestBody={
        values:data
      }
      var SHEET=jsonData.sheet;
      
      WriteDataOnGoogleSheet(requestBody,SHEET);//Write data Googlesheet 
      if(SHEET=='Sheet1'){//Machine is currently stop
        //becouse pass lates brekingtime in googleshet to client 
        const todaybrakingtime=Gettodaydata('Sheet2');
          FeedbackMessage={"TodayBreakingTime":todaybrakingtime}
        }else{
          const todayrunningtime=Gettodaydata('Sheet2');
          FeedbackMessage={"TodayRunningTime":todayrunningtime}
        }

   
        
  }else{
    FeedbackMessage=message.toString();//Normally every 5 second comming data
  }

  jsonobject=JSON.parse(FeedbackMessage); // Share message all connected client
  wss.clients.forEach(function each(client) {
   if (client !== ws && client.readyState === WebSocket.OPEN) {
   client.send("hello1");
   }});
    
    }catch(error){
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send("hello");
        }});
  

    }
    
    // Send a response back to the client
     ws.send(`Server received: ${message}`);     
});

  // Event: When the WebSocket client disconnects
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });

  // Send a welcome message to the newly connected client
  ws.send('Welcome to the WebSocket server!');
});
// Start the server on port 8080
server.listen(PORT, () => {
  console.log(`HTTP and WebSocket server is running on http://localhost:${PORT}`);
});
       
  


