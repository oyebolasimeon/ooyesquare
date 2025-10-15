const Position = require('../models/Position');
const { NIGERIAN_STATES, ELECTION_CATEGORIES } = require('../utils/constants');

// @desc    Get all positions
// @route   GET /api/positions
// @access  Private
const getPositions = async (req, res) => {
  try {
    const { category, state } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (state && category === 'State') {
      filter.state = state;
    }

    const positions = await Position.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single position
// @route   GET /api/positions/:id
// @access  Private
const getPositionById = async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);

    if (position) {
      res.json(position);
    } else {
      res.status(404).json({ message: 'Position not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create position
// @route   POST /api/positions
// @access  Private/Admin
const createPosition = async (req, res) => {
  try {
    const { title, description, category, state, order } = req.body;

    // Validate category
    if (!Object.values(ELECTION_CATEGORIES).includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Validate state if category is State
    if (category === 'State') {
      if (!state || !NIGERIAN_STATES.includes(state)) {
        return res.status(400).json({ message: 'Invalid state for State category' });
      }
    }

    const position = await Position.create({
      title,
      description,
      category,
      state: category === 'State' ? state : undefined,
      order: order || 0
    });

    res.status(201).json(position);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update position
// @route   PUT /api/positions/:id
// @access  Private/Admin
const updatePosition = async (req, res) => {
  try {
    const { title, description, category, state, order, isActive } = req.body;

    const position = await Position.findById(req.params.id);

    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }

    // Validate category if being updated
    if (category && !Object.values(ELECTION_CATEGORIES).includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Validate state if category is State
    if (category === 'State' || (position.category === 'State' && state)) {
      if (!state || !NIGERIAN_STATES.includes(state)) {
        return res.status(400).json({ message: 'Invalid state for State category' });
      }
    }

    position.title = title || position.title;
    position.description = description || position.description;
    position.category = category || position.category;
    position.state = (category === 'State' || position.category === 'State') ? state : undefined;
    position.order = order !== undefined ? order : position.order;
    position.isActive = isActive !== undefined ? isActive : position.isActive;
    position.updatedAt = Date.now();

    const updatedPosition = await position.save();
    res.json(updatedPosition);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete position
// @route   DELETE /api/positions/:id
// @access  Private/Admin
const deletePosition = async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);

    if (position) {
      await position.deleteOne();
      res.json({ message: 'Position removed' });
    } else {
      res.status(404).json({ message: 'Position not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all states
// @route   GET /api/positions/states/list
// @access  Public
const getStates = async (req, res) => {
  try {
    res.json(NIGERIAN_STATES);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
  getStates
};

