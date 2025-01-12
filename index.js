const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser=require('cookie-parser');
const { OAuth2Client } = require('google-auth-library');
const mongoose = require('mongoose');
require('dotenv').config();
const app=express();

const router=require('./Routes/User-Route.js')

const PORT=process.env.PORT|| 5001;
app.use(cookieParser())
app.use(cors({
  origin:['http://localhost:3000','https://pptinovation.vercel.app'],
  credentials:true
}))
app.use(express.json())
app.use('/api',router);


 mongoose.connect(process.env.MONGODB_URL)
 .then()

    app.listen(PORT,()=>console.log(`Server is running on Port: ${PORT} && Connected MONGODB`));





