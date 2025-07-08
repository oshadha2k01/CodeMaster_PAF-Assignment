const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/Auth/AdminController');
const { protect } = require('../middleware/authMiddleware');

// Register a new admin
router.post('/register', registerUser);

// Login admin
router.post('/login', loginUser);

// Get admin profile (protected route)
router.get('/profile', protect, getUserProfile);

module.exports = router;