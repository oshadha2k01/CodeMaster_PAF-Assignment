const express = require('express');
const router = express.Router();

const MovieController = require('../../controllers/Movie Management/MovieController');

router.get('/', MovieController.getMovies);
router.get('/:id', MovieController.viewOneMovie);
router.post('/', MovieController.addMovie); // Multer middleware is in controller
router.put('/:id', MovieController.updateMovie); // Multer middleware is in controller
router.delete('/:id', MovieController.deleteMovie);

module.exports = router;