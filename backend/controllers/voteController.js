const Vote = require('../models/Vote');
const Voter = require('../models/Voter');
const Position = require('../models/Position');
const Contestant = require('../models/Contestant');
const ElectionSettings = require('../models/ElectionSettings');
const { getClientIP, geolocateIP } = require('../utils/ipGeolocation');

// @desc    Submit votes
// @route   POST /api/votes/submit
// @access  Private/Voter
const submitVotes = async (req, res) => {
  try {
    const { votes, category, state } = req.body;
    const voterId = req.user._id;

    // Validate category
    if (!['National', 'State'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Check if voter has already voted for this category
    const voter = await Voter.findById(voterId);
    const categoryKey = category.toLowerCase();
    
    if (voter.votedCategories[categoryKey]) {
      return res.status(400).json({ 
        message: `You have already voted for ${category} category` 
      });
    }

    // Check if election is ongoing (general election settings)
    const election = await ElectionSettings.findOne();
    
    if (!election) {
      return res.status(400).json({ message: 'Election not configured' });
    }

    // Only check if election is enabled (ignore dates if enabled)
    if (!election.isActive) {
      return res.status(400).json({ message: 'Election is currently disabled' });
    }

    // Get voter's IP address and geolocation
    const ipAddress = getClientIP(req);
    const location = await geolocateIP(ipAddress);

    // Process votes
    const voteRecords = [];
    const contestantUpdates = [];

    for (const vote of votes) {
      const { positionId, contestantId } = vote;

      // Validate position
      const position = await Position.findById(positionId);
      if (!position || position.category !== category) {
        return res.status(400).json({ 
          message: `Invalid position: ${positionId}` 
        });
      }

      // Check if already voted for this position
      const existingVote = await Vote.findOne({
        voter: voterId,
        position: positionId
      });

      if (existingVote) {
        return res.status(400).json({ 
          message: `You have already voted for ${position.title}` 
        });
      }

      // If contestantId is provided, validate contestant
      if (contestantId) {
        const contestant = await Contestant.findById(contestantId);
        if (!contestant || contestant.position.toString() !== positionId) {
          return res.status(400).json({ 
            message: `Invalid contestant for position: ${position.title}` 
          });
        }

        // Track contestant vote count update
        contestantUpdates.push(contestantId);
      }

      // Create vote record with IP and location
      voteRecords.push({
        voter: voterId,
        position: positionId,
        contestant: contestantId || null,
        category,
        state: category === 'State' ? state : undefined,
        ipAddress,
        location
      });
    }

    // Save all votes
    await Vote.insertMany(voteRecords);

    // Update contestant vote counts
    for (const contestantId of contestantUpdates) {
      await Contestant.findByIdAndUpdate(contestantId, {
        $inc: { voteCount: 1 }
      });
    }

    // Update voter status
    voter.votedCategories[categoryKey] = true;
    voter.hasVoted = voter.votedCategories.national || voter.votedCategories.state;
    await voter.save();

    res.json({
      message: 'Votes submitted successfully',
      category,
      votesCount: voteRecords.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get voter's voting status
// @route   GET /api/votes/status
// @access  Private/Voter
const getVotingStatus = async (req, res) => {
  try {
    const voter = await Voter.findById(req.user._id);

    res.json({
      hasVoted: voter.hasVoted,
      votedCategories: voter.votedCategories
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get available elections for voter
// @route   GET /api/votes/available-elections
// @access  Private/Voter
const getAvailableElections = async (req, res) => {
  try {
    const now = new Date();
    const voter = await Voter.findById(req.user._id);

    const elections = await ElectionSettings.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    const availableElections = elections.filter(election => {
      const categoryKey = election.category.toLowerCase();
      return !voter.votedCategories[categoryKey];
    });

    res.json(availableElections);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitVotes,
  getVotingStatus,
  getAvailableElections
};

