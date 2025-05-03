const User = require('../../models/Auth/UserModel');

// Generate a simple random ID without dependencies
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (name, email, password, phone)'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      password,
      phone
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: error.message
    });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Return success with user data (excluding password)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};
