const jwt= require('jsonwebtoken');
require('dotenv').config();
const Verfifytoken=async(req,res,next)=>{
    const token=req.cookies.token;
    if(!token)return res.status(400).json({success:false,message:'Not Token Provided'});
    try{

    
    const decoded=jwt.verify(token,process.env.JWT_SECRET)  
    if(!decoded)return res.status(400).json({success:false,message:'Not Match Token'})
    req.userID=decoded.userID;
    next();
}catch(err){
    res.status(400).json({success:false,message:err});
}

}

module.exports=Verfifytoken;