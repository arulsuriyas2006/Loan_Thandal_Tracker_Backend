const userModel =require("../model/user_model")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const installmentModel = require("../model/Installment_Model")
const loanModel = require("../model/loan_model")
const sendMail =require("../utils/sendMail")
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
     const existingUser = await userModel.findOne({email:newUser.email})
     if(existingUser){
      return res.status(409).json({message:"Email already exists"})
     }
     console.log(newUser)
     const hashpassword = await bcrypt.hash(newUser.password,10)
     console.log(hashpassword)
     const User = new userModel({...newUser,password:hashpassword})
     console.log(User)
     await User.save()
     res.status(200).json({message:"successfully user added",User})
    try{
      await sendMail(
  User.email,
  "Welcome to FinFamily 🎉",
  `Dear ${User.name},

Welcome to FinFamily!

Your account has been successfully created.

We're excited to help you track and manage your loans, installments, and payment reminders in one place.

With FinFamily, you can:
• Create and manage loans
• Track installment payments
• View payment history
• Get upcoming payment reminders
• Monitor overdue installments

Thank you for joining FinFamily.

Best Regards,
FinFamily Team`
);
    }catch(err){
      console.log("mail Error:",err.message)
    }

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
     console.log(login)
     const user = await userModel.findOne({email:login.email})
     console.log(user)
     if(!user){
        return res.status(404).json({message:"email not found",user})
     }
     const compare = await bcrypt.compare(login.password,user.password)
     if(compare){
      const token = jwt.sign({userId:user._id,email:user.email},jwt_secret,{expiresIn:"1d"})
      console.log(token)
      res.cookie('token',token,{
         httpOnly:true,
         sameSite:"lax",
         maxAge:24*60*60*1000
      })
      res.status(200).json({message:"login successfull",user:user})
     }else{
     res.status(401).json({message:"Invalid Credential",user})
     }
    }catch(err){
     res.status(500).json({message:"Invalid credential",err})
    }
}
const getUser = async(req,res)=>{
   try{
      const authemail = req.email;
      const iamuser = await userModel.findOne({email:authemail});
      res.status(200).json({mesaage:"user fetched",iamuser})
   }catch(err){
     res.status(500).json({message:"error in fetch individual user",err})
   }
}

const logout = async(req,res)=>{
   try{
    res.clearCookie("token",{
      httpOnly:true,
      sameSite:"lax"
    })
    console.log("cookie Cleared")
    res.status(200).json({message:"Logout successful"})
   }catch(err){
    res.status(500).json({message:"Logout failed"})
   }
}

const deleteAccount=async(req,res)=>{
   try{
      const userid =req.user
    const installments = await installmentModel.deleteMany({userID:userid})
    const loans = await loanModel.deleteMany({userID:userid})
    const deactivate = await userModel.findByIdAndDelete({_id:userid})
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
    });
    console.log("cookie Cleared")
    res.status(200).json({message:"Account deleted Successfully"})
    await sendMail(
  deactivate.email,
  "FinFamily Account Deactivated",
  `Dear ${deactivate.name},

We're confirming that your FinFamily account has been successfully deactivated.

As requested, your account and associated data have been removed from our system, including:

• Loan records
• Installment history
• Payment reminders
• Account information

We're sorry to see you go and appreciate the time you spent with FinFamily.

If this action was not performed by you or you believe this was a mistake, please contact support immediately.

Thank you for using FinFamily.

Best Regards,
FinFamily Team`
);
   }catch(err){
    res.status(500).json({message:"error in account deleted"})
   }
}

const toggleNotification = async(req,res)=>{
   try{
      
      const user = await userModel.findById(req.user);
      user.notifications=!user.notifications
      await user.save();

      res.status(200).json({notifications:user.notifications})

      try{
         if(user.notifications){
    await sendMail(
        user.email,
        "Email Notifications Enabled",
        `Dear ${user.name},

Your email notification preferences have been updated successfully.

Email notifications are now enabled for your FinFamily account.

Thank you for using FinFamily.

Best Regards,
FinFamily Team`
    );
}else{
    await sendMail(
        user.email,
        "Email Notifications Disabled",
        `Dear ${user.name},

Your email notification preferences have been updated successfully.

Email notifications have been disabled for your FinFamily account.

You can re-enable email notifications at any time from your Profile settings.

Best Regards,
FinFamily Team`
    );
}
   }catch(err){
   console.log("error in email",err.message)
}
   }catch(err){
      res.status(500).json({message:"Error updating notification settings"})
   }
}
module.exports ={addUser,login,getUser,logout,deleteAccount,toggleNotification}