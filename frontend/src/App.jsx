import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/customer/Home';
import AdminDashboard from './components/admin/Dashboard/AdminDashboard';
import MovieForm from './components/admin/MovieManagement/MovieForm';
import MovieList from './components/admin/MovieManagement/MovieList';
import NowShowing from './components/customer/MovieManagement/NowShowing';
import Upcoming from './components/customer/MovieManagement/Upcoming';
import BookingList from './components/admin/BookingManagement/BookingList';
import BookingForm from './components/customer/BookingManagement/BookingForm';
import BookingDetails from './components/customer/BookingManagement/BookingDetails';
import MovieBuddyList from './components/customer/MovieBuddy/MovieBuddyList';
import MovieBuddyAdmin from './components/admin/MovieBuddy/MovieBuddy';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/now-showing" element={<NowShowing />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/book-tickets/:id" element={<BookingForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/movies" element={<MovieList />} />
          <Route path="/admin/movies/add" element={<MovieForm />} />
          <Route path="/admin/movies/edit/:id" element={<MovieForm />} />
          <Route path="/admin/bookings" element={<BookingList />} />
          <Route path="/admin/food" element={<AdminDashboard />} />
          <Route path="/admin/movie-buddy" element={<MovieBuddyAdmin />} />
          <Route path="/booking-details/:bookingId" element={<BookingDetails />} />
          <Route path="/movie-buddies" element={<MovieBuddyList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;