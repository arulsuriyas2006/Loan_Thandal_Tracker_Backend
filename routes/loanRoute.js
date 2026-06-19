const express = require("express")
const auth = require("../controller/auth")
const router = express.Router();
const {addLoan,getAllLoan,getLoanById, updateLoan, deleteLoan,getInstallments,markPaid,getPaidHistory,getUpcomingpayments,getCalendarInstallments}= require("../controller/loanController")

router.post("/addloan",auth,addLoan);
router.get("/getloan",auth,getAllLoan);
router.get("/getloan/:id",auth,getLoanById);
router.put("/editloan/:id",auth,updateLoan);
router.delete("/deleteloan/:id",auth,deleteLoan);
router.get("/getinstallments/:loanId",auth,getInstallments)
router.put("/markpaid/:id",auth,markPaid);
router.get("/history",auth,getPaidHistory)
router.get("/getupcomingpayments",auth,getUpcomingpayments)
router.get("/getCalendarInstallments",auth,getCalendarInstallments)

module.exports = router;