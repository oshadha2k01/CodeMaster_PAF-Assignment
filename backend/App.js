const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3000;

dotenv.config();

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));



app.listen(PORT, () => {
    console.log('Server is running on port 3000');
});



