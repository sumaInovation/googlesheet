// server.js
const express = require('express');
const session = require('cookie-session');
const helmet = require('helmet');
const hpp = require('hpp');
const csurf = require('csurf');
const limiter =require('express-rate-limit')
/* Create Express App */
const app = express();

/* Set Security Configs */
app.use(helmet());
app.use(hpp());

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

app.listen(5000, () => {
    console.log("I'm listening!");
});
