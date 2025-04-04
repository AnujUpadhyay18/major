const express= require("express")
const app= express();
const dotenv=require("dotenv").config();
const connectDB=require("./Config/db")
connectDB();
const userRouter=require('./Routes/user.route')
const authRoute=require('./Routes/auth.route')
const path =require('path')
const cors=require('cors')


// middlewares 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use('/uploads/resumes', express.static(path.join(__dirname, 'uploads/resumes')));
app.use('/user',userRouter)
app.use('/auth',authRoute)


app.get("/",(req,res)=>{
    res.send(" hey its running ")
})

app.listen(process.env.PORT,()=>{
    console.log("App is running on 3000")
})