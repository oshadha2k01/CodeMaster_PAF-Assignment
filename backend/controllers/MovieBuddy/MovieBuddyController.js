const MovieBuddy = require('../../models/MovieBuddy/MovieBuddyModel');
const Booking = require('../../models/BookingManagement/BookingModel');

// Create or update movie buddy group
const updateMovieBuddies = async (req, res) => {
  try {
    const { movieName, movieDate, movieTime, buddies } = req.body;

    // Validate required fields
    if (!movieName || !movieDate || !movieTime || !buddies || !Array.isArray(buddies)) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate each buddy
    for (const buddy of buddies) {
      if (!buddy.name || !buddy.age || !buddy.gender || !buddy.bookingId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required buddy information'
        });
      }

      // Validate privacy settings
      if (!buddy.privacySettings) {
        return res.status(400).json({
          success: false,
          message: 'Privacy settings are required'
        });
      }

      const { showName, showEmail, showPhone, petName } = buddy.privacySettings;

      // Validate privacy settings
      if (typeof showName !== 'boolean' || typeof showEmail !== 'boolean' || typeof showPhone !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'Invalid privacy settings format'
        });
      }

      // If name is not shown, pet name is required
      if (!showName && !petName) {
        return res.status(400).json({
          success: false,
          message: 'Pet name is required when real name is not shown'
        });
      }

      // Handle email and phone based on privacy settings
      if (!showEmail) {
        buddy.email = undefined;
      }
      if (!showPhone) {
        buddy.phone = undefined;
      }
    }

    // Find existing movie buddy group
    let movieBuddyGroup = await MovieBuddy.findOne({
      movieName,
      movieDate,
      movieTime
    });

    if (movieBuddyGroup) {
      // Update existing group
      for (const newBuddy of buddies) {
        const existingBuddyIndex = movieBuddyGroup.buddies.findIndex(
          buddy => buddy.bookingId === newBuddy.bookingId
        );

        if (existingBuddyIndex !== -1) {
          // Update existing buddy
          const existingBuddy = movieBuddyGroup.buddies[existingBuddyIndex];
          movieBuddyGroup.buddies[existingBuddyIndex] = {
            ...existingBuddy,
            ...newBuddy,
            // Preserve privacy settings
            privacySettings: {
              ...existingBuddy.privacySettings,
              ...newBuddy.privacySettings
            }
          };
        } else {
          // Add new buddy
          movieBuddyGroup.buddies.push(newBuddy);
        }
      }
    } else {
      // Create new group
      movieBuddyGroup = new MovieBuddy({
        movieName,
        movieDate,
        movieTime,
        buddies
      });
    }

    await movieBuddyGroup.save();

    res.status(200).json({
      success: true,
      message: 'Movie buddy group updated successfully',
      data: movieBuddyGroup
    });
  } catch (error) {
    console.error('Error updating movie buddies:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating movie buddies',
      error: error.message
    });
  }
};

// Get all movie buddy groups
const getAllMovieBuddyGroups = async (req, res) => {
  try {
    const movieBuddyGroups = await MovieBuddy.find();
    res.status(200).json({
      success: true,
      data: movieBuddyGroups
    });
  } catch (error) {
    console.error('Error fetching movie buddy groups:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching movie buddy groups',
      error: error.message
    });
  }
};

// Get movie buddy group by ID
const getMovieBuddyGroupById = async (req, res) => {
  try {
    const movieBuddyGroup = await MovieBuddy.findById(req.params.id);
    if (!movieBuddyGroup) {
      return res.status(404).json({
        success: false,
        message: 'Movie buddy group not found'
      });
    }
    res.status(200).json({
      success: true,
      data: movieBuddyGroup
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching movie buddy group',
      error: error.message
    });
  }
};

// Delete movie buddy group
const deleteMovieBuddyGroup = async (req, res) => {
  try {
    const movieBuddyGroup = await MovieBuddy.findByIdAndDelete(req.params.id);
    if (!movieBuddyGroup) {
      return res.status(404).json({
        success: false,
        message: 'Movie buddy group not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Movie buddy group deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting movie buddy group',
      error: error.message
    });
  }
};

module.exports = {
  updateMovieBuddies,
  getAllMovieBuddyGroups,
  getMovieBuddyGroupById,
  deleteMovieBuddyGroup
};