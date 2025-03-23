const mongoose = require('mongoose');

const movieBuddySchema = new mongoose.Schema({
  movieName: {
    type: String,
    required: true
  },
  movieDate: {
    type: String,
    required: true
  },
  movieTime: {
    type: String,
    required: true
  },
  buddies: [{
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other']
    },
    email: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    },
    bookingId: {
      type: String,
      required: true
    },
    bookingDate: {
      type: Date,
      default: Date.now
    },
    seatNumbers: [{
      type: String
    }],
    moviePreferences: [{
      type: String
    }],
    isGroup: {
      type: Boolean,
      default: false
    },
    privacySettings: {
      showName: {
        type: Boolean,
        default: true
      },
      showEmail: {
        type: Boolean,
        default: false
      },
      showPhone: {
        type: Boolean,
        default: false
      },
      petName: {
        type: String,
        default: ''
      }
    }
  }]
}, {
  timestamps: true
});

// Create a compound index for unique movie showtimes
movieBuddySchema.index({ movieName: 1, movieDate: 1, movieTime: 1 }, { unique: true });

const MovieBuddy = mongoose.model('MovieBuddy', movieBuddySchema);

module.exports = MovieBuddy;