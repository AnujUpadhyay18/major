const User = require('../Models/user.model');
const Employer = require('../Models/Employer.model');
const generateToken = require('../Utils/generateToken');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const sendOTP=require('../Utils/sendOtp')
const redisClient=require("../Config/radisClient")
const crypto=require('crypto')
const sendEmail=require('../Utils/sendEmail')
const path=require("path")

const registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;
    const resume = req.file ? req.file.path : null; // Save file path

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            resume, 
            role:'seeker'
        });

        res.status(201).json({ token: generateToken(user._id,user.role) });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// const loginUser = async (req, res) => {
//     const { email, password } = req.body;
//     try {
      
//         const user = await User.findOne({ email });
//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }
//        const token= generateToken(user._id,user.role)
//        console.log(user.role)
//         res.json({token :token});
        
//     } catch (error) {
//         res.status(500).json({ message:  error.message });
//     }
// };

// email validation
// function isValidEmailDomain(email) {
//     return  !(email.includes("gmail") || email.includes("yahoo") || email.includes("outlook"));
// }
// const registerEmployer = async (req, res) => {
//     const { companyName, email, password, industry, website, companyLogo, name } = req.body;

//     try {
//         if (!isValidEmailDomain(email)) {
//             return res.status(400).json({ message: "Email domain must end with .com, .org, or .in" });
//         }
//         const employerExists = await Employer.findOne({ email });
//         if (employerExists) return res.status(400).json({ message: 'Employer already exists' });

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const otp = otpGenerator.generate(6, {
//             digits: true,
//             upperCaseAlphabets: false,
//             lowerCaseAlphabets: false,
//             specialChars: false
//           });
          

//         await Employer.create({
//             companyName,
//             name,
//             email,
//             password: hashedPassword,
//             industry,
//             otp,
//             otpExpires: Date.now() + 5 * 60 * 1000,
//             isVerified: false,
//             website,
//             companyLogo
//         });
//          console.log(otp)
//         await sendOTP(email, otp);
//         res.status(201).json({ message: "OTP sent to email. Please verify.", email });

//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// const verifyOTP = async (req, res) => {
//     const { email, otp } = req.body;

//     try {
//         const employer = await Employer.findOne({ email });
//         if (!employer) return res.status(400).json({ message: "Employer not found" });

//         if (employer.otp !== otp || employer.otpExpires < Date.now()) {
//             return res.status(400).json({ message: "Invalid or expired OTP" });
//         }

//         employer.isVerified = true;
//         employer.otp = undefined;
//         employer.otpExpires = undefined;
//         await employer.save();

//         const token = generateToken(employer._id, employer.email);
//         res.status(200).json({ message: "OTP verified successfully.", token, employer });

//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// }; 

const registerEmployer = async (req, res) => {
    const { companyName, email, password, industry, website, companyLogo, name } = req.body;
  
    try {
      // if (!isValidEmailDomain(email)) {
      //   return res.status(400).json({ message: "Email domain must end with .com, .org, or .in" });
      // }
  
      const existing = await Employer.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Employer already exists' });
  
      // Check if pending exists in Redis
      const existingOTPData = await redisClient.get(`pending:${email}`);
      if (existingOTPData) {
        return res.status(400).json({ message: 'OTP already sent. Please verify.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
  
      const data = JSON.stringify({
        companyName, name, email, password: hashedPassword, industry, website, companyLogo, otp
      });
  
      await redisClient.set(`pending:${email}`, data, { EX: 300 }); // TTL = 5 min
  console.log(otp)
      await sendOTP(email, otp);
      res.status(201).json({ message: "OTP sent. Please verify.", email });
  
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
   
      if (email === process.env.ADMIN_EMAIL) {
        const data = await redisClient.get(`loginAdmin:${email}`);

        if (!data) {
          return res.status(400).json({ message: "OTP expired or not found for admin" });
        }
  
        const parsedOtp = JSON.parse(data);
  
        if (parsedOtp !== otp) {
          return res.status(400).json({ message: "Invalid OTP for admin login" });
        }
  
        const token = generateToken(process.env.ADMIN_EMAIL, "admin");
  
        await redisClient.del(`loginAdmin:${email}`);

        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
        });
        
        
        return res.status(200).json({
          message: "Admin OTP verified successfully.",
          redirectedurl: "http://localhost:3000/Admin/", 
        });
      }
  
      // 2. Employer Registration OTP Flow
      const pendingKey = `pending:${email}`;
      const loginKey = `login:${email}`;
  
      const pendingData = await redisClient.get(pendingKey);
      const loginData = await redisClient.get(loginKey);
  
      if (pendingData) {
        const parsed = JSON.parse(pendingData);
  
        if (parsed.otp !== otp) {
          return res.status(400).json({ message: "Invalid OTP" });
        }
  
        const employer = await Employer.create({
          companyName: parsed.companyName,
          name: parsed.name,
          email: parsed.email,
          password: parsed.password,
          industry: parsed.industry,
          website: parsed.website,
          companyLogo: parsed.companyLogo,
          isVerified: true,
          role:"employer"
        });
  
        await redisClient.del(pendingKey);
  
        const token = generateToken(employer._id, employer.role);
        return res.status(200).json({
          message: "OTP verified. Employer registered.",
          token,
        
        });
  
      } else if (loginData) {
        // 3. Login OTP Flow
        const parsed = JSON.parse(loginData);
  
        if (parsed.otp !== otp) {
          return res.status(400).json({ message: "Invalid OTP" });
        }
  
        await redisClient.del(loginKey);
  
        const token = generateToken(parsed.id, parsed.role);
        return res.status(200).json({
          message: "Login successful",
          redirectedurl:"http://localhost:3000/",
          token,
       
        });
  
      } else {
        return res.status(400).json({ message: "No OTP found or OTP expired" });
      }
  
    } catch (error) {
      console.error("OTP verification error:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  

  const loginHandler = async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt:", email);
  
    try {
      //  Check for Admin login
      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
   console.log(email)
        const otp = otpGenerator.generate(6, {
          digits: true,
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
  
        console.log("Generated Admin OTP:", otp);
  
        await redisClient.set(`loginAdmin:${email}`, JSON.stringify(otp), { EX: 300 });
  
        await sendOTP(email, otp);
  
        return res.status(200).json({
          message: "OTP sent to Admin email for verification.",
          email,
          role: "admin"
        });
      }
  
      //  Check for Employer login
      const employer = await Employer.findOne({ email });
    
      if (employer && await bcrypt.compare(password, employer.password)) {
        const otp = otpGenerator.generate(6, {
          digits: true,
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
  
        const data = JSON.stringify({
          id: employer._id,
          email: employer.email,
          role: employer.role,
          otp,
        });
  
        await redisClient.set(`login:${email}`, data, { EX: 300 });
  
        await sendOTP(email, otp);
  
        return res.status(200).json({
          message: "OTP sent to Employer email for verification.",
          email,
          role: employer.role
        });
      }
  
      //  Check for User login
      const user = await User.findOne({ email });
      
      if (user && await bcrypt.compare(password, user.password)) {
        const token = generateToken(user._id, user.role);
  
        return res.status(200).json({
          redirectedurl:"http://localhost:3000/major/",
          message: "User logged in successfully.",
          token,
          role: user.role
        });
      }
  
      //  If no match
      return res.status(401).json({ message: "Invalid credentials" });
  
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

const resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const employer = await Employer.findOne({ email });
        if (!employer) return res.status(400).json({ message: "Employer not found" });

        const newOTP = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
          });
          

        employer.otp = newOTP;
        employer.otpExpires = Date.now() + 5 * 60 * 1000;
        await employer.save();

        await sendOTP(email, newOTP);
        res.json({ message: "New OTP sent to email." });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

 const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetURL = `http://localhost:3000/auth/reset-password/${token}`;
  await sendEmail(
    user.email,
    'Reset Password',
    `<p>Click <a href="${resetURL}">here</a> to reset your password. Link valid for 1 hour.</p>`
  );

  res.json({ message: 'Reset email sent' });
};

 const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
 
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ message: 'Token expired or invalid' });

  user.password = await bcrypt.hash(newPassword, 10); // hash it in real use
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  res.json({ message: 'Password has been reset' });
};

module.exports = { registerUser, loginHandler, registerEmployer, verifyOTP,resendOTP ,forgotPassword,resetPassword};
