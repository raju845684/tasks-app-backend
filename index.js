const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const todoRoutes = require("./routes/todoRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB is connected before every request (safe for serverless cold starts)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DB connection failed:", error.message);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Routes
app.use("/api/todos", todoRoutes);

// Static files from /tmp/uploads (writable on Vercel)
app.use("/uploads", express.static("/tmp/uploads"));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "API is running", db: "connected" });
});

// Only start local server when not on Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
