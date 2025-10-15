const ElectionSettings = require('../models/ElectionSettings');
const { NIGERIAN_STATES } = require('../utils/constants');

// @desc    Get all election settings
// @route   GET /api/elections
// @access  Private/Admin
const getElectionSettings = async (req, res) => {
  try {
    const { category, state } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (state && category === 'State') {
      filter.state = state;
    }

    const elections = await ElectionSettings.find(filter).sort({ category: 1, state: 1 });
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single election setting
// @route   GET /api/elections/:id
// @access  Private/Admin
const getElectionById = async (req, res) => {
  try {
    const election = await ElectionSettings.findById(req.params.id);

    if (election) {
      res.json(election);
    } else {
      res.status(404).json({ message: 'Election setting not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create election setting
// @route   POST /api/elections
// @access  Private/Admin
const createElection = async (req, res) => {
  try {
    const { category, state, startDate, endDate } = req.body;

    // Validate category
    if (!['National', 'State'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Validate state if category is State
    if (category === 'State') {
      if (!state || !NIGERIAN_STATES.includes(state)) {
        return res.status(400).json({ message: 'Invalid state for State category' });
      }
    }

    // Check if election already exists for this category/state
    const existingElection = await ElectionSettings.findOne({
      category,
      ...(category === 'State' && { state })
    });

    if (existingElection) {
      return res.status(400).json({ 
        message: `Election setting already exists for ${category}${category === 'State' ? ` - ${state}` : ''}` 
      });
    }

    // Determine status based on dates
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    let status = 'pending';
    if (now >= start && now <= end) {
      status = 'ongoing';
    } else if (now > end) {
      status = 'ended';
    }

    const election = await ElectionSettings.create({
      category,
      state: category === 'State' ? state : undefined,
      startDate,
      endDate,
      status
    });

    res.status(201).json(election);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update election setting
// @route   PUT /api/elections/:id
// @access  Private/Admin
const updateElection = async (req, res) => {
  try {
    const { startDate, endDate, isActive } = req.body;

    const election = await ElectionSettings.findById(req.params.id);

    if (!election) {
      return res.status(404).json({ message: 'Election setting not found' });
    }

    if (startDate) {
      election.startDate = startDate;
    }

    if (endDate) {
      election.endDate = endDate;
    }

    if (isActive !== undefined) {
      election.isActive = isActive;
    }

    // Update status based on dates
    const now = new Date();
    const start = new Date(election.startDate);
    const end = new Date(election.endDate);

    if (now >= start && now <= end) {
      election.status = 'ongoing';
    } else if (now > end) {
      election.status = 'ended';
    } else {
      election.status = 'pending';
    }

    election.updatedAt = Date.now();

    const updatedElection = await election.save();
    res.json(updatedElection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete election setting
// @route   DELETE /api/elections/:id
// @access  Private/Admin
const deleteElection = async (req, res) => {
  try {
    const election = await ElectionSettings.findById(req.params.id);

    if (election) {
      await election.deleteOne();
      res.json({ message: 'Election setting removed' });
    } else {
      res.status(404).json({ message: 'Election setting not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getElectionSettings,
  getElectionById,
  createElection,
  updateElection,
  deleteElection
};

