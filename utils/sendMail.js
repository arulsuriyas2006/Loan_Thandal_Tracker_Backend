const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    },
    connectionTimeout: 10000,
})
// Add here
transporter.verify((err, success) => {
  if (err) {
    console.log("SMTP Error:", err);
  } else {
    console.log("SMTP Ready");
  }
});
const sendMail = async(to,subject,text)=>{
    console.log(process.env.EMAIL)
    console.log(process.env.EMAIL_PASSWORD)
    await transporter.sendMail({
        from:process.env.EMAIL,
        to,
        subject,
        text
    })
}

module.exports=sendMail;