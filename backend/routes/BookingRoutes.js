const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/BookingController');

// Booking Routes
router.post('/', bookingController.addBooking);           // Add Booking
router.get('/', bookingController.getAllBookings);        // Get All Bookings (Admin)
router.get('/:id', bookingController.getBookingById);     // Get Single Booking
router.put('/:id', bookingController.updateBooking);      // Update Booking
router.delete('/:id', bookingController.deleteBooking);   // Delete Booking

module.exports = router;