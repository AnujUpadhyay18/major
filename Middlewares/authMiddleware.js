// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const Employer = require('../Models/Employer.model');
const dotenv = require('dotenv');
const UserModel=require('../Models/user.model')
dotenv.config();

// Protect route middleware
const protect = async (req, res, next) => {
    let token = req.headers.authorization;
    
    if (token && token.startsWith('Bearer')) {
        try {
            token = token.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await UserModel.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }
            next();
        } catch (error) {
            console.log(error.message)
            res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Employer protect middleware
const protectEmployer = async (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer')) {
        try {
            token = token.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.employer = await Employer.findById(decoded.id).select('-password');
            if (!req.employer) {
                return res.status(401).json({ message: 'Employer not found' });
            }
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect, protectEmployer };
