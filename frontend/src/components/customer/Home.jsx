import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faTicket, faUtensils, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import MainNavBar from '../navbar/MainNavBar';

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="min-h-screen bg-deep-space text-silver">
      <MainNavBar />
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-electric-purple/10 to-scarlet/10 z-0"></div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-amber mb-6 z-10"
        >
          Welcome to GalaxyX Cinema
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl max-w-2xl mb-8 z-10"
        >
          Experience the future of cinema with state-of-the-art technology and unparalleled comfort
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-scarlet hover:bg-amber text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 z-10"
          onClick={() => navigate("/now-showing")} // Corrected navigation
        >
          Book Now
        </motion.button>
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

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-deep-space to-electric-purple/20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-amber mb-6">Ready for an Epic Movie Experience?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Join us at GalaxyX Cinema and immerse yourself in the ultimate cinematic journey.</p>
          <Link 
            to="/movies" 
            className="inline-block bg-scarlet hover:bg-amber text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
          >
            View Movies
          </Link>
        </div>
      </section>
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
