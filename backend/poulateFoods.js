const mongoose = require('mongoose');
const Food = require('./models/FoodModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


  // Define an array of food objects
  const foodItems = [




  ]