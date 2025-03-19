import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminNavbar from '../navbar/AdminNavbar';
import MovieList from './Movie Management/MovieList';

const AdminDashboard = () => {
  const location = useLocation();

  // Render different components based on the current route
  const renderContent = () => {
    if (location.pathname === '/admin/movies') {
      return <MovieList />;
    }
    // Add other routes here when needed
    return (
      <div className="p-4 md:p-8">
        <div className="bg-electric-purple/10 rounded-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-amber mb-4">
            Welcome to GalaxyX Admin Dashboard
          </h1>
          <p className="text-lg text-silver/80">
            Manage your cinema operations with ease
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-deep-space text-silver">
      <AdminNavbar />
      <main className="container mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard; 