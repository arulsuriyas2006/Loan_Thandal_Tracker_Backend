const mongoose = require("mongoose")

const installmentSchema =new mongoose.Schema(
    {
        loanId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"loan",
            required:true
        },
        dueDate:{
            type:Date,
            required:true
        },
        installmentamount:{
            type:Number,
            required:true
        },
        paid:{
            type:Boolean,
            default:false
        },
        paidDate:{
            type:Date,
            default:null
        },
        userID:{
            type:String,
            required:true
        }

   },
   {timestamps:true}
)
const installmentModel = mongoose.model("installment",installmentSchema);
module.exports = installmentModel;