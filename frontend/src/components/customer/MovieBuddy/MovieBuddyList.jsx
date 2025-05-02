import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faSort, 
  faChair,
  faUsers,
  faUserGroup,
  faUser,
  faSpinner,
  faCalendarAlt,
  faClock,
  faTicketAlt,
  faChartBar,
  faEnvelope,
  faPhone,
  faUserSecret,
  faEye,
  faEyeSlash,
  faFilter,
  faUserCircle,
  faUserFriends,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import CustomerNavBar from '../../navbar/MainNavBar';

const MovieBuddyList = () => {
  const navigate = useNavigate();
  const [movieBuddyGroups, setMovieBuddyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('movieDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterOptions, setFilterOptions] = useState({
    bookingType: 'all',
    privacy: 'all'
  });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFilterPortal, setShowFilterPortal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchMovieBuddyGroups();
  }, []);

  const fetchMovieBuddyGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/movie-buddies/all');
      
      if (response.data.success) {
        const processedGroups = response.data.data.map(group => {
          const buddies = group.buddies || [];
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewDetails = (buddy, group) => {
    navigate('/movie-buddy-profile', { 
      state: { 
        movieName: group.movieName,
        movieDate: group.movieDate,
        movieTime: group.movieTime,
        name: buddy.name,
        age: buddy.age,
        gender: buddy.gender,
        email: buddy.email,
        phone: buddy.phone,
        privacySettings: buddy.privacySettings,
        seatNumbers: buddy.seatNumbers,
        isGroup: buddy.isGroup
      } 
    });
  };

  const handleFilterClick = (group) => {
    setSelectedBooking({
      movieName: group.movieName,
      movieDate: group.movieDate,
      movieTime: group.movieTime,
      bookingDate: new Date().toISOString().split('T')[0], // Current date
      seatNumbers: group.buddies[0]?.seatNumbers || [], // Add seat numbers from the first buddy
      preferences: {
        gender: group.buddies[0]?.gender || '',
        age: group.buddies[0]?.age || '',
        moviePreferences: group.buddies[0]?.moviePreferences || []
      },
      privacySettings: group.buddies[0]?.privacySettings || {
        showName: true,
        showEmail: false,
        showPhone: false,
        petName: ''
      }
    });
    setShowFilterPortal(true);
  };

  const handleFilterClose = () => {
    setShowFilterPortal(false);
    setSelectedBooking(null);
  };

  const handleWhatsAppChat = (buddy) => {
    // Format the message with movie details
    const message = `Hi! I'm interested in connecting with you for the movie. Let's chat about it!`;
    
    // Create WhatsApp URL with the phone number and message
    const whatsappUrl = `https://wa.me/${buddy.phone}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };

  const filteredGroups = movieBuddyGroups
    .filter(group => {
      const matchesSearch = 
        group.movieName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.movieDate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.movieTime?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = 
        (!filterOptions.movieName || group.movieName === filterOptions.movieName) &&
        (!filterOptions.date || group.movieDate === filterOptions.date) &&
        (!filterOptions.time || group.movieTime === filterOptions.time) &&
        (filterOptions.bookingType === 'all' ||
         (filterOptions.bookingType === 'group' && group.groupBookings > 0) ||
         (filterOptions.bookingType === 'single' && group.singleBookings > 0));

      return matchesSearch && matchesFilter;
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
      <CustomerNavBar />
      <div className="container mx-auto px-4 pt-24 pb-8">
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
                  <h1 className="text-3xl font-bold text-amber">Movie Buddies</h1>
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
                  onClick={() => handleFilterClick(movieBuddyGroups[0])}
                  className="px-6 py-2 bg-amber/20 text-amber hover:bg-amber/30 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faFilter} />
                  <span>Filter Your Preference</span>
                </button>
              </div>
            </div>

            {/* Add the Modal */}
            {showFilterModal && (
              <div className="fixed inset-0 bg-black/50 z-50">
                <div className="fixed inset-y-0 right-0 w-full max-w-md bg-deep-space shadow-xl">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-silver/10">
                      <h2 className="text-xl font-bold text-amber">Filter Preferences</h2>
                      <button
                        onClick={() => setShowFilterModal(false)}
                        className="text-silver hover:text-amber"
                      >
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <MovieBuddyPortal />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <motion.div
                  key={`${group.movieName}-${group.movieDate}-${group.movieTime}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-electric-purple/10 rounded-xl p-6 border border-silver/10 hover:border-amber/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber/10"
                >
                  {/* Movie Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-amber/20 rounded-full">
                        <FontAwesomeIcon icon={faTicketAlt} className="text-amber text-xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-amber">{group.movieName}</h3>
                        <p className="text-silver/75 text-sm">{formatDate(group.movieDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-amber/20 text-amber rounded-full text-sm">
                        {group.movieTime}
                      </span>
                    </div>
                  </div>

                  {/* Buddies List */}
                  <div className="space-y-3 mb-6">
                    {group.buddies.slice(0, 3).map((buddy, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-electric-purple/20 transition-colors duration-200"
                      >
                        <div className={`p-2 rounded-full ${buddy.isGroup ? 'bg-amber/20' : 'bg-electric-purple/20'}`}>
                          <FontAwesomeIcon 
                            icon={buddy.isGroup ? faUserGroup : faUser} 
                            className={`${buddy.isGroup ? 'text-amber' : 'text-electric-purple'}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-silver font-medium truncate">
                              {buddy.privacySettings?.showName ? buddy.name : buddy.privacySettings?.petName || 'Anonymous'}
                            </h4>
                            {!buddy.privacySettings?.showName && (
                              <FontAwesomeIcon icon={faUserSecret} className="text-amber text-sm" title="Using pet name" />
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-silver/60">
                              {buddy.age} • {buddy.gender}
                            </span>
                            <span className="text-xs text-silver/40">•</span>
                            <span className="text-xs text-silver/60">
                              {buddy.isGroup ? 'Group' : 'Single'}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(buddy.seatNumbers) && buddy.seatNumbers.slice(0, 2).map((seat, seatIndex) => (
                            <span
                              key={seatIndex}
                              className="bg-amber/20 text-amber px-2 py-0.5 rounded-full text-xs flex items-center"
                            >
                              <FontAwesomeIcon icon={faChair} className="mr-1" />
                              {seat}
                            </span>
                          ))}
                          {buddy.seatNumbers?.length > 2 && (
                            <span className="bg-amber/20 text-amber px-2 py-0.5 rounded-full text-xs">
                              +{buddy.seatNumbers.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {group.buddies.length > 3 && (
                      <div className="text-center">
                        <button
                          onClick={() => setSelectedGroup(group)}
                          className="text-amber hover:text-amber/80 text-sm font-medium"
                        >
                          View all {group.buddies.length} buddies
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleViewDetails(group.buddies[0], group)}
                      className="w-full bg-electric-purple/20 text-electric-purple hover:bg-electric-purple/30 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <FontAwesomeIcon icon={faChartBar} />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => handleWhatsAppChat(group.buddies[0])}
                      className="w-full bg-amber/20 text-amber hover:bg-amber/30 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <FontAwesomeIcon icon={faUserFriends} />
                      <span>Chat on WhatsApp</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter Portal Modal */}
      {showFilterPortal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-deep-space p-8 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-amber">Filter Your Preference</h2>
              <button
                onClick={handleFilterClose}
                className="text-silver hover:text-amber"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <MovieBuddyPortal bookingData={selectedBooking} />
          </div>
        </div>
      )}

      {/* Group Details Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-deep-space p-8 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-amber">Group Details</h2>
              <button
                onClick={() => setSelectedGroup(null)}
                className="text-silver hover:text-amber"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            {/* Add group details rendering logic here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieBuddyList;