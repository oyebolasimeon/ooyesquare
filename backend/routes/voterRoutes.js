const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getVoters,
  getVoterStats,
  getVoterById,
  createVoter,
  updateVoter,
  toggleVoterStatus,
  deleteVoter,
  uploadVotersExcel
} = require('../controllers/voterController');
const { protect, adminOnly } = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'voters-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== '.xlsx' && ext !== '.xls') {
      return cb(new Error('Only Excel files are allowed'));
    }
    cb(null, true);
  }
});

router.get('/stats', protect, adminOnly, getVoterStats);
router.post('/upload', protect, adminOnly, upload.single('file'), uploadVotersExcel);
router.route('/')
  .get(protect, adminOnly, getVoters)
  .post(protect, adminOnly, createVoter);
router.put('/:id/toggle-status', protect, adminOnly, toggleVoterStatus);
router.route('/:id')
  .get(protect, adminOnly, getVoterById)
  .put(protect, adminOnly, updateVoter)
  .delete(protect, adminOnly, deleteVoter);

module.exports = router;

