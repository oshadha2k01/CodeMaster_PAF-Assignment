import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShield, 
  faUsers, 
  faUser, 
  faEye, 
  faEyeSlash, 
  faArrowRight,
  faUserGroup,
  faVenusMars,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';

const MovieBuddyPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;
  
  const [preferences, setPreferences] = useState({
    gender: '',
    groupPreference: 'single', // 'single' or 'group'
    interests: [],
    ageRange: '18-25'
  });

  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [petName, setPetName] = useState('');
  const [showPetNameInput, setShowPetNameInput] = useState(false);

  const [privacySettings, setPrivacySettings] = useState({
    showName: false,
    showEmail: false,
    showPhone: false
  });

  const [agreed, setAgreed] = useState(false);

  // Available interests
  const interestOptions = [
    'Action Movies', 'Comedy', 'Drama', 'Horror',
    'Sci-Fi', 'Animation', 'Thriller', 'Romance'
  ];

  // Age range options
  const ageRangeOptions = [
    '18-25', '26-35', '36-45', '46+'
  ];

  const handleInterestToggle = (interest) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handlePrivacyToggle = (field) => {
    setPrivacySettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleShowPersonalInfoChange = (value) => {
    setShowPersonalInfo(value);
    setShowPetNameInput(!value);
    if (value) {
      setPetName('');
    }
  };

  const handleContinue = async () => {
    if (!agreed) {
      toast.error('Please agree to the privacy terms to continue');
      return;
    }

    if (!preferences.gender) {
      toast.error('Please select your gender');
      return;
    }

    if (preferences.interests.length === 0) {
      toast.error('Please select at least one interest');
      return;
    }

    if (!showPersonalInfo && !petName) {
      toast.error('Please enter a pet name');
      return;
    }

    try {
      // Prepare the movie buddy data
      const movieBuddyData = {
        movieName: bookingData.movieName,
        movieDate: bookingData.movieDate,
        movieTime: bookingData.movieTime,
        preferences: {
          ...preferences,
          showPersonalInfo
        },
        personalInfo: showPersonalInfo ? {
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          ...privacySettings
        } : {
          petName
        }
      };

      // Save to database
      await axios.post('http://localhost:3000/api/movie-buddies', movieBuddyData);

      // Navigate to movie buddies list
      navigate('/movie-buddies', { state: movieBuddyData });
      
    } catch (error) {
      console.error('Error saving movie buddy data:', error);
      toast.error('Failed to save preferences');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-deep-space text-silver flex items-center justify-center">
        <div className="text-2xl text-amber">Invalid access. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-space text-silver py-12">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-electric-purple/10 rounded-xl p-8 border border-silver/10 shadow-lg">
            {/* Booking Details Section */}
            <div className="mb-8 p-4 bg-deep-space/50 rounded-lg">
              <h2 className="text-xl font-bold text-amber mb-4">Your Movie Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-silver/80">Movie</p>
                  <p className="text-amber font-semibold">{bookingData.movieName}</p>
                </div>
                <div>
                  <p className="text-silver/80">Date</p>
                  <p className="text-amber font-semibold">{bookingData.movieDate}</p>
                </div>
                <div>
                  <p className="text-silver/80">Time</p>
                  <p className="text-amber font-semibold">{bookingData.movieTime}</p>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="space-y-6 mb-8">
              <h2 className="text-2xl font-bold text-amber flex items-center">
                <FontAwesomeIcon icon={faStar} className="mr-3" />
                Your Preferences
              </h2>

              {/* Gender Selection */}
              <div className="space-y-2">
                <label className="block text-lg font-semibold text-amber">Gender</label>
                <div className="flex space-x-4">
                  {['Male', 'Female', 'Other'].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setPreferences(prev => ({ ...prev, gender }))}
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        preferences.gender === gender
                          ? 'bg-amber text-deep-space'
                          : 'bg-deep-space/50 text-silver hover:bg-deep-space/70'
                      }`}
                    >
                      <FontAwesomeIcon icon={faVenusMars} className="mr-2" />
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              {/* Group Preference */}
              <div className="space-y-2">
                <label className="block text-lg font-semibold text-amber">Preferred Company</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, groupPreference: 'single' }))}
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      preferences.groupPreference === 'single'
                        ? 'bg-amber text-deep-space'
                        : 'bg-deep-space/50 text-silver hover:bg-deep-space/70'
                    }`}
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Single Buddy
                  </button>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, groupPreference: 'group' }))}
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      preferences.groupPreference === 'group'
                        ? 'bg-amber text-deep-space'
                        : 'bg-deep-space/50 text-silver hover:bg-deep-space/70'
                    }`}
                  >
                    <FontAwesomeIcon icon={faUserGroup} className="mr-2" />
                    Group Watch
                  </button>
                </div>
              </div>

              {/* Age Range */}
              <div className="space-y-2">
                <label className="block text-lg font-semibold text-amber">Age Range</label>
                <div className="flex flex-wrap gap-2">
                  {ageRangeOptions.map((range) => (
                    <button
                      key={range}
                      onClick={() => setPreferences(prev => ({ ...prev, ageRange: range }))}
                      className={`px-4 py-2 rounded-lg ${
                        preferences.ageRange === range
                          ? 'bg-amber text-deep-space'
                          : 'bg-deep-space/50 text-silver hover:bg-deep-space/70'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Movie Interests */}
              <div className="space-y-2">
                <label className="block text-lg font-semibold text-amber">Movie Interests</label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-4 py-2 rounded-lg ${
                        preferences.interests.includes(interest)
                          ? 'bg-amber text-deep-space'
                          : 'bg-deep-space/50 text-silver hover:bg-deep-space/70'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="space-y-6 mb-8">
              <h2 className="text-2xl font-bold text-amber flex items-center">
                <FontAwesomeIcon icon={faShield} className="mr-3" />
                Privacy Settings
              </h2>

              <div className="space-y-4">
                <p className="text-lg text-silver">Would you like to share your personal details with movie buddies?</p>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleShowPersonalInfoChange(true)}
                    className={`px-6 py-3 rounded-lg flex items-center ${
                      showPersonalInfo
                        ? 'bg-amber text-deep-space'
                        : 'bg-deep-space/50 text-silver hover:bg-deep-space/70'
                    }`}
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    Yes, share my details
                  </button>
                  <button
                    onClick={() => handleShowPersonalInfoChange(false)}
                    className={`px-6 py-3 rounded-lg flex items-center ${
                      !showPersonalInfo
                        ? 'bg-amber text-deep-space'
                        : 'bg-deep-space/50 text-silver hover:bg-deep-space/70'
                    }`}
                  >
                    <FontAwesomeIcon icon={faEyeSlash} className="mr-2" />
                    No, use a pet name
                  </button>
                </div>

                {showPersonalInfo && (
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between p-4 bg-deep-space/50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-amber">Display Name</h3>
                        <p className="text-sm text-silver/80">Your name: {bookingData.name}</p>
                      </div>
                      <button
                        onClick={() => handlePrivacyToggle('showName')}
                        className={`p-2 rounded-lg ${privacySettings.showName ? 'bg-emerald-500/20 text-emerald-400' : 'bg-scarlet/20 text-scarlet'}`}
                      >
                        <FontAwesomeIcon icon={privacySettings.showName ? faEye : faEyeSlash} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-deep-space/50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-amber">Email Address</h3>
                        <p className="text-sm text-silver/80">Your email: {bookingData.email}</p>
                      </div>
                      <button
                        onClick={() => handlePrivacyToggle('showEmail')}
                        className={`p-2 rounded-lg ${privacySettings.showEmail ? 'bg-emerald-500/20 text-emerald-400' : 'bg-scarlet/20 text-scarlet'}`}
                      >
                        <FontAwesomeIcon icon={privacySettings.showEmail ? faEye : faEyeSlash} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-deep-space/50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-amber">Phone Number</h3>
                        <p className="text-sm text-silver/80">Your phone: {bookingData.phone}</p>
                      </div>
                      <button
                        onClick={() => handlePrivacyToggle('showPhone')}
                        className={`p-2 rounded-lg ${privacySettings.showPhone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-scarlet/20 text-scarlet'}`}
                      >
                        <FontAwesomeIcon icon={privacySettings.showPhone ? faEye : faEyeSlash} />
                      </button>
                    </div>
                  </div>
                )}

                {showPetNameInput && (
                  <div className="mt-4">
                    <label className="block text-lg font-semibold text-amber mb-2">Choose a Pet Name</label>
                    <input
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      placeholder="Enter your pet name"
                      className="w-full px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Privacy Agreement */}
            <div className="mt-8">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm text-silver/80">
                  I understand and agree that my selected preferences and information will be used to find compatible movie buddies.
                  I can modify these settings at any time.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={handleCancel}
                className="px-6 py-2 text-silver hover:text-amber"
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                className="px-6 py-2 bg-amber text-deep-space rounded-lg hover:bg-amber/80 flex items-center"
              >
                Continue
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MovieBuddyPortal; 