import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FilmIcon,
  TicketIcon,
  CakeIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { logout } from '../services/authService';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
    }
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'movies', name: 'Movie Management', icon: FilmIcon },
    { id: 'bookings', name: 'Booking Management', icon: TicketIcon },
    { id: 'food', name: 'Food Management', icon: CakeIcon },
    { id: 'movieBuddy', name: 'Movie Buddy', icon: UserGroupIcon },
    { id: 'users', name: 'User Management', icon: UsersIcon },
    { id: 'settings', name: 'Settings', icon: Cog6ToothIcon },
  ];

  const stats = [
    { name: 'Total Bookings', value: '2,345', change: '+12.5%', changeType: 'increase' },
    { name: 'Active Movies', value: '24', change: '+3', changeType: 'increase' },
    { name: 'Revenue', value: '$45,678', change: '+23.1%', changeType: 'increase' },
    { name: 'Movie Buddy Matches', value: '456', change: '+45.5%', changeType: 'increase' },
  ];

  const recentBookings = [
    { id: 1, movie: 'Inception', customer: 'John Doe', seats: '2', time: '20:00', date: '2024-03-14' },
    { id: 2, movie: 'The Matrix', customer: 'Jane Smith', seats: '3', time: '18:30', date: '2024-03-14' },
    { id: 3, movie: 'Interstellar', customer: 'Mike Johnson', seats: '4', time: '19:15', date: '2024-03-14' },
  ];

  const popularMovies = [
    { id: 1, name: 'Dune: Part Two', bookings: 234, revenue: '$4,567' },
    { id: 2, name: 'Kung Fu Panda 4', bookings: 189, revenue: '$3,789' },
    { id: 3, name: 'Bob Marley: One Love', bookings: 156, revenue: '$3,123' },
  ];

  return (
    <div className="flex h-screen bg-[#0A192F]">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-[#0A192F] border-r border-[#8A2BE2] p-4`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className={`${isSidebarOpen ? 'block' : 'hidden'} text-xl font-bold bg-gradient-to-r from-[#FFBF00] to-[#FF2400] bg-clip-text text-transparent`}>
            Admin Panel
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-[#0A192F] text-[#C0C0C0] hover:bg-[#8A2BE2]/10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isSidebarOpen ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7' : 'M13 5l7 7-7 7M5 5l7 7-7 7'}
              />
            </svg>
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-[#8A2BE2] text-white'
                  : 'text-[#C0C0C0] hover:bg-[#8A2BE2]/10'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className={`${isSidebarOpen ? 'ml-3' : 'hidden'}`}>{item.name}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center px-4 py-3 rounded-lg mt-8 text-[#FF2400] hover:bg-[#FF2400]/10 transition-colors`}
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />
          <span className={`${isSidebarOpen ? 'ml-3' : 'hidden'}`}>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-[#0A192F]/90 backdrop-blur-lg border-b border-[#8A2BE2] p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#C0C0C0]">
              {navItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg bg-[#0A192F] text-[#C0C0C0] hover:bg-[#8A2BE2]/10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FFBF00] to-[#FF2400]" />
                <span className="text-[#C0C0C0]">Admin</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div
                    key={stat.name}
                    className="bg-[#0A192F]/90 backdrop-blur-lg border border-[#8A2BE2] rounded-lg p-6"
                  >
                    <dt className="text-sm font-medium text-[#C0C0C0]">{stat.name}</dt>
                    <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                      <div className="flex items-baseline text-2xl font-semibold text-[#FFBF00]">
                        {stat.value}
                      </div>
                      <div className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0 ${
                        stat.changeType === 'increase'
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </div>
                ))}
              </div>

              {/* Recent Bookings */}
              <div className="bg-[#0A192F]/90 backdrop-blur-lg border border-[#8A2BE2] rounded-lg p-6">
                <h3 className="text-lg font-medium text-[#C0C0C0] mb-4">Recent Bookings</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#8A2BE2]">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#C0C0C0] uppercase tracking-wider">Movie</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#C0C0C0] uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#C0C0C0] uppercase tracking-wider">Seats</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#C0C0C0] uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#C0C0C0] uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#8A2BE2]">
                      {recentBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#C0C0C0]">{booking.movie}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#C0C0C0]">{booking.customer}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#C0C0C0]">{booking.seats}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#C0C0C0]">{booking.time}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#C0C0C0]">{booking.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Popular Movies */}
              <div className="bg-[#0A192F]/90 backdrop-blur-lg border border-[#8A2BE2] rounded-lg p-6">
                <h3 className="text-lg font-medium text-[#C0C0C0] mb-4">Popular Movies</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#8A2BE2]">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#C0C0C0] uppercase tracking-wider">Movie</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#C0C0C0] uppercase tracking-wider">Bookings</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#C0C0C0] uppercase tracking-wider">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#8A2BE2]">
                      {popularMovies.map((movie) => (
                        <tr key={movie.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#C0C0C0]">{movie.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#C0C0C0]">{movie.bookings}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#C0C0C0]">{movie.revenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Other tab content will be added here */}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard; 