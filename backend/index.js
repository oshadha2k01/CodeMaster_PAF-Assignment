const express = require('express');
const router = express.Router();

// New route for Movie
const movieRoute = require('./routes/Movie Management/MovieRoutes.js');

// New route for Movie
const movieRoute = require('./routes/Movie Management/MovieRoutes.js');

// New route for Booking
const bookingRoute = require('./routes/Booking Management/BookingRoutes.js');

// Root route
router.get("/", (req, res) => {
    res.send("Hello World!");
});

// New route usage for Movie
router.use('/movies', movieRoute);

// New route usage for Booking
router.use('/bookings', bookingRoute);

module.exports = router; 
