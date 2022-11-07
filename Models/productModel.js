const mongoose=require('mongoose')

const {Schema}=mongoose;

const productSchema=new Schema({
    name:{
        type:String,
        required:[true,"Please Enter Product Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please Enter Description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter Price"],
        maxLength:[6,"Price Cannnot be exceed 6 Figure"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
      {  public_id:{
            type:String,
            required:true
        },
        URL:{
            type:String,
            required:true
        }}
    ],
    category:{
        type:String,
        required:[true,"Please Category"],
        
    },
    Stock:{
        type:Number,
        required:[false,"Please Enter Stock"],
        maxLength:[4,"Stock Figure Should be less than 5"],
        default:1
    },
    numOfreviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
            name:{
                type:String,
                required:[true,"Please Review Name"]
            },
            rating:{
                type:Number,
                required:[true,"Please Enter Rating"]
            },
            comment:{
                type:String,
                required:[true,"Please Enter Comment"]
            }
        }
    ],
    craetedAt:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    }

})

module.exports=mongoose.model("Product",productSchema)