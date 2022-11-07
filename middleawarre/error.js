// const ErrorHandler=require('../utilis/errorhandler');

const ErrorHandler = require("../utilis/errorhandler");

module.exports=(err,req,res,next)=>{
    // console.log("CheckError:",err)
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal Server Error";
    //Wrong mongodb Id error
    if(err.name==="CastError"){
        const message=`Resource not Found,Invalid ${err.path}`;
        err=new ErrorHandler(message,400)
    }
    //Duplicate Key error
    // if(err.code===11000){
    //     const message=`Duplicate ${Object.keys(err.keyValue)} Entered`;
    //     err=new ErrorHandler(message,400)
    // }
    // //Wrong JWT TOKEN ERROR
    // if(err.name="JsonWebTokenError"){
    //     const message=`Json Web Token is Invalid, Try Again`;
    //     err=new ErrorHandler(message,400)
    // }
    // //JWT Expire error
    // if(err.name="TokenExpiredError"){
    //     const message=`Json Web Token is Expire, Try Again`;
    //     err=new ErrorHandler(message,400)
    // }


    res.status(err.statusCode).json({
        success:false,
        error:err,
        message:err.message
    })
}