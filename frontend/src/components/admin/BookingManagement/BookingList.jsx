import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faSort, 
  faEdit, 
  faTrash, 
  faChair,
  faTimes,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import AdminNavBar from '../../navbar/AdminNavbar';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('movieDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [editFormData, setEditFormData] = useState({
    movieName: '',
    movieDate: '',
    movieTime: '',
    seatNumbers: [],
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setEditFormData({
      movieName: booking.movieName,
      movieDate: booking.movieDate,
      movieTime: booking.movieTime,
      seatNumbers: booking.seatNumbers,
      name: booking.name,
      email: booking.email,
      phone: booking.phone
    });
    setEditModalOpen(true);
  };

  const handleDelete = (id) => {
    setBookingToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/bookings/${bookingToDelete}`);
      toast.success('Booking deleted successfully');
      fetchBookings();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/api/bookings/${selectedBooking._id}`, editFormData);
      toast.success('Booking updated successfully');
      fetchBookings();
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  const filteredBookings = bookings
    .filter(booking => {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.movieName?.toLowerCase().includes(searchLower) ||
        booking.name?.toLowerCase().includes(searchLower) ||
        booking.email?.toLowerCase().includes(searchLower) ||
        booking.phone?.includes(searchTerm)
      );
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-space text-silver flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-space text-silver">
      <AdminNavBar />
      <div className="container mx-auto px-4 py-8">
        <Toaster position="top-right" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="bg-electric-purple/10 rounded-xl p-8 border border-silver/10 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-amber">Booking List</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber w-64"
                  />
                  <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-3 text-silver/50" />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-silver/20">
                <thead>
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-silver uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('movieName')}
                    >
                      Movie Name
                      <FontAwesomeIcon icon={faSort} className="ml-2" />
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-silver uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('movieDate')}
                    >
                      Date
                      <FontAwesomeIcon icon={faSort} className="ml-2" />
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-silver uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('movieTime')}
                    >
                      Time
                      <FontAwesomeIcon icon={faSort} className="ml-2" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-silver uppercase tracking-wider">
                      Seats
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-silver uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      Customer Name
                      <FontAwesomeIcon icon={faSort} className="ml-2" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-silver uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-silver uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-silver uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-silver/20">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-silver/5">
                      <td className="px-6 py-4 whitespace-nowrap text-silver">
                        {booking.movieName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-silver">
                        {booking.movieDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-silver">
                        {booking.movieTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-silver">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faChair} className="mr-2 text-amber" />
                          {Array.isArray(booking.seatNumbers) ? (
                            <span>{booking.seatNumbers.join(', ')}</span>
                          ) : (
                            <span>{booking.seatNumbers}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-silver">
                        {booking.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-silver">
                        {booking.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-silver">
                        {booking.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(booking)}
                          className="text-amber hover:text-amber/80 mr-3"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="text-scarlet hover:text-scarlet/80"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit Modal */}
            {editModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-deep-space p-8 rounded-xl max-w-md w-full">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-amber">Edit Booking</h2>
                    <button
                      onClick={() => setEditModalOpen(false)}
                      className="text-silver hover:text-amber"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
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
                    <div>
                      <label className="block text-sm font-medium text-silver mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        value={editFormData.movieTime}
                        onChange={(e) => setEditFormData({ ...editFormData, movieTime: e.target.value })}
                        className="w-full px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-silver mb-2">
                        Seats
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(editFormData.seatNumbers) ? editFormData.seatNumbers.join(', ') : editFormData.seatNumbers}
                        onChange={(e) => setEditFormData({ ...editFormData, seatNumbers: e.target.value.split(',').map(s => s.trim()) })}
                        className="w-full px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                      />
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
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={() => setEditModalOpen(false)}
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
              </div>
            )}

            {/* Delete Modal */}
            {deleteModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-deep-space p-8 rounded-xl max-w-md w-full">
                  <h2 className="text-2xl font-bold text-amber mb-6">Confirm Delete</h2>
                  <p className="text-silver mb-6">
                    Are you sure you want to delete this booking? This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setDeleteModalOpen(false)}
                      className="px-4 py-2 text-silver hover:text-amber"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-4 py-2 bg-scarlet text-white rounded-lg hover:bg-scarlet/80"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingList; 