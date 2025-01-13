require('dotenv').config();
const mongoose=require('mongoose');

 const connectDB=async()=>{
try{
 const connection=await mongoose.connect(process.env.AUTH_MONGODB_URL)
console.log(`MongoDB Connected:${connection.connection.host}`);

}catch(err){
    console.error(err);
    process.exit(1);
}

}


module.exports=connectDB