const jwt = require('jsonwebtoken');
const User = require('../Models/user.model');

const adminProtect = async (req, res, next) => {
  try {
    const token = req.cookies.token; // only admins get tokens in cookies

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   console.log(decoded)
    if (decoded.id !== process.env.ADMIN_EMAIL || decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access denied' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = adminProtect;
