const Admin = require('../models/Admin');
const Voter = require('../models/Voter');
const { generateToken } = require('../middleware/auth');

// @desc    Admin login
// @route   POST /api/auth/admin/login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // await Admin.create({
    //   email,
    //   password,
    //   firstName: "Simeon",
    //   lastName: "Oyebola"
    // });

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        token: generateToken(admin._id, 'admin')
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Voter login
// @route   POST /api/auth/voter/login
// @access  Public
const voterLogin = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email || !phoneNumber) {
      return res.status(400).json({ message: 'Please provide email and phone number' });
    }

    const voter = await Voter.findOne({ 
      email: email.toLowerCase(), 
      phoneNumber: phoneNumber 
    });

    if (!voter) {
      return res.status(401).json({ message: 'Invalid credentials. Please check your email and phone number.' });
    }

    if (voter.status !== 'active') {
      return res.status(403).json({ message: 'Your account has been deactivated. Please contact admin.' });
    }

    // Update last login
    voter.lastLogin = new Date();
    await voter.save();

    res.json({
      _id: voter._id,
      email: voter.email,
      firstName: voter.firstName,
      lastName: voter.lastName,
      phoneNumber: voter.phoneNumber,
      hasVoted: voter.hasVoted,
      votedCategories: voter.votedCategories,
      token: generateToken(voter._id, 'voter')
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create admin (for initial setup)
// @route   POST /api/auth/admin/create
// @access  Public (should be protected in production)
const createAdmin = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await Admin.create({
      email,
      password,
      firstName,
      lastName
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        token: generateToken(admin._id, 'admin')
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  adminLogin,
  voterLogin,
  createAdmin
};

