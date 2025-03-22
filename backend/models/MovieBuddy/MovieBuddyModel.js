const mongoose = require('mongoose');

const movieBuddySchema = new mongoose.Schema({
  movieName: {
    type: String,
    required: [true, 'Movie name is required'],
    trim: true
  },
  movieDate: {
    type: String,
    required: [true, 'Movie date is required'],
    trim: true
  },
  movieTime: {
    type: String,
    required: [true, 'Movie time is required'],
    trim: true
  },
  buddies: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    seatNumbers: [{
      type: String,
      required: true
    }],
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    bookingDate: {
      type: Date,
      required: true
    },
    isGroup: {
      type: Boolean,
      default: false
    }
  }],
  totalBuddies: {
    type: Number,
    default: 0
  },
  totalSeats: {
    type: Number,
    default: 0
  },
  groupBookings: {
    type: Number,
    default: 0
  },
  singleBookings: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create a compound index for unique movie showtimes
movieBuddySchema.index({ movieName: 1, movieDate: 1, movieTime: 1 }, { unique: true });

// Pre-save middleware to update statistics
movieBuddySchema.pre('save', function(next) {
  this.totalBuddies = this.buddies.length;
  this.totalSeats = this.buddies.reduce((acc, buddy) => acc + buddy.seatNumbers.length, 0);
  this.groupBookings = this.buddies.filter(buddy => buddy.isGroup).length;
  this.singleBookings = this.buddies.filter(buddy => !buddy.isGroup).length;
  this.lastUpdated = new Date();
  next();
});

const MovieBuddy = mongoose.model('MovieBuddy', movieBuddySchema);

module.exports = MovieBuddy;