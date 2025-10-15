const express = require('express');
const router = express.Router();
const { adminLogin, voterLogin, createAdmin } = require('../controllers/authController');

router.post('/admin/login', adminLogin);
router.post('/voter/login', voterLogin);
router.post('/admin/create', createAdmin);

module.exports = router;

