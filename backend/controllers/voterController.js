const Voter = require('../models/Voter');
const xlsx = require('xlsx');
const fs = require('fs');
const { sendVoterCredentialsEmail, sendBulkVoterEmails } = require('../utils/emailService');

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
      errors: [],
      emailsSent: 0,
      emailsFailed: 0
    };

    const createdVoters = [];

    for (const row of data) {
      try {
        const email = row.email || row.Email || row.EMAIL;
        const phoneNumber = row.phoneNumber || row['phone number'] || row.PhoneNumber || row['Phone Number'];
        const firstName = row.firstName || row['first name'] || row.FirstName || row['First Name'];
        const maidenName = row.maidenName || row['maiden name'] || row.MaidenName || row['Maiden Name'];
        const marriedName = row.marriedName || row['married name'] || row.MarriedName || row['Married Name'];
        const state = row.state || row.State || row.STATE;

        // Clean phone number - trim spaces and remove ' from beginning
        let cleanPhoneNumber = phoneNumber ? phoneNumber.toString().trim() : '';
        if (cleanPhoneNumber.startsWith("'")) {
          cleanPhoneNumber = cleanPhoneNumber.substring(1);
        }

        if (!phoneNumber || !firstName || !maidenName || !state) {
          results.failed++;
          console.log('Missing required fields (phoneNumber, firstName, maidenName, state)', row);
          results.errors.push({
            row,
            error: 'Missing required fields (phoneNumber, firstName, maidenName, state)'
          });
          continue;
        }

        // Check if voter exists by phone number and maiden name (since email is optional)
        const voterExists = await Voter.findOne({ 
          phoneNumber: cleanPhoneNumber,
          maidenName: maidenName.trim()
        });

        if (voterExists) {
          results.failed++;
          console.log('Voter with phone number', cleanPhoneNumber, 'and maiden name', maidenName, 'already exists', row);
          results.errors.push({
            row,
            error: `Voter with phone number ${cleanPhoneNumber} and maiden name ${maidenName} already exists`
          });
          continue;
        }

        const newVoter = await Voter.create({
          email: email ? email.toLowerCase().trim() : null,
          phoneNumber: cleanPhoneNumber,
          firstName: firstName.trim(),
          maidenName: maidenName.trim(),
          lastName: marriedName ? marriedName.trim() : null,
          state: state.trim(),
          status: 'active'
        });

        console.log('New voter created', newVoter);
        createdVoters.push(newVoter);
        results.success++;
      } catch (error) {
        results.failed++;
        console.log('Error creating voter', error, row);
        results.errors.push({
          row,
          error: error.message
        });
      }
    }

    // Send emails to newly created voters
    if (createdVoters.length > 0) {
      const emailResults = await sendBulkVoterEmails(createdVoters);
      results.emailsSent = emailResults.sent;
      results.emailsFailed = emailResults.failed;
      results.emailsSkipped = emailResults.skipped;
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

// @desc    Resend credentials email to a single voter
// @route   POST /api/voters/:id/resend-email
// @access  Private/Admin
const resendVoterEmail = async (req, res) => {
  try {
    const voter = await Voter.findById(req.params.id);

    if (!voter) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    const result = await sendVoterCredentialsEmail(voter);

    if (result.success) {
      res.json({
        message: `Credentials email resent successfully to ${voter.email}`,
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        message: 'Failed to send email',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Resend credentials email to all voters
// @route   POST /api/voters/resend-all-emails
// @access  Private/Admin
const resendAllVotersEmails = async (req, res) => {
  try {
    const voters = await Voter.find({ status: 'active' }).sort({ createdAt: 1 });

    if (voters.length === 0) {
      return res.status(404).json({ message: 'No active voters found' });
    }

    const results = await sendBulkVoterEmails(voters);

    res.json({
      message: 'Bulk email sending completed',
      results: {
        total: results.total,
        sent: results.sent,
        failed: results.failed,
        skipped: results.skipped,
        errors: results.errors
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get available states for voting based on voter's state
// @route   GET /api/voters/available-states
// @access  Private/Voter
const getAvailableStates = async (req, res) => {
  try {
    const voterId = req.user._id;
    const voter = await Voter.findById(voterId);

    if (!voter) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    // Get positions for the voter's state
    const Position = require('../models/Position');
    const positions = await Position.find({ 
      state: voter.state,
      category: 'State'
    }).distinct('state');

    // If no positions found for voter's state, return empty array
    if (positions.length === 0) {
      return res.json([]);
    }

    // Return the voter's state if it has positions
    res.json([voter.state]);
  } catch (error) {
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
  uploadVotersExcel,
  resendVoterEmail,
  resendAllVotersEmails,
  getAvailableStates
};

