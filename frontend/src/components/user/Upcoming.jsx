import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainNavBar from '../navbar/MainNavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faStar, faClock, faTicketAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Upcoming = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('releaseDate');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/movies');
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      
      // Check if the response has the expected structure
      if (data.success && Array.isArray(data.data)) {
        // Filter for Upcoming movies
        const upcomingMovies = data.data.filter(movie => movie.status === 'Upcoming');
        setMovies(upcomingMovies);
        setError(null);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast.error('Failed to load upcoming movies. Please try again later.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setError('Failed to load upcoming movies. Please try again later.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique genres from movies
  const genres = ['all', ...new Set(movies.map(movie => movie.genre))];

  const filteredMovies = movies
    .filter(movie => {
      const matchesSearch = movie.movie_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === 'all' || movie.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'duration') return a.duration - b.duration;
      if (sortBy === 'releaseDate') return new Date(a.release_date) - new Date(b.release_date);
      return 0;
    });

  return (
    <div className="min-h-screen bg-deep-space pt-16">
      <MainNavBar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber mb-4">Upcoming Movies</h1>
          <p className="text-silver text-lg">Get excited about the upcoming blockbusters</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-electric-purple/10 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-silver" />
                <input
                  type="text"
                  placeholder="Search upcoming movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-silver" />
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre} className="capitalize">{genre}</option>
                  ))}
                </select>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
              >
                <option value="releaseDate">Sort by Release Date</option>
                <option value="rating">Sort by Rating</option>
                <option value="duration">Sort by Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMovies.map((movie) => (
              <div
                key={movie._id}
                className="bg-electric-purple/10 rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={`http://localhost:3000/uploads/${movie.image_name}`}
                    alt={movie.movie_name}
                    className="w-full h-[280px] object-cover"
                  />
<<<<<<< HEAD
                  <div className="absolute top-2 right-2 bg-scarlet text-white px-2 py-0.5 rounded-full text-xs">
                    {movie.rating} <FontAwesomeIcon icon={faStar} className="ml-1" />
                  </div>
                  <div className="absolute top-2 left-2 bg-amber text-deep-space px-2 py-0.5 rounded-full text-xs">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
=======
      
                  <div className="absolute top-2 left-2 bg-scarlet hover:bg-amber px-2 py-0.5 rounded-full text-xs text-black">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-black" />
>>>>>>> Vidumini
                    {new Date(movie.release_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-amber mb-1">{movie.movie_name}</h3>
<<<<<<< HEAD
                  <div className="flex items-center text-silver text-sm mb-2">
                    <span className="mr-3">
                      <FontAwesomeIcon icon={faClock} className="mr-1" />
                      {movie.duration} min
                    </span>
                    <span>{movie.genre}</span>
                  </div>
                  <p className="text-silver text-sm mb-3 line-clamp-2">{movie.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-amber font-bold">${movie.price}</span>
                    <Link
                      to={`/book-tickets/${movie._id}`}
                      className="flex items-center space-x-2 bg-amber text-deep-space px-3 py-1.5 rounded-lg hover:bg-amber/90 transition-colors duration-300 text-sm"
                    >
                      <FontAwesomeIcon icon={faTicketAlt} />
=======
                  
                  <p className="text-silver text-sm mb-3 line-clamp-2">{movie.description}</p>
                  <div className="flex justify-between items-center">
                    
                    <Link
                      to={`/book-tickets/${movie._id}`}
                      className="flex items-center space-x-2 bg-scarlet hover:bg-amber px-3 py-1.5 rounded-lg hover:bg-amber/90 transition-colors duration-300 text-sm text-black"
                    >
                      <FontAwesomeIcon icon={faTicketAlt} className='text-black' />
>>>>>>> Vidumini
                      <span>Pre-book Tickets</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {!loading && filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-silver text-lg">No upcoming movies found matching your criteria.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-deep-space border-t border-silver/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-silver">
            <p>&copy; {new Date().getFullYear()} GalaxyX Cinema. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Upcoming; 