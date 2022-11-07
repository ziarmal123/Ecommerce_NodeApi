const express =require('express');
const ErrorHandler = require('../utilis/errorhandler');
const catchAsyncError =require('../middleawarre/catchAsyncError');
const sendToken=require('../utilis/jwtToken')
const User=require('../Models/userModel')
const sendEmail=require("../utilis/sendEmail")
const crypto=require('crypto');
const { isAuthenticate ,authorizeRole} = require('../middleawarre/auth');
const cloudinary =require('cloudinary')
const UserRouter=express.Router();

const nodemailer=require('nodemailer')
const transporter=nodemailer.createTransport({
    service:'gmail',
    // host: "smtp.mailtrap.io",
    // port: 2525,
    auth: {
      user: "mzhbangash121@gmail.com",
      pass: "kfrmfqowbasrsuxm"
    }
})
//User Registeration
UserRouter.post('/register',catchAsyncError(async(req,res,next)=>{
    const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale"
    })
   const {name,email,password}=req.body
   const user =await User.create({
    name,email,password,
    avatar:{
        public_id:myCloud.public_id,
        URL:myCloud.secure_url
    }
   })


   res.status(201).json({
    success:true,
    user
   })

}))


//User Login

UserRouter.post('/login',catchAsyncError(async(req,res,next)=>{
    const {email,password}=req.body
    if(!email||!password){
        return next(new ErrorHandler("Please Enter Your email and password",401))
    }
    const user =await User.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("Invalid Cradidential",401))
    }
    const isPasswordmatch=await user.comparePassword(password);
    if(!isPasswordmatch){
        return next(new ErrorHandler("Invalid Cradidential",401))
    }

    sendToken(user,200,res);
    // const token=user.getJWTToken();
    // res.status(200).json({
    //  success:true,
    //  token,
    // })
}))


//ForgetPassword

// UserRouter.post('/password/forget',catchAsyncError(async(req,res,next)=>{

//     const user =await User.findOne({email:req.body.email});
//     if(!user){
//         return next(new ErrorHandler("Invalid Cradidential",401))
//     }
//     //Get reset Token
//     const resetToken=user.getResetPassword();
//     await user.save({validateBeforeSave:false});

//     const resetPasswordUrl=`http://localhost/api/v1/password/reset/${resetToken}`
//     //  const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

//     const message=`Your password Reset token is :- \n\n ${resetPasswordUrl} \n\n if ypi have not requested email ignore it`;
//     try {
//         await sendEmail({
//             email:user.email,
//             subject:`Ecommerce Password Recovery`,
//             message

//         })
//         res.status(200).json({
//             success:true,
//             message:`Email send to ${user.email} successfully`
//         })

//     } catch (error) {
//         user.resetPasswordToken=undefined;
//         user.resetPasswordExpire=undefined;
//          await user.save({validateBeforeSave:false});
//          return next(new ErrorHandler(error.message,500))
        
//     }

// }))
//////////////////////////Copy
UserRouter.post('/password/forget',catchAsyncError(async(req,res,next)=>{
    // const {email}=req.body
    try{
         const user =await User.findOne({email:req.body.email});
         if(!user){
        return next(new ErrorHandler("Invalid Cradidential",401))
        }
        //Get reset Token
        const resetToken=user.getResetPassword();
        await user.save({validateBeforeSave:false});

         const resetPasswordUrl=`http://localhost/api/v1/password/reset/${resetToken}`
         //  const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

        const message=`Your password Reset token is :- \n\n ${resetPasswordUrl} \n\n if ypi have not requested email ignore it`;
        if(resetToken){
            const mailOptions={
                from:'mzhbangash121@gmail.com',
                to:user.email,
                subject:"Sending Email to password",
                text:`This Link is Valid for http://localhost:4000/api/v1/passsword/reset/${resetToken}`
            }
            transporter.sendMail(mailOptions,(error,inform)=>{
                if(error){
                    
                    res.status(401).json({
                        status:401,
                        message:"email not Send"
                    })
                }
                else{
                   
                    res.status(201).json({
                        status:201,
                        message:"Email Send Successfully"

                    })
                }
            })
        }

    }
    catch(error){
        res.status(401).json({
            status:401,
            message:"email not Send"
        })

    }
}
)
)


    
   
    
    // try {
    //     await sendEmail({
    //         email:user.email,
    //         subject:`Ecommerce Password Recovery`,
    //         message

    //     })
    //     res.status(200).json({
    //         success:true,
    //         message:`Email send to ${user.email} successfully`
    //     })

    // } catch (error) {
    //     user.resetPasswordToken=undefined;
    //     user.resetPasswordExpire=undefined;
    //      await user.save({validateBeforeSave:false});
    //      return next(new ErrorHandler(error.message,500))
        
    // }



///////////////



//Reset Password through nodemailer

UserRouter.post('/password/reset',catchAsyncError(async(req,res,next)=>{

    //creating token hash
  const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user=await User.findOne({
        resetPasswordToken:resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    });

    if(!user){
        return next(new ErrorHandler("Reset password is invalid or hasbeen expire",400))
    }
    if(req.body.password!==req.body.confirmedPassword){
        return next(new ErrorHandler("Password does not matched",400))
    }
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();
    sendToken(user,200,res);

}))


//logOut ROute
UserRouter.post('/logout',catchAsyncError((req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"Logged Out"
    })
}))

//Login User Own Data
UserRouter.get("/userlogin",isAuthenticate,catchAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.user._id)
    if(!user){
        return next(new ErrorHandler("Did not logged_IN",401))
    }
    res.status(200).json({
        success:true,
        user
    })
}))

//Change Password 
UserRouter.put("/password/update",isAuthenticate,catchAsyncError(async(req,res,next)=>{

    const user=await User.findById(req.user._id).select("+password");
    const isPasswordmatch=await user.comparePassword(req.body.oldpassword);
    if(!isPasswordmatch){
        return next(new ErrorHandler("Old Password Not Matched",401))
    }
    if(req.body.newPassword!==req.body.confirmedPassword){
        return next(new ErrorHandler("Confirm Password Not Matched",401))
    }
    user.password=req.body.newPassword;
    await user.save();
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true
    })
    // sendToken(user,200,res)
}))

///Update your own Profile
UserRouter.put("/profileupdate",isAuthenticate,catchAsyncError(async(req,res,next)=>{
    
    const userupdateData={
        name:req.body.name,
        email:req.body.email
    }
    if(req.body.avatar!==""){
        const user=await User.findById(req.user.id)
        const imageId=user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);
        const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"avatars",
            width:150,
            crop:"scale"
        });
        userupdateData.avatar={
            public_id:myCloud.public_id,
            URL:myCloud.secure_url
        }
    }
    const user =await User.findByIdAndUpdate(req.user._id,userupdateData,{new:true,
    runValidators:true,useFindAndModify:false})
    // const user=await User.findByIdAndUpdate(req.user._id,{$set:userupdateData},{new:true})
    
    res.status(200).json({
        success:true,
        user
    })
    // sendToken(user,200,res)


}))

//Admin want total User Data

UserRouter.get("/admin/allprofile",isAuthenticate,authorizeRole("admin"),catchAsyncError(async(req,res,next)=>{

    const users =await User.find({});
    res.status(200).json({
        success:true,
        users
    })
}))



///Admin want Single User Data 


UserRouter.get("/admin/userprofile/:id",isAuthenticate,authorizeRole("admin"),catchAsyncError(async(req,res,next)=>{

    const user =await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User of this id: ${req.params.id} not found`))
    }
    res.status(200).json({
        success:true,
        user
    })
}))

//Admin Update the user role and other cred
UserRouter.put("/admin/roleupdate/:id",isAuthenticate,authorizeRole("admin"),catchAsyncError(async(req,res,next)=>{

    // let user=User.findById(req.params.id)
    // if(!user){
    //     return next(
    //         new ErrorHandler(`User does not exist with Id:${req.params.id}`400,)
    //     )
    // }
    const userupdateData={
        role:req.body.role,
        name:req.body.name,
        email:req.body.email
    }
     user =await User.findByIdAndUpdate(req.params.id,userupdateData,{new:true,
    runValidators:true,useFindAndModify:false})
    // const user=await User.findByIdAndUpdate(req.user._id,{$set:userupdateData},{new:true})
    res.status(200).json({
        success:true,
        user
    })
    // sendToken(user,200,res)


}))

//Admin Delete the User
UserRouter.delete('/admin/deleteuser/:id',isAuthenticate,authorizeRole("admin"),catchAsyncError(async(req,res,next)=>{

    const user=await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler(`User of this id: ${req.params.id} not found`))
    }
    const imageId=user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId)
    await user.remove()
    res.status(200).json({
        success:true,
        user
    })

}))




module.exports=UserRouter;

