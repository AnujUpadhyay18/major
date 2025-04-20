const express = require('express');
const { registerUser, registerEmployer, loginHandler,verifyOTP,resendOTP,forgotPassword,resetPassword } = require('../Controllers/Auth.controllers');
const router = express.Router();
const upload =require('../Middlewares/uploadMiddlewares')
const path=require('path')
router.post('/register-user', upload.single('resume'), registerUser);
//router.post('/login-user', loginUser);
router.post('/register-employer', registerEmployer);
router.post('/login-employer', loginHandler);
router.post('/verify-employer', verifyOTP);  
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/reset-password/:token', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/resetPage.html'));
  
  });
module.exports = router; 