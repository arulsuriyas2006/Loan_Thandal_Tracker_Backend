const express = require("express")
const router = express.Router();
const {addLoan,getAllLoan,getLoanById, updateLoan, deleteLoan,getInstallments,markPaid,getPaidHistory,getUpcomingpayments,getCalendarInstallments}= require("../controller/loanController")

router.post("/addloan",addLoan);
router.get("/getloan",getAllLoan);
router.get("/getloan/:id",getLoanById);
router.put("/editloan/:id",updateLoan);
router.delete("/deleteloan/:id",deleteLoan);
router.get("/getinstallments/:loanId",getInstallments)
router.put("/markpaid/:id",markPaid);
router.get("/history",getPaidHistory)
router.get("/getupcomingpayments",getUpcomingpayments)
router.get("/getCalendarInstallments",getCalendarInstallments)

module.exports = router;