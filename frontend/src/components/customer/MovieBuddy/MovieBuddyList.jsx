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
  faTimes,
  faToggleOn,
  faToggleOff,
  faUserCheck,
  faFilm
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import MovieBuddyPortal from './MovieBuddyPortal';
import MovieBuddyNavBar from '../../navbar/MovieBuddyNavBar';

const MovieBuddyList = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [flattenedBuddies, setFlattenedBuddies] = useState([]);
  const [currentUserDetails, setCurrentUserDetails] = useState({
    email: localStorage.getItem('userEmail') || '',
    phone: localStorage.getItem('userPhone') || ''
  });
  
  const [movieFilter, setMovieFilter] = useState({
    isActive: false,
    movieName: '',
    movieDate: '',
    movieTime: ''
  });
  const [showAllBuddies, setShowAllBuddies] = useState(true);
  const [selectedFilmCategory, setSelectedFilmCategory] = useState('all');
  const [uniqueFilms, setUniqueFilms] = useState([]);

  useEffect(() => {
    fetchMovieBuddyGroups();
    
    if (location.state?.movieDetails) {
      const { movieName, movieDate, movieTime } = location.state.movieDetails;
      setMovieFilter({
        isActive: true,
        movieName,
        movieDate,
        movieTime
      });
      setShowAllBuddies(false);
    }
  }, [location.state]);

  const fetchMovieBuddyGroups = async () => {
    try {
      setLoading(true);
      
      if (movieFilter.isActive && !showAllBuddies) {
        const response = await axios.get('http://localhost:3000/api/movie-buddies/buddies', {
          params: {
            movieName: movieFilter.movieName,
            movieDate: movieFilter.movieDate,
            movieTime: movieFilter.movieTime,
            email: currentUserDetails.email // Make sure this is always passed
          }
        });
        
        if (response.data) {
          const filteredBuddies = response.data.map(buddy => ({
            ...buddy,
            isCurrentUser: buddy.email === currentUserDetails.email && 
                          buddy.phone === currentUserDetails.phone
          }));
          
          const groupedBuddies = [{
            movieName: movieFilter.movieName,
            movieDate: movieFilter.movieDate,
            movieTime: movieFilter.movieTime,
            buddies: filteredBuddies
          }];
          
          setMovieBuddyGroups(groupedBuddies);
          setFlattenedBuddies(filteredBuddies);
        } else {
          toast.error('Failed to load matching movie buddies');
          setFlattenedBuddies([]);
        }
      } else {
        const response = await axios.get('http://localhost:3000/api/movie-buddies/all');
        
        if (response.data.success) {
          const processedGroups = response.data.data;
          setMovieBuddyGroups(processedGroups);
          
          // Extract unique film names for categories
          const films = [...new Set(processedGroups.map(group => group.movieName))];
          setUniqueFilms(films);

          const allBuddies = [];
          processedGroups.forEach(group => {
            // Filter out the current user from each group's buddies
            const filteredBuddies = group.buddies.filter(buddy => 
              buddy.email !== currentUserDetails.email
            );
            
            filteredBuddies.forEach(buddy => {
              allBuddies.push({
                ...buddy,
                movieName: group.movieName,
                movieDate: group.movieDate,
                movieTime: group.movieTime
              });
            });
          });
          setFlattenedBuddies(allBuddies);
        } else {
          toast.error('Failed to load movie buddy groups');
        }
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
      bookingDate: new Date().toISOString().split('T')[0],
      seatNumbers: group.buddies[0]?.seatNumbers || [],
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

  const toggleShowAllBuddies = () => {
    setShowAllBuddies(!showAllBuddies);
    setTimeout(() => {
      fetchMovieBuddyGroups();
    }, 0);
  };

  // Filter buddies based on selected film category
  const getFilteredBuddiesByFilm = () => {
    if (selectedFilmCategory === 'all') {
      return flattenedBuddies.filter(buddy => {
        if (searchTerm) {
          const matchesSearch = 
            buddy.movieName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            buddy.movieDate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            buddy.movieTime?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            buddy.name?.toLowerCase().includes(searchTerm.toLowerCase());
          
          return matchesSearch;
        }
        
        return true;
      }).sort((a, b) => {
        if (a.isCurrentUser && !b.isCurrentUser) return -1;
        if (!a.isCurrentUser && b.isCurrentUser) return 1;
        
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
    return flattenedBuddies.filter(buddy => buddy.movieName === selectedFilmCategory);
  };

  const displayedBuddies = getFilteredBuddiesByFilm();

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-space text-silver flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-space text-silver">
      <MovieBuddyNavBar />
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
                {movieFilter.isActive && (
                  <button
                    onClick={toggleShowAllBuddies}
                    className="px-6 py-2 bg-amber/20 text-amber hover:bg-amber/30 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                    title={!showAllBuddies ? "Show all movie buddies" : "Show only this movie's buddies"}
                  >
                    <FontAwesomeIcon icon={showAllBuddies ? faToggleOn : faToggleOff} />
                    <span>{showAllBuddies ? "Showing All" : "Filtered by Movie"}</span>
                  </button>
                )}
                <button
                  onClick={() => handleFilterClick(movieBuddyGroups[0])}
                  className="px-6 py-2 bg-amber/20 text-amber hover:bg-amber/30 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faFilter} />
                  <span>Filter Your Preference</span>
                </button>
              </div>
            </div>

            {/* Film Category Navigation Bar */}
            <div className="mb-8 overflow-x-auto">
              <div className="flex space-x-2 pb-2">
                <button
                  onClick={() => setSelectedFilmCategory('all')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors duration-200 ${
                    selectedFilmCategory === 'all'
                      ? 'bg-amber text-deep-space'
                      : 'bg-deep-space/50 text-silver hover:bg-deep-space/70'
                  }`}
                >
                  All Movies
                </button>
                {uniqueFilms.map((filmName) => (
                  <button
                    key={filmName}
                    onClick={() => setSelectedFilmCategory(filmName)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors duration-200 ${
                      selectedFilmCategory === filmName
                        ? 'bg-amber text-deep-space'
                        : 'bg-deep-space/50 text-silver hover:bg-deep-space/70'
                    }`}
                  >
                    {filmName}
                  </button>
                ))}
              </div>
            </div>

            {/* Show active filter if a specific movie is selected */}
            {selectedFilmCategory !== 'all' && (
              <div className="mb-6 p-4 bg-amber/10 rounded-lg border border-amber/20">
                <h3 className="text-lg text-amber font-medium flex items-center">
                  <FontAwesomeIcon icon={faFilm} className="mr-2" />
                  Showing buddies for: {selectedFilmCategory}
                </h3>
              </div>
            )}

            {movieFilter.isActive && !showAllBuddies && (
              <div className="mb-6 p-4 bg-electric-purple/20 rounded-lg">
                <h3 className="text-lg text-amber font-medium mb-2">
                  Showing movie buddies for:
                </h3>
                <div className="flex items-center space-x-4">
                  <span className="text-white font-bold">{movieFilter.movieName}</span>
                  <span className="text-silver">•</span>
                  <span className="text-silver">{formatDate(movieFilter.movieDate)}</span>
                  <span className="text-silver">•</span>
                  <span className="text-silver">{movieFilter.movieTime}</span>
                </div>
              </div>
            )}

            {displayedBuddies.length === 0 ? (
              <div className="text-center py-12">
                <FontAwesomeIcon icon={faUsers} className="text-silver/30 text-5xl mb-4" />
                <h3 className="text-xl text-silver/70 mb-2">No movie buddies found</h3>
                <p className="text-silver/50">
                  {selectedFilmCategory !== 'all'
                    ? `No buddies found for ${selectedFilmCategory}`
                    : "No movie buddies found. Try adjusting your search criteria."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedBuddies.map((buddy, index) => (
                  <motion.div
                    key={buddy._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-electric-purple/10 rounded-xl p-6 border ${
                      buddy.isCurrentUser 
                        ? 'border-amber border-2' 
                        : 'border-silver/10 hover:border-amber/30'
                    } transition-all duration-300 hover:shadow-lg hover:shadow-amber/10`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-amber/20 rounded-full">
                          <FontAwesomeIcon icon={faTicketAlt} className="text-amber text-xl" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-amber">{buddy.movieName}</h3>
                          <p className="text-silver/75 text-sm">{formatDate(buddy.movieDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-amber/20 text-amber rounded-full text-sm">
                          {buddy.movieTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-2 rounded-lg mb-4">
                      <div className={`p-2 rounded-full ${
                        buddy.isCurrentUser 
                          ? 'bg-amber/30' 
                          : buddy.isGroup 
                            ? 'bg-amber/20' 
                            : 'bg-electric-purple/20'
                      }`}>
                        <FontAwesomeIcon 
                          icon={
                            buddy.isCurrentUser 
                              ? faUserCheck
                              : buddy.isGroup 
                                ? faUserGroup 
                                : faUser
                          } 
                          className={`${
                            buddy.isCurrentUser 
                              ? 'text-amber' 
                              : buddy.isGroup 
                                ? 'text-amber' 
                                : 'text-electric-purple'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-silver font-medium truncate">
                            {buddy.isCurrentUser 
                              ? `${buddy.name} (You)` 
                              : buddy.privacySettings?.showName 
                                ? buddy.name 
                                : buddy.privacySettings?.petName || 'Anonymous'}
                          </h4>
                          {!buddy.privacySettings?.showName && !buddy.isCurrentUser && (
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
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {Array.isArray(buddy.seatNumbers) && buddy.seatNumbers.map((seat, seatIndex) => (
                        <span
                          key={seatIndex}
                          className="bg-amber/20 text-amber px-2 py-0.5 rounded-full text-xs flex items-center"
                        >
                          <FontAwesomeIcon icon={faChair} className="mr-1" />
                          {seat}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleViewDetails(buddy, { 
                          movieName: buddy.movieName, 
                          movieDate: buddy.movieDate, 
                          movieTime: buddy.movieTime 
                        })}
                        className="w-full bg-electric-purple/20 text-electric-purple hover:bg-electric-purple/30 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <FontAwesomeIcon icon={faChartBar} />
                        <span>View Details</span>
                      </button>
                      {!buddy.isCurrentUser && (
                        <button
                          className="w-full bg-amber/20 text-amber hover:bg-amber/30 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                          <FontAwesomeIcon icon={faUserFriends} />
                          <span>Connect with Buddy</span>
                        </button>
                      )}
                      {buddy.isCurrentUser && (
                        <button
                          className="w-full bg-green-500/20 text-green-500 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                          disabled
                        >
                          <FontAwesomeIcon icon={faUserCheck} />
                          <span>This is You</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

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