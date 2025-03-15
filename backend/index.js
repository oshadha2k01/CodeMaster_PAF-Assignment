const express = require('express');
const router = express.Router();

const orderRoute = require('./OrderRoute.js');
const foodRoute = require('./FoodRoutes.js');



router.get("/", (req, res) => {
    res.send("Hello World!");
  });
  

router.use('/orders',orderRoute);
router.use('/foods',foodRoute);

module.exports = router;
