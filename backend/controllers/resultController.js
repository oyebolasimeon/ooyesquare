const Vote = require('../models/Vote');
const Position = require('../models/Position');
const Contestant = require('../models/Contestant');
const Voter = require('../models/Voter');
const xlsx = require('xlsx');

// @desc    Get results by category
// @route   GET /api/results
// @access  Private/Admin
const getResults = async (req, res) => {
  try {
    const { category, state } = req.query;

    if (!category || !['National', 'State'].includes(category)) {
      return res.status(400).json({ message: 'Valid category (National or State) is required' });
    }

    const filter = { category };
    if (category === 'State' && state) {
      filter.state = state;
    }

    // Get all positions for this category
    const positions = await Position.find(filter).sort({ order: 1 });

    const results = [];

    for (const position of positions) {
      // Get all contestants for this position
      const contestants = await Contestant.find({ position: position._id })
        .sort({ voteCount: -1, lastName: 1 });

      // Get total votes for this position
      const totalVotes = await Vote.countDocuments({ position: position._id, contestant: { $ne: null } });

      // Get abstentions (votes with no contestant selected)
      const abstentions = await Vote.countDocuments({ position: position._id, contestant: null });

      // Determine winner or tie
      let winner = null;
      let isTie = false;
      let tiedContestants = [];
      
      if (contestants.length > 0) {
        const highestVoteCount = contestants[0].voteCount;
        
        // Check if there's a tie (multiple contestants with the same highest vote count)
        // Include ties even when vote count is 0
        tiedContestants = contestants.filter(c => c.voteCount === highestVoteCount);
        console.log("tied contestants", tiedContestants)
        console.log("highest vote count", highestVoteCount)
        console.log("contestants", contestants)
        
        if (tiedContestants.length > 1) {
          // It's a tie if multiple contestants have the same vote count
          isTie = true;
        } else if (tiedContestants.length === 1 && highestVoteCount > 0) {
          // Only declare a winner if they have at least 1 vote
          winner = tiedContestants[0];
        }
      }

      results.push({
        position: {
          _id: position._id,
          title: position.title,
          category: position.category,
          state: position.state
        },
        contestants: contestants.map(c => ({
          _id: c._id,
          firstName: c.firstName,
          lastName: c.lastName,
          maidenName: c.maidenName,
          voteCount: c.voteCount,
          percentage: totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(2) : 0
        })),
        totalVotes,
        abstentions,
        isTie,
        tiedContestants: isTie ? tiedContestants.map(c => ({
          _id: c._id,
          firstName: c.firstName,
          lastName: c.lastName,
          maidenName: c.maidenName,
          voteCount: c.voteCount
        })) : [],
        winner: winner ? {
          _id: winner._id,
          firstName: winner.firstName,
          lastName: winner.lastName,
          maidenName: winner.maidenName,
          voteCount: winner.voteCount
        } : null
      });
    }

    res.json({
      category,
      state: category === 'State' ? state : undefined,
      positions: results
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get analytics/dashboard data
// @route   GET /api/results/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    // Overall statistics
    const totalVoters = await Voter.countDocuments();
    const activeVoters = await Voter.countDocuments({ status: 'active' });
    const votersWhoVoted = await Voter.countDocuments({ hasVoted: true });
    const totalVotes = await Vote.countDocuments();

    // Category-wise statistics
    const nationalVotes = await Voter.countDocuments({ 'votedCategories.national': true });
    const stateVotes = await Voter.countDocuments({ 'votedCategories.state': true });

    // Position statistics
    const totalPositions = await Position.countDocuments();
    const nationalPositions = await Position.countDocuments({ category: 'National' });
    const statePositions = await Position.countDocuments({ category: 'State' });

    // Contestant statistics
    const totalContestants = await Contestant.countDocuments();

    // Voting percentage
    const votingPercentage = activeVoters > 0 ? ((votersWhoVoted / activeVoters) * 100).toFixed(2) : 0;

    // Recent votes (last 10)
    const recentVotes = await Vote.find()
      .populate('voter', 'firstName lastName email')
      .populate('position', 'title category state')
      .populate('contestant', 'firstName lastName')
      .sort({ timestamp: -1 })
      .limit(10);

    res.json({
      voters: {
        total: totalVoters,
        active: activeVoters,
        voted: votersWhoVoted,
        notVoted: activeVoters - votersWhoVoted,
        votingPercentage
      },
      votes: {
        total: totalVotes,
        national: nationalVotes,
        state: stateVotes
      },
      positions: {
        total: totalPositions,
        national: nationalPositions,
        state: statePositions
      },
      contestants: {
        total: totalContestants
      },
      recentVotes
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Export results to Excel
// @route   GET /api/results/export
// @access  Private/Admin
const exportResults = async (req, res) => {
  try {
    const { category, state } = req.query;

    if (!category || !['National', 'State'].includes(category)) {
      return res.status(400).json({ message: 'Valid category (National or State) is required' });
    }

    const filter = { category };
    if (category === 'State' && state) {
      filter.state = state;
    }

    // Get all positions for this category
    const positions = await Position.find(filter).sort({ order: 1 });

    const exportData = [];

    for (const position of positions) {
      // Get all contestants for this position with votes
      const contestants = await Contestant.find({ position: position._id })
        .sort({ voteCount: -1 });

      const totalVotes = await Vote.countDocuments({ position: position._id, contestant: { $ne: null } });
      const abstentions = await Vote.countDocuments({ position: position._id, contestant: null });

      contestants.forEach((contestant, index) => {
        exportData.push({
          'Position': position.name,
          'Category': position.category,
          'State': position.state || 'N/A',
          'Rank': index + 1,
          'Contestant Name': `${contestant.firstName} ${contestant.maidenName ? contestant.maidenName + ' ' : ''}${contestant.lastName}`,
          'Votes': contestant.voteCount,
          'Percentage': totalVotes > 0 ? `${((contestant.voteCount / totalVotes) * 100).toFixed(2)}%` : '0%',
          'Total Votes for Position': totalVotes,
          'Abstentions': abstentions
        });
      });

      // Add summary row
      exportData.push({
        'Position': position.name,
        'Category': position.category,
        'State': position.state || 'N/A',
        'Rank': 'TOTAL',
        'Contestant Name': 'All Contestants',
        'Votes': totalVotes,
        'Percentage': '100%',
        'Total Votes for Position': totalVotes,
        'Abstentions': abstentions
      });

      // Add blank row
      exportData.push({});
    }

    // Create workbook and worksheet
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(exportData);

    // Add worksheet to workbook
    xlsx.utils.book_append_sheet(wb, ws, 'Results');

    // Generate buffer
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename=election-results-${category}${state ? `-${state}` : ''}-${Date.now()}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get detailed result for a specific position
// @route   GET /api/results/position/:id
// @access  Private/Admin
const getPositionResult = async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);

    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }

    // Get all contestants for this position
    const contestants = await Contestant.find({ position: position._id })
      .sort({ voteCount: -1, lastName: 1 });

    // Get all votes for this position
    const votes = await Vote.find({ position: position._id })
      .populate('voter', 'firstName lastName email')
      .populate('contestant', 'firstName lastName maidenName')
      .sort({ timestamp: -1 });

    const totalVotes = votes.filter(v => v.contestant).length;
    const abstentions = votes.filter(v => !v.contestant).length;

    res.json({
      position: {
        _id: position._id,
        title: position.title,
        category: position.category,
        state: position.state
      },
      contestants: contestants.map(c => ({
        _id: c._id,
        firstName: c.firstName,
        lastName: c.lastName,
        maidenName: c.maidenName,
        voteCount: c.voteCount,
        percentage: totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(2) : 0
      })),
      totalVotes,
      abstentions,
      votes: votes.map(v => ({
        voter: `${v.voter.firstName} ${v.voter.lastName}`,
        contestant: v.contestant ? `${v.contestant.firstName} ${v.contestant.lastName}` : 'Abstained',
        timestamp: v.timestamp
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getResults,
  getAnalytics,
  exportResults,
  getPositionResult
};

