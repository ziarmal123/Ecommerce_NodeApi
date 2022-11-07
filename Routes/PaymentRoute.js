const catchAsyncErrors=require('../middleawarre/catchAsyncError')
const stripeClient=require('stripe')('sk_test_51LuztxLmk9FbHuzadlYKJNM1ftppIBiyhDhlGQSUz3lfJCSSirgUz1Z2VS3bstujhOsN1MRHttVfEOayLiOyyX0N00HnBAIG95')
const express=require('express')
const PaymentRouter=express.Router();
const {isAuthenticate} =require('../middleawarre/auth')

PaymentRouter.post('/payment/process',isAuthenticate,catchAsyncErrors(async(req,res,next)=>{

    const myPayment=await stripeClient.paymentIntents.create({
        amount:req.body.amount,
        currency:'usd',
        metadata:{
            compamy:"Ecommerce",

        }
    });
    res.status(200).json({
        success:true,
        client_secret:myPayment.client_secret
    })

})
)
PaymentRouter.get('/stripekey',isAuthenticate,catchAsyncErrors(async(req,res,next)=>{
    res.status(200).json({
        stripeApiKey:process.env.STRIPE_API_KEY
    })
}))
module.exports=PaymentRouter;