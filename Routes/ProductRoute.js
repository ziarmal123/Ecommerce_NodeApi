const express =require('express');
const Product=require("../Models/productModel");
const ErrorHandler = require('../utilis/errorhandler');
const Productrouter=express.Router();
const catchAsyncError =require('../middleawarre/catchAsyncError');
const ApiFeatures = require('../utilis/apifeatures');
const {isAuthenticate,authorizeRole} = require('../middleawarre/auth');
const cloudinary=require('cloudinary')
const success=true;

//Product is Created by admin Routes

//All Product Get Route
Productrouter.get("/product",catchAsyncError(async(req,res,next)=>{

const ResultPerPage=6;
const productCount=await Product.countDocuments();
const apifeatures =new ApiFeatures(Product.find(),req.query).search().filter().pagination(ResultPerPage);
const product=await apifeatures.query;

if(!product){
    return next(new ErrorHandler("Filter not Found",404))
} 
res.statusCode=200;
res.setHeader("Content-Type","application/json")
res.json({"success":success,product,productCount,ResultPerPage})
}))

//Single Product Get Route
Productrouter.get("/product/:id",catchAsyncError(async(req,res,next)=>{
    let singleproduct=await Product.findById(req.params.id)
    if(!singleproduct){
        return next(new ErrorHandler("Product not Found",404))
                
    }
    singleproduct=await Product.findById(req.params.id);
    res.status(200);
    res.setHeader("Content-Type","application/json")
    res.json({"success":success,singleproduct})
    }))

//New Product Add Route    
Productrouter.post("/product/new",isAuthenticate,authorizeRole("admin"),catchAsyncError(async (req,res,next)=>{
    
    let images=[]
    if(typeof req.body.images==='string'){
        images.push(req.body.images)
    }
    else{
        images=req.body.images
    }
    const imagesLinks=[];
    for(let i=0;i<images.length;i++){
        const result =await cloudinary.v2.uploader.upload(images[i],{
            folder:'products'
        })
        imagesLinks.push({
            public_id:result.public_id,
            URL:result.secure_url
        })
    }


    req.body.user=req.user.id;
    req.body.images=imagesLinks
    const product=await Product.create(req.body);
    res.status(200);;
    res.setHeader("Content-Type","application/json")
    res.json({"success":"New Product Created Successfully",product})
}))

//Product Update Route
Productrouter.put("/product/:id",isAuthenticate,authorizeRole("admin"),catchAsyncError(async (req,res,next)=>{
    let product=await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not Updated",404))
                
    }
    let images=[]
    if(typeof req.body.images==='string'){
        images.push(req.body.images)
    }
     else{
        images=req.body.images
    }
    if(images!==undefined){
        //Delete Images from cloudinary
      for(let i=0;i<product.images.length;i++){
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
       } 
    const imagesLinks=[];
        for(let i=0;i<images.length;i++){
        const result =await cloudinary.v2.uploader.upload(images[i],{
            folder:'products'
        })
        imagesLinks.push({
            public_id:result.public_id,
            URL:result.secure_url
        })
    }
    req.body.images=imagesLinks
    }
   

   
    product=await Product.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
    res.status(200);
    res.setHeader("Content-Type","application/json")
    res.json({"success":success,product})
}))

//Single Product Delete Route
Productrouter.delete("/product/delete/:id",isAuthenticate,authorizeRole("admin"),catchAsyncError(async(req,res,next)=>{
    let deletedata=await Product.findById(req.params.id)
    if(!deletedata){
        return next(new ErrorHandler("Product not Deleted",404))
                
    }

    //Delete Images from cloudinary
    for(let i=0;i<deletedata.images.length;i++){
       await cloudinary.v2.uploader.destroy(deletedata.images[i].public_id)
    }


    deletedata=await Product.findByIdAndRemove(req.params.id);
    res.status(200);
    res.setHeader("Content-Type","application/json")
    res.json({"success":success,deletedata})
}))

//Create New Review and Update the Review

Productrouter.put('/review',isAuthenticate,catchAsyncError(async(req,res,next)=>{

const {rating,comment,productId}=req.body
const review={
user:req.user._id,
name:req.user.name,
rating:Number(rating),
comment:comment,
}
const product=await Product.findById(productId);
if(!product){
    return next(new ErrorHandler("Product not Find",404))
}
const isReviewd=product.reviews.find((rev)=>rev.user.toString()===req.user._id.toString());
// if(!isReviewd){
//     return next(new ErrorHandler("Is Reviewed is Error",404))
// }
if(isReviewd){
product.reviews.forEach((rev)=>{
if(rev.user.toString()===req.user._id.toString())
(rev.rating=rating),
(rev.comment=comment)

})
}
else{
    product.reviews.push(review)
    product.numOfreviews=product.reviews.length
}
let avg=0;
product.reviews.forEach(rev=>{
    avg+=rev.rating
});

product.ratings=avg/product.reviews.length

await product.save({validateBeforeSave:false})

res.status(200).json({
    success:true,
    message:"Review has Been Added"
})

}))

//See all Review of Product


Productrouter.get("/Allreview",catchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.query.id);
    if(!product){
        return next(new ErrorHandler("ID not Find",404))
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews
    })

}))


//Delete Review

Productrouter.delete("/reviews",isAuthenticate,catchAsyncError(async(req,res,next)=>{

    const product=await Product.findById(req.query.productid);
    if(!product){
        return next(new ErrorHandler("ID not Find",404))
    }
    const reviews=product.reviews.filter(rev=>rev._id.toString()!==req.query.id);
    let avg=0;
    reviews.forEach(rev=>{
    avg+=rev.rating
    });
    if(reviews.length===0){
        ratings=0
    }
    else{
        const ratings=avg/reviews.length
    }

   
   const numOfreviews=reviews.length
   await Product.findByIdAndUpdate(req.query.productid,{reviews,ratings,numOfreviews},{new:true,runValidators:true,useFindAndModify:false});
    res.status(200).json({
        success:true
    })
    })) 

    //All Product Get Route bt Admin
Productrouter.get("/admin/products",isAuthenticate,authorizeRole("admin"),catchAsyncError(async(req,res,next)=>{

        const products=await Product.find({})
        if(!products){
            return next(new ErrorHandler("No Product has Been Found",404))
        }
        res.status(201).json({
            products,
            success
        })
    }))





module.exports=Productrouter