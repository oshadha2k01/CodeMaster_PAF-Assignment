const express = require('express');
const router = express.Router();
const {
  updateMovieBuddies,
  getMovieBuddies,
  getAllMovieBuddyGroups,
  getMovieBuddyStats,
  deleteMovieBuddyGroup
} = require('../../controllers/MovieBuddy/MovieBuddyController');

// Update movie buddies for a specific showtime
router.post('/update', updateMovieBuddies);

// Get movie buddies for a specific showtime
router.get('/find', getMovieBuddies);

// Get all movie buddy groups
router.get('/all', getAllMovieBuddyGroups);

// Get movie buddy statistics
router.get('/stats', getMovieBuddyStats);

// Delete movie buddy group
router.delete('/:movieName/:movieDate/:movieTime', deleteMovieBuddyGroup);

module.exports = router;