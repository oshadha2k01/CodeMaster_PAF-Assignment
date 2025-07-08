const express = require('express');


const router = express.Router();


//new route for food
const foodRoute = require('./FoodManagement/FoodRoutes.js');

//new route for order
const orderRoute = require('./FoodManagement/OrderRoute.js');

// New route for Movie
const movieRoute = require('./MovieManagement/MovieRoutes.js');

// New route for Booking
const bookingRoute = require('./BookingManagement/BookingRoutes.js');

// New route for Movie Buddy
const movieBuddyRoute = require('./MovieBuddy/MovieBuddyRoutes.js');

// New route for Authentication
const authRoute = require('./Auth/AuthRoutes.js');

// New route for Admin Authentication
const adminRoute = require('./AdminRoute.js');

// Root route
router.get("/", (req, res) => {
    res.send("Hello World!");
});

// New route usage for Movie
router.use('/movies', movieRoute);

// New route usage for Booking
router.use('/bookings', bookingRoute);

// New route usage for Movie Buddy
router.use('/movie-buddies', movieBuddyRoute);


// New route usage for Admin Authentication  
router.use('/admin', adminRoute);


// New route usage for Food
router.use('/foods', foodRoute);

// New route usage for Order        
router.use('/orders', orderRoute);




module.exports = router;