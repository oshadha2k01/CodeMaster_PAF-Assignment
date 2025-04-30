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
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: bookingData?.name || '',
    email: bookingData?.email || '',
    phone: bookingData?.phone || '',
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
        if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
          toast.error('Please enter a valid email');
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
      case 3:
        if (!privacySettings.showName && !privacySettings.petName.trim()) {
          toast.error('Please enter a pet name if you choose not to show your real name');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        toast.error('Please log in to continue');
        navigate('/login');
        return;
      }

      if (!bookingData?.bookingId) {
        toast.error('Booking ID is missing. Please complete your booking first.');
        navigate('/booking');
        return;
      }

      // Save phone and email to localStorage
      localStorage.setItem('userPhone', formData.phone || userData.phone);
      localStorage.setItem('userEmail', formData.email || userData.email);

      const buddyData = {
        name: formData.name || `${userData.firstName} ${userData.lastName}`,
        age: parseInt(formData.age),
        gender: formData.gender,
        bookingId: bookingData.bookingId,
        email: formData.email || userData.email,
        phone: formData.phone || userData.phone,
        privacySettings: {
          showName: privacySettings.showName,
          showEmail: privacySettings.showEmail,
          showPhone: privacySettings.showPhone,
          petName: privacySettings.showName ? '' : privacySettings.petName
        },
        moviePreferences: formData.moviePreferences,
        seatNumbers: bookingData.seatNumbers || [],
        bookingDate: new Date().toISOString()
      };

      const payload = {
        movieName: bookingData.movieName,
        movieDate: bookingData.movieDate,
        movieTime: bookingData.movieTime,
        buddies: [buddyData]
      };

      // Check if the user already exists
      const checkResponse = await axios.post('http://localhost:3000/api/movie-buddies/check-existing', {
        email: buddyData.email
      });

      if (checkResponse.data.exists) {
        // If user exists, update movie details via WebSocket
        const ws = new WebSocket('ws://localhost:3000');
        ws.onopen = () => {
          ws.send(JSON.stringify({
            type: 'updateMovieDetails',
            email: buddyData.email,
            movieDetails: {
              movieName: bookingData.movieName,
              movieDate: bookingData.movieDate,
              movieTime: bookingData.movieTime,
              bookingId: bookingData.bookingId,
              seatNumbers: bookingData.seatNumbers || []
            }
          }));
          ws.close();
        };
      } else {
        // If user doesn't exist, create new entry
        const response = await axios.post('http://localhost:3000/api/movie-buddies/update', payload);
        console.log('Movie buddy created:', response.data);
      }

      toast.success("Movie buddy preferences saved successfully!", {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#4ade80',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '8px'
        },
        icon: '🎉'
      });
      navigate("/movie-buddies", { state: { bookingData } });
    } catch (error) {
      console.error("Error saving preferences:", error);
      const errorMessage = error.response?.data?.message || "Error saving preferences";
      if (error.response?.status === 400) {
        toast.error(errorMessage, {
          duration: 5000,
          style: { background: '#f87171', color: '#fff' }
        });
      } else if (error.response?.status === 409) {
        toast.error("This movie group already exists. Please join it or update your booking.", {
          duration: 5000,
          style: { background: '#f87171', color: '#fff' }
        });
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderPrivacySettings = () => (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-deep-space/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faUser} className="text-amber" />
              <div>
                <p className="font-semibold text-amber">Display Name</p>
                <p className="text-sm text-silver/80">Show your name to other movie-goers</p>
              </div>
            </div>
            <Switch
              checked={privacySettings.showName}
              onChange={(checked) => setPrivacySettings(prev => ({ ...prev, showName: checked }))}
              className={`${privacySettings.showName ? 'bg-amber' : 'bg-silver/20'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2`}
            >
              <span className={`${privacySettings.showName ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-deep-space transition-transform`}/>
            </Switch>
          </div>

          {!privacySettings.showName && (
            <div className="p-4 bg-deep-space/50 rounded-lg">
              <div className="flex items-center mb-2 space-x-3">
                <FontAwesomeIcon icon={faUserSecret} className="text-amber" />
                <p className="font-semibold text-amber">Pet Name</p>
              </div>
              <p className="text-sm text-silver/80 mb-3">Enter a fun name to be displayed to others</p>
              <input
                type="text"
                value={privacySettings.petName}
                onChange={(e) => setPrivacySettings(prev => ({ ...prev, petName: e.target.value }))}
                className="w-full px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                placeholder="Enter your pet name"
                required={!privacySettings.showName}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-deep-space/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faEnvelope} className="text-amber" />
              <div>
                <p className="font-semibold text-amber">Email Address</p>
                <p className="text-sm text-silver/80">Share your email with other movie-goers</p>
              </div>
            </div>
            <Switch
              checked={privacySettings.showEmail}
              onChange={(checked) => setPrivacySettings(prev => ({ ...prev, showEmail: checked }))}
              className={`${privacySettings.showEmail ? 'bg-amber' : 'bg-silver/20'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2`}
            >
              <span className={`${privacySettings.showEmail ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-deep-space transition-transform`}/>
            </Switch>
          </div>

          <div className="flex items-center justify-between p-4 bg-deep-space/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faPhone} className="text-amber" />
              <div>
                <p className="font-semibold text-amber">Phone Number</p>
                <p className="text-sm text-silver/80">Share your phone number with other movie-goers</p>
              </div>
            </div>
            <Switch
              checked={privacySettings.showPhone}
              onChange={(checked) => setPrivacySettings(prev => ({ ...prev, showPhone: checked }))}
              className={`${privacySettings.showPhone ? 'bg-amber' : 'bg-silver/20'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2`}
            >
              <span className={`${privacySettings.showPhone ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-deep-space transition-transform`}/>
            </Switch>
          </div>
        </div>
      </div>

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
  );

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-deep-space text-silver flex items-center justify-center">
        <div className="text-2xl text-amber">Invalid access. Please complete a booking first.</div>
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
          className="max-w-5xl mx-auto"
        >
          <div className="bg-electric-purple/10 rounded-xl p-8 border border-silver/10 shadow-lg">
            <div className="flex justify-between mb-8">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`flex items-center ${stepNumber < 3 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= stepNumber ? 'bg-amber text-deep-space' : 'bg-deep-space/50 text-silver'
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step > stepNumber ? 'bg-amber' : 'bg-deep-space/50'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mb-8 p-6 bg-deep-space/50 rounded-lg">
              <h2 className="text-xl font-bold text-amber mb-4">Your Movie Details</h2>
              <div className="grid grid-cols-3 gap-6">
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

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-amber">Basic Information</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-semibold text-amber mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                      placeholder="Enter your name"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-amber mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                      placeholder="Enter your email"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-amber mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                      placeholder="Enter your phone number"
                      disabled
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
                  <div className="col-span-2">
                    <label className="block text-lg font-semibold text-amber mb-2">Gender</label>
                    <div className="flex space-x-6">
                      {['Male', 'Female', 'Other'].map((gender) => (
                        <button
                          key={gender}
                          onClick={() => setFormData(prev => ({ ...prev, gender }))}
                          className={`px-6 py-2 rounded-lg flex items-center ${
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

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-amber">Movie Preferences</h2>
                <p className="text-silver">Select your favorite movie genres:</p>
                <div className="grid grid-cols-4 gap-4">
                  {movieGenres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleMoviePreferenceToggle(genre)}
                      className={`px-4 py-2 rounded-lg text-center ${
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
                    disabled={!agreed || loading}
                    className={`px-6 py-2 rounded-lg flex items-center ${
                      agreed && !loading
                        ? 'bg-amber text-deep-space hover:bg-amber/80'
                        : 'bg-deep-space/50 text-silver/50 cursor-not-allowed'
                    }`}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
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