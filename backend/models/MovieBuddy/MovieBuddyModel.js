const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    required: true,
    min: 18
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
    trim: true,
    required: true
  },
  password: {
    type: String,
    required: false
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

// Password hashing middleware
movieBuddySchema.pre('save', async function(next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords for authentication
movieBuddySchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

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