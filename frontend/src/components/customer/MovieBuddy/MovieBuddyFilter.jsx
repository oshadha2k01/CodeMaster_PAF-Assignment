// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import { motion } from 'framer-motion';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { 
//   faFilm, 
//   faCalendarAlt, 
//   faClock, 
//   faUsers, 
//   faUserPlus,
//   faUserFriends,
//   faSpinner,
//   faVenusMars,
//   faUserGroup,
//   faUser,
//   faEnvelope,
//   faPhone,
//   faFilter
// } from '@fortawesome/free-solid-svg-icons';
// import MovieBuddyNavBar from '../../navbar/MovieBuddyNavBar';

// const MovieBuddyFilter = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [movieBuddies, setMovieBuddies] = useState([]);
//   const [userPreferences, setUserPreferences] = useState(null);
//   const [movieDetails, setMovieDetails] = useState(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState({
//     gender: '',
//     ageRange: '',
//     groupSize: ''
//   });

//   useEffect(() => {
//     loadSavedData();
//   }, []);

//   const loadSavedData = () => {
//     try {
//       // Load current movie buddy details
//       const currentMovieBuddy = JSON.parse(localStorage.getItem('currentMovieBuddy'));
//       if (!currentMovieBuddy) {
//         toast.error('No movie details found. Please set your preferences first.');
//         navigate('/movie-buddy-portal');
//         return;
//       }
//       setMovieDetails(currentMovieBuddy);

//       // Load user preferences
//       const movieBuddyPreferences = JSON.parse(localStorage.getItem('movieBuddyPreferences') || '{}');
//       const currentPreferences = movieBuddyPreferences[currentMovieBuddy.movieName];
//       if (!currentPreferences) {
//         toast.error('No preferences found. Please set your preferences first.');
//         navigate('/movie-buddy-portal');
//         return;
//       }
//       setUserPreferences(currentPreferences.preferences);

//       // Fetch matching buddies
//       fetchMatchingBuddies(currentMovieBuddy, currentPreferences.preferences);
//     } catch (error) {
//       console.error('Error loading saved data:', error);
//       toast.error('Failed to load saved data');
//       navigate('/movie-buddy-portal');
//     }
//   };

//   const fetchMatchingBuddies = async (movieDetails, preferences) => {
//     try {
//       setLoading(true);
//       const response = await axios.get('http://localhost:3000/api/movie-buddies/buddies', {
//         params: {
//           movieName: movieDetails.movieName,
//           movieDate: movieDetails.movieDate,
//           movieTime: movieDetails.movieTime
//         }
//       });

//       if (response.data.success) {
//         const allBuddies = response.data.data;
        
//         // Filter buddies based on preferences
//         const filteredBuddies = allBuddies.filter(buddy => {
//           // Skip if buddy is the current user
//           const userEmail = localStorage.getItem('userEmail');
//           if (buddy.email === userEmail) return false;

//           // Match gender preference
//           if (preferences.gender && preferences.gender !== 'Other' && buddy.gender !== preferences.gender) {
//             return false;
//           }

//           // Match age range
//           if (preferences.ageRange) {
//             const [minAge, maxAge] = preferences.ageRange.split('-').map(Number);
//             if (buddy.age < minAge || buddy.age > maxAge) {
//               return false;
//             }
//           }

//           // Match group preference
//           if (preferences.groupPreference === 'single' && buddy.groupPreference !== 'single') {
//             return false;
//           }

//           return true;
//         });

//         setMovieBuddies(filteredBuddies);
//         console.log('Filtered buddies:', filteredBuddies);
//       } else {
//         toast.error('Failed to fetch movie buddies');
//       }
//     } catch (error) {
//       console.error('Error fetching movie buddies:', error);
//       toast.error(error.response?.data?.message || 'Failed to load movie buddies');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (field, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const applyFilters = () => {
//     const filteredBuddies = movieBuddies.filter(buddy => {
//       if (filters.gender && buddy.gender !== filters.gender) return false;
//       if (filters.ageRange) {
//         const [minAge, maxAge] = filters.ageRange.split('-').map(Number);
//         if (buddy.age < minAge || buddy.age > maxAge) return false;
//       }
//       return true;
//     });
//     setMovieBuddies(filteredBuddies);
//     setShowFilters(false);
//   };

//   const handleConnect = async (buddyId) => {
//     try {
//       const response = await axios.post('http://localhost:3000/api/movie-buddies/connect', {
//         buddyId,
//         movieName: movieDetails.movieName,
//         movieDate: movieDetails.movieDate,
//         movieTime: movieDetails.movieTime
//       });

//       if (response.data.success) {
//         toast.success('Connection request sent successfully!');
//       } else {
//         toast.error('Failed to send connection request');
//       }
//     } catch (error) {
//       console.error('Error connecting with buddy:', error);
//       toast.error('Failed to connect with buddy');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-deep-space text-silver flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-deep-space text-silver py-12">
//       <MovieBuddyNavBar />
//       <div className="container mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="max-w-4xl mx-auto"
//         >
//           {/* Movie Details Section */}
//           <div className="bg-electric-purple/10 rounded-xl p-8 border border-silver/10 shadow-lg mb-8">
//             <h1 className="text-3xl font-bold text-amber mb-6">Movie Details</h1>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-deep-space/50 p-6 rounded-lg">
//                 <FontAwesomeIcon icon={faFilm} className="text-amber text-2xl mb-4" />
//                 <h3 className="text-lg font-semibold text-amber mb-2">Movie</h3>
//                 <p className="text-silver">{movieDetails?.movieName}</p>
//               </div>
//               <div className="bg-deep-space/50 p-6 rounded-lg">
//                 <FontAwesomeIcon icon={faCalendarAlt} className="text-amber text-2xl mb-4" />
//                 <h3 className="text-lg font-semibold text-amber mb-2">Date</h3>
//                 <p className="text-silver">{movieDetails?.movieDate}</p>
//               </div>
//               <div className="bg-deep-space/50 p-6 rounded-lg">
//                 <FontAwesomeIcon icon={faClock} className="text-amber text-2xl mb-4" />
//                 <h3 className="text-lg font-semibold text-amber mb-2">Time</h3>
//                 <p className="text-silver">{movieDetails?.movieTime}</p>
//               </div>
//             </div>
//           </div>

//           {/* Filter Button */}
//           <div className="flex justify-end mb-6">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="px-4 py-2 bg-electric-purple/20 text-silver rounded-lg hover:bg-electric-purple/30 flex items-center space-x-2"
//             >
//               <FontAwesomeIcon icon={faFilter} />
//               <span>Filter Buddies</span>
//             </button>
//           </div>

//           {/* Filter Section */}
//           {showFilters && (
//             <div className="bg-electric-purple/10 rounded-xl p-6 border border-silver/10 shadow-lg mb-8">
//               <h2 className="text-xl font-bold text-amber mb-4">Filter Options</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-amber mb-2">Gender</label>
//                   <select
//                     value={filters.gender}
//                     onChange={(e) => handleFilterChange('gender', e.target.value)}
//                     className="w-full bg-deep-space text-silver rounded-lg p-2 border border-silver/20"
//                   >
//                     <option value="">All</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-amber mb-2">Age Range</label>
//                   <select
//                     value={filters.ageRange}
//                     onChange={(e) => handleFilterChange('ageRange', e.target.value)}
//                     className="w-full bg-deep-space text-silver rounded-lg p-2 border border-silver/20"
//                   >
//                     <option value="">All</option>
//                     <option value="18-25">18-25</option>
//                     <option value="26-35">26-35</option>
//                     <option value="36-45">36-45</option>
//                     <option value="46+">46+</option>
//                   </select>
//                 </div>
//                 <div className="flex items-end">
//                   <button
//                     onClick={applyFilters}
//                     className="w-full px-4 py-2 bg-amber text-deep-space rounded-lg hover:bg-amber/90"
//                   >
//                     Apply Filters
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Movie Buddies List */}
//           <div className="space-y-6">
//             {movieBuddies.length === 0 ? (
//               <div className="text-center py-12">
//                 <p className="text-silver text-lg">No matching movie buddies found</p>
//               </div>
//             ) : (
//               movieBuddies.map((buddy) => (
//                 <motion.div
//                   key={buddy._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="bg-electric-purple/10 rounded-xl p-6 border border-silver/10 shadow-lg"
//                 >
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h3 className="text-xl font-bold text-amber mb-2">
//                         {buddy.name}
//                       </h3>
//                       <div className="space-y-2">
//                         <p className="text-silver flex items-center space-x-2">
//                           <FontAwesomeIcon icon={faVenusMars} className="text-amber" />
//                           <span>{buddy.gender} • {buddy.age} years</span>
//                         </p>
//                         {buddy.privacySettings?.showEmail && (
//                           <p className="text-silver flex items-center space-x-2">
//                             <FontAwesomeIcon icon={faEnvelope} className="text-amber" />
//                             <span>{buddy.email}</span>
//                           </p>
//                         )}
//                         {buddy.privacySettings?.showPhone && (
//                           <p className="text-silver flex items-center space-x-2">
//                             <FontAwesomeIcon icon={faPhone} className="text-amber" />
//                             <span>{buddy.phone}</span>
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => handleConnect(buddy._id)}
//                       className="px-4 py-2 bg-amber text-deep-space rounded-lg hover:bg-amber/90 flex items-center space-x-2"
//                     >
//                       <FontAwesomeIcon icon={faUserPlus} />
//                       <span>Connect</span>
//                     </button>
//                   </div>
//                 </motion.div>
//               ))
//             )}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default MovieBuddyFilter; 