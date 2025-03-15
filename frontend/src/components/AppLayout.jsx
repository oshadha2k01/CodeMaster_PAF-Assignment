import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HomeIcon, FilmIcon, TicketIcon, UserIcon } from '@heroicons/react/24/outline';

function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0A192F]">
      <nav className="bg-[#0A192F]/90 backdrop-blur-lg border-b border-[#8A2BE2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-[#FFBF00] to-[#FF2400] bg-clip-text text-transparent">
                  GalaxyX
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === '/'
                      ? 'bg-[#8A2BE2] text-white'
                      : 'text-[#C0C0C0] hover:bg-[#8A2BE2]/10 hover:text-white'
                  }`}
                >
                  <HomeIcon className="h-5 w-5 mr-2" />
                  Home
                </Link>
                <Link
                  to="/movies"
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === '/movies'
                      ? 'bg-[#8A2BE2] text-white'
                      : 'text-[#C0C0C0] hover:bg-[#8A2BE2]/10 hover:text-white'
                  }`}
                >
                  <FilmIcon className="h-5 w-5 mr-2" />
                  Movies
                </Link>
                {user && (
                  <Link
                    to="/bookings"
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === '/bookings'
                        ? 'bg-[#8A2BE2] text-white'
                        : 'text-[#C0C0C0] hover:bg-[#8A2BE2]/10 hover:text-white'
                    }`}
                  >
                    <TicketIcon className="h-5 w-5 mr-2" />
                    My Bookings
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-[#C0C0C0]">
                    <UserIcon className="h-5 w-5" />
                    <span>{user.email}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-[#FF2400] hover:bg-[#FFBF00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF2400] transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 border border-[#8A2BE2] text-sm font-medium rounded-lg text-[#C0C0C0] hover:bg-[#8A2BE2]/10 hover:text-white transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-[#FF2400] hover:bg-[#FFBF00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF2400] transition-all duration-200"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>

      <footer className="bg-[#0A192F]/90 backdrop-blur-lg border-t border-[#8A2BE2] mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-[#C0C0C0] text-sm">
            © {new Date().getFullYear()} GalaxyX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout; 