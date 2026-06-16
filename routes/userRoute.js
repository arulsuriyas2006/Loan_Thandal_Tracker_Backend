const express =require("express")
const router = express.Router()
const {addUser, login} =require("../controller/userController")


router.post("/adduser",addUser);
router.post("/login",login)
module.exports= router