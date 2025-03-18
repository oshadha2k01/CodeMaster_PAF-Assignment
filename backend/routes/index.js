const express = require('express');
const FoodRoutes = require('./FoodRoutes');
const OrderRoutes = require('./OrderRoute')


const router = express.Router();

router.use('/foods',FoodRoutes);
router.use('/orders',OrderRoutes);

module.exports = router;






