const nodeMailer=require('nodemailer');
const {resolveHostname}=require('nodemailer/lib/shared')

const transporter=nodeMailer.createTransport({
    service:'gmail',
    // host: "smtp.mailtrap.io",
    // port: 2525,
    auth: {
      user: "mzhbangash121@gmail.com",
      pass: "kfrmfqowbasrsuxm"
    }
})

transporter.verify((error,success)=>{
    if(error){
        console.log(error)
    }
    else{
        console.log("Mail service is Running")
    }
})

module.exports=transporter


