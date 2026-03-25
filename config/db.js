const mongoose = require("mongoose");

let cachedConnection = null;

const connectDB = async () => {
  // Reuse existing connection across warm serverless invocations
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not set");
  }

  try {
    cachedConnection = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      bufferCommands: false,
    });
    console.log("MongoDB Connected");
    return cachedConnection;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    cachedConnection = null;
    throw error;
  }
};

module.exports = connectDB;
