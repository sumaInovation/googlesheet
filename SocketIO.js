var PORT = process.env.PORT || 5000;
var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);





var io = require('socket.io')(server);
   
io.on('connection', (socket) => {
   console.log('A new client connected');
 
   // Listen for 'chat message' events from the client
   socket.on('client_send', (msg) => {
     console.log('Message from client: ', msg);
     
    socket.on('disconnect',()=>{
      console.log('User Disconnect');
    })


     
   }

)});

    setInterval(()=>{
      io.emit('sever_send', "hhhh");

      
    },5000);
 
    server.listen(PORT, () =>{
      console.log('listening on *:' + PORT);
  }
);