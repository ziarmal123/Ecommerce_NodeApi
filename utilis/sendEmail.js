// const nodeMailer=require('nodemailer');


// const sendEmail=async(options)=>{

//     const transporter=nodeMailer.createTransport({
//         // service:"gmail",
//         service:process.env.SMPT_SERVICE,
//         host: process.env.SMPT_HOST,
//         port: process.env.SMPT_PORT,
//         secure: false, // true for 587, false for other ports
//         requireTLS: true,
        
//         tls:{
//             ciphers: "SSLv3",
//             rejectUnauthorized:false
//         },
//         auth:{
//             // user:"ziarmaldpservice121@gmail.com",
//             // password:"khan123khan"
//             user:process.env.SMPT_MAIL,
//             pass:process.env.SMPT_PASSWORD
//         }
//  });  
//             let mailOptions={
//                 from:process.env.SMPT_MAIL,
//                 to:options.email,
//                 subject:options.subject,
//                 text:options.message
//             } 
//       await transporter.sendMail(mailOptions)
//     //   transporter.sendMail(mailOptions, function(error, info){
//     //     if (error) {
//     //        console.log(error);
//     //     } else {
//     //         console.log('Email sent: ' + info.response);
//     //         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

//     //     }
//     // });
// }


// module.exports=sendEmail