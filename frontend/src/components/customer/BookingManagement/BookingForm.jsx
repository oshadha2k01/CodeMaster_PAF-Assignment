import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTheaterMasks, faCalendar, faClock, faChair, faUser, faEnvelope, faPhone, faExclamationCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Toaster, toast } from 'react-hot-toast';
import MainNavBar from '../../navbar/MainNavBar';
import axios from 'axios';
import SeatSelection from './SeatSelection';

const BookingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState({
    movieDate: '',
    movieTime: '',
    seatNumbers: [],
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [movieData, setMovieData] = useState({
    movie_name: '',
    show_times: []
  });
  const [seatSelectionOpen, setSeatSelectionOpen] = useState(false);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        if (location.state?.movieData) {
          setMovieData({
            movie_name: location.state.movieData.movie_name,
            show_times: location.state.movieData.show_times || []
          });
        } else {
          const response = await axios.get(`http://localhost:3000/api/movies/${id}`);
          if (response.data) {
            setMovieData({
              movie_name: response.data.movie_name,
              show_times: response.data.show_times || []
            });
          }
        }
      } catch (error) {
        console.error('Error fetching movie data:', error);
        toast.error('Failed to load movie data');
        navigate('/now-showing');
      }
    };

    fetchMovieData();
  }, [id, navigate, location.state]);

  useEffect(() => {
    const fetchBookedSeats = async () => {
      if (formData.movieDate && formData.movieTime) {
        try {
          const response = await axios.get(`http://localhost:3000/api/bookings/booked-seats`, {
            params: {
              movieId: id,
              date: formData.movieDate,
              time: formData.movieTime
            }
          });
          setBookedSeats(response.data.bookedSeats || []);
          setSelectedSeats([]);
        } catch (error) {
          console.error('Error fetching booked seats:', error);
          toast.error('Failed to load booked seats');
        }
      }
    };

    fetchBookedSeats();
  }, [formData.movieDate, formData.movieTime, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Name validation: only allow letters and spaces
    if (name === 'name') {
      if (/[^a-zA-Z\s]/.test(value)) {
        return; // Don't update if contains numbers or special characters
      }
    }
    
    // Phone validation: only allow numbers
    if (name === 'phone') {
      if (/[^0-9]/.test(value) || value.length > 10) {
        return; // Don't update if contains letters or exceeds 10 digits
      }
    }

    setFormData({ ...formData, [name]: value });
    if (name === 'movieDate' || name === 'movieTime') {
      setSelectedSeats([]);
    }
  };

  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
    setFormData({ ...formData, seatNumbers: seats });
    setSeatSelectionOpen(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.movieDate) {
      newErrors.movieDate = 'Please select a date';
    }

    if (!formData.movieTime) {
      newErrors.movieTime = 'Please select a show time';
    }

    if (selectedSeats.length === 0) {
      newErrors.seatNumber = 'Please select at least one seat';
    }

    const hasDoubleBooking = selectedSeats.some(seat => bookedSeats.includes(seat));
    if (hasDoubleBooking) {
      newErrors.seatNumber = 'Some selected seats are already booked';
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    } else if (/[^a-zA-Z\s]/.test(formData.name)) {
      newErrors.name = 'Name should only contain letters';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name should be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/bookings', {
        movieName: movieData.movie_name,
        movieDate: formData.movieDate,
        movieTime: formData.movieTime,
        seatNumbers: formData.seatNumbers,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        movie_id: id
      });

      if (response.data) {
        toast.success('Booking confirmed successfully!');
        navigate(`/booking-details/${response.data._id}`);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-space text-silver flex items-center justify-center py-12">
      <MainNavBar />
      <div className="container mx-auto px-4">
        <Toaster position="top-right" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-electric-purple/10 rounded-xl p-8 border border-silver/10 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-amber">Book Tickets</h1>
              <div className="flex items-center text-silver bg-deep-space/50 px-4 py-2 rounded-lg">
                <FontAwesomeIcon icon={faTheaterMasks} className="mr-2 text-amber" />
                <span className="font-medium">{movieData.movie_name}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-amber mb-6 pb-2 border-b border-silver/20">Movie Details</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-silver mb-2">
                      <FontAwesomeIcon icon={faCalendar} className="mr-2 text-amber" />
                      Select Date
                    </label>
                    <input
                      type="date"
                      name="movieDate"
                      value={formData.movieDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                    />
                    {errors.movieDate && (
                      <p className="mt-1 text-sm text-scarlet flex items-center">
                        <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                        {errors.movieDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-silver mb-2">
                      <FontAwesomeIcon icon={faClock} className="mr-2 text-amber" />
                      Select Show Time
                    </label>
                    <select
                      name="movieTime"
                      value={formData.movieTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                    >
                      <option value="">Select a time</option>
                      {movieData.show_times.map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    {errors.movieTime && (
                      <p className="mt-1 text-sm text-scarlet flex items-center">
                        <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                        {errors.movieTime}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-silver mb-2">
                      <FontAwesomeIcon icon={faChair} className="mr-2 text-amber" />
                      Select Seats
                    </label>
                    <div
                      onClick={() => {
                        if (!formData.movieDate || !formData.movieTime) {
                          toast.error('Please select date and time first');
                          return;
                        }
                        setSeatSelectionOpen(true);
                      }}
                      className="w-full px-4 py-2.5 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber cursor-pointer hover:border-amber transition-colors duration-200"
                    >
                      {selectedSeats.length > 0 
                        ? `${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''} selected: ${selectedSeats.join(', ')}`
                        : 'Click to select seats'}
                    </div>
                    {errors.seatNumber && (
                      <p className="mt-1 text-sm text-scarlet flex items-center">
                        <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                        {errors.seatNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-amber mb-6 pb-2 border-b border-silver/20">Personal Details</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-silver mb-2">
                      <FontAwesomeIcon icon={faUser} className="mr-2 text-amber" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-scarlet flex items-center">
                        <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-silver mb-2">
                      <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-amber" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                      placeholder="example@domain.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-scarlet flex items-center">
                        <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-silver mb-2">
                      <FontAwesomeIcon icon={faPhone} className="mr-2 text-amber" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      maxLength={10}
                      className="w-full px-4 py-2.5 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                      placeholder="Ente Phone number"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-scarlet flex items-center">
                        <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-silver/20">
                <button
                  type="button"
                  onClick={() => navigate('/now-showing')}
                  className="px-6 py-2.5 bg-deep-space/50 text-silver hover:bg-deep-space/70 rounded-lg transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-scarlet hover:bg-amber text-white rounded-lg transition-colors duration-300 flex items-center"
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      <SeatSelection
        isOpen={seatSelectionOpen}
        onClose={() => setSeatSelectionOpen(false)}
        onSelect={handleSeatSelect}
        selectedSeats={selectedSeats}
        bookedSeats={bookedSeats}
        maxSeats={4}
      />
    </div>
  );
};

export default BookingForm;