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
//   faUser
// } from '@fortawesome/free-solid-svg-icons';
// import MovieBuddyNavBar from '../../navbar/MovieBuddyNavBar';

// const MovieBuddyPortal = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [userMovieDetails, setUserMovieDetails] = useState(null);
//   const [movieBuddyStats, setMovieBuddyStats] = useState({
//     totalBuddies: 0,
//     activeGroups: 0,
//   });
//   const [preferences, setPreferences] = useState({
//     gender: '',
//     groupPreference: 'single',
//     ageRange: ''
//   });
//   const [agreed, setAgreed] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // Available options
//   const genderOptions = ['Male', 'Female', 'Other'];
//   const ageRangeOptions = ['18-25', '26-35', '36-45', '46+'];

//   useEffect(() => {
//     fetchUserMovieDetails();
//   }, []);

//   const fetchUserMovieDetails = async () => {
//     try {
//       setLoading(true);
//       const storedEmail = localStorage.getItem('userEmail');
//       const storedPhone = localStorage.getItem('userPhone');

//       if (!storedEmail || !storedPhone) {
//         toast.error('Please complete your Movie Buddy profile first');
//         navigate('/movie-buddy-form');
//         return;
//       }

//       const response = await axios.get('http://localhost:3000/api/movie-buddies/all');
//       if (response.data.success) {
//         const groups = response.data.data;
        
//         // Find the user's movie details
//         let userMovieInfo = null;
//         for (const group of groups) {
//           const userBuddy = group.buddies.find(buddy => 
//             buddy.email === storedEmail && buddy.phone === storedPhone
//           );
//           if (userBuddy) {
//             userMovieInfo = {
//               movieName: group.movieName,
//               movieDate: group.movieDate,
//               movieTime: group.movieTime,
//               bookingId: userBuddy.bookingId,
//               seatNumbers: userBuddy.seatNumbers
//             };
//             break;
//           }
//         }

//         if (userMovieInfo) {
//           setUserMovieDetails(userMovieInfo);
          
//           // Calculate stats
//           const stats = {
//             totalBuddies: groups.reduce((acc, group) => acc + group.buddies.length, 0),
//             activeGroups: groups.length,
//           };
//           setMovieBuddyStats(stats);
//         } else {
//           toast.error('No Movie Buddy profile found. Please create one first.');
//           navigate('/movie-buddy-form');
//         }
//       } else {
//         toast.error('Failed to fetch movie details');
//       }
//     } catch (error) {
//       console.error('Error fetching movie details:', error);
//       toast.error(error.response?.data?.message || 'Failed to load movie details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePreferenceChange = (field, value) => {
//     setPreferences(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       setIsLoading(true);
      
//       // Validate preferences
//       if (!preferences.gender || !preferences.ageRange) {
//         toast.error('Please select both gender and age range preferences');
//         return;
//       }

//       // Show loading toast
//       const loadingToast = toast.loading('Finding your movie buddies...');

//       // Get existing preferences from localStorage
//       const existingPreferences = JSON.parse(localStorage.getItem('movieBuddyPreferences') || '{}');
//       console.log('Existing preferences:', existingPreferences);

//       // Create new preferences object with current movie details
//       const newPreferences = {
//         ...existingPreferences,
//         [userMovieDetails.movieName]: {
//           movieName: userMovieDetails.movieName,
//           movieDate: userMovieDetails.movieDate,
//           movieTime: userMovieDetails.movieTime,
//           preferences: {
//             gender: preferences.gender,
//             groupPreference: preferences.groupPreference,
//             ageRange: preferences.ageRange,
//             timestamp: new Date().toISOString()
//           }
//         }
//       };

//       // Save to localStorage
//       localStorage.setItem('movieBuddyPreferences', JSON.stringify(newPreferences));
//       console.log('Saved preferences to localStorage:', newPreferences);

//       // Save current movie details for the buddies page
//       const currentMovieBuddy = {
//         movieName: userMovieDetails.movieName,
//         movieDate: userMovieDetails.movieDate,
//         movieTime: userMovieDetails.movieTime,
//         preferences: preferences
//       };
//       localStorage.setItem('currentMovieBuddy', JSON.stringify(currentMovieBuddy));
//       console.log('Saved current movie buddy to localStorage:', currentMovieBuddy);

//       // Verify the data was saved correctly
//       const savedPreferences = JSON.parse(localStorage.getItem('movieBuddyPreferences'));
//       const savedCurrentMovieBuddy = JSON.parse(localStorage.getItem('currentMovieBuddy'));
      
//       if (savedPreferences && savedCurrentMovieBuddy) {
//         console.log('Successfully verified saved data in localStorage');
        
//         // Update loading toast
//         toast.loading('Matching preferences with movie buddies...', {
//           id: loadingToast
//         });

//         // Add artificial delay to show loading state
//         await new Promise(resolve => setTimeout(resolve, 2000));

//         // Update loading toast with success
//         toast.success('Movie buddies found! Redirecting...', {
//           id: loadingToast
//         });

//         // Add small delay before navigation
//         await new Promise(resolve => setTimeout(resolve, 1000));

//         // Navigate to movie buddy filter page
//         navigate('/movie-buddy-filter');
//       } else {
//         throw new Error('Failed to verify saved data');
//       }
//     } catch (error) {
//       console.error('Error saving preferences:', error);
//       toast.error('Failed to save preferences');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate(-1);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-deep-space text-silver flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber"></div>
//       </div>
//     );
//   }

//   if (!userMovieDetails) {
//     return (
//       <div className="min-h-screen bg-deep-space text-silver flex items-center justify-center">
//         <div className="text-2xl text-amber">No movie details found</div>
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
//             <h1 className="text-3xl font-bold text-amber mb-6">Your Movie Details</h1>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-deep-space/50 p-6 rounded-lg">
//                 <FontAwesomeIcon icon={faFilm} className="text-amber text-2xl mb-4" />
//                 <h3 className="text-lg font-semibold text-amber mb-2">Movie</h3>
//                 <p className="text-silver">{userMovieDetails.movieName}</p>
//               </div>
//               <div className="bg-deep-space/50 p-6 rounded-lg">
//                 <FontAwesomeIcon icon={faCalendarAlt} className="text-amber text-2xl mb-4" />
//                 <h3 className="text-lg font-semibold text-amber mb-2">Date</h3>
//                 <p className="text-silver">{userMovieDetails.movieDate}</p>
//               </div>
//               <div className="bg-deep-space/50 p-6 rounded-lg">
//                 <FontAwesomeIcon icon={faClock} className="text-amber text-2xl mb-4" />
//                 <h3 className="text-lg font-semibold text-amber mb-2">Time</h3>
//                 <p className="text-silver">{userMovieDetails.movieTime}</p>
//               </div>
//             </div>
//           </div>

//           {/* Stats Section */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <div className="bg-electric-purple/10 rounded-xl p-6 border border-silver/10 shadow-lg">
//               <FontAwesomeIcon icon={faUsers} className="text-amber text-2xl mb-4" />
//               <h3 className="text-lg font-semibold text-amber mb-2">Total Buddies</h3>
//               <p className="text-3xl font-bold text-silver">{movieBuddyStats.totalBuddies}</p>
//             </div>
//             <div className="bg-electric-purple/10 rounded-xl p-6 border border-silver/10 shadow-lg">
//               <FontAwesomeIcon icon={faUserFriends} className="text-amber text-2xl mb-4" />
//               <h3 className="text-lg font-semibold text-amber mb-2">Active Groups</h3>
//               <p className="text-3xl font-bold text-silver">{movieBuddyStats.activeGroups}</p>
//             </div>
//           </div>

//           {/* Preferences Section */}
//           <div className="bg-electric-purple/10 rounded-xl p-8 border border-silver/10 shadow-lg mb-8">
//             <h2 className="text-2xl font-bold text-amber mb-6">Your Preferences</h2>
//             <div className="space-y-6">
//               {/* Gender Preference */}
//               <div>
//                 <label className="flex items-center space-x-2 text-amber mb-2">
//                   <FontAwesomeIcon icon={faVenusMars} />
//                   <span className="text-sm">Gender Preference</span>
//                 </label>
//                 <div className="flex flex-wrap gap-2">
//                   {genderOptions.map((gender) => (
//                     <button
//                       key={gender}
//                       onClick={() => handlePreferenceChange('gender', gender)}
//                       className={`px-3 py-1.5 rounded-lg border transition-colors duration-200 flex items-center space-x-2 text-sm
//                         ${preferences.gender === gender 
//                           ? 'bg-amber text-deep-space border-amber' 
//                           : 'bg-deep-space text-silver border-silver/20 hover:border-amber/50'}`}
//                     >
//                       <span>{gender}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Group Preference */}
//               <div>
//                 <label className="flex items-center space-x-2 text-amber mb-2">
//                   <FontAwesomeIcon icon={faUserGroup} />
//                   <span className="text-sm">Group Preference</span>
//                 </label>
//                 <div className="flex flex-wrap gap-2">
//                   <button
//                     onClick={() => handlePreferenceChange('groupPreference', 'single')}
//                     className={`px-3 py-1.5 rounded-lg border transition-colors duration-200 flex items-center space-x-2 text-sm
//                       ${preferences.groupPreference === 'single' 
//                         ? 'bg-amber text-deep-space border-amber' 
//                         : 'bg-deep-space text-silver border-silver/20 hover:border-amber/50'}`}
//                   >
//                     <FontAwesomeIcon icon={faUser} className="text-xs" />
//                     <span>Single</span>
//                   </button>
//                   <button
//                     onClick={() => handlePreferenceChange('groupPreference', 'group')}
//                     className={`px-3 py-1.5 rounded-lg border transition-colors duration-200 flex items-center space-x-2 text-sm
//                       ${preferences.groupPreference === 'group' 
//                         ? 'bg-amber text-deep-space border-amber' 
//                         : 'bg-deep-space text-silver border-silver/20 hover:border-amber/50'}`}
//                   >
//                     <FontAwesomeIcon icon={faUserGroup} className="text-xs" />
//                     <span>Group</span>
//                   </button>
//                 </div>
//               </div>

//               {/* Age Range */}
//               <div>
//                 <label className="flex items-center space-x-2 text-amber mb-2">
//                   <FontAwesomeIcon icon={faCalendarAlt} />
//                   <span className="text-sm">Age Range</span>
//                 </label>
//                 <div className="flex flex-wrap gap-2">
//                   {ageRangeOptions.map((age) => (
//                     <button
//                       key={age}
//                       onClick={() => handlePreferenceChange('ageRange', age)}
//                       className={`px-3 py-1.5 rounded-lg border transition-colors duration-200 flex items-center space-x-2 text-sm
//                         ${preferences.ageRange === age 
//                           ? 'bg-amber text-deep-space border-amber' 
//                           : 'bg-deep-space text-silver border-silver/20 hover:border-amber/50'}`}
//                     >
//                       <span>{age}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Terms and Conditions */}
//               <div className="flex items-center space-x-2 bg-electric-purple/20 p-4 rounded-lg border border-silver/10">
//                 <input
//                   type="checkbox"
//                   id="terms"
//                   checked={agreed}
//                   onChange={(e) => setAgreed(e.target.checked)}
//                   className="rounded border-silver/20 text-amber focus:ring-amber"
//                 />
//                 <label htmlFor="terms" className="text-silver text-sm">
//                   I agree to share my information with potential movie buddies
//                 </label>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex justify-end space-x-4">
//                 <button
//                   onClick={handleCancel}
//                   className="px-4 py-2 text-silver hover:text-amber focus:outline-none"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   disabled={!agreed || isLoading}
//                   className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2
//                     ${isLoading || !agreed
//                       ? 'bg-amber/50 text-deep-space cursor-not-allowed'
//                       : 'bg-amber text-deep-space hover:bg-amber/90'}`}
//                 >
//                   {isLoading ? (
//                     <span className="flex items-center space-x-2">
//                       <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
//                       <span>Finding Buddies...</span>
//                     </span>
//                   ) : (
//                     'Find Movie Buddies'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default MovieBuddyPortal;