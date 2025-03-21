const MovieBuddy = require('../../models/MovieBuddy/MovieBuddyModel');
const Booking = require('../../models/BookingManagement/BookingModel');

// Update movie buddies for a specific showtime
const updateMovieBuddies = async (req, res) => {
  try {
    const { movieName, movieDate, movieTime } = req.body;

    // Find all bookings for this showtime
    const bookings = await Booking.find({
      movieName,
      movieDate,
      movieTime
    });

    // Transform bookings into buddy format
    const buddies = bookings.map(booking => ({
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      seatNumbers: booking.seatNumbers,
      bookingId: booking._id,
      bookingDate: booking.createdAt,
      isGroup: booking.seatNumbers.length > 1
    }));

    // Calculate statistics
    const totalBuddies = buddies.length;
    const totalSeats = buddies.reduce((acc, buddy) => acc + buddy.seatNumbers.length, 0);
    const groupBookings = buddies.filter(buddy => buddy.isGroup).length;
    const singleBookings = buddies.filter(buddy => !buddy.isGroup).length;

    // Update or create movie buddy group
    const movieBuddyGroup = await MovieBuddy.findOneAndUpdate(
      { movieName, movieDate, movieTime },
      {
        movieName,
        movieDate,
        movieTime,
        buddies,
        totalBuddies,
        totalSeats,
        groupBookings,
        singleBookings,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Movie buddies updated successfully',
      data: movieBuddyGroup
    });
  } catch (error) {
    console.error('Error updating movie buddies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update movie buddies',
      error: error.message
    });
  }
};

// Get movie buddies for a specific showtime
const getMovieBuddies = async (req, res) => {
  try {
    const { movieName, movieDate, movieTime, excludeBookingId } = req.query;

    const movieBuddyGroup = await MovieBuddy.findOne({
      movieName,
      movieDate,
      movieTime
    });

    if (!movieBuddyGroup) {
      return res.status(404).json({
        success: false,
        message: 'No movie buddy group found for this showtime'
      });
    }

    // Filter out the excluded booking if provided
    let buddies = movieBuddyGroup.buddies;
    if (excludeBookingId) {
      buddies = buddies.filter(buddy => buddy.bookingId !== excludeBookingId);
    }

    res.status(200).json({
      success: true,
      data: {
        ...movieBuddyGroup.toObject(),
        buddies
      }
    });
  } catch (error) {
    console.error('Error getting movie buddies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get movie buddies',
      error: error.message
    });
  }
};

// Get all movie buddy groups
const getAllMovieBuddyGroups = async (req, res) => {
  try {
    const movieBuddyGroups = await MovieBuddy.find()
      .sort({ lastUpdated: -1 })
      .select('movieName movieDate movieTime buddies totalBuddies totalSeats groupBookings singleBookings lastUpdated');

    res.status(200).json({
      success: true,
      data: movieBuddyGroups
    });
  } catch (error) {
    console.error('Error getting all movie buddy groups:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get movie buddy groups',
      error: error.message
    });
  }
};

// Get movie buddy statistics
const getMovieBuddyStats = async (req, res) => {
  try {
    const stats = await MovieBuddy.aggregate([
      {
        $group: {
          _id: null,
          totalGroups: { $sum: 1 },
          totalBuddies: { $sum: '$totalBuddies' },
          totalSeats: { $sum: '$totalSeats' },
          totalGroupBookings: { $sum: '$groupBookings' },
          totalSingleBookings: { $sum: '$singleBookings' }
        }
      },
      {
        $project: {
          _id: 0,
          totalGroups: 1,
          totalBuddies: 1,
          totalSeats: 1,
          totalGroupBookings: 1,
          totalSingleBookings: 1,
          averageGroupSize: { $divide: ['$totalSeats', '$totalBuddies'] }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {
        totalGroups: 0,
        totalBuddies: 0,
        totalSeats: 0,
        totalGroupBookings: 0,
        totalSingleBookings: 0,
        averageGroupSize: 0
      }
    });
  } catch (error) {
    console.error('Error getting movie buddy stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get movie buddy statistics',
      error: error.message
    });
  }
};

// Delete a movie buddy group
const deleteMovieBuddyGroup = async (req, res) => {
  try {
    const { movieName, movieDate, movieTime } = req.params;

    const deletedGroup = await MovieBuddy.findOneAndDelete({
      movieName,
      movieDate,
      movieTime
    });

    if (!deletedGroup) {
      return res.status(404).json({
        success: false,
        message: 'Movie buddy group not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie buddy group deleted successfully',
      data: deletedGroup
    });
  } catch (error) {
    console.error('Error deleting movie buddy group:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete movie buddy group',
      error: error.message
    });
  }
};

module.exports = {
  updateMovieBuddies,
  getMovieBuddies,
  getAllMovieBuddyGroups,
  getMovieBuddyStats,
  deleteMovieBuddyGroup
};