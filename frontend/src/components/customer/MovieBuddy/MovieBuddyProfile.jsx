import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser,
  faUserGroup,
  faTicketAlt,
  faCalendarAlt,
  faClock,
  faChair,
  faEnvelope,
  faPhone,
  faUserSecret,
  faEyeSlash,
  faArrowLeft,
  faVenusMars,
  faBirthdayCake,
  faTicket,
  faUsers,
  faUserFriends
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
//import CustomerNavBar from '../../navbar/MainNavBar';
import MovieBuddyNavBar from '../../navbar/MovieBuddyNavBar';

const MovieBuddyProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [movieBuddyData, setMovieBuddyData] = useState(null);

  useEffect(() => {
    const fetchMovieBuddyData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/movie-buddies/all');
        
        if (response.data.success) {
          console.log('Fetched movie buddy data:', response.data.data);
          
          // Find the movie group matching our criteria
          const userData = response.data.data.find(group => 
            group.movieName === location.state?.movieName &&
            group.movieDate === location.state?.movieDate &&
            group.movieTime === location.state?.movieTime
          );
          
          if (userData && userData.buddies) {
            // Find the specific buddy within the group
            // Use more flexible matching to handle potential data inconsistencies
            const buddyData = userData.buddies.find(buddy => {
              const nameMatch = buddy.name === location.state?.name;
              const ageMatch = buddy.age === location.state?.age || 
                               (typeof buddy.age === 'number' && typeof location.state?.age === 'string' && 
                                buddy.age === parseInt(location.state?.age));
              const genderMatch = buddy.gender === location.state?.gender;
              
              return nameMatch && (ageMatch || genderMatch);
            });
            
            if (buddyData) {
              console.log('Found buddy data:', buddyData);
              setMovieBuddyData({
                ...userData,
                buddyDetails: buddyData
              });
            } else {
              console.error('No matching buddy found within movie group', userData);
              toast.error('Movie buddy data not found');
              navigate('/movie-buddies');
            }
          } else {
            console.error('No matching movie group found', location.state);
            toast.error('Failed to load movie buddy data');
            navigate('/movie-buddies');
          }
        } else {
          toast.error('Failed to load movie buddy data');
          navigate('/movie-buddies');
        }
      } catch (error) {
        console.error('Error fetching movie buddy data:', error);
        toast.error(error.response?.data?.message || 'Failed to load movie buddy data');
        navigate('/movie-buddies');
      } finally {
        setLoading(false);
      }
    };

    if (location.state?.movieName && location.state?.name) {
      fetchMovieBuddyData();
    } else {
      navigate('/movie-buddies');
    }
  }, [location.state, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-space text-silver flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber"></div>
      </div>
    );
  }

  if (!movieBuddyData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-deep-space text-silver">
      <MovieBuddyNavBar />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back Button */}
          <button
            onClick={() => navigate('/movie-buddies')}
            className="mb-6 flex items-center text-amber hover:text-amber/80 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Movie Buddies
          </button>

          {/* Profile Card */}
          <div className="bg-electric-purple/10 rounded-xl p-8 border border-silver/10 shadow-lg">
            {/* Movie Details */}
            <div className="bg-electric-purple/20 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faTicketAlt} className="text-amber text-xl" />
                  <div>
                    <p className="text-silver/75">Movie</p>
                    <p className="text-xl font-semibold text-amber">{movieBuddyData.movieName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-amber text-xl" />
                  <div>
                    <p className="text-silver/75">Date</p>
                    <p className="text-xl font-semibold text-amber">{formatDate(movieBuddyData.movieDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faClock} className="text-amber text-xl" />
                  <div>
                    <p className="text-silver/75">Time</p>
                    <p className="text-xl font-semibold text-amber">{movieBuddyData.movieTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="bg-electric-purple/20 rounded-lg p-6 mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`p-4 rounded-full ${movieBuddyData.buddyDetails.isGroup ? 'bg-amber/20' : 'bg-electric-purple/20'}`}>
                  <FontAwesomeIcon 
                    icon={movieBuddyData.buddyDetails.isGroup ? faUserGroup : faUser} 
                    className={`${movieBuddyData.buddyDetails.isGroup ? 'text-amber' : 'text-electric-purple'} text-2xl`}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-amber">
                    {movieBuddyData.buddyDetails.privacySettings?.showName 
                      ? movieBuddyData.buddyDetails.name 
                      : movieBuddyData.buddyDetails.privacySettings?.petName || 'Anonymous'}
                  </h2>
                  <p className="text-silver/75">
                    {movieBuddyData.buddyDetails.isGroup ? 'Group Booking' : 'Single Booking'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-amber">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faBirthdayCake} className="text-amber" />
                      <div>
                        <p className="text-silver/75 text-sm">Age</p>
                        <p className="text-silver">{movieBuddyData.buddyDetails.age}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faVenusMars} className="text-amber" />
                      <div>
                        <p className="text-silver/75 text-sm">Gender</p>
                        <p className="text-silver">{movieBuddyData.buddyDetails.gender}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-amber">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faEnvelope} className="text-amber" />
                      <div>
                        <p className="text-silver/75 text-sm">Email</p>
                        <p className="text-silver">
                          {movieBuddyData.buddyDetails.privacySettings?.showEmail 
                            ? movieBuddyData.buddyDetails.email 
                            : 'Email hidden'}
                          {!movieBuddyData.buddyDetails.privacySettings?.showEmail && (
                            <FontAwesomeIcon icon={faEyeSlash} className="ml-2 text-amber" title="Email hidden" />
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faPhone} className="text-amber" />
                      <div>
                        <p className="text-silver/75 text-sm">Phone</p>
                        <p className="text-silver">
                          {movieBuddyData.buddyDetails.privacySettings?.showPhone 
                            ? movieBuddyData.buddyDetails.phone 
                            : 'Phone hidden'}
                          {!movieBuddyData.buddyDetails.privacySettings?.showPhone && (
                            <FontAwesomeIcon icon={faEyeSlash} className="ml-2 text-amber" title="Phone hidden" />
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-amber">Booking Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-amber" />
                      <div>
                        <p className="text-silver/75 text-sm">Booked On</p>
                        <p className="text-silver">{formatDate(movieBuddyData.buddyDetails.bookingDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seat Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-amber">Seat Information</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(movieBuddyData.buddyDetails.seatNumbers) && 
                      movieBuddyData.buddyDetails.seatNumbers.map((seat, index) => (
                        <span
                          key={index}
                          className="bg-amber/20 text-amber px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          <FontAwesomeIcon icon={faChair} className="mr-2" />
                          {seat}
                        </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MovieBuddyProfile;