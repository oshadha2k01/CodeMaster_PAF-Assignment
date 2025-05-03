import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import MainNavBar from '../navbar/MainNavBar';

// Placeholder location data (replace with API fetch)
const locations = [
  {
    id: 1,
    poster: 'https://theatersollution.s3.amazonaws.com/60ee8ca3-e8ee-448d-a5bd-ebbc768bf3b7.jpg',
    name: 'GalaxyX Cinema - Downtown',
    address: '123 Starlight Avenue, City Center, Galaxy City',
    phone: '+1 (555) 123-4567',
    mapUrl: 'https://maps.google.com/?q=123+Starlight+Avenue,Galaxy+City',
  },
  {
    id: 2,
    poster: 'https://theatersollution.s3.amazonaws.com/c615697a-fd01-48bf-b40b-4067badf0189.jpeg',
    name: 'GalaxyX Cinema - Uptown',
    address: '456 Nebula Road, Uptown District, Galaxy City',
    phone: '+1 (555) 987-6543',
    mapUrl: 'https://maps.google.com/?q=456+Nebula+Road,Galaxy+City',
  },
  {
    id: 3,
    poster: 'https://theatersollution.s3.amazonaws.com/7f3ad000-a850-43d8-81f6-af2520b2605a.png',
    name: 'GalaxyX Cinema - Riverside',
    address: '789 Cosmic Boulevard, Riverside, Galaxy City',
    phone: '+1 (555) 321-7890',
    mapUrl: 'https://maps.google.com/?q=789+Cosmic+Boulevard,Galaxy+City',
  },
];

const Locations = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-deep-space text-silver">
      <MainNavBar />
      {/* Hero Section */}
      

      {/* Locations Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-deep-space">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-amber text-center mb-12 ">Our Cinemas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-electric-purple/10 p-6 rounded-lg border border-silver/10 hover:border-electric-purple transform hover:-translate-y-2 transition-all duration-300"
              >
                <motion.img
                  src={location.poster}
                  alt={`${location.name} exterior`}
                  className="w-full h-[200px] object-cover rounded-lg mb-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  whileHover={{ scale: 1.05 }}
                />
                <h3 className="text-amber text-xl font-semibold mb-3">{location.name}</h3>
                <div className="flex items-start mb-3">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-amber text-lg mr-2 mt-1" />
                  <p className="text-silver/80">{location.address}</p>
                </div>
                <div className="flex items-center mb-3">
                  <FontAwesomeIcon icon={faPhone} className="text-amber text-lg mr-2" />
                  <p className="text-silver/80">{location.phone}</p>
                </div>
                <div className="flex justify-between items-center">
                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber hover:text-silver underline flex items-center"
                  >
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                    View on Map
                  </a>
                  <button
                    onClick={() => navigate(`/locations/${location.id}`)}
                    className="bg-scarlet hover:bg-amber text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-deep-space to-electric-purple/20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-amber mb-6 ">
            Ready for a Cinematic Adventure?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-silver/90">
            Visit any of our GalaxyX Cinema locations and immerse yourself in the ultimate movie experience.
          </p>
          <Link
            to="/now-showing"
            className="inline-block bg-scarlet hover:bg-amber text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
          >
            Book Now
          </Link>
        </div>
      </section>

      {/* Custom CSS for glowing text and styling */}
      <style>
        {`
          .glow-text {
            text-shadow: 0 0 10px rgba(255, 191, 0, 0.8), 0 0 20px rgba(255, 191, 0, 0.6);
          }
        `}
      </style>
    </div>
  );
};

export default Locations;