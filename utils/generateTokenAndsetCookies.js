//JWT_SECRET
require('dotenv').config();
const jwt=require('jsonwebtoken');
const generateTokenAndsetCookies=async(res,userID)=>{
  const payload={//we make token using user Id in db
    userID
  }
const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'7d'})
 res.cookie('token',token,{
    httpOnly:true,
    secure:process.env.NODE_ENV==='production',
    sameSite: 'Strict', // Cookie is only sent with same-site requests
    maxAge:7*24*60*60*1000
  })
  
 return token;

}


module.exports=generateTokenAndsetCookies;