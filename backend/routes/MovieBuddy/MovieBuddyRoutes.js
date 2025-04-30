const express = require('express');
const router = express.Router();
const {
  updateMovieBuddies,
  getAllMovieBuddyGroups,
  getMovieBuddyGroupById,
  deleteMovieBuddyGroup,
  createMovieBuddy,
  updateMovieBuddy,
  checkExistingUser,
  getMovieBuddies
} = require('../../controllers/MovieBuddy/MovieBuddyController');
const MovieBuddy = require('../../models/MovieBuddy/MovieBuddyModel');

// Verify all imported functions are defined
if (
  !updateMovieBuddies ||
  !getAllMovieBuddyGroups ||
  !getMovieBuddyGroupById ||
  !deleteMovieBuddyGroup ||
  !createMovieBuddy ||
  !updateMovieBuddy ||
  !checkExistingUser ||
  !getMovieBuddies
) {
  throw new Error('One or more required controller functions are undefined.');
}

// Create or update movie buddy group
router.post('/update', updateMovieBuddies);

// Get all movie buddy groups
router.get('/all', getAllMovieBuddyGroups);

// Check if user exists
router.post('/check-existing', checkExistingUser);

// Create new movie buddy profile
router.post('/create', createMovieBuddy);

// Get movie buddies for a specific show with filtering
router.get('/buddies', async (req, res) => {
  try {
    const { movieName, movieDate, movieTime, email } = req.query;
    
    if (!movieName || !movieDate || !movieTime) {
      return res.status(400).json({ 
        error: 'Movie details are required for filtering' 
      });
    }

    console.log('Query parameters:', { movieName, movieDate, movieTime, email });

    // Build the query - make sure movie details match exactly
    const query = {
      movieName: movieName,
      movieDate: movieDate,
      movieTime: movieTime
    };

    // If email is provided, exclude that user from results
    if (email && email.trim() !== '') {
      query.email = { $ne: email };
    }

    console.log('MongoDB query:', query);

    // Find matching movie buddies
    const buddies = await MovieBuddy.find(query)
      .select('-__v -createdAt -updatedAt')
      .lean();

    console.log(`Found ${buddies.length} matching buddies`);

    // Filter out buddies based on privacy settings
    const filteredBuddies = buddies.map(buddy => {
      const filteredBuddy = { ...buddy };
      
      // Handle privacy settings
      if (buddy.privacySettings) {
        if (!buddy.privacySettings.showName) {
          filteredBuddy.name = buddy.privacySettings.petName || 'Anonymous';
        }
        if (!buddy.privacySettings.showEmail) {
          filteredBuddy.email = '';
        }
        if (!buddy.privacySettings.showPhone) {
          filteredBuddy.phone = '';
        }
      }

      return filteredBuddy;
    });

    res.json(filteredBuddies);
  } catch (error) {
    console.error('Error fetching movie buddies:', error);
    res.status(500).json({ error: 'Failed to fetch movie buddies' });
  }
});

// Get movie buddy profile
router.get('/profile', async (req, res) => {
  try {
    const { email, phone } = req.query;
    
    if (!email || !phone) {
      return res.status(400).json({ 
        error: 'Email and phone are required' 
      });
    }

    // Find the user's profile
    const profile = await MovieBuddy.findOne({ email, phone })
      .select('-__v -createdAt -updatedAt');

    if (!profile) {
      return res.status(404).json({ 
        error: 'Profile not found' 
      });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get movie buddy group by ID
router.get('/:id', getMovieBuddyGroupById);

// Delete movie buddy group
router.delete('/:id', deleteMovieBuddyGroup);

// Update movie buddy profile
router.put('/:id', updateMovieBuddy);

module.exports = router;