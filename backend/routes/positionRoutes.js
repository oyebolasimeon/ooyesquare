const express = require('express');
const router = express.Router();
const {
  getPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
  getStates,
  getStatesWithPositions
} = require('../controllers/positionController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/states/list', getStates);
router.get('/states/available', getStatesWithPositions);
router.route('/')
  .get(protect, getPositions)
  .post(protect, adminOnly, createPosition);
router.route('/:id')
  .get(protect, getPositionById)
  .put(protect, adminOnly, updatePosition)
  .delete(protect, adminOnly, deletePosition);

module.exports = router;

