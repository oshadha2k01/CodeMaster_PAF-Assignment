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
    trim: true,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  bookingId: {
    type: String,
    required: true,
    unique: true
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
}, {
  timestamps: true
});

// Removed the unique index to allow multiple buddies for the same showtime
// movieBuddySchema.index({ movieName: 1, movieDate: 1, movieTime: 1 }, { unique: true });

// Pre-save middleware to handle privacy settings
movieBuddySchema.pre('save', function(next) {
  if (!this.privacySettings.showEmail) {
    this.email = '';
  }
  if (!this.privacySettings.showPhone) {
    this.phone = '';
  }
  if (!this.privacySettings.showName && this.privacySettings.petName) {
    this.name = this.privacySettings.petName;
  }
  next();
});

const MovieBuddy = mongoose.model('MovieBuddy', movieBuddySchema);

module.exports = MovieBuddy;