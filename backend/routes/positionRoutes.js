const express = require('express');
const router = express.Router();
const {
  getPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
  getStates
} = require('../controllers/positionController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/states/list', getStates);
router.route('/')
  .get(protect, getPositions)
  .post(protect, adminOnly, createPosition);
router.route('/:id')
  .get(protect, getPositionById)
  .put(protect, adminOnly, updatePosition)
  .delete(protect, adminOnly, deletePosition);

module.exports = router;

