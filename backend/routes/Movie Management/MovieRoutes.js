const express = require('express');
const router = express.Router();

const MovieController = require('../../controllers/Movie Management/MovieController');

router.get('/', MovieController.getMovies);
router.get('/:id', MovieController.viewOneMovie);
router.post('/', MovieController.addMovie);
router.put('/:id', MovieController.updateMovie);
router.delete('/:id', MovieController.deleteMovie);

module.exports = router;