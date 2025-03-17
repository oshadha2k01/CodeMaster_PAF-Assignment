const express = require('express');
const router = express.Router();



// New route for Movie
const movieRoute = require('./routes/Movie Management/MovieRoutes.js');

// Root route
router.get("/", (req, res) => {
    res.send("Hello World!");
});



// New route usage for Movie
router.use('/movies', movieRoute);

module.exports = router;