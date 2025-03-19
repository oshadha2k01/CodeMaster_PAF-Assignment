const express = require('express');
const router = express.Router();



// New route for Movie
const movieRoute = require('./Movie Management/MovieRoutes');

// Root route
router.get("/", (req, res) => {
    res.send("Hello World!");
});



// New route usage for Movie
router.use('/movies', movieRoute);

module.exports = router;
//const FoodRoutes = require('./FoodRoutes');
const BookingRoutes = require('./BookingRoutes');




//router.use('/foods',FoodRoutes);
router.use('/Booking',BookingRoutes);

module.exports = router;






