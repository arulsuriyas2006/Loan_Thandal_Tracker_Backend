const loan = require("../model/loan_model")
const installmentModel = require("../model/Installment_Model")
const addLoan = async(req,res)=>{
    try{
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
        unpaidCount:newLoan.term   
    });
     await ln.save();
    //  console.log(ln)

     const installments =[];

    for(let i=0;i<ln.term;i++){
        const dueDate = new Date(ln.date);
        dueDate.setMonth(dueDate.getMonth()+i);

        installments.push({
            loanId:ln._id,
            dueDate:dueDate,
            installmentamount:ln.installmentamount,
            paid:false
        })
    }
    console.log("add installments")
    console.log(installments)
    await installmentModel.insertMany(installments);
    console.log(installments)
     res.status(201).json({message:"loan added successfullly",ln})
    }catch(err){
        console.log(err);
     res.status(500).json({message:"loan does not added check the server",err})       
    }
}

const getAllLoan = async(req,res)=>{
    try{
        console.log("getloan")
     const allLoanDetails = await loan.find();
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
        const m = await installmentModel.findById(req.params.id);
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
    }catch(err){
    res.status(500).json({message:"error to update loan"})
    }
}

const deleteLoan =async(req,res)=>{
    try{
    const deleteloan = await loan.findByIdAndDelete(req.params.id);
    if(!deleteloan){
        res.status(404).json({message:"loanid not found"})
    }
    res.status(200).json({message:"loan deleted successfully",deleteloan})
    }catch(err){
    res.status(500).json({message:"error in deleting loan",err})
    }
}

const getPaidHistory =async(req,res)=>{
    try{
        console.log("history")
       const history = await installmentModel.find({paid:true}).populate("loanId")
       res.status(200).json({message:"get paid amount details",history})
    }catch(err){
      res.status(500).json(err);
    }
}

const getUpcomingpayments =async(req,res)=>{
    try{
    const payments  = await installmentModel.find({paid:false})
                               .populate("loanId")
                               .sort({dueDate:1})
    res.status(200).json({payments})
    }catch(err){
        res.status(500).json({message:"Error fetching payments",err})
    }
}
module.exports = {addLoan,getAllLoan,getLoanById,updateLoan,deleteLoan,getInstallments,markPaid,getPaidHistory,getUpcomingpayments}