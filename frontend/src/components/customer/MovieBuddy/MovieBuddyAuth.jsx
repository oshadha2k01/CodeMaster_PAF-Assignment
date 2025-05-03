// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUsers } from '@fortawesome/free-solid-svg-icons';

// const MovieBuddyAuth = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const bookingData = location.state;

//   const handleFindMovieBuddy = () => {
//     navigate('/movie-buddies', { state: { bookingData } });
//   };

//   if (!bookingData) {
//     return (
//       <div className="min-h-screen bg-deep-space text-silver flex items-center justify-center">
//         <div className="text-2xl text-amber">Invalid access. Please complete a booking first.</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-deep-space text-silver py-12">
//       <div className="container mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="max-w-md mx-auto"
//         >
//           <div className="bg-electric-purple/10 rounded-xl p-8 border border-silver/10 shadow-lg">
//             <h1 className="text-3xl font-bold text-amber mb-6 text-center">
//               Movie Buddy Authentication
//             </h1>
            
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-lg font-semibold text-amber mb-2">Email</label>
//                 <input
//                   type="email"
//                   value={bookingData.email}
//                   disabled
//                   className="w-full px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver opacity-70 cursor-not-allowed"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-lg font-semibold text-amber mb-2">Phone</label>
//                 <input
//                   type="tel"
//                   value={bookingData.phone}
//                   disabled
//                   className="w-full px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver opacity-70 cursor-not-allowed"
//                 />
//               </div>

//               <div className="mt-8">
//                 <p className="text-silver text-center mb-4">
//                   Your contact details match our records. Ready to find movie buddies?
//                 </p>
//                 <button
//                   onClick={handleFindMovieBuddy}
//                   className="w-full px-6 py-3 bg-amber text-deep-space rounded-lg hover:bg-amber/80 flex items-center justify-center text-lg"
//                 >
//                   <FontAwesomeIcon icon={faUsers} className="mr-2" />
//                   Let's Find Movie Buddies
//                 </button>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default MovieBuddyAuth;