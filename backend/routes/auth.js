const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getCurrentUser
} = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validate');
const { protect } = require('../middleware/auth');

// Register route
router.post('/register', registerValidation, register);

// Login route
router.post('/login', loginValidation, login);

// Get current user route
router.get('/me', protect, getCurrentUser);

module.exports = router; 