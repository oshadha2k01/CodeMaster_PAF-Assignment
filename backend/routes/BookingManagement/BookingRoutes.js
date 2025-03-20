const express = require('express');
const router = express.Router();
const {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
    getBookedSeats,
    getMovieBuddies
} = require('../../controllers/BookingManagement/BookingController');

// Create a new booking
router.post('/', createBooking);

// Get all bookings
router.get('/', getAllBookings);

// Get booked seats for a specific movie, date, and time
router.get('/booked-seats', getBookedSeats);

// Get a single booking by ID
router.get('/:id', getBookingById);

// Update a booking
router.put('/:id', updateBooking);

// Delete a booking
router.delete('/:id', deleteBooking);

// Get movie buddies for a specific movie, date, and time
router.get('/movie-buddies', getMovieBuddies);

module.exports = router;
