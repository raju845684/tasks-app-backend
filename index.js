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

// Static
app.use("/uploads", express.static("uploads"));

// Test
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server is Running Port: ${PORT}`);
// });
app.listen(PORT, "admin-local.knorex.com", () => {
  console.log(`Server running on ${PORT}`);
});
