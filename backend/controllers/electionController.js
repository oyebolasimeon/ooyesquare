const ElectionSettings = require('../models/ElectionSettings');

// @desc    Get election settings (general settings)
// @route   GET /api/elections
// @access  Private/Admin
const getElectionSettings = async (req, res) => {
  try {
    const settings = await ElectionSettings.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update election settings
// @route   PUT /api/elections
// @access  Private/Admin
const updateElectionSettings = async (req, res) => {
  try {
    const { startDate, endDate, isActive } = req.body;

    // Validate required fields
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (start >= end) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Get existing settings or create new one
    let settings = await ElectionSettings.findOne();
    
    if (!settings) {
      // Create new settings
      settings = await ElectionSettings.create({
        startDate,
        endDate,
        isActive: isActive !== undefined ? isActive : false
      });
    } else {
      // Update existing settings
      settings.startDate = startDate;
      settings.endDate = endDate;
      
      if (isActive !== undefined) {
        settings.isActive = isActive;
      }
      
      settings.updatedAt = Date.now();
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Check if election is currently active (for voters)
// @route   GET /api/elections/status
// @access  Public
const getElectionStatus = async (req, res) => {
  try {
    const settings = await ElectionSettings.getSettings();
    
    // Only check isActive status (ignore dates)
    const isActive = settings.isActive;
    
    res.json({
      isActive,
      isScheduledActive: settings.isActive,
      startDate: settings.startDate,
      endDate: settings.endDate,
      message: isActive ? 'Election is active' : 'Election is currently disabled'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getElectionSettings,
  updateElectionSettings,
  getElectionStatus
};

