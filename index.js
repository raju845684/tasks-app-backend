const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const todoRoutes = require("./routes/todoRoutes");

dotenv.config();

const connectDB = require("./config/db");
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/todos", todoRoutes);

// Static files from /tmp/uploads (writable on Vercel)
app.use("/uploads", express.static("/tmp/uploads"));

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Only start local server outside Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
