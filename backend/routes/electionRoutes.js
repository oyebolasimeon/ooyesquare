const express = require('express');
const router = express.Router();
const {
  getElectionSettings,
  getElectionById,
  createElection,
  updateElection,
  deleteElection
} = require('../controllers/electionController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(protect, adminOnly, getElectionSettings)
  .post(protect, adminOnly, createElection);
router.route('/:id')
  .get(protect, adminOnly, getElectionById)
  .put(protect, adminOnly, updateElection)
  .delete(protect, adminOnly, deleteElection);

module.exports = router;

