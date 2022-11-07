const Order=require('../Models/orderModel');
const express=require('express')
const {isAuthenticate,authorizeRole} = require('../middleawarre/auth');
const ErrorHandler = require('../utilis/errorhandler');
const ApiFeatures = require('../utilis/apifeatures');
const catchAsyncError = require('../middleawarre/catchAsyncError');
const OrderRouter=express.Router();
const Product =require('../Models/productModel')

//Create New Order 

OrderRouter.post('/order/new',isAuthenticate,catchAsyncError(async(req,res,next)=>{

const {shippingInfo,orderitem,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice}=req.body;

const order=await Order.create({
    shippingInfo
    ,orderitem
    ,paymentInfo,
    itemPrice,
    taxPrice
    ,shippingPrice
    ,totalPrice,
    paidAt:Date.now(),
    user:req.user._id
});
res.status(200).json({
    success:true,
    order
})


}))

//Get Single Order Detail

OrderRouter.get('/order/:id',catchAsyncError(async(req,res,next)=>{

    const order=await Order.findById(req.params.id).populate("user","name email");
    if(!order){
        return next(new ErrorHandler("Product not found with Id",400))
    }
    res.status(200).json({
        success:true,
        order
    })

}))

//Get LoggedIn User Orders Detail

OrderRouter.get("/ownorder",isAuthenticate,catchAsyncError(async(req,res,next)=>{
   
    const orders=await Order.find({user:req.user._id})
    if(!orders){
        return next(new ErrorHandler("Order not found with Id",400))
    }
    res.status(200).json({
        success:true,
        orders
    })

}))

//Admin Get All order and total Amount

OrderRouter.get("/admin/totalorder",isAuthenticate,authorizeRole("admin"),catchAsyncError(async(req,res,next)=>{
   
    const orders=await Order.find({})
    let totalAmount=0
    orders.forEach(order=>{
        totalAmount+=order.itemPrice
    })
    if(!orders){
        return next(new ErrorHandler("Order not found with Id",400))
    }
    res.status(200).json({
        totalAmount,
        orders
    })

}))
//Admin Update the status

OrderRouter.put("/admin/order/:id",isAuthenticate,authorizeRole("admin"),catchAsyncError(async(req,res,next)=>{
   
    const orders=await Order.findById(req.params.id)
    if(!orders){
        return next(new ErrorHandler("Order not found with Id",400))
    }
    if(orders.orderStatus==="Delivered"){
        return next(new ErrorHandler("You have already deliverd this order",404))
    }
    if(req.body.status==='Shipped'){
        orders.orderitem.forEach(async order=>{
        await updateStock(order.product,order.quantity)
    })
    }
    
    orders.orderStatus=req.body.status;
    if(req.body.status==="Delivered"){
        orders.deliveredAt=Date.now();
    }
    await orders.save({validateBeforeSave:false})
    res.status(200).json({
        success:true,
        orders
    })

}))

async function updateStock(id,quantity){
 const product=await Product.findById(id);

 product.Stock-=quantity;
 await product.save({validateBeforeSave:false})
}

//Admin Delete the Order

OrderRouter.delete("/admin/order/:id",isAuthenticate,authorizeRole("admin"),catchAsyncError(async(req,res,next)=>{
   
    const orders=await Order.findById(req.params.id)
    if(!orders){
        next(new ErrorHandler("Id not Found",400))
    }
    await orders.remove();
    res.status(200).json({
        success:true
    })
   


}))

module.exports=OrderRouter;