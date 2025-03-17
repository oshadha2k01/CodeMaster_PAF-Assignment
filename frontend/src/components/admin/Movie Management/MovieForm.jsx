import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilm,
  faUpload,
  faCalendar,
  faUser,
  faUsers,
  faLink,
  faToggleOn,
  faTimes,
  faExclamationCircle,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNavbar from '../../navbar/AdminNavbar';

const MovieForm = () => {
  const [formData, setFormData] = useState({
    movie_name: '',
    description: '',
    release_date: '',
    director: '',
    cast: '',
    trailer_link: '',
    status: '',
    image_name: null // This will hold the file or existing filename
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Determine if we're in edit mode
  const isEditMode = !!id;

  // Calculate status based on release date
  const calculateStatus = (releaseDate) => {
    const currentDate = new Date();
    const releaseDateObj = new Date(releaseDate);
    
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(currentDate.getMonth() + 1);
    
    const fourMonthsFromRelease = new Date(releaseDateObj);
    fourMonthsFromRelease.setMonth(releaseDateObj.getMonth() + 4);

    if (releaseDateObj > currentDate && releaseDateObj <= oneMonthFromNow) {
      return 'Upcoming';
    } else if (releaseDateObj <= currentDate && currentDate <= fourMonthsFromRelease) {
      return 'Now Showing';
    } else if (currentDate > fourMonthsFromRelease) {
      return 'End';
    }
    return 'Upcoming';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-500/20 text-blue-400';
      case 'Now Showing': return 'bg-green-500/20 text-green-400';
      case 'End': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    const status = calculateStatus(value);
    setFormData(prev => ({
      ...prev,
      release_date: value,
      status
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.movie_name.trim()) newErrors.movie_name = 'Movie name is required';
    else if (formData.movie_name.length < 2) newErrors.movie_name = 'Movie name must be at least 2 characters';
    if (!formData.release_date) newErrors.release_date = 'Release date is required';
    if (!formData.director.trim()) newErrors.director = 'Director name is required';
    if (!formData.cast.trim()) newErrors.cast = 'At least one cast member is required';
    if (!isEditMode && !formData.image_name) newErrors.image_name = 'Movie poster is required'; // Only required for add
    if (formData.trailer_link && !formData.trailer_link.match(/^https?:\/\/.+/)) {
      newErrors.trailer_link = 'Please enter a valid URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleImageFile(e.dataTransfer.files[0]);
  }, []);

  const handleImageFile = (file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error('Please upload a valid image (JPG, JPEG, or PNG)');
        return;
      }
      setFormData(prev => ({ ...prev, image_name: file }));
      setImagePreview(URL.createObjectURL(file));
      if (errors.image_name) setErrors(prev => ({ ...prev, image_name: '' }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) handleImageFile(e.target.files[0]);
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_name: null }));
    setImagePreview(null);
  };

  const fetchMovieData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/movies/${id}`);
      const data = await response.json();
      if (data.data) { // Check `data.data` based on your backend response structure
        const movie = data.data;
        setFormData({
          movie_name: movie.movie_name || '',
          release_date: movie.release_date ? new Date(movie.release_date).toISOString().split('T')[0] : '',
          director: movie.director || '',
          cast: movie.cast ? movie.cast.join(', ') : '',
          trailer_link: movie.trailer_link || '',
          description: movie.description || '',
          image_name: movie.image_name || null, // Keep as string for existing image
          status: movie.status || ''
        });
        setImagePreview(movie.image_name ? `http://localhost:3000/uploads/${movie.image_name}` : null);
      } else {
        throw new Error('Movie not found');
      }
    } catch (error) {
      console.error('Error fetching movie:', error);
      toast.error('Failed to fetch movie data');
      navigate('/admin/movies');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(isEditMode ? 'Updating movie...' : 'Adding movie...');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('movie_name', formData.movie_name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('release_date', formData.release_date);
      formDataToSend.append('director', formData.director);
      const castArray = formData.cast.split(',').map(item => item.trim());
      formDataToSend.append('cast', JSON.stringify(castArray));
      formDataToSend.append('trailer_link', formData.trailer_link);
      formDataToSend.append('status', formData.status);
      
      // Only append image_name if a new file is uploaded
      if (formData.image_name instanceof File) {
        formDataToSend.append('image_name', formData.image_name);
      }

      const url = isEditMode
        ? `http://localhost:3000/api/movies/${id}`
        : 'http://localhost:3000/api/movies';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success || data.message === 'Movie updated successfully') {
        toast.success(isEditMode ? 'Movie updated successfully!' : 'Movie added successfully!', { id: loadingToast });
        navigate('/admin/movies');
      } else {
        throw new Error(data.error || 'Failed to save movie');
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} movie:`, error);
      toast.error(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to server. Please check if the server is running.'
          : `Error: ${error.message}`,
        { id: loadingToast }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchMovieData();
  }, [id]);

  return (
    <div className="min-h-screen bg-deep-space text-silver">
      <AdminNavbar />
      <div className="container mx-auto p-2 md:p-4">
        <Toaster position="top-right" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto bg-electric-purple/10 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-silver/10"
        >
          <div className="flex items-center mb-4">
            <FontAwesomeIcon icon={faFilm} className="text-amber text-2xl mr-3" />
            <h2 className="text-xl md:text-2xl font-bold text-amber">
              {isEditMode ? 'Edit Movie' : 'Add New Movie'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div
                className="relative group"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className={`h-40 w-full rounded-lg border-2 border-dashed 
                  ${imagePreview ? 'border-electric-purple' : dragActive ? 'border-amber' : 'border-silver/30'} 
                  flex items-center justify-center overflow-hidden relative
                  ${errors.image_name ? 'border-red-500' : ''}`}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-scarlet hover:bg-amber p-1.5 rounded-full text-white transition-colors duration-300"
                      >
                        <FontAwesomeIcon icon={faTimes} size="sm" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-2">
                      <FontAwesomeIcon icon={faUpload} className="text-amber text-2xl mb-1" />
                      <p className="text-silver text-sm">Click or drag to upload poster</p>
                      <p className="text-silver/60 text-xs">Max: 5MB (JPG, PNG)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="image_name"
                    onChange={handleImageChange}
                    accept="image/jpeg,image/png,image/jpg"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                {errors.image_name && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1 flex items-center"
                  >
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" size="sm" />
                    {errors.image_name}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-silver text-sm mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-deep-space/50 border border-silver/30 rounded-lg px-3 py-2 text-silver text-sm focus:border-electric-purple focus:ring-1 focus:ring-electric-purple outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-silver text-sm mb-1">
                  <FontAwesomeIcon icon={faToggleOn} className="mr-2" />
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-deep-space/50 border border-silver/30 rounded-lg px-3 py-2 text-silver text-sm focus:border-electric-purple focus:ring-1 focus:ring-electric-purple outline-none"
                  required
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Now Showing">Now Showing</option>
                  <option value="End">End</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-silver text-sm mb-1">
                  <FontAwesomeIcon icon={faFilm} className="mr-2" />
                  Movie Name
                </label>
                <input
                  type="text"
                  name="movie_name"
                  value={formData.movie_name}
                  onChange={handleInputChange}
                  className={`w-full bg-deep-space/50 border rounded-lg px-3 py-2 text-silver text-sm focus:border-electric-purple focus:ring-1 focus:ring-electric-purple outline-none ${errors.movie_name ? 'border-red-500' : 'border-silver/30'}`}
                  required
                />
                {errors.movie_name && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1 flex items-center"
                  >
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" size="sm" />
                    {errors.movie_name}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-silver text-sm mb-1">
                  <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                  Release Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="release_date"
                    value={formData.release_date}
                    onChange={handleDateChange}
                    className={`w-full bg-deep-space/50 border rounded-lg px-3 py-2 text-silver text-sm focus:border-electric-purple focus:ring-1 focus:ring-electric-purple outline-none ${errors.release_date ? 'border-red-500' : 'border-silver/30'}`}
                    required
                  />
                  {formData.release_date && (
                    <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(formData.status)}`}>
                        {formData.status}
                      </span>
                    </div>
                  )}
                </div>
                {errors.release_date && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1 flex items-center"
                  >
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" size="sm" />
                    {errors.release_date}
                  </motion.p>
                )}
                {formData.release_date && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-silver/60 text-xs mt-1 flex items-center"
                  >
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                    Status is automatically set based on release date
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-silver text-sm mb-1">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Director
                </label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleInputChange}
                  className={`w-full bg-deep-space/50 border rounded-lg px-3 py-2 text-silver text-sm focus:border-electric-purple focus:ring-1 focus:ring-electric-purple outline-none ${errors.director ? 'border-red-500' : 'border-silver/30'}`}
                  required
                />
                {errors.director && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1 flex items-center"
                  >
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" size="sm" />
                    {errors.director}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-silver text-sm mb-1">
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
                  Cast (comma-separated)
                </label>
                <input
                  type="text"
                  name="cast"
                  value={formData.cast}
                  onChange={handleInputChange}
                  placeholder="Actor 1, Actor 2, Actor 3"
                  className={`w-full bg-deep-space/50 border rounded-lg px-3 py-2 text-silver text-sm focus:border-electric-purple focus:ring-1 focus:ring-electric-purple outline-none ${errors.cast ? 'border-red-500' : 'border-silver/30'}`}
                  required
                />
                {errors.cast && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1 flex items-center"
                  >
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" size="sm" />
                    {errors.cast}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-silver text-sm mb-1">
                  <FontAwesomeIcon icon={faLink} className="mr-2" />
                  Trailer Link
                </label>
                <input
                  type="url"
                  name="trailer_link"
                  value={formData.trailer_link}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className={`w-full bg-deep-space/50 border rounded-lg px-3 py-2 text-silver text-sm focus:border-electric-purple focus:ring-1 focus:ring-electric-purple outline-none ${errors.trailer_link ? 'border-red-500' : 'border-silver/30'}`}
                />
                {errors.trailer_link && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1 flex items-center"
                  >
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" size="sm" />
                    {errors.trailer_link}
                  </motion.p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full bg-scarlet hover:bg-amber text-white font-semibold py-2 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 text-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <FontAwesomeIcon icon={faFilm} className='text-black' />
                <span className='text-black'>{loading ? (isEditMode ? 'Updating Movie...' : 'Adding Movie...') : (isEditMode ? 'Update Movie' : 'Add Movie')}</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default MovieForm;