const Voter = require('../models/Voter');
const xlsx = require('xlsx');
const fs = require('fs');

// @desc    Get all voters
// @route   GET /api/voters
// @access  Private/Admin
const getVoters = async (req, res) => {
  try {
    const { status, hasVoted } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (hasVoted !== undefined) {
      filter.hasVoted = hasVoted === 'true';
    }

    const voters = await Voter.find(filter).sort({ createdAt: -1 });
    res.json(voters);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get voter stats
// @route   GET /api/voters/stats
// @access  Private/Admin
const getVoterStats = async (req, res) => {
  try {
    const totalVoters = await Voter.countDocuments();
    const activeVoters = await Voter.countDocuments({ status: 'active' });
    const inactiveVoters = await Voter.countDocuments({ status: 'inactive' });
    const votedCount = await Voter.countDocuments({ hasVoted: true });
    const notVotedCount = await Voter.countDocuments({ hasVoted: false });

    res.json({
      totalVoters,
      activeVoters,
      inactiveVoters,
      votedCount,
      notVotedCount,
      votingPercentage: totalVoters > 0 ? ((votedCount / totalVoters) * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single voter
// @route   GET /api/voters/:id
// @access  Private/Admin
const getVoterById = async (req, res) => {
  try {
    const voter = await Voter.findById(req.params.id);

    if (voter) {
      res.json(voter);
    } else {
      res.status(404).json({ message: 'Voter not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create single voter
// @route   POST /api/voters
// @access  Private/Admin
const createVoter = async (req, res) => {
  try {
    const { email, phoneNumber, firstName, maidenName, lastName } = req.body;

    const voterExists = await Voter.findOne({ email: email.toLowerCase() });

    if (voterExists) {
      return res.status(400).json({ message: 'Voter with this email already exists' });
    }

    const voter = await Voter.create({
      email: email.toLowerCase(),
      phoneNumber,
      firstName,
      maidenName: maidenName || '',
      lastName,
      status: 'active'
    });

    res.status(201).json(voter);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update voter
// @route   PUT /api/voters/:id
// @access  Private/Admin
const updateVoter = async (req, res) => {
  try {
    const { email, phoneNumber, firstName, maidenName, lastName, status } = req.body;

    const voter = await Voter.findById(req.params.id);

    if (!voter) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    voter.email = email || voter.email;
    voter.phoneNumber = phoneNumber || voter.phoneNumber;
    voter.firstName = firstName || voter.firstName;
    voter.maidenName = maidenName !== undefined ? maidenName : voter.maidenName;
    voter.lastName = lastName || voter.lastName;
    voter.status = status || voter.status;

    const updatedVoter = await voter.save();
    res.json(updatedVoter);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Toggle voter status (activate/deactivate)
// @route   PUT /api/voters/:id/toggle-status
// @access  Private/Admin
const toggleVoterStatus = async (req, res) => {
  try {
    const voter = await Voter.findById(req.params.id);

    if (!voter) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    voter.status = voter.status === 'active' ? 'inactive' : 'active';
    const updatedVoter = await voter.save();

    res.json({
      message: `Voter ${updatedVoter.status === 'active' ? 'activated' : 'deactivated'} successfully`,
      voter: updatedVoter
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete voter
// @route   DELETE /api/voters/:id
// @access  Private/Admin
const deleteVoter = async (req, res) => {
  try {
    const voter = await Voter.findById(req.params.id);

    if (voter) {
      await voter.deleteOne();
      res.json({ message: 'Voter removed' });
    } else {
      res.status(404).json({ message: 'Voter not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Upload voters from Excel
// @route   POST /api/voters/upload
// @access  Private/Admin
const uploadVotersExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an Excel file' });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const row of data) {
      try {
        const email = row.email || row.Email || row.EMAIL;
        const phoneNumber = row.phoneNumber || row['phone number'] || row.PhoneNumber || row['Phone Number'];
        const firstName = row.firstName || row['first name'] || row.FirstName || row['First Name'];
        const maidenName = row.maidenName || row['maiden name'] || row.MaidenName || row['Maiden Name'] || '';
        const lastName = row.lastName || row['last name'] || row.LastName || row['Last Name'];

        if (!email || !phoneNumber || !firstName || !lastName) {
          results.failed++;
          results.errors.push({
            row,
            error: 'Missing required fields (email, phoneNumber, firstName, lastName)'
          });
          continue;
        }

        const voterExists = await Voter.findOne({ email: email.toLowerCase() });

        if (voterExists) {
          results.failed++;
          results.errors.push({
            row,
            error: `Voter with email ${email} already exists`
          });
          continue;
        }

        await Voter.create({
          email: email.toLowerCase(),
          phoneNumber: phoneNumber.toString(),
          firstName,
          maidenName,
          lastName,
          status: 'active'
        });

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          row,
          error: error.message
        });
      }
    }

    // Delete uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      message: 'Upload completed',
      results
    });
  } catch (error) {
    // Delete uploaded file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getVoters,
  getVoterStats,
  getVoterById,
  createVoter,
  updateVoter,
  toggleVoterStatus,
  deleteVoter,
  uploadVotersExcel
};

