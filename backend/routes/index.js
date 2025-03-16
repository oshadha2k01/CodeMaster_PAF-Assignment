const express = require('express');
const FoodRoutes = require('./FoodRoutes');


const router = express.Router();

router.use('/foods',FoodRoutes);



router.get("/", (req, res) => {
    res.send("Hello World!");
  });


module.exports = router;






