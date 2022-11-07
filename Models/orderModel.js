const mongoose =require('mongoose');

const {Schema}=mongoose;


const orderSchema=new Schema({
    shippingInfo:{
        address:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true,
            default:"Pakistan"
        },
        pinCode:{
            type:Number,
            required:true
        },
        phoneNumber:{
            type:Number,
            required:true
        }
    },
    orderitem:[
        {
        name:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        product:{
            type:mongoose.Schema.ObjectId,
            ref:"Product",
            required:true
        }

    }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    paymentInfo:{
        id:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        }
    },
    paidAt:{
        type:Date,
        required:true
    },
    itemPrice:{
        type:Number,
        default:0,
        required:true
    },
    taxPrice:{
        type:Number,
        default:0,
        required:true
    },
    shipingPrice:{
        type:Number,
        default:0,
        required:true
    },
    totalPrice:{
        type:Number,
        default:0,
        required:true
    },
    orderStatus:{
        type:String,
        required:true,
        default:"Processing"
    },
    deliveredAt:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }

})


const Order=mongoose.model('Order',orderSchema)

module.exports=Order;