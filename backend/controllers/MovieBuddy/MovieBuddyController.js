const MovieBuddy = require('../../models/MovieBuddy/MovieBuddyModel');

// Create or update movie buddy
const updateMovieBuddies = async (req, res) => {
  try {
    const { movieName, movieDate, movieTime, buddies } = req.body;

    // Validate required fields
    if (!movieName || !movieDate || !movieTime || !buddies || !Array.isArray(buddies)) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: movieName, movieDate, movieTime, or buddies'
      });
    }

    const results = [];

    for (const buddy of buddies) {
      const { name, age, gender, email, phone, bookingId, seatNumbers, moviePreferences, privacySettings } = buddy;

      // Validate buddy information
      if (!name || !age || !gender || !bookingId || !email) {
        return res.status(400).json({
          success: false,
          message: 'Missing required buddy information: name, age, gender, bookingId, or email'
        });
      }

      // Validate privacy settings
      if (!privacySettings) {
        return res.status(400).json({
          success: false,
          message: 'Privacy settings are required for each buddy'
        });
      }

      const { showName, showEmail, showPhone, petName } = privacySettings;

      // Validate privacy settings types
      if (typeof showName !== 'boolean' || typeof showEmail !== 'boolean' || typeof showPhone !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'Invalid privacy settings format: showName, showEmail, and showPhone must be booleans'
        });
      }

      // If name is not shown, pet name is required
      if (!showName && !petName) {
        return res.status(400).json({
          success: false,
          message: 'Pet name is required when real name is not shown'
        });
      }

      // Check if a movie buddy with the same bookingId exists
      let movieBuddy = await MovieBuddy.findOne({ bookingId });

      if (movieBuddy) {
        // Update existing movie buddy
        movieBuddy = await MovieBuddy.findOneAndUpdate(
          { bookingId },
          {
            movieName,
            movieDate,
            movieTime,
            name,
            age,
            gender,
            email,
            phone,
            bookingId,
            seatNumbers,
            moviePreferences,
            privacySettings
          },
          { new: true }
        );
      } else {
        // Create new movie buddy
        movieBuddy = new MovieBuddy({
          movieName,
          movieDate,
          movieTime,
          name,
          age,
          gender,
          email,
          phone,
          bookingId,
          seatNumbers,
          moviePreferences,
          privacySettings
        });
        await movieBuddy.save();
      }

      results.push(movieBuddy);
    }

    res.status(200).json({
      success: true,
      message: 'Movie buddies updated successfully',
      data: results
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
    // Get all movie buddies from the database
    const allBuddies = await MovieBuddy.find().lean();
    
    // Group buddies by movie details (movieName, movieDate, movieTime)
    const groupedBuddies = allBuddies.reduce((acc, buddy) => {
      // Create a unique key for each movie showing
      const key = `${buddy.movieName}|${buddy.movieDate}|${buddy.movieTime}`;
      
      if (!acc[key]) {
        // Initialize a new group
        acc[key] = {
          movieName: buddy.movieName,
          movieDate: buddy.movieDate,
          movieTime: buddy.movieTime,
          buddies: []
        };
      }
      
      // Add this buddy to the appropriate group
      // Determine if this is a group booking based on seat numbers
      const isGroup = buddy.seatNumbers && buddy.seatNumbers.length > 1;
      
      acc[key].buddies.push({
        ...buddy,
        isGroup: isGroup // Add isGroup flag for frontend
      });
      
      return acc;
    }, {});
    
    // Convert the grouped object to an array
    const movieBuddyGroups = Object.values(groupedBuddies);
    
    res.status(200).json({
      success: true,
      data: movieBuddyGroups
    });
  } catch (error) {
    console.error('Error fetching movie buddy groups:', {
      message: error.message,
      stack: error.stack
    });
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
    console.error('Error fetching movie buddy group:', {
      message: error.message,
      stack: error.stack
    });
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
    console.error('Error deleting movie buddy group:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Error deleting movie buddy group',
      error: error.message
    });
  }
};

// Get movie buddies with filtering
const getMovieBuddies = async (filters) => {
  try {
    const { movieName, movieDate, movieTime, email } = filters;

    // Find all movie buddies that match the exact movie details
    // and exclude the current user
    const buddies = await MovieBuddy.find({
      movieName,
      movieDate,
      movieTime,
      email: { $ne: email } // Exclude the current user
    }).select('-__v -createdAt -updatedAt');

    return buddies;
  } catch (error) {
    console.error('Error in getMovieBuddies:', error);
    throw error;
  }
};

// Check if user exists
const checkExistingUser = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await MovieBuddy.findOne({ email });
    res.json({ exists: !!existingUser });
  } catch (error) {
    console.error('Error in checkExistingUser:', error);
    res.status(500).json({ error: 'Failed to check user existence' });
  }
};

// Update movie buddy details
const updateMovieBuddy = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedBuddy = await MovieBuddy.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedBuddy) {
      return res.status(404).json({ error: 'Movie buddy not found' });
    }

    res.json(updatedBuddy);
  } catch (error) {
    console.error('Error in updateMovieBuddy:', error);
    res.status(500).json({ error: 'Failed to update movie buddy' });
  }
};

// Create new movie buddy
const createMovieBuddy = async (req, res) => {
  try {
    const newBuddy = new MovieBuddy(req.body);
    const savedBuddy = await newBuddy.save();
    res.status(201).json(savedBuddy);
  } catch (error) {
    console.error('Error in createMovieBuddy:', error);
    res.status(500).json({ error: 'Failed to create movie buddy' });
  }
};

module.exports = {
  updateMovieBuddies,
  getAllMovieBuddyGroups,
  getMovieBuddyGroupById,
  deleteMovieBuddyGroup,
  getMovieBuddies,
  checkExistingUser,
  updateMovieBuddy,
  createMovieBuddy
};