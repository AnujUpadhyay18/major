const express = require('express');
const { registerUser, loginUser, registerEmployer, loginEmployer,verifyOTP,resendOTP,resetPassword } = require('../Controllers/Auth.controllers');
const router = express.Router();
const upload =require('../Middlewares/uploadMiddlewares')

router.post('/register-user', upload.single('resume'), registerUser);
router.post('/login-user', loginUser);
router.post('/register-employer', registerEmployer);
router.post('/login-employer', loginEmployer);
router.post('/verify-employer', verifyOTP);  
router.post('/resend-otp', resendOTP);
router.post('/reset-password', resetPassword);
module.exports = router; 