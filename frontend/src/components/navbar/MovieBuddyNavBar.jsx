import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faUserCircle, 
  faTicket, 
  faFilm, 
  faHome, 
  faBars, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';

const MovieBuddyNavBar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  
  // Define navigation items
  const navItems = [
    // { label: 'Home', path: '/', icon: faHome },
    // { label: 'Movies', path: '/now-showing', icon: faFilm },
    { label: 'Movie Buddies', path: '/movie-buddies', icon: faUsers },
    { label: 'My Profile', path: '/movie-buddy-main-profile', icon: faUserCircle },
    // { label: 'My Bookings', path: '/bookings', icon: faTicket }
  ];

  useEffect(() => {
    // Get user name from localStorage
    const email = localStorage.getItem('userEmail');
    if (email) {
      fetch(`http://localhost:3000/api/movie-buddies/profile?email=${email}&phone=${localStorage.getItem('userPhone') || ''}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.name) {
            // Extract first name for greeting
            const firstName = data.name.split(' ')[0];
            setUserName(firstName);
          }
        })
        .catch(err => {
          console.error('Error fetching user profile:', err);
        });
    }
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-deep-space/90 backdrop-blur-md py-4 shadow-lg shadow-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faFilm} className="text-amber text-2xl" />
              <span className="text-xl font-bold text-amber">GalaxyX Cinema</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-300
                  ${isActive(item.path)
                    ? 'bg-electric-purple/20 text-amber'
                    : 'text-silver hover:text-amber hover:bg-electric-purple/10'
                  }`}
              >
                <FontAwesomeIcon icon={item.icon} className="text-sm" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
            
            {userName && (
              <div className="px-3 py-2 rounded-lg bg-amber/20 text-amber flex items-center space-x-2">
                <FontAwesomeIcon icon={faUserCircle} className="text-sm" />
                <span className="text-sm font-medium">Hi, {userName}</span>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-silver hover:text-amber p-2"
            >
              <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        initial={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {userName && (
            <div className="px-3 py-2 rounded-lg bg-amber/20 text-amber flex items-center space-x-2">
              <FontAwesomeIcon icon={faUserCircle} className="text-sm" />
              <span className="text-sm font-medium">Hi, {userName}</span>
            </div>
          )}
          
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-300
                ${isActive(item.path)
                  ? 'bg-electric-purple/20 text-amber'
                  : 'text-silver hover:text-amber hover:bg-electric-purple/10'
                }`}
            >
              <FontAwesomeIcon icon={item.icon} className="text-sm" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </nav>
  );
};

export default MovieBuddyNavBar;