const app=require('./app')
const dotenv=require('dotenv')
const cloudinary =require('cloudinary')
// const connectDatabasse=require("./config/database");
const ConnectDatabase=require("./config/database")


dotenv.config({path:"backend/config/config.env"});
ConnectDatabase();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
//Call Database here due to env file
// connectDatabasse();

app.listen(process.env.PORT,()=>{
    console.log(`Server is Runing on http://localhost:${process.env.PORT}`)
})