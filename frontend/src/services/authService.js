import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error);
    if (error.response?.data?.errors) {
      throw { message: error.response.data.errors[0].msg };
    }
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error);
    if (error.response?.data?.errors) {
      throw { message: error.response.data.errors[0].msg };
    }
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to get user data' };
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/auth/profile', userData);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error.response?.data || error);
    throw error.response?.data || { message: 'Profile update failed' };
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Change password error:', error.response?.data || error);
    throw error.response?.data || { message: 'Password change failed' };
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to send reset email' };
  }
};

// Reset password
export const resetPassword = async (token, password) => {
  try {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Password reset failed' };
  }
};

// Verify email
export const verifyEmail = async (token) => {
  try {
    const response = await api.post(`/auth/verify-email/${token}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Email verification failed' };
  }
};

// Resend verification email
export const resendVerificationEmail = async () => {
  try {
    const response = await api.post('/auth/resend-verification');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to resend verification email' };
  }
};

// Logout user
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Check if user is admin
export const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'admin';
};

// Check if user is verified
export const isVerified = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.isVerified || false;
};

// Get user permissions
export const getUserPermissions = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.permissions || [];
};

// Check if user has specific permission
export const hasPermission = (permission) => {
  const permissions = getUserPermissions();
  return permissions.includes(permission);
};

// Send OTP to phone number
export const sendPhoneOTP = async (phoneNumber) => {
  try {
    const response = await api.post('/auth/send-phone-otp', { phoneNumber });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to send OTP' };
  }
};

// Verify phone OTP
export const verifyPhoneOTP = async (phoneNumber, otp) => {
  try {
    const response = await api.post('/auth/verify-phone-otp', { phoneNumber, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to verify OTP' };
  }
};

// Reset password with phone verification
export const resetPasswordWithPhone = async (phoneNumber, otp, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password-phone', { 
      phoneNumber, 
      otp, 
      newPassword 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to reset password' };
  }
};

export const authService = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  async logout() {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Logout failed');
    }

    return response.json();
  },

  async getCurrentUser() {
    const response = await fetch(`${API_URL}/auth/me`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get current user');
    }

    return response.json();
  },

  async verifyEmail(token) {
    const response = await fetch(`${API_URL}/auth/verify-email/${token}`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Email verification failed');
    }

    return response.json();
  },

  async forgotPassword(email) {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send reset email');
    }

    return response.json();
  },

  async resetPassword(token, password) {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset failed');
    }

    return response.json();
  },
}; 