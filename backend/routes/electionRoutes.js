const express = require('express');
const router = express.Router();
const {
  getElectionSettings,
  updateElectionSettings,
  getElectionStatus
} = require('../controllers/electionController');
const { protect, adminOnly } = require('../middleware/auth');

// Admin routes
router.route('/')
  .get(protect, adminOnly, getElectionSettings)
  .put(protect, adminOnly, updateElectionSettings);

// Public route to check election status (for voters)
router.get('/status', getElectionStatus);

module.exports = router;

