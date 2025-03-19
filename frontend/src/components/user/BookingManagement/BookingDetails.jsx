// src/components/BookingDetails.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilm,
  faCalendar,
  faChair,
  faUser,
  faEnvelope,
  faPhone,
  faEdit,
  faTrash,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const BookingDetails = () => {
  const [booking, setBooking] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch booking details
  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      if (response.ok && data) {
        setBooking(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
        });
      } else {
        throw new Error(data.message || 'Booking not found');
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error('Failed to load booking details. Please try again.');
      navigate('/bookings');
    } finally {
      setLoading(false);
    }
  };

  // Validate form data for editing
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!formData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!formData.phone.match(/^\d{10}$/)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes during edit
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handle edit submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const loadingToast = toast.loading('Updating booking...');
    try {
      const response = await fetch(`http://localhost:3000/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setBooking((prev) => ({ ...prev, ...formData }));
        setEditing(false);
        toast.success('Booking updated successfully!', { id: loadingToast });
      } else {
        throw new Error(data.message || 'Failed to update booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error(`Error: ${error.message}`, { id: loadingToast });
    }
  };

  // Handle cancel booking
  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    const loadingToast = toast.loading('Cancelling booking...');
    try {
      const response = await fetch(`http://localhost:3000/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.ok) {
        toast.success('Booking cancelled successfully!', { id: loadingToast });
        navigate('/movies');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(`Error: ${error.message}`, { id: loadingToast });
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  if (loading) return <div className="text-silver text-center mt-10">Loading booking details...</div>;
  if (!booking) return <div className="text-red-500 text-center mt-10">Booking not found.</div>;

  return (
    <div className="min-h-screen bg-deep-space text-silver flex flex-col">
      {/* Navigation Bar */}
      <header className="bg-deep-space-dark shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-amber text-2xl font-bold">GalaxyX Cinema</span>
          </div>
          <nav className="flex space-x-4">
            <a href="/movies" className="text-silver hover:text-amber">Now Showing</a>
            <a href="/upcoming" className="text-silver hover:text-amber">Upcoming</a>
            <a href="/beverages" className="text-silver hover:text-amber">Beverages</a>
            <a href="/showtimes" className="text-silver hover:text-amber">Show Times</a>
            <a href="/profile" className="text-silver hover:text-amber">Profile</a>
            <a href="/logout" className="text-silver hover:text-amber">Logout</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto p-2 md:p-4">
          <Toaster position="top-right" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-electric-purple/10 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-silver/10"
          >
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faFilm} className="text-amber text-2xl mr-3" />
              <h2 className="text-xl md:text-2xl font-bold text-amber">Your Booking Details</h2>
            </div>

            {/* Booking Details */}
            <div className="bg-deep-space/50 rounded-lg p-4 mb-6">
              <h3 className="text-silver font-semibold mb-2">Movie Details</h3>
              <p className="text-silver/80">
                <FontAwesomeIcon icon={faFilm} className="mr-2 text-amber" />
                Movie: {booking.movieName}
              </p>
              <p className="text-silver/80">
                <FontAwesomeIcon icon={faCalendar} className="mr-2 text-amber" />
                Date: {booking.movieDate} at {booking.movieTime}
              </p>
              <p className="text-silver/80">
                <FontAwesomeIcon icon={faChair} className="mr-2 text-amber" />
                Seat: {booking.seatNumber}
              </p>
            </div>

            {/* User Details (Editable) */}
            {editing ? (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-silver text-sm mb-1">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full bg-deep-space/50 border rounded-lg px-3 py-2 text-silver text-sm focus:border-electric-purple focus:ring-1 focus:ring-electric-purple outline-none ${
                      errors.name ? 'border-red-500' : 'border-silver/30'
                    }`}
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-xs mt-1 flex items-center"
                    >
                      <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" size="sm" />
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-silver text-sm mb-1">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-deep-space/50 border rounded-lg px-3 py-2 text-silver text-sm focus:border-electric-purple focus:ring-1 focus:ring-electric-purple outline-none ${
                      errors.email ? 'border-red-500' : 'border-silver/30'
                    }`}
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-xs mt-1 flex items-center"
                    >
                      <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" size="sm" />
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-silver text-sm mb-1">
                    <FontAwesomeIcon icon={faPhone} className="mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full bg-deep-space/50 border rounded-lg px-3 py-2 text-silver text-sm focus:border-electric-purple focus:ring-1 focus:ring-electric-purple outline-none ${
                      errors.phone ? 'border-red-500' : 'border-silver/30'
                    }`}
                  />
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-xs mt-1 flex items-center"
                    >
                      <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" size="sm" />
                      {errors.phone}
                    </motion.p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-amber hover:bg-scarlet text-white font-semibold py-2 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 text-sm"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    <span>Save Changes</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setEditing(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-silver/30 hover:bg-silver/50 text-white font-semibold py-2 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 text-sm"
                  >
                    <span>Cancel</span>
                  </motion.button>
                </div>
              </form>
            ) : (
              <div className="bg-deep-space/50 rounded-lg p-4 mb-6">
                <h3 className="text-silver font-semibold mb-2">User Details</h3>
                <p className="text-silver/80">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-amber" />
                  Name: {booking.name}
                </p>
                <p className="text-silver/80">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-amber" />
                  Email: {booking.email}
                </p>
                <p className="text-silver/80">
                  <FontAwesomeIcon icon={faPhone} className="mr-2 text-amber" />
                  Phone: {booking.phone}
                </p>
                <div className="flex space-x-3 mt-4">
                  <motion.button
                    onClick={() => setEditing(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-amber hover:bg-scarlet text-white font-semibold py-2 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 text-sm"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    <span>Edit Booking</span>
                  </motion.button>
                  <motion.button
                    onClick={handleCancelBooking}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-scarlet hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 text-sm"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    <span>Cancel Booking</span>
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-deep-space-dark text-silver py-4 text-center">
        <p>© 2025 GalaxyX Cinema. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BookingDetails;