const mongoose= require('mongoose')
const validator=require('validator');
const {Schema}=mongoose;
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')


const userSchema=new Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your name"],
        maxLength:[30,"Limit of 30 is exceeding"],
        minLength:[4,"Showed be More than 4 Character"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter Your Correct Email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Your password"],
        maxLength:[30,"Limit of 30 is exceeding"],
        minLength:[4,"Showed be More than 4 Character"],
        select:false
    },
    avatar:{  
        public_id:{
            type:String,
            required:true
        },
        URL:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,


})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,10)
})

userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}
//Compare Password

userSchema.methods.comparePassword=async function(sendpassword){
    // console.log("sendpassword",sendpassword)
    // console.log("password",this.password)
    return await bcrypt.compare(sendpassword,this.password)
}


//Resetpassword Genertating Password Token


userSchema.methods.getResetPassword=function (){

    const resetToken=crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire=Date.now() + 15*60*1000;
    // console.log("Reset Token",tokenCrypto)
    return resetToken;
    
}

module.exports=mongoose.model('User',userSchema)
