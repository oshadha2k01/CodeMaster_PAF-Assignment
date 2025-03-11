const express = require('express');
const router = express.Router();

const FoodController = require('../controllers/FoodController');


router.get('/foods', FoodController.getFood);
router.get('/foods/:id', FoodController.viewOneFood);
router.post('/foods', FoodController.AddFood);
router.put('/foods/:id', FoodController.UpdateFood);
router.delete('/foods/:id', FoodController.deleteFood);

module.exports = router;