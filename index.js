const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const {CreateNewSheet}=require('./CreateNewSheet')
const {FetchData}=require('./Fetchdatas')
const {WriteDataOnGoogleSheet}=require('./Writedata');
const{Gettodaydata}=require('./Gettodaydata')

// Create an Express application
const app = express();
// Create an HTTP server using the Express app
const server = http.createServer(app);
// Create a WebSocket server and attach it to the HTTP server
const wss = new WebSocket.Server({ server });
// Start the HTTP server
const PORT =5000;
// WebSocket connection event
wss.on('connection', async(ws) => {
  console.log('New client connected');
  try{
    //1.lates update today run_vale
    const run_time=await Gettodaydata("Sheet1");
    console.log(run_time);
    //2.latest update today breake value
   const stop_time=await Gettodaydata("Sheet2");
   //3.This Month Total run value
    const result=await FetchData("Sheet1");
      const thisMonthRunTime=result.map(subArray => Number(subArray[3]))  // Extract first element of each sub-array
      .reduce((acc, current) => acc + current, 0);
    //4.This monnth Total beak value
    const result1=await FetchData("Sheet2");
    const thisMonthBreakeTime=result1.map(subArray => Number(subArray[3]))  // Extract first element of each sub-array
    .reduce((acc, current) => acc + current, 0);
 
      //sent to API    
 
      const Objectdata={
        thisMonthBreakeTime,
        thisMonthRunTime,
        run_time,
        stop_time
      }
     
       
       
 console.log(Objectdata);
// Send a welcome message to the client when they connect
  ws.send(JSON.stringify(Objectdata));

  }catch(erro){
   console.log('cannot connect to google');
   ws.send('Your Data Base Empty');
  }
    

// Event listener for receiving messages from the client
  ws.on('message', async(message) => {
//console.log(`Received message: ${message}`);
    const receivedObject = JSON.parse(message);//Convert json string to 
    //json object to acce data
    const {current_breaking_time, breake_value, run_value ,
      current_running_time, lenght} = receivedObject;
   if (run_value != undefined || breake_value!=undefined) {//update current time
    WriteDataOnGoogleSheet(receivedObject);
    console.log("updates google sheet");  
    //when we updates run_value or breake_value
    //we have to 4 parameters pass to front end
    //1.lates update today run_vale
    //2.latest update today breake value
    //3.This Month Total run value
    //4.This monnth Total beak value

     //1.lates update today run_vale
   const run_time=await Gettodaydata("Sheet1");
   //2.latest update today breake value
  const stop_time=await Gettodaydata("Sheet2");
  //3.This Month Total run value
   const result=await FetchData("Sheet1");
     const thisMonthRunTime=result.map(subArray => Number(subArray[3]))  // Extract first element of each sub-array
     .reduce((acc, current) => acc + current, 0);
   //4.This monnth Total beak value   
   const result1=await FetchData("Sheet1");
   const thisMonthBreakeTime=result1.map(subArray => Number(subArray[3]))  // Extract first element of each sub-array
   .reduce((acc, current) => acc + current, 0);

     //sent to API

     const Objectdata={
       thisMonthBreakeTime,
       thisMonthRunTime,
       run_time,
       stop_time
     }
     // Send updates for Front end
     wss.clients.forEach((client)=>{
        if(client.readyState===WebSocket.OPEN){
          client.send(JSON.stringify(Objectdata));
        }
      })
      
      
   
    }


    if (current_running_time != undefined || current_breaking_time!=undefined || lenght!=undefined) {//update current_breaking
        wss.clients.forEach((client)=>{
          if(client.readyState===WebSocket.OPEN){
            client.send(JSON.stringify(receivedObject));
          }
        })  
      
    }
    
    
  
// Respond to the client with the same message (echo)
    ws.send(`You said: ${message}`);
  });

  // Event listener for when the client disconnects
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});   


server.listen(PORT, () => console.log(`Server is running on ${PORT}`));



  

  

const test=async function (params) {
   




}
test();