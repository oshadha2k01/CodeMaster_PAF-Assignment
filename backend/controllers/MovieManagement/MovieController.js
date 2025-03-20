const Movie = require("../../models/MovieManagement/MovieModel");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
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
    upload.single('image_name'),
    async (req, res) => {
        try {
            const { movie_name, release_date, description, director, cast, trailer_link, status, show_times, genre } = req.body;

            if (!movie_name || !release_date || !director || !cast || !status || !genre) {
                return res.status(400).json({ success: false, error: "Please fill all the required fields" });
            }

            const image_name = req.file ? req.file.filename : null;
            if (!image_name) {
                return res.status(400).json({ success: false, error: "Please upload an image" });
            }

            let parsedShowTimes = show_times ? JSON.parse(show_times) : [];
            if (!Array.isArray(parsedShowTimes) || parsedShowTimes.length > 2) {
                return res.status(400).json({ success: false, error: "Show times must be an array of maximum 2 times" });
            }

            const validTimes = ['9:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '7:00 PM', '9:30 PM'];
            if (parsedShowTimes.length > 0) {
                parsedShowTimes = parsedShowTimes.filter(time => validTimes.includes(time));
                if (parsedShowTimes.length === 0) {
                    return res.status(400).json({ success: false, error: "Invalid show times provided" });
                }
            }

            const newMovie = new Movie({
                image_name,
                movie_name,
                release_date,
                description,
                director,
                cast,
                trailer_link,
                status,
                show_times: parsedShowTimes,
                genre
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
    upload.single('image_name'),
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
                genre: req.body.genre
            };

            if (req.file) {
                updatedMovie.image_name = req.file.filename;
            }

            if (req.body.show_times) {
                let parsedShowTimes = JSON.parse(req.body.show_times);
                const validTimes = ['9:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '7:00 PM', '9:30 PM'];
                parsedShowTimes = parsedShowTimes.filter(time => validTimes.includes(time));
                if (parsedShowTimes.length > 2) {
                    parsedShowTimes = parsedShowTimes.slice(0, 2);
                }
                updatedMovie.show_times = parsedShowTimes;
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