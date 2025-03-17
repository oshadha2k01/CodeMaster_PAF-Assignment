const express = require('express');
const FoodRoutes = require('./FoodRoutes');
const BookingRoutes = require('./BookingRoutes');


const router = express.Router();

router.use('/foods',FoodRoutes);
router.use('/Booking',BookingRoutes);

module.exports = router;






