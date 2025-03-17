const Movie = require("../../models/Movie Management/MovieModel");
const multer = require('multer');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});

const upload = multer({ storage: storage });

// Get all movies
exports.getMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json({ success: true, data: movies });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Add a new movie with image upload
exports.addMovie = [
    upload.single('image_name'), // 'image_name' is the field name in the form
    async (req, res) => {
        try {
            const { movie_name, release_date, description, director, cast, trailer_link, status } = req.body;

            // Validate required fields
            if (!movie_name || !release_date || !director || !cast || !status) {
                return res.status(400).json({ success: false, error: "Please fill all the required fields" });
            }

            // Get the uploaded file name
            const image_name = req.file ? req.file.filename : null;

            if (!image_name) {
                return res.status(400).json({ success: false, error: "Please upload an image" });
            }

            // Create a new movie
            const newMovie = new Movie({
                image_name,
                movie_name,
                release_date,
                description,
                director,
                cast,
                trailer_link,
                status,
            });

            const savedMovie = await newMovie.save();

            return res.status(200).json({ success: true, data: savedMovie });
        } catch (err) {
            console.log('Error in adding movie', err);
            return res.status(400).json({ success: false, error: err.message });
        }
    }
];

// Update a movie with optional image upload
exports.updateMovie = [
    upload.single('image_name'), // Optional upload
    async (req, res) => {
        try {
            const movieId = req.params.id;

            const updatedMovie = {
                movie_name: req.body.movie_name,
                release_date: req.body.release_date,
                description: req.body.description,
                director: req.body.director,
                cast: req.body.cast,
                trailer_link: req.body.trailer_link,
                status: req.body.status,
            };

            // Update image_name if a new file is uploaded
            if (req.file) {
                updatedMovie.image_name = req.file.filename;
            }

            const movie = await Movie.findByIdAndUpdate(movieId, updatedMovie, { new: true });

            if (!movie) {
                return res.status(404).json({ success: false, error: "Movie not found" });
            }

            return res.status(200).json({ message: "Movie updated successfully", data: movie });
        } catch (err) {
            console.log('Error in updating movie', err);
            return res.status(400).json({ success: false, error: err.message });
        }
    }
];

// Delete a movie
exports.deleteMovie = async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findByIdAndDelete(movieId);

        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        // Optional: Delete the associated image file
        const fs = require('fs');
        const path = require('path');
        const imagePath = path.join(__dirname, '../uploads', movie.image_name);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        return res.status(200).json({ message: "Movie deleted successfully" });
    } catch (err) {
        console.log('Error in deleting movie', err);
        return res.status(400).json({ message: "Error in deleting movie", error: err.message });
    }
};

// View a single movie
exports.viewOneMovie = async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findById(movieId);

        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        return res.status(200).json({ message: "Movie found successfully", data: movie });
    } catch (err) {
        res.status(400).json({ message: "Error in viewing one movie", error: err.message });
    }
};