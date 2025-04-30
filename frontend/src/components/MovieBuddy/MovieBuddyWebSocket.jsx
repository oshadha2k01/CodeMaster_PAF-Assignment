import { useEffect, useRef } from 'react';

const MovieBuddyWebSocket = ({ onMovieDetailsUpdated }) => {
  const ws = useRef(null);

  useEffect(() => {
    // Connect to WebSocket server
    ws.current = new WebSocket('ws://localhost:3000');

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'movieDetailsUpdated') {
        onMovieDetailsUpdated(data.data);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [onMovieDetailsUpdated]);

  const updateMovieDetails = (email, movieDetails) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'updateMovieDetails',
        email,
        movieDetails
      }));
    }
  };

  return null; // This component doesn't render anything
};

export default MovieBuddyWebSocket; 