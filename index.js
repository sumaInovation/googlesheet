// server.js
const express = require('express');
const session = require('cookie-session');
const helmet = require('helmet');
const hpp = require('hpp');
const csurf = require('csurf');
const limiter =require('express-rate-limit')
const cors=require('cors');
/* Create Express App */
const app = express();

/* Set Security Configs */
app.use(helmet());
app.use(hpp());
app.use(cors({
  origin:['http://localhost:3000','https://pptinovation.vercel.app'],
  credentials:true
}))
/* Set Cookie Settings */
app.use(
    session({
        name: 'session',
        secret: 'secretKeyWooo',
        cookie  : {
          httpOnly: true,
          secure: true,
          maxAge  : 60 * 60 * 1000 
      }
    })
);
app.use(csurf());

app.use(limiter);
app.use('/api/csrf-token',(req,res)=>{
     req.session.session='sumanga';
     res.json({"message":"sent cookies"})
})

app.listen(5000, () => {
    console.log("I'm listening!");
});
