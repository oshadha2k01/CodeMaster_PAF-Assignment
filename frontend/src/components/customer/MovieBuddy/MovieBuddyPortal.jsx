import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faUser, 
  faUserGroup,
  faVenusMars,
  faCalendarAlt,
  faFilm,
  faClock,
  faChair,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';

const MovieBuddyPortal = ({ bookingData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentBookingData, setCurrentBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [preferences, setPreferences] = useState({
    gender: '',
    groupPreference: 'single',
    ageRange: ''
  });

  const [agreed, setAgreed] = useState(false);

  // Available interests
  const interestOptions = [
    'Action Movies', 'Comedy', 'Drama', 'Horror',
    'Sci-Fi', 'Animation', 'Thriller', 'Romance'
  ];

  // Gender options
  const genderOptions = ['Male', 'Female', 'Other'];
  
  // Age range options
  const ageRangeOptions = ['18-25', '26-35', '36-45', '46+'];

  useEffect(() => {
    // Get booking data from either props or location state
    const data = bookingData || location.state;
    if (data) {
      setCurrentBookingData(data);
      // If we have existing preferences, load them
      if (data.preferences) {
        setPreferences(data.preferences);
      }
    } else {
      toast.error('No booking data available');
      navigate('/now-showing');
    }
  }, [bookingData, location.state, navigate]);

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validate required fields
      if (!currentBookingData.movieName || !currentBookingData.movieDate || !currentBookingData.movieTime) {
        toast.error('Missing required movie details');
        return;
      }

      if (!preferences.gender) {
        toast.error('Please select a gender preference');
        return;
      }

      if (!preferences.ageRange) {
        toast.error('Please select an age range');
        return;
      }

      // Format the data according to the MovieBuddyModel schema
      const movieBuddyData = {
        movieName: currentBookingData.movieName,
        movieDate: currentBookingData.movieDate,
        movieTime: currentBookingData.movieTime,
        buddies: [{
          name: currentBookingData.name,
          age: Number(preferences.ageRange.split('-')[0]),
          gender: preferences.gender,
          email: currentBookingData.email,
          phone: currentBookingData.phone,
          bookingId: currentBookingData.bookingId,
          bookingDate: new Date().toISOString(),
          seatNumbers: currentBookingData.seatNumbers || [],
          moviePreferences: interestOptions.filter(option => preferences[option]),
          isGroup: preferences.groupPreference === 'group'
        }]
      };

      console.log('Sending data to server:', movieBuddyData);

      // Update movie buddy data
      const response = await axios.post('http://localhost:3000/api/movie-buddies/update', movieBuddyData);

      if (response.data.success) {
        // Show success message
        toast.success('Successfully saved your preferences! Finding movie buddies...', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #FFD700',
            borderRadius: '8px',
            padding: '12px 24px',
          },
        });

        // Get matching movie buddies
        const buddiesResponse = await axios.get('http://localhost:3000/api/bookings/movie-buddies', {
          params: {
            movieName: currentBookingData.movieName,
            movieDate: currentBookingData.movieDate,
            movieTime: currentBookingData.movieTime,
            excludeBookingId: currentBookingData.bookingId
          }
        });

        if (buddiesResponse.data.success) {
          // Navigate to MovieBuddyList with user data and matching buddies
          navigate('/movie-buddies', {
            state: {
              ...currentBookingData,
              preferences,
              matchingBuddies: buddiesResponse.data.data.buddies
            }
          });
        } else {
          toast.error('Failed to find matching movie buddies');
        }
      } else {
        toast.error(response.data.message || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!currentBookingData) {
    return (
      <div className="h-screen bg-deep-space text-silver flex items-center justify-center">
        <div className="text-2xl text-amber">Loading booking details...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-deep-space text-silver p-4">
      <div className="h-full max-w-5xl mx-auto">
        <div className="h-full bg-electric-purple/10 shadow rounded-lg p-6 border border-silver/10 flex flex-col">
          <h2 className="text-2xl font-bold text-amber mb-4">Movie Buddy Portal</h2>
          
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
            {/* Left Column - Movie Details and Preferences */}
            <div className="space-y-4 overflow-y-auto pr-2">
              {/* Movie Details Section */}
              <div className="bg-electric-purple/20 p-4 rounded-lg border border-silver/10">
                <h3 className="text-lg font-semibold text-amber mb-3">Movie Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 bg-deep-space/30 p-2 rounded-lg">
                    <FontAwesomeIcon icon={faFilm} className="text-amber" />
                    <div>
                      <p className="text-silver/75 text-xs">Movie Name</p>
                      <p className="text-silver text-sm font-medium">{currentBookingData.movieName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-deep-space/30 p-2 rounded-lg">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-amber" />
                    <div>
                      <p className="text-silver/75 text-xs">Show Date</p>
                      <p className="text-silver text-sm font-medium">{currentBookingData.movieDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-deep-space/30 p-2 rounded-lg">
                    <FontAwesomeIcon icon={faClock} className="text-amber" />
                    <div>
                      <p className="text-silver/75 text-xs">Show Time</p>
                      <p className="text-silver text-sm font-medium">{currentBookingData.movieTime}</p>
                    </div>
                  </div>
                  {currentBookingData.seatNumbers && (
                    <div className="flex items-center space-x-2 bg-deep-space/30 p-2 rounded-lg">
                      <FontAwesomeIcon icon={faChair} className="text-amber" />
                      <div>
                        <p className="text-silver/75 text-xs">Seat Numbers</p>
                        <p className="text-silver text-sm font-medium">{currentBookingData.seatNumbers.join(', ')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Preferences Section */}
              <div className="space-y-4">
                {/* Gender Preference */}
                <div>
                  <label className="flex items-center space-x-2 text-amber mb-2">
                    <FontAwesomeIcon icon={faVenusMars} />
                    <span className="text-sm">Gender Preference</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {genderOptions.map((gender) => (
                      <button
                        key={gender}
                        onClick={() => handlePreferenceChange('gender', gender)}
                        className={`px-3 py-1.5 rounded-lg border transition-colors duration-200 flex items-center space-x-2 text-sm
                          ${preferences.gender === gender 
                            ? 'bg-amber text-deep-space border-amber' 
                            : 'bg-deep-space text-silver border-silver/20 hover:border-amber/50'}`}
                      >
                        <span>{gender}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Group Preference */}
                <div>
                  <label className="flex items-center space-x-2 text-amber mb-2">
                    <FontAwesomeIcon icon={faUserGroup} />
                    <span className="text-sm">Group Preference</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handlePreferenceChange('groupPreference', 'single')}
                      className={`px-3 py-1.5 rounded-lg border transition-colors duration-200 flex items-center space-x-2 text-sm
                        ${preferences.groupPreference === 'single' 
                          ? 'bg-amber text-deep-space border-amber' 
                          : 'bg-deep-space text-silver border-silver/20 hover:border-amber/50'}`}
                    >
                      <FontAwesomeIcon icon={faUser} className="text-xs" />
                      <span>Single</span>
                    </button>
                    <button
                      onClick={() => handlePreferenceChange('groupPreference', 'group')}
                      className={`px-3 py-1.5 rounded-lg border transition-colors duration-200 flex items-center space-x-2 text-sm
                        ${preferences.groupPreference === 'group' 
                          ? 'bg-amber text-deep-space border-amber' 
                          : 'bg-deep-space text-silver border-silver/20 hover:border-amber/50'}`}
                    >
                      <FontAwesomeIcon icon={faUserGroup} className="text-xs" />
                      <span>Group</span>
                    </button>
                  </div>
                </div>

                {/* Age Range */}
                <div>
                  <label className="flex items-center space-x-2 text-amber mb-2">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span className="text-sm">Age Range</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ageRangeOptions.map((age) => (
                      <button
                        key={age}
                        onClick={() => handlePreferenceChange('ageRange', age)}
                        className={`px-3 py-1.5 rounded-lg border transition-colors duration-200 flex items-center space-x-2 text-sm
                          ${preferences.ageRange === age 
                            ? 'bg-amber text-deep-space border-amber' 
                            : 'bg-deep-space text-silver border-silver/20 hover:border-amber/50'}`}
                      >
                        <span>{age}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Terms and Actions */}
            <div className="flex flex-col justify-between">
              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2 bg-electric-purple/20 p-4 rounded-lg border border-silver/10">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="rounded border-silver/20 text-amber focus:ring-amber"
                />
                <label htmlFor="terms" className="text-silver text-sm">
                  I agree to share my information with potential movie buddies
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-silver hover:text-amber focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!agreed || isLoading}
                  className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2
                    ${isLoading || !agreed
                      ? 'bg-amber/50 text-deep-space cursor-not-allowed'
                      : 'bg-amber text-deep-space hover:bg-amber/90'}`}
                >
                  {isLoading ? (
                    <span className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                      <span>Finding Buddies...</span>
                    </span>
                  ) : (
                    'Find Movie Buddies'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieBuddyPortal;