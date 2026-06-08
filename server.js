require("dotenv").config()
const express = require("express");
const connection = require("./config/db")
const cors =require("cors")
const loanRoute = require("./routes/loanRoute")
const app =express();
const port = process.env.PORT
connection();
app.use(cors());
app.use(express.json());
app.use("/loan",loanRoute);

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})