const express = require("express")
const router = express.Router();
const {addLoan,getAllLoan,getLoanById}= require("../controller/loanController")

router.post("/addloan",addLoan);
router.get("/getloan",getAllLoan);
router.get("/getloan/:id",getLoanById);

module.exports = router;