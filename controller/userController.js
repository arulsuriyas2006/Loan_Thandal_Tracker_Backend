const userModel =require("../model/user_model")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const jwt_secret = process.env.JWT_SECRET
const addUser = async(req,res)=>{
    try{
     const newUser = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
     }
     if(!validator.isEmail(newUser.email)){
      return res.status(406).json({message:"Invaid Email,Email must be @ symbol",Email:newUser.email})
     }
     if(!validator.isStrongPassword(newUser.password)){
      return res.status(400).json({message:"Password is not strong"})
     }
     console.log(newUser)
     const hashpassword = await bcrypt.hash(newUser.password,10)
     console.log(hashpassword)
     const User = new userModel({...newUser,password:hashpassword})
     console.log(User)
     await User.save()
     res.status(200).json({message:"successfully user added",User})
    }catch(err){
     res.status(500).json({message:"error in add user",err})
     console.log(err)
    }
}

const login =async(req,res)=>{
    try{
     const login = {
        email:req.body.email,
        password:req.body.password
     }
     const user = await userModel.findOne({email:login.email})
     if(!user){
        return res.status(404).json({message:"email not found",user})
     }
     const compare = await bcrypt.compare(login.password,user.password)
     if(compare){
      const token = jwt.sign({userId:user._id,email:user.email},jwt_secret,{expiresIn:""})
      console.log(token)
      res.cookie('token',token)
      res.status(200).json({message:"login successfull",user:user})
     }else{
     res.status(401).json({message:"Invalid Credential",user})
     }
    }catch(err){
     res.status(500).json({message:"Invalid credential",user})
    }
}
module.exports ={addUser,login}