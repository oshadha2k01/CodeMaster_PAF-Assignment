const AdminRole = require('../../models/AdminRole');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d'
  });
};

// @desc    Register a new admin
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    console.log('Admin registration attempt:', req.body);
    const { name, email, password, phone, role } = req.body;

    // Check if admin already exists
    const adminExists = await AdminRole.findOne({ email });
    if (adminExists) {
      console.log('Admin already exists:', email);
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create new admin with role set to 'admin'
    const admin = await AdminRole.create({
      name,
      email,
      password,
      phone,
      role: role || 'admin' // Default to 'admin' if not provided
    });

    console.log('Admin created successfully:', admin.email);

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        token: generateToken(admin._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login admin & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    console.log('Admin login attempt:', req.body.email);
    const { email, password } = req.body;

    // Find admin by email
    const admin = await AdminRole.findOne({ email });
    console.log('Admin found:', admin ? 'Yes' : 'No');

    // Check if admin exists and password matches
    if (admin && (await admin.matchPassword(password))) {
      console.log('Login successful for:', email);
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        token: generateToken(admin._id)
      });
    } else {
      console.log('Invalid credentials for:', email);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get admin profile
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const admin = await AdminRole.findById(req.user._id).select('-password');
    if (admin) {
      res.json(admin);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};