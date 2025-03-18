import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/user/Home';
import AdminDashboard from './components/admin/AdminDashboard';
import MovieForm from './components/admin/Movie Management/MovieForm';
import MovieList from './components/admin/Movie Management/MovieList';
import NowShowing from './components/user/NowShowing';
import Upcoming from './components/user/Upcoming';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;