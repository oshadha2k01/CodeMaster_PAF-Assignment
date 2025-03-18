import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilm,
  faCalendar,
  faGlassMartiniAlt,
  faClock,
  faUser,
  faSignOutAlt,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const MainNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/now-showing', label: 'Now Showing', icon: faFilm },
    { path: '/upcoming', label: 'Upcoming', icon: faCalendar },
    { path: '/beverages', label: 'Beverages', icon: faGlassMartiniAlt },
    { path: '/show-times', label: 'Show Times', icon: faClock }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-deep-space border-b border-silver/10 fixed top-0 left-0 right-0 z-50">
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
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-silver hover:text-amber hover:bg-electric-purple/10 transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faUser} className="text-sm" />
              <span className="text-sm font-medium">Profile</span>
            </Link>
            <button
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-silver hover:text-amber hover:bg-electric-purple/10 transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="text-sm" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-silver hover:text-amber focus:outline-none"
            >
              <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
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
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-silver hover:text-amber hover:bg-electric-purple/10 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faUser} className="text-sm" />
            <span className="text-sm font-medium">Profile</span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-silver hover:text-amber hover:bg-electric-purple/10 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="text-sm" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </motion.div>
    </nav>
  );
};

export default MainNavBar;
