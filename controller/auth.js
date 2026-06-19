const jwt = require("jsonwebtoken")
const userModel = require("../model/user_model")
const jwt_secret= process.env.JWT_SECRET
const auth = async(req,res,next)=>{
    try{
        console.log("cookie",req.cookies)
    const {token}=req.cookies;
    console.log("t")
    console.log("token",token)
    if(!token){
        return res.status(401).json({message:"access denied please login"})
    }
    const decoded = jwt.verify(token,jwt_secret)
    console.log(decoded)
    if(!decoded){
        return res.status(404).json({message:"no token found"})
    }
    const{userId,email}=decoded;
    const userdata = await userModel.findById(userId)
    console.log(userdata)
    if(!userdata){
        return res.status(404).json({message:"user not found"})
    }
    req.user =userId
    req.email=email
    next();
    }catch(err){
      res.status(500).json({message:"error in authentication",err})
    }
}
module.exports =auth