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
    {
      name: "Spaghetti Bolognese",
      ingrediants: ["Spaghetti", "Ground Beef", "Tomato Sauce", "Garlic", "Onion"],
      category: "foods",
      price: 9.99,
      imageUrl: "https://example.com/images/spaghetti-bolognese.jpg"
    },

    {
      name: "Orange Juice",
      ingrediants: ["Fresh Oranges"],
      category: "drinks",
      price: 4.50,
      imageUrl: "https://example.com/images/orange-juice.jpg"
    }
  
  ]
  // Function to insert data
 
  Food.insertMany(foodItems)
  .then(() => {
    console.log('Food items added successfully');
    mongoose.connection.close(); // Close the connection after the operation
  })
  .catch(err => {
    console.error('Error adding food items:', err);
    mongoose.connection.close(); // Close the connection in case of an error
  });


  