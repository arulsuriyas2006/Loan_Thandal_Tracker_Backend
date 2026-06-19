const express =require("express")
const router = express.Router()
const {addUser, login,getUser,logout,deleteAccount,toggleNotification} =require("../controller/userController")
const auth=require("../controller/auth")

router.post("/adduser",addUser);
router.get("/getuser",auth,getUser);
router.post("/login",login)
router.post("/logout",auth,logout)
router.delete("/deleteaccount",auth,deleteAccount)
router.put("/notification",auth,toggleNotification)
router.get("/checkauth",auth,(req,res)=>{
    res.status(200).json({message:"User Authenticatrd",userId:req.user,email:req.email})
})

module.exports= router