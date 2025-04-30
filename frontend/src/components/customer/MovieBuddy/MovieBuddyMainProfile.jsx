import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faFilm, 
  faCalendar, 
  faClock,
  faChair,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const MovieBuddyMainProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get stored email and phone from localStorage
        const storedEmail = localStorage.getItem('userEmail');
        const storedPhone = localStorage.getItem('userPhone');

        if (!storedEmail || !storedPhone) {
          setError('No profile data found. Please complete a booking first.');
          setLoading(false);
          return;
        }

        console.log('Fetching profile with:', { storedEmail, storedPhone });

        // Fetch profile from backend
        const response = await axios.get('http://localhost:3000/api/movie-buddies/profile', {
          params: {
            email: storedEmail,
            phone: storedPhone
          }
        });

        if (response.data) {
          setProfile(response.data);
        } else {
          setError('Profile not found. Please complete a booking first.');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response?.status === 404) {
          setError('Profile not found. Please complete a booking first.');
        } else {
          setError('Failed to load profile. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    navigate('/movie-buddy-form', { 
      state: { 
        isEditing: true,
        profileData: profile 
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-space text-silver flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-deep-space text-silver flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-amber mb-4">{error}</div>
          <button
            onClick={() => navigate('/movie-buddy-form')}
            className="px-4 py-2 bg-amber text-deep-space rounded-lg hover:bg-amber/80"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-deep-space text-silver flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-amber mb-4">No profile found</div>
          <button
            onClick={() => navigate('/movie-buddy-form')}
            className="px-4 py-2 bg-amber text-deep-space rounded-lg hover:bg-amber/80"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-space text-silver py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-electric-purple/10 rounded-xl p-8 border border-silver/10 shadow-lg">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-amber">My Movie Buddy Profile</h1>
              <button
                onClick={handleEditProfile}
                className="px-4 py-2 bg-amber text-deep-space rounded-lg hover:bg-amber/80 flex items-center"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="bg-deep-space/50 rounded-lg p-6">
                <h2 className="text-xl font-bold text-amber mb-6">Personal Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faUser} className="text-amber mr-3 w-5" />
                    <div>
                      <p className="text-silver/80">Name</p>
                      <p className="text-amber font-semibold">{profile.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faEnvelope} className="text-amber mr-3 w-5" />
                    <div>
                      <p className="text-silver/80">Email</p>
                      <p className="text-amber font-semibold">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faPhone} className="text-amber mr-3 w-5" />
                    <div>
                      <p className="text-silver/80">Phone</p>
                      <p className="text-amber font-semibold">{profile.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Movie Details */}
              <div className="bg-deep-space/50 rounded-lg p-6">
                <h2 className="text-xl font-bold text-amber mb-6">Current Movie Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faFilm} className="text-amber mr-3 w-5" />
                    <div>
                      <p className="text-silver/80">Movie</p>
                      <p className="text-amber font-semibold">{profile.movieName || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCalendar} className="text-amber mr-3 w-5" />
                    <div>
                      <p className="text-silver/80">Date</p>
                      <p className="text-amber font-semibold">{profile.movieDate || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faClock} className="text-amber mr-3 w-5" />
                    <div>
                      <p className="text-silver/80">Time</p>
                      <p className="text-amber font-semibold">{profile.movieTime || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faChair} className="text-amber mr-3 w-5" />
                    <div>
                      <p className="text-silver/80">Seats</p>
                      <p className="text-amber font-semibold">
                        {Array.isArray(profile.seatNumbers) 
                          ? profile.seatNumbers.join(', ') 
                          : profile.seatNumbers || 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Movie Preferences */}
              {profile.moviePreferences && profile.moviePreferences.length > 0 && (
                <div className="bg-deep-space/50 rounded-lg p-6 md:col-span-2">
                  <h2 className="text-xl font-bold text-amber mb-6">Movie Preferences</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.moviePreferences.map((preference, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-amber/20 text-amber rounded-full"
                      >
                        {preference}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {profile.privacySettings && (
                <div className="bg-deep-space/50 rounded-lg p-6 md:col-span-2">
                  <h2 className="text-xl font-bold text-amber mb-6">Privacy Settings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-deep-space rounded-lg">
                      <div>
                        <p className="text-amber font-semibold">Show Name</p>
                        <p className="text-silver/80 text-sm">Display your real name to other movie buddies</p>
                      </div>
                      <div className={`w-12 h-6 rounded-full ${profile.privacySettings.showName ? 'bg-amber' : 'bg-silver/20'}`} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-deep-space rounded-lg">
                      <div>
                        <p className="text-amber font-semibold">Show Email</p>
                        <p className="text-silver/80 text-sm">Share your email with other movie buddies</p>
                      </div>
                      <div className={`w-12 h-6 rounded-full ${profile.privacySettings.showEmail ? 'bg-amber' : 'bg-silver/20'}`} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-deep-space rounded-lg">
                      <div>
                        <p className="text-amber font-semibold">Show Phone</p>
                        <p className="text-silver/80 text-sm">Share your phone number with other movie buddies</p>
                      </div>
                      <div className={`w-12 h-6 rounded-full ${profile.privacySettings.showPhone ? 'bg-amber' : 'bg-silver/20'}`} />
                    </div>
                    {!profile.privacySettings.showName && profile.privacySettings.petName && (
                      <div className="flex items-center justify-between p-4 bg-deep-space rounded-lg">
                        <div>
                          <p className="text-amber font-semibold">Pet Name</p>
                          <p className="text-silver/80 text-sm">Your display name for other movie buddies</p>
                        </div>
                        <p className="text-amber">{profile.privacySettings.petName}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MovieBuddyMainProfile;