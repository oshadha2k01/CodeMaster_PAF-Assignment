const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require("cors");
const http = require('http');
const WebSocket = require('ws');
const path = require('path'); // Add path module for file handling
const movieBuddyRoutes = require('./routes/MovieBuddy/MovieBuddyRoutes');
const setupMovieBuddyWebSocket = require('./websocket/movieBuddySocket');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

const app = express();
const server = http.createServer(app);
const wss = setupMovieBuddyWebSocket(server);

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for frontend requests

// Serve uploaded images statically - Moving this BEFORE the API routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import the main router from index.js
const mainRouter = require('././routes/index.js');

// Use the main router for all API routes
app.use('/api', mainRouter);

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'updateMovieDetails') {
        const { email, movieDetails } = data; // Fix parameter name from newMovieDetails to movieDetails
        
        // Update movie details in database
        const MovieBuddy = require('./models/MovieBuddy/MovieBuddyModel');
        const updatedBuddy = await MovieBuddy.findOneAndUpdate(
          { email },
          {
            movieName: movieDetails.movieName,
            movieDate: movieDetails.movieDate,
            movieTime: movieDetails.movieTime,
            bookingId: movieDetails.bookingId,
            seatNumbers: movieDetails.seatNumbers,
            bookingDate: new Date()
          },
          { new: true }
        );

        // Broadcast update to all connected clients
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'movieDetailsUpdated',
              data: updatedBuddy
            }));
          }
        });
      }
    } catch (error) {
      console.error('WebSocket error:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Routes
app.use('/api/movie-buddies', movieBuddyRoutes);

// Connect to MongoDB
mongoose.connect(uri)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Create the 'uploads' directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

module.exports = { wss }; // Export WebSocket server for use in other files
