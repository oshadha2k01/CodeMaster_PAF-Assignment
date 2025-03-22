import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { 
  faUser, 
  faCalendar, 
  faClock, 
  faFilm,
  faArrowRight,
  faArrowLeft,
  faUserSecret,
  faEnvelope,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import { Switch } from '@headlessui/react';

const MovieBuddyForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [formData, setFormData] = useState({
    name: bookingData.name || '',
    age: '',
    gender: '',
    preferredGroupSize: '1-2',
    moviePreferences: []
  });

  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    showName: true,
    showEmail: false,
    showPhone: false,
    petName: ''
  });

  const movieGenres = [
    'Action', 'Comedy', 'Drama', 'Horror',
    'Sci-Fi', 'Animation', 'Thriller', 'Romance',
    'Documentary', 'Family', 'Fantasy', 'Mystery'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMoviePreferenceToggle = (genre) => {
    setFormData(prev => ({
      ...prev,
      moviePreferences: prev.moviePreferences.includes(genre)
        ? prev.moviePreferences.filter(g => g !== genre)
        : [...prev.moviePreferences, genre]
    }));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          toast.error('Please enter your name');
          return false;
        }
        if (!formData.age || formData.age < 18) {
          toast.error('Please enter a valid age (18 or above)');
          return false;
        }
        if (!formData.gender) {
          toast.error('Please select your gender');
          return false;
        }
        break;
      case 2:
        if (formData.moviePreferences.length === 0) {
          toast.error('Please select at least one movie genre preference');
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.gender) {
        toast.error('Please select your gender');
        return;
      }

      if (!bookingData.bookingId) {
        toast.error('Invalid booking information');
        return;
      }

      // Validate privacy settings
      if (!privacySettings.showName && !privacySettings.petName.trim()) {
        toast.error('Please enter a pet name since you chose not to share your real name');
        return;
      }

      // Format the data according to the MovieBuddyModel schema
      const movieBuddyData = {
        movieName: bookingData.movieName,
        movieDate: bookingData.movieDate,
        movieTime: bookingData.movieTime,
        buddies: [{
          name: bookingData.name, // Always include real name from booking
          age: Number(formData.age),
          gender: formData.gender,
          email: privacySettings.showEmail ? bookingData.email : '', // Only include if sharing
          phone: privacySettings.showPhone ? bookingData.phone : '', // Only include if sharing
          bookingId: bookingData.bookingId,
          bookingDate: new Date().toISOString(),
          seatNumbers: bookingData.seatNumbers || [],
          moviePreferences: formData.moviePreferences,
          privacySettings: {
            showName: privacySettings.showName,
            showEmail: privacySettings.showEmail,
            showPhone: privacySettings.showPhone,
            petName: privacySettings.showName ? '' : privacySettings.petName // Only include if not showing real name
          }
        }]
      };

      console.log('Sending data to server:', movieBuddyData);

      const response = await axios.post('http://localhost:3000/api/movie-buddies/update', movieBuddyData);

      if (response.data.success) {
        toast.success('Your preferences have been saved successfully!');
        // Navigate to MovieBuddyList with user data
        navigate('/movie-buddies', {
          state: {
            ...bookingData,
            privacySettings,
            preferences: {
              gender: formData.gender,
              age: formData.age,
              moviePreferences: formData.moviePreferences
            }
          }
        });
      } else {
        toast.error(response.data.message || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        toast.error(error.response.data.message || 'An error occurred while saving your preferences');
      } else {
        toast.error('An error occurred while saving your preferences');
      }
    }
  };

  // Helper function to determine age range
  const getAgeRange = (age) => {
    if (age >= 18 && age <= 25) return '18-25';
    if (age >= 26 && age <= 35) return '26-35';
    if (age >= 36 && age <= 45) return '36-45';
    return '46+';
  };

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Name Privacy */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-4 bg-deep-space/50 rounded-lg">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faUser} className="text-amber mr-3" />
              <div>
                <p className="font-semibold text-amber">Display Name</p>
                <p className="text-sm text-silver/80">Show your name to other movie-goers</p>
              </div>
            </div>
            <Switch
              checked={privacySettings.showName}
              onChange={(checked) => setPrivacySettings(prev => ({ ...prev, showName: checked }))}
              className={`${
                privacySettings.showName ? 'bg-amber' : 'bg-silver/20'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2`}
            >
              <span
                className={`${
                  privacySettings.showName ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-deep-space transition-transform`}
              />
            </Switch>
          </div>

          {!privacySettings.showName && (
            <div className="p-4 bg-deep-space/50 rounded-lg ml-4">
              <div className="flex items-center mb-2">
                <FontAwesomeIcon icon={faUserSecret} className="text-amber mr-3" />
                <p className="font-semibold text-amber">Pet Name</p>
              </div>
              <p className="text-sm text-silver/80 mb-3">Enter a fun name to be displayed to others</p>
              <input
                type="text"
                value={privacySettings.petName}
                onChange={(e) => setPrivacySettings(prev => ({ ...prev, petName: e.target.value }))}
                className="w-full px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                placeholder="Enter your pet name"
                required
              />
            </div>
          )}
        </div>

        {/* Email Privacy */}
        <div className="flex items-center justify-between p-4 bg-deep-space/50 rounded-lg">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faEnvelope} className="text-amber mr-3" />
            <div>
              <p className="font-semibold text-amber">Email Address</p>
              <p className="text-sm text-silver/80">Share your email with other movie-goers</p>
            </div>
          </div>
          <Switch
            checked={privacySettings.showEmail}
            onChange={(checked) => setPrivacySettings(prev => ({ ...prev, showEmail: checked }))}
            className={`${
              privacySettings.showEmail ? 'bg-amber' : 'bg-silver/20'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2`}
          >
            <span
              className={`${
                privacySettings.showEmail ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-deep-space transition-transform`}
            />
          </Switch>
        </div>

        {/* Phone Privacy */}
        <div className="flex items-center justify-between p-4 bg-deep-space/50 rounded-lg">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faPhone} className="text-amber mr-3" />
            <div>
              <p className="font-semibold text-amber">Phone Number</p>
              <p className="text-sm text-silver/80">Share your phone number with other movie-goers</p>
            </div>
          </div>
          <Switch
            checked={privacySettings.showPhone}
            onChange={(checked) => setPrivacySettings(prev => ({ ...prev, showPhone: checked }))}
            className={`${
              privacySettings.showPhone ? 'bg-amber' : 'bg-silver/20'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2`}
          >
            <span
              className={`${
                privacySettings.showPhone ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-deep-space transition-transform`}
            />
          </Switch>
        </div>

        {/* Privacy Terms */}
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
      </div>
    </div>
  );

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
            {/* Progress Steps */}
            <div className="flex justify-between mb-8">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`flex items-center ${
                    stepNumber < 3 ? 'flex-1' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= stepNumber
                        ? 'bg-amber text-deep-space'
                        : 'bg-deep-space/50 text-silver'
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step > stepNumber
                          ? 'bg-amber'
                          : 'bg-deep-space/50'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Movie Details */}
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

            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-amber">Basic Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-lg font-semibold text-amber mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-amber mb-2">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      min="18"
                      className="w-full px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                      placeholder="Enter your age"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-amber mb-2">Gender</label>
                    <div className="flex space-x-4">
                      {['Male', 'Female', 'Other'].map((gender) => (
                        <button
                          key={gender}
                          onClick={() => setFormData(prev => ({ ...prev, gender }))}
                          className={`px-4 py-2 rounded-lg flex items-center ${
                            formData.gender === gender
                              ? 'bg-amber text-deep-space'
                              : 'bg-deep-space/50 text-silver hover:bg-deep-space/70'
                          }`}
                        >
                          <FontAwesomeIcon icon={faUser} className="mr-2" />
                          {gender}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className="bg-amber text-deep-space px-6 py-2 rounded-lg hover:bg-amber/80 flex items-center"
                  >
                    Next
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Movie Preferences */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-amber">Movie Preferences</h2>
                <p className="text-silver">Select your favorite movie genres:</p>
                
                <div className="flex flex-wrap gap-2">
                  {movieGenres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleMoviePreferenceToggle(genre)}
                      className={`px-4 py-2 rounded-lg ${
                        formData.moviePreferences.includes(genre)
                          ? 'bg-amber text-deep-space'
                          : 'bg-deep-space/50 text-silver hover:bg-deep-space/70'
                      }`}
                    >
                      <FontAwesomeIcon icon={faFilm} className="mr-2" />
                      {genre}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={handleBack}
                    className="bg-deep-space/50 text-silver px-6 py-2 rounded-lg hover:bg-deep-space/70 flex items-center"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="bg-amber text-deep-space px-6 py-2 rounded-lg hover:bg-amber/80 flex items-center"
                  >
                    Next
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Privacy Settings */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-amber">Privacy Settings</h2>
                {renderPrivacySettings()}
                <div className="flex justify-between">
                  <button
                    onClick={handleBack}
                    className="bg-deep-space/50 text-silver px-6 py-2 rounded-lg hover:bg-deep-space/70 flex items-center"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!agreed}
                    className={`px-6 py-2 rounded-lg flex items-center ${
                      agreed
                        ? 'bg-amber text-deep-space hover:bg-amber/80'
                        : 'bg-deep-space/50 text-silver/50 cursor-not-allowed'
                    }`}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MovieBuddyForm; 