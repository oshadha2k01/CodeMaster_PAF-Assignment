const mongoose = require('mongoose');
const schema = mongoose.Schema;

const MovieSchema = new schema({
    image_name: {
        type: String,
        required: true,
    },
    movie_name: {
        type: String,
        required: true,
    },
    release_date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    director: {
        type: String,
        required: true,
    },
    cast: {
        type: [String],
        required: true,
    },
    trailer_link: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: true,
        enum: ['Upcoming', 'Now Showing', 'End'],
        default: 'Upcoming',
    },
}, {
    timestamps: true
});

// Middleware to update status based on release_date
MovieSchema.pre('save', function (next) {
    const currentDate = new Date(); // Use actual current date
    const releaseDate = this.release_date;
    
    // Calculate dates for comparison
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(currentDate.getMonth() + 1);
    
    const fourMonthsFromReleaseDate = new Date(releaseDate);
    fourMonthsFromReleaseDate.setMonth(releaseDate.getMonth() + 4);

    // Set status based on date comparisons
    if (releaseDate > currentDate && releaseDate <= oneMonthFromNow) {
        // If release date is within the next month
        this.status = 'Upcoming';
    } else if (releaseDate <= currentDate && currentDate <= fourMonthsFromReleaseDate) {
        // If movie is released and within 4 months of release date
        this.status = 'Now Showing';
    } else if (currentDate > fourMonthsFromReleaseDate) {
        // If more than 4 months have passed since release date
        this.status = 'End';
    }

    next();
});

module.exports = mongoose.model('Movie', MovieSchema);