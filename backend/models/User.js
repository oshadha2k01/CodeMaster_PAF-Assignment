const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    validate: {
      validator: function(v) {
        // Check if email follows the admin format: firstnameadmin@gmail.com
        const emailParts = this.email.split('@');
        if (emailParts.length === 2) {
          const localPart = emailParts[0].toLowerCase();
          const domain = emailParts[1].toLowerCase();
          
          // Check if email ends with 'admin@gmail.com'
          if (domain === 'gmail.com' && localPart.endsWith('admin')) {
            // Extract the first name from the email (remove 'admin' suffix)
            const firstNameFromEmail = localPart.slice(0, -5); // Remove 'admin' from the end
            
            // Check if the first name in email matches the provided firstName
            if (firstNameFromEmail === this.firstName.toLowerCase()) {
              return v === 'admin';
            }
          }
        }
        // If email doesn't match admin format, role must be user
        return v === 'user';
      },
      message: 'Invalid role for the given email format'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 