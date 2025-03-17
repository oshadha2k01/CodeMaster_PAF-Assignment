const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const path = require('path'); // Add path module for file handling

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for frontend requests

// Serve uploaded images statically - Moving this BEFORE the API routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import the main router from index.js
const mainRouter = require('./index');

// Use the main router for all API routes
app.use('/api', mainRouter);

// Connect to MongoDB
mongoose.connect(uri)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

// Start the server
app.listen(PORT, () => {
    console.log('Server is running on port 3000');
});

// Create the 'uploads' directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}