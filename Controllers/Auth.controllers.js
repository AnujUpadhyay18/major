const User = require('../Models/user.model');
const Employer = require('../Models/Employer.model');
const generateToken = require('../Utils/generateToken');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const sendOTP=require('../Utils/sendOtp')


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
        });

        res.status(201).json({ token: generateToken(user._id,email) });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({ token: generateToken(user._id), user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const registerEmployer = async (req, res) => {
    const { companyName, email, password, industry, website, companyLogo, name } = req.body;

    try {
        const employerExists = await Employer.findOne({ email });
        if (employerExists) return res.status(400).json({ message: 'Employer already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
          });
          
        await Employer.create({
            companyName,
            name,
            email,
            password: hashedPassword,
            industry,
            otp,
            otpExpires: Date.now() + 5 * 60 * 1000,
            isVerified: false,
            website,
            companyLogo
        });

        await sendOTP(email, otp);
        res.status(201).json({ message: "OTP sent to email. Please verify.", email });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const employer = await Employer.findOne({ email });
        if (!employer) return res.status(400).json({ message: "Employer not found" });

        if (employer.otp !== otp || employer.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        employer.isVerified = true;
        employer.otp = undefined;
        employer.otpExpires = undefined;
        await employer.save();

        const token = generateToken(employer._id, employer.email);
        res.status(200).json({ message: "OTP verified successfully.", token, employer });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



const loginEmployer = async (req, res) => {
    const { email, password } = req.body;

    try {
        const employer = await Employer.findOne({ email });
        if (!employer || !(await bcrypt.compare(password, employer.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const otp = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
          });
          

        employer.otp = otp;
        employer.otpExpires = Date.now() + 5 * 60 * 1000;
        employer.isVerified = false;
        await employer.save();

        await sendOTP(email, otp);

        res.status(200).json({ message: "OTP sent to your email for verification.", email });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
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

const resetPassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password

        const employer = await Employer.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!employer) {
            return res.status(404).json({ message: 'Employer not found' });
        }

        res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};


module.exports = { registerUser, loginUser, registerEmployer, loginEmployer, verifyOTP,resendOTP ,resetPassword};
