const express = require('express');
const router = express.Router();
const {
  updateMovieBuddies,
  getAllMovieBuddyGroups,
  getMovieBuddyGroupById,
  deleteMovieBuddyGroup
} = require('../../controllers/MovieBuddy/MovieBuddyController');

// Create or update movie buddy group
router.post('/update', updateMovieBuddies);

// Get all movie buddy groups
router.get('/all', getAllMovieBuddyGroups);

// Get movie buddy group by ID
router.get('/:id', getMovieBuddyGroupById);

// Delete movie buddy group
router.delete('/:id', deleteMovieBuddyGroup);

module.exports = router;