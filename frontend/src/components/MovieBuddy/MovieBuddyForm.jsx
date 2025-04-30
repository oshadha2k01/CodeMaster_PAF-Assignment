import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieBuddyWebSocket from './MovieBuddyWebSocket';

const MovieBuddyForm = () => {
  const [formData, setFormData] = useState({
    movieName: '',
    movieDate: '',
    movieTime: '',
    buddies: [{
      name: '',
      age: '',
      gender: '',
      email: '',
      phone: '',
      bookingId: '',
      seatNumbers: [],
      moviePreferences: [],
      privacySettings: {
        showName: true,
        showEmail: false,
        showPhone: false,
        petName: ''
      }
    }]
  });

  const handleMovieDetailsUpdated = (updatedData) => {
    // Update the form data with the new movie details
    setFormData(prevData => ({
      ...prevData,
      movieName: updatedData.movieName,
      movieDate: updatedData.movieDate,
      movieTime: updatedData.movieTime,
      buddies: prevData.buddies.map(buddy => ({
        ...buddy,
        bookingId: updatedData.bookingId,
        seatNumbers: updatedData.seatNumbers
      }))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First, check if the user already exists
      const checkResponse = await axios.post('http://localhost:3000/api/movie-buddies/check-existing', {
        email: formData.buddies[0].email
      });

      if (checkResponse.data.exists) {
        // If user exists, update movie details via WebSocket
        const movieDetails = {
          movieName: formData.movieName,
          movieDate: formData.movieDate,
          movieTime: formData.movieTime,
          bookingId: formData.buddies[0].bookingId,
          seatNumbers: formData.buddies[0].seatNumbers
        };

        // Use the WebSocket to update movie details
        const ws = new WebSocket('ws://localhost:3000');
        ws.onopen = () => {
          ws.send(JSON.stringify({
            type: 'updateMovieDetails',
            email: formData.buddies[0].email,
            movieDetails
          }));
          ws.close();
        };
      } else {
        // If user doesn't exist, create new entry
        const response = await axios.post('http://localhost:3000/api/movie-buddies/update', formData);
        console.log('Movie buddy created:', response.data);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <>
      <MovieBuddyWebSocket onMovieDetailsUpdated={handleMovieDetailsUpdated} />
      <form onSubmit={handleSubmit}>
        {/* Your existing form fields */}
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default MovieBuddyForm; 