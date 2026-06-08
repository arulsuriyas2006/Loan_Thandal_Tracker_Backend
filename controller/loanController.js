const loan = require("../model/loan_model")

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
     const ln =new loan(newLoan);
     await ln.save();
     res.status(201).json({message:"loan added successfullly"},ln)
    }catch(err){
     res.status(500).json({message:"loan does not added check the server"},err)       
    }
}

const getAllLoan = async(req,res)=>{
    try{
     const allLoanDetails = await loan.find();
     res.status(200).json({allLoanDetails})
    }catch(err){
        res.status(500).json({message:"unable to get loan details check the server"},err)
    }
}

const getLoanById =async(req,res)=>{
    try{
     const loanidDetails = await loan.findById(req.params.id);
     if(!loanidDetails){
        res.status(404).json({message:"loan not found"})
     }
     res.status(200).json({loanidDetails})
    }catch(err){
     res.status(500).json({message:"error to fetch loan by id",err})
    }

}
module.exports = {addLoan,getAllLoan,getLoanById}