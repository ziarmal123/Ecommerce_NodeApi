const ErrorHandler = require('../utilis/errorhandler');
const catchAsyncError=require('./catchAsyncError')
const jwt=require('jsonwebtoken')
const User=require('../Models/userModel')

exports.isAuthenticate=catchAsyncError(async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        return next(new ErrorHandler("Please Login to access the resources",401))
    }
    const decodedData=jwt.verify(token,process.env.JWT_SECRET)
    // console.log(decodedData)
    req.user=await User.findById(decodedData.id)

    next();

})

exports.authorizeRole=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`,403))
        }
        next();
    }
}

// module.exports=isauthenticate