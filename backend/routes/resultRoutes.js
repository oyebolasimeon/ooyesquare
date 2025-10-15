const express = require('express');
const router = express.Router();
const {
  getResults,
  getAnalytics,
  exportResults,
  getPositionResult
} = require('../controllers/resultController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getResults);
router.get('/analytics', protect, adminOnly, getAnalytics);
router.get('/export', protect, adminOnly, exportResults);
router.get('/position/:id', protect, adminOnly, getPositionResult);

module.exports = router;

