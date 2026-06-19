require("dotenv").config()
const express = require("express");
const connection = require("./config/db")
const cors =require("cors")
const cookieparser = require("cookie-parser")
const loanRoute = require("./routes/loanRoute")
const userRoute =require("./routes/userRoute")
const cron = require("./cron/installmentRemainder")
const app =express();
const port = process.env.PORT
connection();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(cookieparser())
app.use("/loan",loanRoute);
app.use("/user",userRoute)

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})