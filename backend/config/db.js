const mongoose = require("mongoose");

// Connects to MongoDB Atlas using the connection string in .env
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is missing from environment variables (.env)");
    }
    if (uri.includes("<") || uri.includes(">")) {
      throw new Error("MONGO_URI contains unresolved placeholders like '<db_username>'. Please replace placeholders with your actual MongoDB credentials in .env.");
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // stop the server if the database can't be reached
  }
};

module.exports = connectDB;
