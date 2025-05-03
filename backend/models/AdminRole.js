const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminRoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number! Needs to be 10 digits.`
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'admin',
    required: [true, 'Role is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
adminRoleSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if password matches
adminRoleSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Explicitly set the collection name to "loginuser"
const AdminRole = mongoose.model('AdminRole', adminRoleSchema, 'loginuser');

module.exports = AdminRole;