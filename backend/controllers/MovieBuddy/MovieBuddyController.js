const MovieBuddy = require('../../models/MovieBuddy/MovieBuddyModel');
const User = require('../../models/Auth/UserModel'); // Import User model for auth data

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
      const { name, age, gender, email, phone, password, bookingId, seatNumbers, moviePreferences, privacySettings } = buddy;

      // Validate buddy information
      if (!name || !age || !gender || !bookingId || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Missing required buddy information: name, age, gender, bookingId, email, or password'
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
            password,
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
          password,
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

// Create/update a movie buddy
const updateMovieBuddy = async (req, res) => {
  try {
    const {
      movieName,
      movieDate,
      movieTime,
      buddies
    } = req.body;

    if (!buddies || !buddies.length) {
      return res.status(400).json({
        success: false,
        message: 'No buddy information provided'
      });
    }

    const buddy = buddies[0]; // assuming single buddy for now

    // Find user by email but don't auto-fill fields
    // Just verify that the user exists in our system
    const user = await User.findOne({ email: buddy.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please login again.'
      });
    }

    // Find existing MovieBuddy or create new one
    const existingBuddy = await MovieBuddy.findOne({ email: buddy.email });
    
    // Use values provided in the form instead of auto-filling from User model
    const buddyData = {
      name: buddy.name, // Use name from form input
      email: buddy.email, // Use email from form input
      phone: buddy.phone, // Use phone from form input
      age: buddy.age,
      gender: buddy.gender,
      movieName,
      movieDate,
      movieTime,
      bookingId: buddy.bookingId,
      privacySettings: buddy.privacySettings,
      moviePreferences: buddy.moviePreferences,
      seatNumbers: buddy.seatNumbers,
      bookingDate: buddy.bookingDate || new Date()
    };

    let result;
    if (existingBuddy) {
      // Update existing buddy
      result = await MovieBuddy.findByIdAndUpdate(existingBuddy._id, buddyData, { new: true });
    } else {
      // Create new buddy
      const newBuddy = new MovieBuddy(buddyData);
      result = await newBuddy.save();
    }

    res.status(201).json({
      success: true,
      message: 'Movie buddy updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error updating movie buddy:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating movie buddy',
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

    // Exact filtering by movie details - working correctly
    const buddies = await MovieBuddy.find({
      movieName,
      movieDate,
      movieTime,
      email: { $ne: email } // Properly excludes current user
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
const updateMovieBuddyDetails = async (req, res) => {
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

// Create/update movie buddy profile
const createMovieBuddy = async (req, res) => {
  try {
    const {
      email,
      movieName,
      movieDate,
      movieTime,
      bookingId,
      age,
      gender,
      moviePreferences,
      privacySettings,
      seatNumbers
    } = req.body;

    // Validate required data
    if (!email || !movieName || !movieDate || !movieTime || !bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find user in the User model to get their basic information
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register or login first.'
      });
    }

    // Check if this specific user already has a movie buddy profile for this specific movie showing
    const existingUserMovieBuddy = await MovieBuddy.findOne({ 
      email,
      movieName,
      movieDate,
      movieTime
    });

    // Only check for bookingId if we don't find a user-specific match
    const existingBuddyByBookingId = !existingUserMovieBuddy ? 
      await MovieBuddy.findOne({ bookingId }) : null;
    
    let movieBuddy;
    
    if (existingUserMovieBuddy) {
      // Update existing movie buddy for this user and movie showing
      movieBuddy = await MovieBuddy.findOneAndUpdate(
        { _id: existingUserMovieBuddy._id },
        {
          // Basic info from User model
          name: user.name,
          email: user.email,
          phone: user.phone,

          // Movie-specific info from form
          movieName,
          movieDate,
          movieTime,
          bookingId,
          age,
          gender,
          moviePreferences: moviePreferences || [],
          privacySettings: privacySettings || {
            showName: true,
            showEmail: false,
            showPhone: false,
            petName: ''
          },
          seatNumbers: seatNumbers || []
        },
        { new: true }
      );
    } else if (existingBuddyByBookingId) {
      // If another user has the same bookingId, generate a unique one
      const uniqueBookingId = `${bookingId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Create a new movie buddy record with unique bookingId
      movieBuddy = new MovieBuddy({
        name: user.name,
        email: user.email,
        phone: user.phone,
        movieName,
        movieDate,
        movieTime,
        bookingId: uniqueBookingId, // Use the unique bookingId
        age,
        gender,
        moviePreferences: moviePreferences || [],
        privacySettings: privacySettings || {
          showName: true,
          showEmail: false,
          showPhone: false,
          petName: ''
        },
        seatNumbers: seatNumbers || []
      });
      
      await movieBuddy.save();
    } else {
      // Create a new movie buddy record
      movieBuddy = new MovieBuddy({
        name: user.name,
        email: user.email,
        phone: user.phone,
        movieName,
        movieDate,
        movieTime,
        bookingId,
        age,
        gender,
        moviePreferences: moviePreferences || [],
        privacySettings: privacySettings || {
          showName: true,
          showEmail: false,
          showPhone: false,
          petName: ''
        },
        seatNumbers: seatNumbers || []
      });
      
      await movieBuddy.save();
    }

    res.status(200).json({
      success: true,
      message: 'Movie buddy profile created/updated successfully',
      data: movieBuddy
    });
  } catch (error) {
    console.error('Error creating movie buddy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Add this new function for handling login
const loginMovieBuddy = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const buddy = await MovieBuddy.findOne({ email });
    if (!buddy) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare passwords
    const isMatch = await buddy.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Return success with user data (excluding password)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      name: buddy.name,
      email: buddy.email,
      phone: buddy.phone,
      id: buddy._id
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

module.exports = {
  updateMovieBuddies,
  getAllMovieBuddyGroups,
  getMovieBuddyGroupById,
  deleteMovieBuddyGroup,
  getMovieBuddies,
  checkExistingUser,
  updateMovieBuddyDetails,
  createMovieBuddy,
  updateMovieBuddy,
  loginMovieBuddy
};