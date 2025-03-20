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
    show_times: [{
        type: String,
        enum: ['9:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '7:00 PM', '9:30 PM'],
        required: true
    }],
    genre: {
        type: String,
        required: true,
        enum: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Adventure'],
        default: 'Action'
    }
}, {
    timestamps: true
});

MovieSchema.pre('save', function (next) {
    const currentDate = new Date();
    const releaseDate = this.release_date;
    
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(currentDate.getMonth() + 1);
    
    const fourMonthsFromReleaseDate = new Date(releaseDate);
    fourMonthsFromReleaseDate.setMonth(releaseDate.getMonth() + 4);

    if (releaseDate > currentDate && releaseDate <= oneMonthFromNow) {
        this.status = 'Upcoming';
    } else if (releaseDate <= currentDate && currentDate <= fourMonthsFromReleaseDate) {
        this.status = 'Now Showing';
    } else if (currentDate > fourMonthsFromReleaseDate) {
        this.status = 'End';
    }

    if (this.show_times && this.show_times.length > 2) {
        this.show_times = this.show_times.slice(0, 2);
    }

    next();
});

module.exports = mongoose.model('Movie', MovieSchema);