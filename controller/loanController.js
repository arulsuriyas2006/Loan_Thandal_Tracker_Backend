const loan = require("../model/loan_model")
const installmentModel = require("../model/Installment_Model")
const sendMail = require("../utils/sendMail")
const userModel = require("../model/user_model")
const addLoan = async(req,res)=>{
    try{
        const authuserID =req.user
        const authemail = req.email
        console.log("in backend")
     const newLoan ={
        name:req.body.name,
        totalamount:Number(req.body.totalamount),
        frequency:req.body.frequency,
        date:req.body.date,
        installmentamount:Number(req.body.installmentamount),
        term:Number(req.body.term)
     }
     console.log(newLoan);
     const ln =new loan({...newLoan,
        paidAmount:0,
        unpaidAmount:newLoan.totalamount,
        paidCount:0,
        unpaidCount:newLoan.term, 
        userID:authuserID 
    });
     await ln.save();
    //  console.log(ln)

     const installments =[];

    for(let i=0;i<ln.term;i++){
        const dueDate = new Date(ln.date);
    if(ln.frequency === "d"){
        dueDate.setDate(dueDate.getDate() + i);
    }

    // Weekly
    else if(ln.frequency === "w"){
        dueDate.setDate(dueDate.getDate() + (i * 7));
    }

    // Monthly
    else if(ln.frequency === "m"){
        dueDate.setMonth(dueDate.getMonth() + i);
    }

    // Yearly
    else if(ln.frequency === "y"){
        dueDate.setFullYear(dueDate.getFullYear() + i);
    }

        installments.push({
            loanId:ln._id,
            dueDate:dueDate,
            installmentamount:ln.installmentamount,
            paid:false,
            userID:authuserID 
        })
    }
    console.log("add installments")
    console.log(installments)
    await installmentModel.insertMany(installments);
    console.log(installments)
    const username = await userModel.findById(authuserID)

     res.status(201).json({message:"loan added successfullly",ln})
         try{
    await sendMail(
        authemail,
        "Loan Created",
        `Dear ${username.name},\nYour loan ${ln.name} has been created successfully.\nInstallment Amount: ₹${ln.installmentamount}\nTotal Term: ${ln.term}
        
FinFamily`
    )
}catch(err){
    console.log("mail Error:",err.message)
}
    }catch(err){
        console.log(err);
     res.status(500).json({message:"loan does not added check the server",err})       
    }
}

const getAllLoan = async(req,res)=>{
    try{
        const authuser = req.user
        console.log("getloan")
     const allLoanDetails = await loan.find({userID:authuser});
     console.log(allLoanDetails)
     res.status(200).json({allLoanDetails})
    }catch(err){
        res.status(500).json({message:"unable to get loan details check the server",err})
    }
}

const getInstallments = async(req,res)=>{
    try{
    console.log("getinstallments")
     const installments = await installmentModel.find({loanId:req.params.loanId});
     console.log(installments);
     res.status(200).json({installments})
    }catch(err){
        res.status(500).json({message:"unable to get loan installments details check the server",err})
    }
}

const markPaid = async(req,res)=>{
    try{
        const authuserID =req.user
        const authemail = req.email
        const m = await installmentModel.findById(req.params.id);
        if(!m){
    return res.status(404).json({
        message:"Installment not found"
    });
}
        if(m.paid){
            return res.status(400).json({message:"Already paid"});
        }
     const month = await installmentModel.findByIdAndUpdate(req.params.id,{
        paid:true,
        paidDate:new Date()
     },{new:true}
    )
    const currentLoan = await loan.findById(month.loanId);
    console.log(currentLoan);
    await loan.findByIdAndUpdate(month.loanId,{
        paidAmount:currentLoan.paidAmount+month.installmentamount,
        unpaidAmount:currentLoan.unpaidAmount-month.installmentamount,
        paidCount:currentLoan.paidCount+1,
        unpaidCount:currentLoan.unpaidCount-1
    },{new:true})
    res.status(200).json(month)
    const username = await userModel.findById(authuserID)
    try{
await sendMail(
  authemail,
  "Installment Payment Successful",
  `Dear ${username.name},

Your installment payment has been successfully recorded.

Loan Name: ${currentLoan.name}
Installment Amount: ₹${m.installmentamount}
Remaining Installments: ${currentLoan.unpaidCount}
Total Installments: ${currentLoan.term}

Thank you for making your payment on time.

You can log in to FinFamily to view your updated loan status and payment history.

Best Regards,
FinFamily Team`
);
}catch(err){
    console.log("mail Error:",err.message)
}
    }catch(err){
        res.status(500).json({message:"error in mark as paid",err})
    }
}

const getLoanById =async(req,res)=>{
    try{
        console.log("loanbyid")
     const loanidDetails = await loan.findById(req.params.id);
     console.log(loanidDetails);
     if(!loanidDetails){
        res.status(404).json({message:"loan not found"})
     }
     res.status(200).json({loanidDetails})
    }catch(err){
     res.status(500).json({message:"error to fetch loan by id",err})
    }

}

const updateLoan = async(req,res)=>{
    try{
        const authuserID =req.user
        const authemail = req.email
     const updateloan = await loan.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        totalamount:Number(req.body.totalamount),
        frequency:req.body.frequency,
        date:req.body.date,
        installmentamount:Number(req.body.installmentamount),
        term:Number(req.body.term)
     },{new:true})
    if(!updateloan){
        res.status(404).json({message:"loan id not found"})
    }
    res.status(200).json({message:"loan updated successfully"},updateloan)
    
    try{
         const username = await userModel.findById(authuserID)
await sendMail(
  authemail,
  "Loan Updated Successfully",
  `Dear ${username.name},

Your loan details have been updated successfully.

Loan Name: ${updateloan.name}
Total Amount: ₹${updateloan.totalamount}
Installment Amount: ₹${updateloan.installmentamount}
Total Installments: ${updateloan.term}

Thank you for using FinFamily.

Best Regards,
FinFamily Team`
);
    }catch(err){
        console.log("Email error",err.message)
    }
    }catch(err){
    res.status(500).json({message:"error to update loan"})
    }
}

const deleteLoan =async(req,res)=>{
    try{
        const authuserID =req.user
        const authemail = req.email
    const deleteloan = await loan.findByIdAndDelete(req.params.id);
    if(!deleteloan){
        res.status(404).json({message:"loanid not found"})
    }
    const deleteinstallments = await installmentModel.deleteMany({loanId:req.params.id})
    res.status(200).json({message:"loan deleted successfully",deleteloan})

    try{
        const username = await userModel.findById(authuserID)
await sendMail(
  authemail,
  "Loan Deleted Successfully",
  `Dear ${username.name},

This email confirms that your loan "${deleteloan.name}" has been successfully deleted from your FinFamily account.

All associated installment records for this loan have also been removed.

Thank you for using FinFamily.

Best Regards,
FinFamily Team`
);
    }catch(err){
        console.log("Email error",err.message)
    }
    }catch(err){
    res.status(500).json({message:"error in deleting loan",err})
    }
}

const getPaidHistory =async(req,res)=>{
    try{
        const authuser = req.user
        console.log("history")
       const history = await installmentModel.find({paid:true,userID:authuser}).populate("loanId")
       res.status(200).json({message:"get paid amount details",history})
    }catch(err){
      res.status(500).json(err);
    }
}

const getUpcomingpayments =async(req,res)=>{
    try{
        const authUser = req.user
    const payments  = await installmentModel.find({paid:false,userID:authUser})
                               .populate("loanId")
                               .sort({dueDate:1})
    res.status(200).json({payments})
    }catch(err){
        res.status(500).json({message:"Error fetching payments",err})
    }
}
const getCalendarInstallments = async(req,res)=>{
    try{
        const authuser =req.user
    const calInstallments = await installmentModel.find({userID:authuser}).populate("loanId");
    res.status(200).json({calInstallments})
    }catch(err){
        res.status(500).json(err);
    }
}
module.exports = {addLoan,getAllLoan,getLoanById,updateLoan,deleteLoan,getInstallments,markPaid,getPaidHistory,getUpcomingpayments,getCalendarInstallments}