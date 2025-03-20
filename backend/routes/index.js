const express = require('express');
const router = express.Router();

// New route for Movie
const movieRoute = require('./MovieManagement/MovieRoutes.js');


// New route for Booking
const bookingRoute = require('./BookingManagement/BookingRoutes.js');

// Root route
router.get("/", (req, res) => {
    res.send("Hello World!");
});

// New route usage for Movie
router.use('/movies', movieRoute);

// New route usage for Booking
router.use('/bookings', bookingRoute);

module.exports = router; 
