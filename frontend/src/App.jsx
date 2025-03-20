import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Client/Home';
import AdminDashboard from './components/Admin/Dashboard/AdminDashboard';
import MovieForm from './components/Admin/MovieManagement/MovieForm';
import MovieList from './components/Admin/MovieManagement/MovieList';
import NowShowing from './components/Client/MovieManagement/NowShowing';
import Upcoming from './components/Client/MovieManagement/Upcoming';
import BookingList from './components/Admin/BookingManagement/BookingList';
import BookingForm from './components/Client/BookingManagement/BookingForm';
import BookingDetails from './components//Client/BookingManagement/BookingDetails';


function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/now-showing" element={<NowShowing />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/movies" element={<MovieList />} />
          <Route path="/admin/movies/add" element={<MovieForm />} />
          <Route path="/admin/movies/edit/:id" element={<MovieForm />} />
          <Route path="/admin/bookings" element={<AdminDashboard />} />
          <Route path="/admin/food" element={<AdminDashboard />} />
          <Route path="/admin/movie-buddy" element={<AdminDashboard />} />
          <Route path="/book-tickets/:id" element={<BookingForm />} />
          <Route path="/admin/bookings" element={<BookingList />} />
          <Route path="/admin/food" element={<AdminDashboard />} />
          <Route path="/admin/movie-buddy" element={<AdminDashboard />} />
          <Route path="/booking-details/:bookingId" element={<BookingDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;