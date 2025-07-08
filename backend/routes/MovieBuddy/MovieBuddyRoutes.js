const express = require('express');
const router = express.Router();
const movieBuddyController = require('../../controllers/MovieBuddy/MovieBuddyController');
const MovieBuddy = require('../../models/MovieBuddy/MovieBuddyModel');

// Verify all imported functions are defined
if (
  !movieBuddyController.updateMovieBuddies ||
  !movieBuddyController.getAllMovieBuddyGroups ||
  !movieBuddyController.getMovieBuddyGroupById ||
  !movieBuddyController.deleteMovieBuddyGroup ||
  !movieBuddyController.createMovieBuddy ||
  !movieBuddyController.updateMovieBuddy ||
  !movieBuddyController.checkExistingUser ||
  !movieBuddyController.getMovieBuddies ||
  !movieBuddyController.loginMovieBuddy ||
  !movieBuddyController.getMovieBuddiesByEmail ||
  !movieBuddyController.createMovieBuddyDirect
) {
  throw new Error('One or more required controller functions are undefined.');
}

// Route to create/update a movie buddy profile
router.post('/', movieBuddyController.createMovieBuddy);

router.post('/email',movieBuddyController.getMovieBuddiesByEmail);

// Update route to handle the movie buddy update (for backward compatibility)
router.post('/update', movieBuddyController.updateMovieBuddy);

// Get all movie buddy groups
router.get('/all', movieBuddyController.getAllMovieBuddyGroups);

// Check if a movie buddy exists
router.post('/check-existing', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    const exists = await MovieBuddy.findOne({ email });
    return res.status(200).json({ exists: !!exists });
  } catch (error) {
    console.error('Error checking movie buddy:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create new movie buddy profile (requires User model)
router.post('/create', movieBuddyController.createMovieBuddy);

// Create new movie buddy profile (direct - no User model dependency)
router.post('/create-direct', movieBuddyController.createMovieBuddyDirect);

// Get movie buddies for a specific show with filtering
router.get('/buddies', async (req, res) => {
  try {
    const { movieName, movieDate, movieTime, email } = req.query;
    
    // Proper validation of required movie details
    if (!movieName || !movieDate || !movieTime) {
      return res.status(400).json({ 
        error: 'Movie details are required for filtering' 
      });
    }

    console.log('Query parameters:', { movieName, movieDate, movieTime, email });

    // Build exact matching query for movie details
    const query = {
      movieName: movieName,
      movieDate: movieDate,
      movieTime: movieTime
    };

    // Optional user exclusion works correctly
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

// Add login route
router.post('/login', movieBuddyController.loginMovieBuddy);

// Update movie details for existing user
router.put('/update-movie-details', movieBuddyController.updateMovieDetailsForUser);

// Get movie buddy group by ID
router.get('/:id', movieBuddyController.getMovieBuddyGroupById);

// Delete movie buddy group
router.delete('/:id', movieBuddyController.deleteMovieBuddyGroup);

// Update movie buddy profile
router.put('/:id', movieBuddyController.updateMovieBuddy);

// Delete movie buddy group by movie details
router.delete('/:movieName/:movieDate/:movieTime', async (req, res) => {
  try {
    const { movieName, movieDate, movieTime } = req.params;
    
    // Delete all buddies for this specific movie showing
    const result = await MovieBuddy.deleteMany({
      movieName,
      movieDate,
      movieTime
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No movie buddy groups found to delete'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie buddy group deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting movie buddy group:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting movie buddy group',
      error: error.message
    });
  }
});

// Clean up route for records without passwords (for development/testing)
router.post('/cleanup-invalid', async (req, res) => {
  try {
    // Delete all MovieBuddy records without passwords
    const result = await MovieBuddy.deleteMany({
      $or: [
        { password: { $exists: false } },
        { password: null },
        { password: '' }
      ]
    });
    
    return res.status(200).json({
      success: true,
      message: `Cleaned up ${result.deletedCount} records without passwords`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error cleaning up records:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during cleanup',
      error: error.message 
    });
  }
});

module.exports = router;