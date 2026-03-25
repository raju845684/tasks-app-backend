const mongoose = require("mongoose");

// Cache the connection promise so parallel requests on cold start
// all wait on the same connection instead of racing each other.
let connectionPromise = null;

const connectDB = async () => {
  // Already connected — reuse
  if (mongoose.connection.readyState === 1) return;

  // Connection in progress — wait for it
  if (connectionPromise) {
    await connectionPromise;
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not set");
  }

  connectionPromise = mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    // bufferCommands: true (default) — let Mongoose queue operations
    // while connecting instead of throwing immediately
  });

  try {
    await connectionPromise;
    console.log("MongoDB Connected");
  } catch (error) {
    connectionPromise = null; // allow retry on next request
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

module.exports = connectDB;
