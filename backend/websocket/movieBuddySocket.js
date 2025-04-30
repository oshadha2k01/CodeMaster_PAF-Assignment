const WebSocket = require('ws');
const MovieBuddy = require('../models/MovieBuddy/MovieBuddyModel');

const setupMovieBuddyWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        const { type, email, movieDetails } = data;

        if (type === 'updateMovieDetails') {
          // Find the existing movie buddy by email
          const existingBuddy = await MovieBuddy.findOne({ email });

          if (existingBuddy) {
            // Update only the movie-specific fields
            existingBuddy.movieName = movieDetails.movieName;
            existingBuddy.movieDate = movieDetails.movieDate;
            existingBuddy.movieTime = movieDetails.movieTime;
            existingBuddy.bookingId = movieDetails.bookingId;
            existingBuddy.seatNumbers = movieDetails.seatNumbers;
            existingBuddy.updatedAt = new Date();

            await existingBuddy.save();

            // Broadcast the update to all connected clients
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'movieDetailsUpdated',
                  data: existingBuddy
                }));
              }
            });
          }
        }
      } catch (error) {
        console.error('WebSocket error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Error processing update'
        }));
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  return wss;
};

module.exports = setupMovieBuddyWebSocket; 