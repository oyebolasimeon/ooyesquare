const express = require('express');
const router = express.Router();
const {
  getContestants,
  getContestantsByPosition,
  getContestantById,
  createContestant,
  updateContestant,
  deleteContestant
} = require('../controllers/contestantController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(protect, getContestants)
  .post(protect, adminOnly, createContestant);
router.get('/position/:positionId', protect, getContestantsByPosition);
router.route('/:id')
  .get(protect, getContestantById)
  .put(protect, adminOnly, updateContestant)
  .delete(protect, adminOnly, deleteContestant);

module.exports = router;

