// import React from 'react';
// import { motion } from 'framer-motion';
// import { Link, useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFilm, faTicket, faUtensils, faUserFriends } from '@fortawesome/free-solid-svg-icons';
// import Slider from 'react-slick';
// import { TypeAnimation } from 'react-type-animation';
// import MainNavBar from '../navbar/MainNavBar';

// // Import react-slick CSS (assuming CDN usage in index.html)
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// const Home = () => {
//   const navigate = useNavigate();

//   // Slider settings for react-slick with vertical sliding
//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 1000,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 4000,
//     vertical: true, // Enable vertical sliding
//     verticalSwiping: true, // Allow vertical swipe
//     arrows: true,
//     cssEase: 'ease-in-out',
//     pauseOnHover: true,
//   };

//   // Sample movie data (replace with actual movie data or API fetch)
//   const movies = [
//     {
//       id: 1,
//       title: 'Cosmic Adventure',
//       poster: 'https://media.istockphoto.com/id/1126093641/photo/hollywood-sign-from-central-la.jpg?s=612x612&w=0&k=20&c=I0jafDVsxn2Aj7zcnU2xhgQFtTD4i1BIMZWJWFJkCII=',
//     },
//     {
//       id: 2,
//       title: 'Starlight Saga',
//       poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDsjKc6YYFjamjBO07sV5QsDNkmfuXbxQ6mQ&s',
//     },
//     {
//       id: 3,
//       title: 'Galactic Quest',
//       poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_7E-caxoN1sHtXbaMrojimMC7Oegg1_zDb7iSJJxYBLpzw3CysbuEtMBy9gNOHDk5m2g&usqp=CAU',
//     },
//     {
//       id: 4,
//       title: 'Nebula Nights',
//       poster: 'https://via.placeholder.com/1200x600?text=Nebula+Nights',
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-deep-space text-silver">
//       <MainNavBar />
//       {/* Hero Section */}
//       <section className="relative h-screen flex flex-col justify-center items-center text-center px-4">
//         <div className="absolute inset-0 bg-gradient-to-r from-electric-purple/10 to-scarlet/10 z-0"></div>
        
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 1, ease: 'easeOut' }}
//           className="relative z-10  from-electric-purple/20 to-scarlet/20 p-8 rounded-xl shadow-2xl"
//         >
//           <TypeAnimation
//             sequence={[
//               'Welcome to GalaxyX Cinema',
//               2000,
//               'Experience Cinematic Excellence',
//               2000,
//               'Dive into a Universe of Stories',
//               2000,
//             ]}
//             wrapper="h1"
//             repeat={Infinity}
//             className="text-4xl md:text-6xl font-bold text-amber mb-6 glow-text"
//           />
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             className="text-lg md:text-xl max-w-2xl mb-8 text-silver/90"
//           >
//             Immerse yourself in state-of-the-art technology and unparalleled comfort at GalaxyX Cinema.
//           </motion.p>
//           <motion.button
//             whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 191, 0, 0.5)' }}
//             whileTap={{ scale: 0.95 }}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//             className="bg-scarlet hover:bg-amber text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
//             onClick={() => navigate('/now-showing')}
//           >
//             Book Now
//           </motion.button>
//         </motion.div>
//       </section>

//       {/* Movie Slideshow Section */}
//       <section className="py-16 px-4 md:px-8 lg:px-16 bg-deep-space">
//         <h2 className="text-3xl font-bold text-amber text-center mb-8">Featured Movies</h2>
//         <div className="max-w-6xl mx-auto">
//           <Slider {...sliderSettings}>
//             {movies.map((movie) => (
//               <div key={movie.id} className="relative">
//                 <motion.div
//                   initial={{ opacity: 0, y: 50 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 1, ease: 'easeOut' }}
//                   className="relative cursor-pointer"
//                   onClick={() => navigate(`/movies/${movie.id}`)}
//                 >
//                   <img
//                     src={movie.poster}
//                     alt={movie.title}
//                     className="w-full h-[500px] md:h-[600px] object-cover rounded-lg"
//                     style={{ opacity: 1 }} // Ensure maximum opacity
//                   />
//                   <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-lg">
//                     <h3 className="text-amber text-2xl font-semibold">{movie.title}</h3>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation(); // Prevent parent div click
//                         navigate(`/movies/${movie.id}`);
//                       }}
//                       className="mt-2 bg-scarlet hover:bg-amber text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
//                     >
//                       View Details
//                     </button>
//                   </div>
//                 </motion.div>
//               </div>
//             ))}
//           </Slider>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16 px-4 md:px-8 lg:px-16">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {features.map((feature, index) => (
//             <motion.div
//               key={feature.title}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               className="bg-electric-purple/10 p-6 rounded-lg border border-silver/10 hover:border-electric-purple transform hover:-translate-y-2 transition-all duration-300"
//             >
//               <FontAwesomeIcon 
//                 icon={feature.icon} 
//                 className="text-amber text-3xl mb-4"
//               />
//               <h3 className="text-amber text-xl font-semibold mb-2">{feature.title}</h3>
//               <p className="text-silver/80">{feature.description}</p>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 px-4 bg-gradient-to-r from-deep-space to-electric-purple/20">
//         <div className="max-w-6xl mx-auto text-center">
//           <h2 className="text-3xl md:text-4xl font-bold text-amber mb-6">Ready for an Epic Movie Experience?</h2>
//           <p className="text-lg mb-8 max-w-2xl mx-auto">Join us at GalaxyX Cinema and immerse yourself in the ultimate cinematic journey.</p>
//           <Link 
//             to="/movies" 
//             className="inline-block bg-scarlet hover:bg-amber text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
//           >
//             View Movies
//           </Link>
//         </div>
//       </section>

//       {/* Custom CSS for glowing text effect */}
//       <style>
//         {`
//           .glow-text {
//             text-shadow: 0 0 10px rgba(255, 191, 0, 0.8), 0 0 20px rgba(255, 191, 0, 0.6);
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// const features = [
//   {
//     title: "4K Laser Projection",
//     description: "Experience crystal clear visuals with our state-of-the-art 4K laser projection system.",
//     icon: faFilm
//   },
//   {
//     title: "Dolby Atmos Sound",
//     description: "Immerse yourself in 360° sound with our advanced Dolby Atmos audio system.",
//     icon: faTicket
//   },
//   {
//     title: "Premium Comfort",
//     description: "Relax in our luxurious reclining seats with extra legroom and personal space.",
//     icon: faUtensils
//   },
//   {
//     title: "Gourmet Concessions",
//     description: "Enjoy premium snacks and beverages delivered right to your seat.",
//     icon: faUserFriends
//   }
// ];

// export default Home;

import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faTicket, faUtensils, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import Slider from 'react-slick';
import { TypeAnimation } from 'react-type-animation';
import MainNavBar from '../navbar/MainNavBar';

// Import react-slick CSS
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Home = () => {
  const navigate = useNavigate();

  // Slider settings for react-slick with vertical sliding
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Faster auto-navigation
    vertical: true, // Keep vertical sliding
    verticalSwiping: true, // Allow vertical swipe
    arrows: true,
    cssEase: 'ease-in-out',
    pauseOnHover: true,
    appendDots: (dots) => (
      <div style={{ bottom: '-30px' }}>
        <ul className="flex justify-center space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2 h-2 bg-silver/50 rounded-full hover:bg-amber transition-colors duration-300" />
    ),
  };

  // Sample movie data (replace with actual movie data or API fetch)
  const movies = [
    {
      id: 1,
      title: 'Wisal Adare',
      poster: 'https://i.ytimg.com/vi/Lk2aOLEFNMM/maxresdefault.jpg',
    },
    {
      id: 2,
      title: 'Starlight Saga',
      poster: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgE9lSmxgTJFiq8jkKUPmtxcsXGlWcoxKLnf_mi2wbc-UxtuTzJi_jrL6UPsIaLVoc9LxiSp2sv-g9U2JVLCQjYm0lFADnSooBSgcakbemgg6-Lb76gmdtc5O6sFIIq3gl50UDg0UHjVr3ctfNtzjBcjQyYi2bRsxoNRg_6ga3AW1lrVBDL4JrqQmDI8g/s1600/kodu.jpg',
    },
    {
      id: 3,
      title: 'Galactic Quest',
      poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_7E-caxoN1sHtXbaMrojimMC7Oegg1_zDb7iSJJxYBLpzw3CysbuEtMBy9gNOHDk5m2g&usqp=CAU',
    },
    {
      id: 4,
      title: 'Nebula Nights',
      poster: 'https://i.ytimg.com/vi/DO0HN5W0XbU/maxresdefault.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-deep-space text-silver">
      <MainNavBar />
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-electric-purple/10 to-scarlet/10 z-0"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative z-10  from-electric-purple/20 to-scarlet/20 p-8 rounded-xl shadow-2xl"
        >
          <TypeAnimation
            sequence={[
              'Welcome to GalaxyX Cinema',
              2000,
              'Experience Cinematic Excellence',
              2000,
              'Dive into a Universe of Stories',
              2000,
            ]}
            wrapper="h1"
            repeat={Infinity}
            className="text-4xl md:text-6xl font-bold text-amber mb-6 glow-text"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl mb-8 text-silver/90"
          >
            Immerse yourself in state-of-the-art technology and unparalleled comfort at GalaxyX Cinema.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 191, 0, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-scarlet hover:bg-amber text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
            onClick={() => navigate('/now-showing')}
          >
            Book Now
          </motion.button>
        </motion.div>
      </section>

      {/* Movie Slideshow Section */}
      <section className="py-8 px-4 md:px-8 lg:px-16 bg-deep-space">
        <h2 className="text-2xl font-bold text-amber text-center mb-4">Featured Movies</h2>
        <div className="max-w-6xl mx-auto">
          <Slider {...sliderSettings}>
            {movies.map((movie) => (
              <div key={movie.id} className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="relative cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => navigate(`/movies/${movie.id}`)}
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-[300px] md:h-[400px] object-cover"
                    style={{ opacity: 1 }} // Maximum opacity
                  />
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                    <h3 className="text-amber text-lg md:text-xl font-semibold">{movie.title}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/movies/${movie.id}`);
                      }}
                      className="mt-2 bg-scarlet hover:bg-amber text-white font-bold py-1 px-3 rounded-lg text-sm transition-colors duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-electric-purple/10 p-6 rounded-lg border border-silver/10 hover:border-electric-purple transform hover:-translate-y-2 transition-all duration-300"
            >
              <FontAwesomeIcon 
                icon={feature.icon} 
                className="text-amber text-3xl mb-4"
              />
              <h3 className="text-amber text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-silver/80">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      
      <style>
        {`
          .glow-text {
            text-shadow: 0 0 10px rgba(255, 191, 0, 0.8), 0 0 20px rgba(255, 191, 0, 0.6);
          }
          .slick-prev, .slick-next {
            z-index: 10;
            width: 30px;
            height: 30px;
            background: rgba(255, 36, 0, 0.7); /* scarlet */
            border-radius: 50%;
            transition: background 0.3s;
          }
          .slick-prev:hover, .slick-next:hover {
            background: #ffbf00; /* amber */
          }
          .slick-prev:before, .slick-next:before {
            color: #ffffff;
            font-size: 16px;
          }
          .slick-prev {
            left: 10px;
          }
          .slick-next {
            right: 10px;
          }
          .slick-dots li.slick-active div {
            background: #ffbf00; /* amber */
          }
        `}
      </style>
    </div>
  );
};

const features = [
  {
    title: "4K Laser Projection",
    description: "Experience crystal clear visuals with our state-of-the-art 4K laser projection system.",
    icon: faFilm
  },
  {
    title: "Dolby Atmos Sound",
    description: "Immerse yourself in 360° sound with our advanced Dolby Atmos audio system.",
    icon: faTicket
  },
  {
    title: "Premium Comfort",
    description: "Relax in our luxurious reclining seats with extra legroom and personal space.",
    icon: faUtensils
  },
  {
    title: "Gourmet Concessions",
    description: "Enjoy premium snacks and beverages delivered right to your seat.",
    icon: faUserFriends
  }
];

export default Home;