const express= require("express")
const app= express();
const dotenv=require("dotenv").config();
const connectDB=require("./Config/db")
connectDB();
const userRouter=require('./Routes/user.route')
const authRoute=require('./Routes/auth.route')
const path =require('path')
const cors=require('cors')
const admin= require("./Routes/Admin.router")
const cookieParser = require('cookie-parser')
const employer= require('./Routes/employer.route')
const packages=require('./Routes/Package')
// middlewares 
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use('/employer',employer)
app.use(cors({
  origin:"http://127.0.0.1:5501" , // your frontend domain
  credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/user',userRouter)
app.use('/package',packages)
app.use('/auth',authRoute)
app.use("/admin",admin)
app.use(express.static(path.join(__dirname, 'Admin'))); 

const fs = require('fs');
const adminProtect = require("./Middlewares/adminProtect");
const { employerProtect } = require("./Middlewares/authMiddleware");

app.get('/Admin', adminProtect, (req, res) => {
  res.sendFile(path.join(__dirname, 'Admin', 'Admin.html'));
});

app.get('/noti',(req,res)=>{
  res.sendFile(path.join(__dirname, 'public', 'notifications.html')); 
})


app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/major/Login.html')); // assuming it's in 'frontend'
});
 
app.get('/dash', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html')); // assuming it's in 'frontend'
});

 
app.get('/otp', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'otp.html')); // adjust path if needed
});
app.get('/ragi', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Ragister.html')); 
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/major/index.html')); 
});


// app.get('/files', (req, res) => {
//   const directoryPath = path.join(__dirname, 'uploads/resumes');

//   fs.readdir(directoryPath, (err, files) => {
//     if (err) {
//       return res.status(500).json({ message: 'Unable to scan files!' });
//     }

//     const fileList = files.map(filename => ({
//       name: filename,
//       url: `/uploads/resumes/${filename}`
//     }));

//     res.json(fileList);
//   });
// });


// logout route on server
app.get('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' }); // set path to match the one used in set-cookie
  res.redirect('/major/login.html');
});

app.listen(process.env.PORT,()=>{
    console.log("App is running on 3000")
})