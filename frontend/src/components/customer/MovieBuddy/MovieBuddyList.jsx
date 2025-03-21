import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faChair, 
  faArrowLeft,
  faUserGroup,
  faSpinner,
  faUser,
  faCalendarAlt,
  faClock,
  faTicketAlt
} from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const MovieBuddyList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movieName, movieDate, movieTime, excludeBookingId, userName } = location.state || {};
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'single', 'group'
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (movieName && movieDate && movieTime) {
      fetchMovieBuddies();
      // If userName is not provided in location state, try to fetch it from the booking
      if (!userName && excludeBookingId) {
        fetchCurrentUser();
      }
    } else {
      navigate('/now-showing');
    }
  }, [movieName, movieDate, movieTime, excludeBookingId, navigate, userName]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/bookings/${excludeBookingId}`);
      if (response.data) {
        setCurrentUser(response.data.name);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      setCurrentUser('Guest');
    }
  };

  const fetchMovieBuddies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First, update the movie buddies in the database
      await axios.post('http://localhost:3000/api/movie-buddies/update', {
        movieName,
        movieDate,
        movieTime
      });

      // Then fetch the updated movie buddies
      const response = await axios.get('http://localhost:3000/api/movie-buddies/find', {
        params: {
          movieName,
          movieDate,
          movieTime,
          excludeBookingId
        }
      });

      if (response.data.success) {
        setBuddies(response.data.data.buddies);
      } else {
        setError('No movie buddies found');
      }
    } catch (error) {
      console.error('Error fetching movie buddies:', error);
      setError('Failed to load movie buddies');
      toast.error('Failed to load movie buddies');
    } finally {
      setLoading(false);
    }
  };

  const filteredBuddies = buddies.filter(buddy => {
    if (activeTab === 'all') return true;
    if (activeTab === 'single') return !buddy.isGroup;
    if (activeTab === 'group') return buddy.isGroup;
    return true;
  });

  const renderSeatBadges = (seatNumbers) => {
    const seats = Array.isArray(seatNumbers) ? seatNumbers : [seatNumbers];
    return (
      <div className="flex flex-wrap gap-2">
        {seats.map((seat, index) => (
          <span
            key={index}
            className="bg-amber/20 text-amber px-3 py-1 rounded-full text-sm flex items-center"
          >
            <FontAwesomeIcon icon={faChair} className="mr-2" />
            {seat}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-deep-space text-silver py-12">
      <div className="container mx-auto px-4">
        <Toaster position="top-right" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-electric-purple/10 rounded-xl p-8 border border-silver/10 shadow-lg">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="text-silver hover:text-amber transition-colors"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
                </button>
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faUsers} className="text-amber text-2xl" />
                  <h1 className="text-3xl font-bold text-amber">
                    Hello! {userName || currentUser || 'Guest'}, your Movie Buddies
                  </h1>
                </div>
              </div>
            </div>

            {/* Movie Info Section */}
            <div className="bg-electric-purple/20 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faTicketAlt} className="text-amber text-xl" />
                  <div>
                    <p className="text-silver/75">Movie</p>
                    <p className="text-xl font-semibold text-amber">{movieName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-amber text-xl" />
                  <div>
                    <p className="text-silver/75">Date</p>
                    <p className="text-xl font-semibold text-amber">{movieDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faClock} className="text-amber text-xl" />
                  <div>
                    <p className="text-silver/75">Time</p>
                    <p className="text-xl font-semibold text-amber">{movieTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'all'
                    ? 'bg-amber text-deep-space'
                    : 'bg-electric-purple/20 text-silver hover:bg-electric-purple/30'
                }`}
              >
                All Buddies
              </button>
              <button
                onClick={() => setActiveTab('single')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'single'
                    ? 'bg-amber text-deep-space'
                    : 'bg-electric-purple/20 text-silver hover:bg-electric-purple/30'
                }`}
              >
                Single Buddies
              </button>
              <button
                onClick={() => setActiveTab('group')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'group'
                    ? 'bg-amber text-deep-space'
                    : 'bg-electric-purple/20 text-silver hover:bg-electric-purple/30'
                }`}
              >
                Group Buddies
              </button>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <FontAwesomeIcon icon={faSpinner} spin className="text-amber text-2xl" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-scarlet">
                <p>{error}</p>
              </div>
            ) : filteredBuddies.length === 0 ? (
              <div className="text-center py-8 text-silver">
                <p>No movie buddies found for this show time.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredBuddies.map((buddy, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-electric-purple/10 rounded-lg p-6 border border-silver/10 hover:border-amber/30 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${buddy.isGroup ? 'bg-amber/20' : 'bg-electric-purple/20'}`}>
                          <FontAwesomeIcon 
                            icon={buddy.isGroup ? faUserGroup : faUser} 
                            className={`${buddy.isGroup ? 'text-amber' : 'text-electric-purple'} text-xl`}
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-silver">{buddy.name}</h3>
                          <p className="text-silver/75">{buddy.email}</p>
                          <p className="text-sm text-silver/60 mt-1">
                            Booked on {new Date(buddy.bookingDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-sm font-medium mb-2 ${
                          buddy.isGroup ? 'text-amber' : 'text-electric-purple'
                        }`}>
                          {buddy.isGroup ? 'Group Booking' : 'Single Booking'}
                        </span>
                        {renderSeatBadges(buddy.seatNumbers)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MovieBuddyList;