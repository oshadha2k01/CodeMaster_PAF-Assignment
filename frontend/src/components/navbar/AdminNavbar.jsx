import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilm,
  faTicket,
  faUtensils,
  faUserFriends,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/admin/movies', icon: faFilm, text: 'Movie Management' },
    { path: '/admin/bookings', icon: faTicket, text: 'Booking Management' },
    { path: '/admin/food', icon: faUtensils, text: 'Food Management' },
    { path: '/admin/movie-buddy', icon: faUserFriends, text: 'Movie Buddy' },
  ];

  return (
    <nav className="bg-deep-space border-b border-silver/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/admin" className="text-amber text-xl font-bold">
              GalaxyX Admin
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300
                    ${location.pathname === item.path
                      ? 'text-amber bg-electric-purple/20'
                      : 'text-silver hover:text-amber hover:bg-electric-purple/10'
                    }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="mr-2" />
                  {item.text}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-electric-purple/10 inline-flex items-center justify-center p-2 rounded-md text-silver
                       hover:text-amber hover:bg-electric-purple/20 focus:outline-none"
            >
              <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-deep-space/95 backdrop-blur-lg border-t border-silver/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300
                  ${location.pathname === item.path
                    ? 'text-amber bg-electric-purple/20'
                    : 'text-silver hover:text-amber hover:bg-electric-purple/10'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon={item.icon} className="mr-2" />
                {item.text}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar; 