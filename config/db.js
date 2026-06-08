const mongoose = require("mongoose")
const mongodb_url = process.env.MONGODB_URL
const connection = async()=>{
    try{
     await mongoose.connect(mongodb_url);
     console.log("mongodb connected successfully");
     console.log("Database Name:", mongoose.connection.name);
     console.log("Connection State:", mongoose.connection.readyState);
    }catch(err){
     console.log("error in mongodb connection",err);
    }
} 
module.exports = connection;