<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
=======
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
>>>>>>> Vidumini
import {
  faEdit,
  faTrash,
  faEye,
  faPlus,
  faSearch,
  faFilter,
  faSpinner,
  faExclamationTriangle,
  faTimes,
  faUser,
  faCalendar,
  faUsers,
<<<<<<< HEAD
  faLink
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import AdminNavbar from '../../navbar/AdminNavbar';
=======
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AdminNavbar from "../../navbar/AdminNavbar";
>>>>>>> Vidumini

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('movie_name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [deleteModal, setDeleteModal] = useState({ show: false, movieId: null, movieName: '' });
=======
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState("movie_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    movieId: null,
    movieName: "",
  });
>>>>>>> Vidumini
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
<<<<<<< HEAD
      const response = await fetch('http://localhost:3000/api/movies');
      const data = await response.json();
      
      if (data.success) {
        setMovies(data.data || []);
      } else {
        toast.error(data.message || 'Failed to fetch movies');
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast.error('Failed to fetch movies');
=======
      const response = await fetch("http://localhost:3000/api/movies");
      const data = await response.json();

      if (data.success) {
        setMovies(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch movies");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to fetch movies");
>>>>>>> Vidumini
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (movie) => {
    setDeleteModal({
      show: true,
      movieId: movie._id,
<<<<<<< HEAD
      movieName: movie.movie_name
=======
      movieName: movie.movie_name,
>>>>>>> Vidumini
    });
  };

  const handleDelete = async () => {
    try {
<<<<<<< HEAD
      const response = await fetch(`http://localhost:3000/api/movies/${deleteModal.movieId}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Movie deleted successfully');
        fetchMovies(); // Refresh the list
      } else {
        toast.error(data.message || 'Failed to delete movie');
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
      toast.error('Failed to delete movie');
    } finally {
      setDeleteModal({ show: false, movieId: null, movieName: '' });
=======
      const response = await fetch(
        `http://localhost:3000/api/movies/${deleteModal.movieId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data.success) {
        toast.success("Movie deleted successfully");
        fetchMovies(); // Refresh the list
      } else {
        toast.error(data.message || "Failed to delete movie");
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Failed to delete movie");
    } finally {
      setDeleteModal({ show: false, movieId: null, movieName: "" });
>>>>>>> Vidumini
    }
  };

  const handleEdit = (movieId) => {
    navigate(`/admin/movies/edit/${movieId}`);
  };

<<<<<<< HEAD
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.movie_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.director.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || movie.status === statusFilter;
=======
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.movie_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || movie.status === statusFilter;
>>>>>>> Vidumini
    return matchesSearch && matchesStatus;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
<<<<<<< HEAD
    const aValue = a[sortField]?.toLowerCase() || '';
    const bValue = b[sortField]?.toLowerCase() || '';
    return sortOrder === 'asc' 
=======
    const aValue = a[sortField]?.toLowerCase() || "";
    const bValue = b[sortField]?.toLowerCase() || "";
    return sortOrder === "asc"
>>>>>>> Vidumini
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const handleSort = (field) => {
    if (field === sortField) {
<<<<<<< HEAD
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
=======
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
>>>>>>> Vidumini
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
<<<<<<< HEAD
      case 'Upcoming': return 'bg-electric-purple/20 text-electric-purple';
      case 'Now Showing': return 'bg-amber/20 text-amber';
      case 'End': return 'bg-scarlet/20 text-scarlet';
      default: return 'bg-silver/20 text-silver';
=======
      case "Upcoming":
        return "bg-electric-purple/20 text-electric-purple";
      case "Now Showing":
        return "bg-amber/20 text-amber";
      case "End":
        return "bg-scarlet/20 text-scarlet";
      default:
        return "bg-silver/20 text-silver";
>>>>>>> Vidumini
    }
  };

  const getImageUrl = (imagePath) => {
    // Remove any leading slashes to prevent double slashes in URL
<<<<<<< HEAD
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
=======
    const cleanPath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;
>>>>>>> Vidumini
    return `http://localhost:3000/uploads/${cleanPath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-space text-silver">
        <AdminNavbar />
        <div className="container mx-auto p-4 flex justify-center items-center h-[calc(100vh-80px)]">
<<<<<<< HEAD
          <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-amber" />
=======
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="3x"
            className="text-amber"
          />
>>>>>>> Vidumini
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-space text-silver">
      <AdminNavbar />
      <div className="container mx-auto p-4">
        <Toaster position="top-right" />
<<<<<<< HEAD
        
=======

>>>>>>> Vidumini
        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteModal.show && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-deep-space border border-silver/10 rounded-xl p-6 max-w-md w-full mx-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-scarlet">
<<<<<<< HEAD
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl mr-3" />
                    <h3 className="text-xl font-semibold">Delete Movie</h3>
                  </div>
                  <button
                    onClick={() => setDeleteModal({ show: false, movieId: null, movieName: '' })}
=======
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-2xl mr-3"
                    />
                    <h3 className="text-xl font-semibold">Delete Movie</h3>
                  </div>
                  <button
                    onClick={() =>
                      setDeleteModal({
                        show: false,
                        movieId: null,
                        movieName: "",
                      })
                    }
>>>>>>> Vidumini
                    className="text-silver/70 hover:text-silver"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <p className="text-silver/90 mb-6">
<<<<<<< HEAD
                  Are you sure you want to delete "{deleteModal.movieName}"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setDeleteModal({ show: false, movieId: null, movieName: '' })}
=======
                  Are you sure you want to delete "{deleteModal.movieName}"?
                  This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() =>
                      setDeleteModal({
                        show: false,
                        movieId: null,
                        movieName: "",
                      })
                    }
>>>>>>> Vidumini
                    className="px-4 py-2 rounded-lg bg-deep-space/50 text-silver hover:bg-deep-space/70 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-lg bg-scarlet hover:bg-red-700 text-white transition-colors duration-300"
                  >
                    Delete Movie
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-amber mb-4 md:mb-0">Movie Management</h1>
=======
          <h1 className="text-2xl font-bold text-amber mb-4 md:mb-0">
            Movie Management
          </h1>
>>>>>>> Vidumini
          <Link
            to="/admin/movies/add"
            className="bg-scarlet hover:bg-amber text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add New Movie
          </Link>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
<<<<<<< HEAD
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-silver/50" />
=======
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-3 text-silver/50"
            />
>>>>>>> Vidumini
            <input
              type="text"
              placeholder="Search by movie name or director..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-deep-space/50 border border-silver/30 rounded-lg pl-10 pr-4 py-2 text-silver
                       focus:border-electric-purple focus:ring-1 focus:ring-electric-purple outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-deep-space/50 border border-silver/30 rounded-lg px-4 py-2 text-silver
                     focus:border-electric-purple focus:ring-1 focus:ring-electric-purple outline-none"
          >
            <option value="All">All Status</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Now Showing">Now Showing</option>
            <option value="End">End</option>
          </select>

          <select
            value={sortField}
            onChange={(e) => handleSort(e.target.value)}
            className="bg-deep-space/50 border border-silver/30 rounded-lg px-4 py-2 text-silver
                     focus:border-electric-purple focus:ring-1 focus:ring-electric-purple outline-none"
          >
            <option value="movie_name">Sort by Name</option>
            <option value="release_date">Sort by Release Date</option>
            <option value="director">Sort by Director</option>
          </select>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedMovies.map((movie) => (
            <motion.div
              key={movie._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-electric-purple/10 backdrop-blur-lg rounded-lg overflow-hidden border border-silver/10 hover:border-electric-purple/50 transition-all duration-300"
            >
              {/* Movie Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={`http://localhost:3000/uploads/${movie.image_name}`}
                  alt={movie.movie_name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
<<<<<<< HEAD
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(movie.status)}`}>
=======
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      movie.status
                    )}`}
                  >
>>>>>>> Vidumini
                    {movie.status}
                  </span>
                </div>
              </div>

              {/* Movie Details */}
              <div className="p-3">
<<<<<<< HEAD
                <h3 className="text-amber font-semibold text-lg mb-1 truncate">{movie.movie_name}</h3>
                
=======
                <h3 className="text-amber font-semibold text-lg mb-1 truncate">
                  {movie.movie_name}
                </h3>

>>>>>>> Vidumini
                {/* Director */}
                <div className="flex items-center text-silver/80 text-sm mb-1">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  <span className="truncate">{movie.director}</span>
                </div>

                {/* Release Date */}
                <div className="flex items-center text-silver/80 text-sm mb-1">
                  <FontAwesomeIcon icon={faCalendar} className="mr-2" />
<<<<<<< HEAD
                  <span>{new Date(movie.release_date).toLocaleDateString()}</span>
=======
                  <span>
                    {new Date(movie.release_date).toLocaleDateString()}
                  </span>
>>>>>>> Vidumini
                </div>

                {/* Cast */}
                <div className="flex items-start text-silver/80 text-sm mb-2">
                  <FontAwesomeIcon icon={faUsers} className="mr-2 mt-1" />
<<<<<<< HEAD
                  <span className="line-clamp-2">{movie.cast.join(', ')}</span>
=======
                  <span className="line-clamp-2">{movie.cast.join(", ")}</span>
>>>>>>> Vidumini
                </div>

                {/* Description */}
                <div className="text-silver/60 text-xs mb-3 line-clamp-2">
                  {movie.description}
                </div>

                {/* Trailer Link */}
                {movie.trailer_link && (
                  <div className="flex items-center text-silver/80 text-sm mb-3">
                    <FontAwesomeIcon icon={faLink} className="mr-2" />
<<<<<<< HEAD
                    <a 
=======
                    <a
>>>>>>> Vidumini
                      href={movie.trailer_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber hover:text-electric-purple truncate"
                    >
                      Watch Trailer
                    </a>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(movie._id)}
                    className="bg-electric-purple/20 hover:bg-electric-purple/30 text-electric-purple px-3 py-1 rounded-lg text-sm transition-colors duration-300"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-1" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteClick(movie)}
                    className="bg-scarlet/20 hover:bg-scarlet/30 text-scarlet px-3 py-1 rounded-lg text-sm transition-colors duration-300"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-1" />
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default MovieList; 
=======
export default MovieList;
>>>>>>> Vidumini
