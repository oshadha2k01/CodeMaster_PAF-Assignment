import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/user/Home';
//import AdminDashboard from './components/admin/AdminDashboard';
//import MovieForm from './components/admin/Movie Management/MovieForm';
//import MovieList from './components/admin/Movie Management/MovieList';
import NowShowing from './components/user/NowShowing';
import Upcoming from './components/user/Upcoming';
import BookingList from './components/admin/BookingManagement/BookingList';
import BookingForm from './components/user/BookingManagement/BookingForm';
import BookingDetails from './components/user/BookingManagement/BookingDetails';


function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/now-showing" element={<NowShowing />} />
          <Route path="/upcoming" element={<Upcoming />} />
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