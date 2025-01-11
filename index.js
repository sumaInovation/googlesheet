const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const http = require('http');
const cors=require('cors');
const app = express();
const PORT = 4000;

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;
app.use(cors({
  origin:'*',
  credentials:true
}))
//session middleware
app.use(sessions({
secret: "thisismysecrctekey",
saveUninitialized:true,
cookie: { maxAge: oneDay },
resave: false
}));

app.use(cookieParser());

app.get('/set',function(req, res){
req.session.user = { name:'Chetan' };
res.json({'message':'Session set'});
});

app.get('/get',function(req, res){
res.json({'result':req.session.user});
});

http.createServer(app).listen(5000, function(){
console.log('Express server listening on port 5000');
});