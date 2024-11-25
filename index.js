const {CreateNewSheet}=require('./CreateNewSheet')
const {FetchData}=require('./Fetchdatas')
const {WriteDataOnGoogleSheet}=require('./Writedata');
const{Gettodaydata}=require('./Gettodaydata')
const {Serchdata}=require('./Serchdata');
       
var PORT =5000;
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);//Create HTTP sever by using express
const {Server}=require('socket.io');//Intergrate SocketIO
//Create new instance
const io=new Server(server,{
  cors:{
    origin:'*',
    methods:["GET",["POST"]]
  }
})
   
io.on('connection', (socket) => {
   console.log('A new client connected ID:',socket.id);
     
   // Listen for 'update_running_time' events from the client
    socket.on('update_running_time', (msg) => {
    //console.log('update_running_time: ', msg);
    WriteDataOnGoogleSheet(msg,"Sheet1");
    UpdateToday();
    
  })
    
   // Listen for 'update_stop_time' events from the client
   socket.on('update_stop_time', (msg) => {
    const {start,end,value}=msg;
    console.log('update_stop_time: ',msg );
    WriteDataOnGoogleSheet(msg,"Sheet2");
    UpdateToday();
    
  })
   // Listen for 'current_running_time' events from the client
   socket.on('current_running_time', (msg) => {
    console.log('current_running_time: ', msg);
  })
   // Listen for 'current_breaking_time' events from the client
   socket.on('current_breaking_time', (msg) => {
    console.log('current_breaking_time: ', msg);
  })
  socket.on('disconnect',(reason)=>{
  console.log(`Client ${socket.id} disconnect,Reason:${reason}`);
  })
  
  
 

  });

  
   
 
    server.listen(PORT, () =>console.log('listening on *:' + PORT));

    //Updates Front end Total Today run and stop time
    async function UpdateToday(params) {
      Gettodaydata("Sheet2").then((res)=>{
        //Updates Today Breaking time
        
      })
      Gettodaydata("Sheet1").then((res)=>{
        //Update today runnign time
        
      })
    }