const mongoose = require("mongoose")

const loanSchema = new mongoose.Schema(
    {
       name:{type:String,required:true},
       totalamount:{type:Number,required:true},
       frequency:{type:String,required:true},
       date:{type:Date,required:true},
       installmentamount:{type:Number,required:true},
       term:{type:Number,required:true}
    },{
        timestamps:true
    }
)
const loanModel = mongoose.model("loan",loanSchema)
module.exports = loanModel;