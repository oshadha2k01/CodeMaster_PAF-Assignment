import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isAdmin, isVerified } from '../services/authService';

function ProtectedRoute({ children, requireAdmin = false, requireVerification = false }) {
  const location = useLocation();
  const isAuth = isAuthenticated();
  const isUserAdmin = isAdmin();
  const isUserVerified = isVerified();

  if (!isAuth) {
    // Redirect to login but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isUserAdmin) {
    // Redirect to home if admin access is required but user is not admin
    return <Navigate to="/" replace />;
  }

  if (requireVerification && !isUserVerified) {
    // Redirect to verification page if verification is required but user is not verified
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute; 