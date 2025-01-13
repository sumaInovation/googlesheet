const express = require('express');
const app = express();
const cookiesparser=require('cookie-parser');

const connectDB = require('./db/connectDB')
const authRoutes = require('./Routes/auth.route');
const Verfifytoken=require('./middleware/Verifytoken');

const PORT = 5000;
//use middleware
app.use(express.json())//allows to allowing req.body
app.use(cookiesparser())//allows pasre cookies

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server Running on port:${PORT}`)
});   