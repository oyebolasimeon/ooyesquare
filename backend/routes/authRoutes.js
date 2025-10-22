const express = require('express');
const router = express.Router();
const { adminLogin, voterLogin, voterLogout, createAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/admin/login', adminLogin);
router.post('/voter/login', voterLogin);
router.post('/voter/logout', protect, voterLogout);
router.post('/admin/create', createAdmin);

module.exports = router;

