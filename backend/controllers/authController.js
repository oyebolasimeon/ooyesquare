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
    const { maidenName, phoneNumber } = req.body;

    if (!maidenName || !phoneNumber) {
      return res.status(400).json({ message: 'Please provide maiden name and phone number' });
    }

    // Clean phone number - trim spaces and remove ' from beginning
    let cleanPhoneNumber = phoneNumber.toString().trim();
    if (cleanPhoneNumber.startsWith("'")) {
      cleanPhoneNumber = cleanPhoneNumber.substring(1);
    }

    const voter = await Voter.findOne({ 
      maidenName: maidenName.trim(), 
      phoneNumber: cleanPhoneNumber 
    });

    if (!voter) {
      return res.status(401).json({ message: 'Invalid credentials. Please check your maiden name and phone number.' });
    }

    if (voter.status !== 'active') {
      return res.status(403).json({ message: 'Your account has been deactivated. Please contact admin.' });
    }

    // Check for active session
    if (voter.activeSession && voter.activeSession.token) {
      // Check if session is still valid (e.g., within last 24 hours)
      const sessionAge = Date.now() - new Date(voter.activeSession.lastActivity).getTime();
      const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours

      if (sessionAge < maxSessionAge) {
        return res.status(403).json({ 
          message: 'Account is already logged in on another device. Please logout from the other device first.',
          sessionInfo: {
            deviceInfo: voter.activeSession.deviceInfo,
            loginTime: voter.activeSession.loginTime,
            ipAddress: voter.activeSession.ipAddress
          }
        });
      }
    }

    // Get device and IP information
    const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || 
                      req.headers['x-real-ip'] || 
                      req.socket.remoteAddress || 
                      'Unknown IP';

    // Generate new token
    const token = generateToken(voter._id, 'voter');

    // Update session information
    voter.lastLogin = new Date();
    voter.activeSession = {
      token: token,
      deviceInfo: deviceInfo,
      ipAddress: ipAddress,
      loginTime: new Date(),
      lastActivity: new Date()
    };
    await voter.save();

    res.json({
      _id: voter._id,
      email: voter.email,
      firstName: voter.firstName,
      lastName: voter.lastName,
      phoneNumber: voter.phoneNumber,
      hasVoted: voter.hasVoted,
      votedCategories: voter.votedCategories,
      token: token
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

// @desc    Voter logout
// @route   POST /api/auth/voter/logout
// @access  Private/Voter
const voterLogout = async (req, res) => {
  try {
    const voterId = req.user._id;

    const voter = await Voter.findById(voterId);

    if (!voter) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    // Clear active session
    voter.activeSession = {
      token: null,
      deviceInfo: null,
      ipAddress: null,
      loginTime: null,
      lastActivity: null
    };
    await voter.save();

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  adminLogin,
  voterLogin,
  voterLogout,
  createAdmin
};

