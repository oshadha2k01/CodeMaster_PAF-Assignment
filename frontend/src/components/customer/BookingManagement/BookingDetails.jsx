import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faTrash, 
  faChair,
  faTimes,
  faSave,
  faCreditCard,
  faUsers,
  faCheck,
  faTimes as faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import SeatSelection from './SeatSelection';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showMovieBuddyDialog, setShowMovieBuddyDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    movieName: '',
    movieDate: '',
    movieTime: '',
    seatNumbers: [],
    name: '',
    email: '',
    phone: ''
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showTimes, setShowTimes] = useState([]);
  const [seatSelectionOpen, setSeatSelectionOpen] = useState(false);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [movieData, setMovieData] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  useEffect(() => {
    if (editMode && booking?.movie_id) {
      fetchMovieData();
      fetchBookedSeats();
    }
  }, [editMode, booking?.movie_id]);

  useEffect(() => {
    if (editFormData.movieDate && editFormData.movieTime) {
      fetchBookedSeats();
    }
  }, [editFormData.movieDate, editFormData.movieTime]);

  // Modified useEffect to add 2-second delay
  useEffect(() => {
    if (booking && !loading) {
      // Set a 2-second delay before showing the dialog
      const timer = setTimeout(() => {
        setShowMovieBuddyDialog(true);
      }, 2000); // 2000 milliseconds = 2 seconds

      // Cleanup the timer if component unmounts
      return () => clearTimeout(timer);
    }
  }, [booking, loading]);

  const fetchMovieData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/movies/${booking.movie_id}`);
      if (response.data && response.data.data) {
        const movieData = response.data.data;
        setMovieData(movieData);
        
        // Get show times from the movie data and ensure they are valid
        const validShowTimes = movieData.show_times || [];
        if (Array.isArray(validShowTimes) && validShowTimes.length > 0) {
          setShowTimes(validShowTimes);
          
          // If current time is not in valid show times, set it to the first available time
          if (!validShowTimes.includes(editFormData.movieTime)) {
            setEditFormData(prev => ({
              ...prev,
              movieTime: validShowTimes[0]
            }));
          }
        } else {
          setShowTimes([]);
          toast.error('No show times available for this movie');
        }
      }
    } catch (error) {
      console.error('Error fetching movie data:', error);
      toast.error('Failed to load movie data');
      setShowTimes([]);
    }
  };

  const fetchBookedSeats = async () => {
    if (editFormData.movieDate && editFormData.movieTime) {
      try {
        const response = await axios.get(`http://localhost:3000/api/bookings/booked-seats`, {
          params: {
            movieId: booking.movie_id,
            date: editFormData.movieDate,
            time: editFormData.movieTime,
            excludeBookingId: bookingId
          }
        });
        setBookedSeats(response.data.bookedSeats || []);
      } catch (error) {
        console.error('Error fetching booked seats:', error);
        toast.error('Failed to load booked seats');
      }
    }
  };

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/bookings/${bookingId}`);
      setBooking(response.data);
      setEditFormData(response.data);
      
      // Fetch movie data and show times immediately when booking details are loaded
      if (response.data.movie_id) {
        const movieResponse = await axios.get(`http://localhost:3000/api/movies/${response.data.movie_id}`);
        if (movieResponse.data && movieResponse.data.data) {
          const movieData = movieResponse.data.data;
          setMovieData(movieData);
          // Ensure show_times is properly set from the movie data
          const validShowTimes = movieData.show_times || [];
          setShowTimes(validShowTimes);
          
          // If current booking time is not in valid show times, set it to the first available time
          if (!validShowTimes.includes(response.data.movieTime)) {
            setEditFormData(prev => ({
              ...prev,
              movieTime: validShowTimes[0] || ''
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  /*const handleTimeChange = (e) => {
    const newTime = e.target.value;
    if (!showTimes.includes(newTime)) {
      toast.error('Please select a valid show time from the available options');
      return;
    }
    setEditFormData(prev => ({ ...prev, movieTime: newTime }));
  };*/

  const handleUpdate = async () => {
    try {
      // Validate show time
      /*if (!showTimes.includes(editFormData.movieTime)) {
        toast.error('Please select a valid show time from the available options');
        return;
      }*/

      // Validate seats
      if (editFormData.seatNumbers.length === 0) {
        toast.error('Please select at least one seat');
        return;
      }

      await axios.put(`http://localhost:3000/api/bookings/${bookingId}`, editFormData);
      toast.success('Booking updated successfully');
      setEditMode(false);
      fetchBookingDetails();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/bookings/${bookingId}`);
      toast.success('Booking deleted successfully');
      navigate('/now-showing');
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  const handleSeatSelect = (seats) => {
    setEditFormData({ ...editFormData, seatNumbers: seats });
    setSeatSelectionOpen(false);
  };

  const handleProceedToPayment = () => {
    navigate('/payment', { state: { booking } });
  };

  const handleMovieBuddyClick = () => {
    setShowMovieBuddyDialog(true);
  };

  const handleMovieBuddyConfirm = () => {
    setShowMovieBuddyDialog(false);
    navigate('/movie-buddy-portal', {
      state: {
        movieName: booking.movieName,
        movieDate: booking.movieDate,
        movieTime: booking.movieTime,
        excludeBookingId: bookingId,
        name: booking.name,
        email: booking.email,
        phone: booking.phone
      }
    });
  };

  const handleMovieBuddyCancel = () => {
    setShowMovieBuddyDialog(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-space text-silver flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-deep-space text-silver flex items-center justify-center">
        <div className="text-2xl text-amber">Booking not found</div>
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
          className="max-w-3xl mx-auto"
        >
          <div className="bg-electric-purple/10 rounded-xl p-8 border border-silver/10 shadow-lg">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-amber">Booking Details</h1>
              {!editMode && (
                <div className="space-x-4">
                  <button
                    onClick={handleEdit}
                    className="text-amber hover:text-amber/80 text-xl"
                    title="Edit Booking"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="text-scarlet hover:text-scarlet/80 text-xl"
                    title="Cancel Booking"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              )}
            </div>

            {/* Movie Buddy Confirmation Dialog */}
            {showMovieBuddyDialog && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-deep-space border-2 border-amber rounded-xl p-8 max-w-md w-full mx-4"
                >
                  <h2 className="text-2xl font-bold text-amber mb-4">Find Movie Buddies</h2>
                  <p className="text-silver mb-6">Would you like to find movie buddies who are watching the same movie at the same time?</p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={handleMovieBuddyCancel}
                      className="px-6 py-2 rounded-lg bg-scarlet hover:bg-scarlet/80 text-white flex items-center"
                    >
                      <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                      No
                    </button>
                    <button
                      onClick={handleMovieBuddyConfirm}
                      className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white flex items-center"
                    >
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      Yes
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-silver mb-2">
                    Movie Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.movieName}
                    onChange={(e) => setEditFormData({ ...editFormData, movieName: e.target.value })}
                    className="w-full px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silver mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editFormData.movieDate}
                    onChange={(e) => setEditFormData({ ...editFormData, movieDate: e.target.value })}
                    className="w-full px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                  />
                </div>
                {/*<div>
                  <label className="block text-sm font-medium text-silver mb-2">
                    Time
                  </label>
                  <select
                    value={editFormData.movieTime}
                    onChange={handleTimeChange}
                    className="w-full px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                    disabled={!editFormData.movieDate}
                  >
                    <option value="">Select a time</option>
                    {showTimes && showTimes.length > 0 ? (
                      showTimes.map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No show times available</option>
                    )}
                  </select>
                  {!editFormData.movieDate && (
                    <p className="mt-1 text-sm text-amber">
                      Please select a date first to view available show times
                    </p>
                  )}
                  {editFormData.movieDate && (!showTimes || showTimes.length === 0) && (
                    <p className="mt-1 text-sm text-amber">
                      No show times available for the selected date
                    </p>
                  )}
                </div>*/}
                <div>
                  <label className="block text-sm font-medium text-silver mb-2">
                    Seats
                  </label>
                  <div
                    onClick={() => {
                      if (!editFormData.movieDate || !editFormData.movieTime) {
                        toast.error('Please select date and time first');
                        return;
                      }
                      setSeatSelectionOpen(true);
                    }}
                    className="w-full px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber cursor-pointer hover:border-amber transition-colors duration-200"
                  >
                    {editFormData.seatNumbers.length > 0 
                      ? `${editFormData.seatNumbers.length} seat${editFormData.seatNumbers.length > 1 ? 's' : ''} selected: ${editFormData.seatNumbers.join(', ')}`
                      : 'Click to select seats'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-silver mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silver mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silver mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 text-silver hover:text-amber"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-amber text-deep-space rounded-lg hover:bg-amber/80 flex items-center"
                  >
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-amber mb-2">Movie</h3>
                    <p className="text-silver">{booking.movieName}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber mb-2">Date</h3>
                    <p className="text-silver">{booking.movieDate}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber mb-2">Time</h3>
                    <p className="text-silver">{booking.movieTime}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber mb-2">Seats</h3>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faChair} className="mr-2 text-amber" />
                      <span className="text-silver">
                        {Array.isArray(booking.seatNumbers) ? booking.seatNumbers.join(', ') : booking.seatNumbers}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber mb-2">Customer Name</h3>
                    <p className="text-silver">{booking.name}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber mb-2">Email</h3>
                    <p className="text-silver">{booking.email}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber mb-2">Phone</h3>
                    <p className="text-silver">{booking.phone}</p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleProceedToPayment}
                    className="px-6 py-3 bg-amber text-deep-space rounded-lg hover:bg-amber/80 flex items-center text-lg"
                  >
                    <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Seat Selection Modal */}
      <SeatSelection
        isOpen={seatSelectionOpen}
        onClose={() => setSeatSelectionOpen(false)}
        onSelect={handleSeatSelect}
        selectedSeats={editFormData.seatNumbers}
        bookedSeats={bookedSeats}
        maxSeats={4}
        isEditMode={editMode}
      />

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-deep-space p-8 rounded-xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-amber mb-6">Confirm Cancellation</h2>
            <p className="text-silver mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-silver hover:text-amber"
              >
                No, Keep Booking
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-scarlet text-white rounded-lg hover:bg-scarlet/80"
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails; 