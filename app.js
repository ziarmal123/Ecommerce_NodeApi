const express=require('express')
const app=express();
const dotenv=require('dotenv')
const Productrouter=require('./Routes/ProductRoute')
const UserRouter=require('./Routes/UserRoute')
const errorMiddleaware=require('./middleawarre/error');
const cookieParser = require('cookie-parser');
const OrderRouter = require('./Routes/OrderRoute');
const bodyParser =require('body-parser')
const fileUpload=require('express-fileupload')
const PaymentRouter=require('./Routes/PaymentRoute')

dotenv.config({path:"backend/config/config.env"});

app.use(fileUpload())
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
//Route Imports
app.use("/api/v1",Productrouter)
app.use('/api/v1',UserRouter)
app.use('/api/v1',OrderRouter)
app.use('/api/v1',PaymentRouter)

//Error Middleware
app.use(errorMiddleaware)
module.exports=app
