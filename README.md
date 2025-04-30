# GalaxyX Cinema - ITPM Project

## Overview
GalaxyX Cinema is a comprehensive cinema management system developed as part of the Information Technology Project Management (ITPM) course. The system allows users to browse movies, make bookings, find movie buddies, and order food and beverages.

## Technology Stack

### Frontend
- **React** - JavaScript library for building user interfaces
- **Vite** - Build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **React Router Dom** - For navigation and routing
- **Framer Motion** - For animations
- **React Hot Toast** - For notifications
- **Axios** - For API requests
- **FontAwesome** - For icons

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - For authentication
- **WebSocket** - For real-time communication
- **Multer** - For file uploads

## Directory Structure

```
ITPM-Project/
├── frontend/             # React frontend
│   ├── public/           # Static files
│   └── src/              # Source code
│       ├── components/   # React components
│       │   ├── admin/    # Admin components
│       │   ├── customer/ # Customer components
│       │   └── navbar/   # Navigation components
│       └── main.jsx      # Entry point
│
└── backend/              # Express.js backend
    ├── controllers/      # Request handlers
    ├── models/           # Database models
    ├── routes/           # API routes
    ├── uploads/          # Uploaded files
    └── App.js            # Main application file
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Git

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. The application will be available at: `http://localhost:5173`

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/galaxyx
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```
   npm run dev
   ```

5. The API will be available at: `http://localhost:3000/api`

## Features

### Customer Features
- Browse movies (Now Showing & Upcoming)
- View movie details
- Book tickets and select seats
- Find movie buddies
- Order food and beverages
- User registration and authentication

### Admin Features
- Movie management (CRUD operations)
- Booking management
- Food and beverage management
- Movie buddy administration
- User management

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get a movie by ID
- `POST /api/movies` - Add a new movie (admin)
- `PUT /api/movies/:id` - Update a movie (admin)
- `DELETE /api/movies/:id` - Delete a movie (admin)

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get a booking by ID
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id` - Update a booking
- `DELETE /api/bookings/:id` - Delete a booking

### Movie Buddies
- `GET /api/movie-buddies/all` - Get all movie buddy groups
- `POST /api/movie-buddies/update` - Update movie buddies
- `GET /api/movie-buddies/buddies` - Get movie buddies for a specific show
- `GET /api/movie-buddies/profile` - Get movie buddy profile

### Food Management
- `GET /api/food` - Get all food items
- `POST /api/food` - Add a new food item
- `PUT /api/food/:id` - Update a food item
- `DELETE /api/food/:id` - Delete a food item

## Team

- Oshadha Pathiraja
- Vidumini Chandrasekara
- Dhanajaya Weerakoon
- Raveesha Abeysekara

## License
This project is part of the ITPM course at Sri Lanka Institute of Information Technology (SLIIT).
