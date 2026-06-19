const cron = require("node-cron")
const installmentModel =require("../model/Installment_Model")
const userModel =require("../model/user_model")
const sendMail =require("../utils/sendMail")
const loanModel = require("../model/loan_model")
cron.schedule("0 9 * * *",async()=>{
    console.log("checking installment remainder")

    try{
        const today = new Date();
        today.setHours(0,0,0,0)

        const installments = await installmentModel.find({paid:false}).populate("loanId")
        
        for(const installment of installments){
            const dueDate = new Date(installment.dueDate)
            dueDate.setHours(0,0,0,0)

            const diffDays = Math.ceil(
                (dueDate-today)/(1000*60*60*24)
            )
            const user = await userModel.findById(installment.userID)
            
            if(!user.notifications){
             continue;
             }
                
                console.log(installment)
                console.log(user)
                console.log(installment.loanId)
                console.log(installment.loanId.name)

            if(diffDays<0){
                await sendMail(
                    user.email,
                    "Overdue Payment Alert",
                    `Dear ${user.name},
\nLoan Name: ${installment.loanId.name}\nInstallment Amount: ₹${installment.installmentamount}\nDue Date: ${dueDate.toDateString()}\n.
Days Overdue: ${Math.abs(diffDays)}

Please complete the payment as soon as possible.

Regards,
FinFamily Team`
                )
                console.log(`Remainder sent to ${user.email}`)
            
            }

                if(diffDays==0){
                await sendMail(
                    user.email,
                    "Payment Due Today",
                    `Dear ${user.name},\n
Your installment payment is due today.

Loan Name: ${installment.loanId.name}\nInstallment Amount ₹${installment.installmentamount}\nDue Date: ${dueDate.toDateString()}.\nDays Remaining: ${diffDays}

Please make the payment today to avoid overdue status.

Regards,
FinFamily Team`
                )
                console.log(`Remainder sent to ${user.email}`)
                
            }    


        if(diffDays<=5 || diffDays==10){
                await sendMail(
                    user.email,
                    "Installment Remainder",
                    `Dear ${user.name},\n
This is a friendly reminder that you have an upcoming installment payment.
\nLoan Name: ${installment.loanId.name}\nInstallment Amount: ₹${installment.installmentamount}\nDue Date: ${dueDate.toDateString()}.\nDays Remaining: ${diffDays}

Please make the payment on or before the due date to avoid overdue status.

Thank you for using FinFamily.

Regards,
FinFamily Team`
                )
                console.log(`Remainder sent to ${user.email}`)
            }

        }

    }catch(err){
        console.log(err)
    }
})