const mongoose = require("mongoose");

// Connects to MongoDB Atlas using the connection string in .env
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // stop the server if the database can't be reached
  }
};

module.exports = connectDB;
