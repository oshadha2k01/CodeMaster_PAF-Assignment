import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faSort, 
  faTrash,
  faChair,
  faUsers,
  faUserGroup,
  faUser,
  faSpinner,
  faCalendarAlt,
  faClock,
  faTicketAlt,
  faChartBar,
  faTimes,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import AdminNavBar from '../../navbar/AdminNavbar';

const MovieBuddy = () => {
  const [movieBuddyGroups, setMovieBuddyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('lastUpdated');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [stats, setStats] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'stats'

  useEffect(() => {
    fetchMovieBuddyGroups();
    fetchStats();
  }, []);

  const fetchMovieBuddyGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/movie-buddies/all');
      
      if (response.data.success) {
        // Process the data to calculate group/single bookings and total seats
        const processedGroups = response.data.data.map(group => {
          // Ensure buddies array exists
          const buddies = group.buddies || [];
          
          // Calculate statistics
          const groupBookings = buddies.filter(buddy => buddy.isGroup).length;
          const singleBookings = buddies.filter(buddy => !buddy.isGroup).length;
          const totalSeats = buddies.reduce((acc, buddy) => {
            const seatCount = Array.isArray(buddy.seatNumbers) ? buddy.seatNumbers.length : 0;
            return acc + seatCount;
          }, 0);
          
          return {
            ...group,
            buddies,
            groupBookings,
            singleBookings,
            totalSeats,
            totalBuddies: buddies.length
          };
        });
        
        setMovieBuddyGroups(processedGroups);
      } else {
        toast.error('Failed to load movie buddy groups');
      }
    } catch (error) {
      console.error('Error fetching movie buddy groups:', error);
      toast.error(error.response?.data?.message || 'Failed to load movie buddy groups');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/movie-buddies/stats');
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        toast.error('Failed to load statistics');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error(error.response?.data?.message || 'Failed to load statistics');
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

  const handleDelete = (group) => {
    setGroupToDelete(group);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/movie-buddies/${groupToDelete.movieName}/${groupToDelete.movieDate}/${groupToDelete.movieTime}`);
      toast.success('Movie buddy group deleted successfully');
      fetchMovieBuddyGroups();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting movie buddy group:', error);
      toast.error('Failed to delete movie buddy group');
    }
  };

  const filteredGroups = movieBuddyGroups
    .filter(group => {
      const searchLower = searchTerm.toLowerCase();
      return (
        group.movieName?.toLowerCase().includes(searchLower) ||
        group.movieDate?.toLowerCase().includes(searchLower) ||
        group.movieTime?.toLowerCase().includes(searchLower)
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
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faUsers} className="text-amber text-2xl" />
                  <h1 className="text-3xl font-bold text-amber">Movie Buddy Management</h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search movie buddies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber w-64"
                  />
                  <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-3 text-silver/50" />
                </div>
                <button
                  onClick={() => setViewMode(viewMode === 'list' ? 'stats' : 'list')}
                  className="px-4 py-2 bg-electric-purple/20 text-silver rounded-lg hover:bg-electric-purple/30 flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faChartBar} />
                  <span>{viewMode === 'list' ? 'View Stats' : 'View List'}</span>
                </button>
              </div>
            </div>

            {viewMode === 'stats' ? (
              // Stats View
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-electric-purple/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-amber mb-4">Overall Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-silver/75">Total Groups</span>
                      <span className="text-2xl font-bold text-amber">{stats?.totalGroups || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-silver/75">Total Buddies</span>
                      <span className="text-2xl font-bold text-amber">{stats?.totalBuddies || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-silver/75">Total Seats</span>
                      <span className="text-2xl font-bold text-amber">{stats?.totalSeats || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-electric-purple/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-amber mb-4">Booking Types</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-silver/75">Group Bookings</span>
                      <span className="text-2xl font-bold text-amber">{stats?.totalGroupBookings || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-silver/75">Single Bookings</span>
                      <span className="text-2xl font-bold text-amber">{stats?.totalSingleBookings || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-electric-purple/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-amber mb-4">Average Group Size</h3>
                  <div className="flex justify-center items-center h-full">
                    <span className="text-4xl font-bold text-amber">
                      {stats?.averageGroupSize ? stats.averageGroupSize.toFixed(1) : 0}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              // List View
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
                        Total Buddies
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-silver uppercase tracking-wider">
                        Total Seats
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-silver uppercase tracking-wider">
                        Group/Single
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-silver uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-silver/20">
                    {filteredGroups.map((group) => (
                      <tr key={`${group.movieName}-${group.movieDate}-${group.movieTime}`} className="hover:bg-silver/5">
                        <td className="px-6 py-4 whitespace-nowrap text-silver">
                          {group.movieName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-silver">
                          {group.movieDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-silver">
                          {group.movieTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-silver">
                          {group.totalBuddies}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-silver">
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faChair} className="mr-2 text-amber" />
                            {group.totalSeats} seats
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-silver">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              group.groupBookings > 0 ? 'bg-amber/20 text-amber' : 'bg-electric-purple/20 text-electric-purple'
                            }`}>
                              {group.groupBookings} Groups
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              group.singleBookings > 0 ? 'bg-electric-purple/20 text-electric-purple' : 'bg-amber/20 text-amber'
                            }`}>
                              {group.singleBookings} Singles
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedGroup(group)}
                            className="text-amber hover:text-amber/80 mr-3"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDelete(group)}
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
            )}

            {/* Group Details Modal */}
            {selectedGroup && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-deep-space p-8 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-amber">Movie Buddy Details</h2>
                    <button
                      onClick={() => setSelectedGroup(null)}
                      className="text-silver hover:text-amber"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                  
                  <div className="bg-electric-purple/20 rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3">
                        <FontAwesomeIcon icon={faTicketAlt} className="text-amber text-xl" />
                        <div>
                          <p className="text-silver/75">Movie</p>
                          <p className="text-xl font-semibold text-amber">{selectedGroup.movieName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-amber text-xl" />
                        <div>
                          <p className="text-silver/75">Date</p>
                          <p className="text-xl font-semibold text-amber">{selectedGroup.movieDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FontAwesomeIcon icon={faClock} className="text-amber text-xl" />
                        <div>
                          <p className="text-silver/75">Time</p>
                          <p className="text-xl font-semibold text-amber">{selectedGroup.movieTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedGroup.buddies.map((buddy, index) => (
                      <div
                        key={index}
                        className="bg-electric-purple/10 rounded-lg p-4 border border-silver/10"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-full ${buddy.isGroup ? 'bg-amber/20' : 'bg-electric-purple/20'}`}>
                              <FontAwesomeIcon 
                                icon={buddy.isGroup ? faUserGroup : faUser} 
                                className={`${buddy.isGroup ? 'text-amber' : 'text-electric-purple'} text-xl`}
                              />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-silver">{buddy.name}</h3>
                              <p className="text-silver/75">{buddy.email}</p>
                              <p className="text-sm text-silver/60 mt-1">
                                Booked on {new Date(buddy.bookingDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`text-sm font-medium mb-2 ${
                              buddy.isGroup ? 'text-amber' : 'text-electric-purple'
                            }`}>
                              {buddy.isGroup ? 'Group Booking' : 'Single Booking'}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {Array.isArray(buddy.seatNumbers) && buddy.seatNumbers.map((seat, seatIndex) => (
                                <span
                                  key={seatIndex}
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
                    ))}
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
                    Are you sure you want to delete this movie buddy group? This action cannot be undone.
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

export default MovieBuddy;