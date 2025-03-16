const express = require('express');
const FoodRoutes = require('./FoodRoutes');


const router = express.Router();

router.use('/foods',FoodRoutes);

module.exports = router;






