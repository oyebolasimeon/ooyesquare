const Contestant = require('../models/Contestant');
const Position = require('../models/Position');

// @desc    Get all contestants
// @route   GET /api/contestants
// @access  Private
const getContestants = async (req, res) => {
  try {
    const { position } = req.query;
    const filter = {};

    if (position) {
      filter.position = position;
    }

    const contestants = await Contestant.find(filter)
      .populate('position', 'title category state')
      .sort({ order: 1, createdAt: 1 });

    res.json(contestants);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get contestants by position
// @route   GET /api/contestants/position/:positionId
// @access  Private
const getContestantsByPosition = async (req, res) => {
  try {
    const contestants = await Contestant.find({ 
      position: req.params.positionId,
      isActive: true 
    })
      .populate('position', 'title category state')
      .sort({ order: 1, lastName: 1 });

    res.json(contestants);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single contestant
// @route   GET /api/contestants/:id
// @access  Private
const getContestantById = async (req, res) => {
  try {
    const contestant = await Contestant.findById(req.params.id)
      .populate('position', 'title category state');

    if (contestant) {
      res.json(contestant);
    } else {
      res.status(404).json({ message: 'Contestant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create contestant
// @route   POST /api/contestants
// @access  Private/Admin
const createContestant = async (req, res) => {
  try {
    const { firstName, lastName, maidenName, position, photo, bio, order } = req.body;

    // Check if position exists
    const positionExists = await Position.findById(position);
    if (!positionExists) {
      return res.status(404).json({ message: 'Position not found' });
    }

    const contestant = await Contestant.create({
      firstName,
      lastName,
      maidenName,
      position,
      photo: photo || '',
      bio: bio || '',
      order: order || 0
    });

    const populatedContestant = await Contestant.findById(contestant._id)
      .populate('position', 'title category state');

    res.status(201).json(populatedContestant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update contestant
// @route   PUT /api/contestants/:id
// @access  Private/Admin
const updateContestant = async (req, res) => {
  try {
    const { firstName, lastName, maidenName, position, photo, bio, order, isActive } = req.body;

    const contestant = await Contestant.findById(req.params.id);

    if (!contestant) {
      return res.status(404).json({ message: 'Contestant not found' });
    }

    // Check if new position exists
    if (position && position !== contestant.position.toString()) {
      const positionExists = await Position.findById(position);
      if (!positionExists) {
        return res.status(404).json({ message: 'Position not found' });
      }
    }

    contestant.firstName = firstName || contestant.firstName;
    contestant.lastName = lastName || contestant.lastName;
    contestant.maidenName = maidenName !== undefined ? maidenName : contestant.maidenName;
    contestant.position = position || contestant.position;
    contestant.photo = photo !== undefined ? photo : contestant.photo;
    contestant.bio = bio !== undefined ? bio : contestant.bio;
    contestant.order = order !== undefined ? order : contestant.order;
    contestant.isActive = isActive !== undefined ? isActive : contestant.isActive;
    contestant.updatedAt = Date.now();

    const updatedContestant = await contestant.save();
    const populatedContestant = await Contestant.findById(updatedContestant._id)
      .populate('position', 'title category state');

    res.json(populatedContestant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete contestant
// @route   DELETE /api/contestants/:id
// @access  Private/Admin
const deleteContestant = async (req, res) => {
  try {
    const contestant = await Contestant.findById(req.params.id);

    if (contestant) {
      await contestant.deleteOne();
      res.json({ message: 'Contestant removed' });
    } else {
      res.status(404).json({ message: 'Contestant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getContestants,
  getContestantsByPosition,
  getContestantById,
  createContestant,
  updateContestant,
  deleteContestant
};

