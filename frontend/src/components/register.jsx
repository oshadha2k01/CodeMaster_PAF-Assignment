import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faPhone, faExclamationCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation function for all fields
  const validateInput = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'firstName':
        if (/[^a-zA-Z\s]/.test(value)) {
          newErrors.firstName = 'Please use letters only';
        } else if (value.trim() === '') {
          newErrors.firstName = 'First name is required';
        } else if (value.length < 2) {
          newErrors.firstName = 'First name must be at least 2 characters';
        } else {
          delete newErrors.firstName;
        }
        break;

      case 'lastName':
        if (/[^a-zA-Z\s]/.test(value)) {
          newErrors.lastName = 'Please use letters only';
        } else if (value.trim() === '') {
          newErrors.lastName = 'Last name is required';
        } else if (value.length < 2) {
          newErrors.lastName = 'Last name must be at least 2 characters';
        } else {
          delete newErrors.lastName;
        }
        break;

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
        // Check if confirm password matches when password changes
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      case 'confirmPassword':
        if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else if (value.trim() === '') {
          newErrors.confirmPassword = 'Confirm password is required';
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      case 'phone':
        if (/[^0-9]/.test(value)) {
          newErrors.phone = 'Please use numbers only';
        } else if (value.length > 10) {
          newErrors.phone = 'Maximum 10 digits allowed';
        } else if (value.trim() === '') {
          newErrors.phone = 'Phone number is required';
        } else if (value.length < 10 && value.length > 0) {
          newErrors.phone = 'Phone number must be 10 digits';
        } else {
          delete newErrors.phone;
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
    let newValue = value;

    // Real-time input restrictions
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (/[^a-zA-Z\s]/.test(value)) {
          return; // Prevent numbers and special characters
        }
        break;
      case 'phone':
        if (/[^0-9]/.test(value) || value.length > 10) {
          return; // Prevent non-numbers and limit to 10 digits
        }
        break;
      default:
        break;
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    validateInput(name, newValue);
  };

  // Validate the entire form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Confirm password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Replace with your actual API endpoint for registration
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      toast.success('Registration successful! Please login.');
      // Navigate to the login page after successful registration
      navigate('/login');
    } catch (error) {
      console.error('Error registering:', error);
      toast.error(error.response?.data?.message || 'Failed to register');
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
          <h1 className="text-3xl font-bold text-amber mb-8 text-center">Register</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-silver mb-2">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-amber" />
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-scarlet flex items-center">
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-silver mb-2">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-amber" />
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-scarlet flex items-center">
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

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
                <FontAwesomeIcon icon={faPhone} className="mr-2 text-amber" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                maxLength={10}
                className="w-full px-4 py-2.5 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-scarlet flex items-center">
                  <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div>
                <label className="block text-sm font-medium text-silver mb-2">
                  <FontAwesomeIcon icon={faLock} className="mr-2 text-amber" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-deep-space border border-silver/20 rounded-lg text-silver focus:outline-none focus:border-amber"
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-scarlet flex items-center">
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
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
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationForm;