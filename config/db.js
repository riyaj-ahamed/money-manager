// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Make sure the MongoDB URI is correct
    const dbURI = process.env.MONGO_URI; // Store URI in .env for security

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
