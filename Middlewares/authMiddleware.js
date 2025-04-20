// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const Employer = require('../Models/Employer.model');
const dotenv = require('dotenv');
const UserModel=require('../Models/user.model')
dotenv.config();

// Protect route middleware
const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      token = token.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);

      // First check if it's a user
      const user = await UserModel.findById(decoded.id)
        .populate("appliedJobs savedJobs resumes.jobId")
        .select("-password");

      if (user) {
        req.profile = user;
        req.user = user;
        req.role = "seeker";
        console.log("User authenticated");
        return next();
      }

      
      const employer = await Employer.findById(decoded.id)
        .populate("jobPosts")
        .select("-password");

      if (employer) {
        req.profile = employer;
        req.employer = employer;
        req.role = "employer";
        console.log("Employer authenticated");
        return next();
      }

      // If neither found
      return res.status(401).json({ message: "User not found" });
    } catch (error) {
      console.log("JWT error:", error.message);
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};





const employerProtect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
      console.log(token)
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   console.log(decoded)
    const employer = await Employer.findById(decoded.id);
      console.log(employer)
    if (!employer) return res.status(401).json({ message: "Invalid employer token" });

    req.employer = employer;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed", error: err.message });
  }
};

module.exports = { protect, employerProtect };
