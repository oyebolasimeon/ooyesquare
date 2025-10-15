const express = require('express');
const router = express.Router();
const {
  submitVotes,
  getVotingStatus,
  getAvailableElections
} = require('../controllers/voteController');
const { protect, voterOnly } = require('../middleware/auth');

router.post('/submit', protect, voterOnly, submitVotes);
router.get('/status', protect, voterOnly, getVotingStatus);
router.get('/available-elections', protect, voterOnly, getAvailableElections);

module.exports = router;

