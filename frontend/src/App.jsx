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
import AddFood from './components/admin/Foodmanagement/AddFood';
import FoodList from './components/admin/Foodmanagement/FoodList';
import ShowFoods from './components/customer/FoodManagement/ShowFoods';
import Cart from './components/customer/FoodManagement/Cart';
import Payment from './components/customer/Payment/Payment';
import MovieBuddyPortal from './components/customer/MovieBuddy/MovieBuddyPortal';
import MovieBuddyForm from './components/customer/MovieBuddy/MovieBuddyForm';
import MovieBuddyProfile from './components/customer/MovieBuddy/MovieBuddyProfile';
import OrderConfirm from './components/customer/Payment/OrderConfirm';
import Login from './components/login';
import Register from './components/register';
import Order from './components/customer/FoodManagement/Order';
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
          <Route path="/admin/food" element={<FoodList />} />
          <Route path="/admin/movie-buddy" element={<MovieBuddyAdmin />} />
          <Route path="/booking-details/:bookingId" element={<BookingDetails />} />
          <Route path="/movie-buddies" element={<MovieBuddyList />} />

           <Route path='/admin/add-food' element={<AddFood />}></Route>
          <Route path='/foodlist' element={<FoodList/>}></Route>
          <Route path='/showfoods' element={<ShowFoods/>}></Route>
          <Route path='/cart' element={<Cart/>}></Route>
          <Route path="/payment" element={<Payment/>} /> 
          <Route path="/movie-buddy-portal" element={<MovieBuddyPortal />} />
          <Route path="/movie-buddy-form" element={<MovieBuddyForm />} />
          <Route path="/movie-buddy-profile" element={<MovieBuddyProfile />} />
          <Route path="/order-confirmation" element={<OrderConfirm/>}/>
          <Route path='/order' element={<Order/>}/>

          


          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;