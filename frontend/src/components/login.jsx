import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link for navigation to register page
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faExclamationCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation function for email and password
  const validateInput = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'email':
        if (!/^[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]*\.[a-zA-Z]{0,}$/.test(value)) {
          newErrors.email = 'Invalid email format';
        } else if (value.trim() === '') {
          newErrors.email = 'Email is required';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (value.trim() === '') {
          newErrors.password = 'Password is required';
        } else if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        } else {
          delete newErrors.password;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 || !newErrors[name];
  };

  // Handle input changes with real-time validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateInput(name, value);
  };

  // Validate the entire form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Replace with your actual API endpoint for login
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      toast.success('Login successful!');
      // Navigate to a dashboard or home page after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error(error.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-space text-silver flex items-center justify-center py-12">
      <Toaster position="top-right" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto w-full"
      >
        <div className="bg-electric-purple/10 rounded-xl p-10 border border-silver/10 shadow-lg">
          <h1 className="text-3xl font-bold text-amber mb-8 text-center">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-silver mb-2">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-amber" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                placeholder="example@domain.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-scarlet flex items-center">
                  <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-silver mb-2">
                <FontAwesomeIcon icon={faLock} className="mr-2 text-amber" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-scarlet flex items-center">
                  <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-silver/20">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2.5 bg-deep-space/50 text-silver hover:bg-deep-space/70 rounded-lg transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-scarlet hover:bg-amber text-white rounded-lg transition-colors duration-300 flex items-center"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>

          {/* Added Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-silver">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-amber hover:underline focus:outline-none"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;