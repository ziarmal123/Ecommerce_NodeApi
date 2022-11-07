class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
        Error.captureStackTrace(this,this.constructor)
        // console.log("Error Class",statusCode,message)
    }
}

module.exports=ErrorHandler