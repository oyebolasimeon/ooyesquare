const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Voter = require('../models/Voter');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Protect routes - general authentication
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.decode(token, JWT_SECRET);

      if (!decoded) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }

      // Check if admin or voter
      if (decoded.role === 'admin') {
        req.user = await Admin.findById(decoded.id).select('-password');
        req.userType = 'admin';
      } else {
        req.user = await Voter.findById(decoded.id);
        req.userType = 'voter';
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.userType === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

// Voter only middleware
const voterOnly = (req, res, next) => {
  if (req.user && req.userType === 'voter') {
    // Check if voter is active
    if (req.user.status !== 'active') {
      return res.status(403).json({ message: 'Your account has been deactivated. Please contact admin.' });
    }
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as voter' });
  }
};

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = { protect, adminOnly, voterOnly, generateToken };

