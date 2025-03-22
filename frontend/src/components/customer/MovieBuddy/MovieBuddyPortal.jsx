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
  faStar,
  faEnvelope,
  faPhone,
  faLock,
  faUserSecret,
  faCheck,
  faTimes,
  faCalendarAlt,
  faFilm,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';

const MovieBuddyPortal = ({ bookingData }) => {
  const navigate = useNavigate();
  
  const [preferences, setPreferences] = useState({
    gender: '',
    groupPreference: 'single',
    ageRange: ''
  });

  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [petName, setPetName] = useState('');
  const [showPetNameInput, setShowPetNameInput] = useState(false);

  const [privacySettings, setPrivacySettings] = useState({
    showName: true,
    showEmail: false,
    showPhone: false,
    petName: ''
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

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrivacyToggle = (setting) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleShowPersonalInfoChange = (value) => {
    setShowPersonalInfo(value);
    setShowPetNameInput(!value);
    if (value) {
      setPetName('');
    }
  };

  const handlePetNameChange = (e) => {
    setPrivacySettings(prev => ({
      ...prev,
      petName: e.target.value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Navigate to MovieBuddyList with user data
      navigate('/movie-buddies', {
        state: {
          ...bookingData,
          preferences
        }
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
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
    <div className="min-h-screen bg-deep-space text-silver py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-electric-purple/10 shadow rounded-lg p-6 border border-silver/10">
          <h2 className="text-2xl font-bold text-amber mb-6">Movie Buddy Portal</h2>
          
          <div className="space-y-6">
            {/* Movie Details Section */}
            <div className="bg-electric-purple/20 p-6 rounded-lg border border-silver/10">
              <h3 className="text-xl font-semibold text-amber mb-4">Movie Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faFilm} className="text-amber" />
                  <div>
                    <p className="text-silver/75">Movie Name</p>
                    <p className="text-silver font-medium">{bookingData.movieName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-amber" />
                  <div>
                    <p className="text-silver/75">Show Date</p>
                    <p className="text-silver font-medium">{bookingData.movieDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faClock} className="text-amber" />
                  <div>
                    <p className="text-silver/75">Show Time</p>
                    <p className="text-silver font-medium">{bookingData.movieTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="space-y-6">
              {/* Gender Preference */}
              <div>
                <label className="flex items-center space-x-2 text-amber mb-3">
                  <FontAwesomeIcon icon={faVenusMars} />
                  <span>Gender Preference</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {genderOptions.map((gender) => (
                    <button
                      key={gender}
                      onClick={() => handlePreferenceChange('gender', gender)}
                      className={`px-4 py-2 rounded-lg border transition-colors duration-200 flex items-center space-x-2
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
                <label className="flex items-center space-x-2 text-amber mb-3">
                  <FontAwesomeIcon icon={faUserGroup} />
                  <span>Group Preference</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handlePreferenceChange('groupPreference', 'single')}
                    className={`px-4 py-2 rounded-lg border transition-colors duration-200 flex items-center space-x-2
                      ${preferences.groupPreference === 'single' 
                        ? 'bg-amber text-deep-space border-amber' 
                        : 'bg-deep-space text-silver border-silver/20 hover:border-amber/50'}`}
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <span>Single</span>
                  </button>
                  <button
                    onClick={() => handlePreferenceChange('groupPreference', 'group')}
                    className={`px-4 py-2 rounded-lg border transition-colors duration-200 flex items-center space-x-2
                      ${preferences.groupPreference === 'group' 
                        ? 'bg-amber text-deep-space border-amber' 
                        : 'bg-deep-space text-silver border-silver/20 hover:border-amber/50'}`}
                  >
                    <FontAwesomeIcon icon={faUserGroup} />
                    <span>Group</span>
                  </button>
                </div>
              </div>

              {/* Age Range */}
              <div>
                <label className="flex items-center space-x-2 text-amber mb-3">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>Age Range</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {ageRangeOptions.map((age) => (
                    <button
                      key={age}
                      onClick={() => handlePreferenceChange('ageRange', age)}
                      className={`px-4 py-2 rounded-lg border transition-colors duration-200 flex items-center space-x-2
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

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-amber text-deep-space px-6 py-2 rounded-lg hover:bg-amber/90 focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2"
              >
                Find Movie Buddies
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieBuddyPortal; 