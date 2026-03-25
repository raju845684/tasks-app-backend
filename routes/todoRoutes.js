const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoStats,
} = require("../controllers/todoController");

// Wrap multer so errors are caught and don't crash the request
const uploadSingle = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err.message);
      // Continue without the image rather than crashing
      req.file = null;
      req.uploadError = err.message;
    }
    next();
  });
};

// GET all / filtered
router.get("/", getTodos);

// Dashboard stats
router.get("/status", getTodoStats);

// GET single todo
router.get("/:id", getTodoById);

// Create
router.post("/", uploadSingle, createTodo);

// Update
router.put("/:id", uploadSingle, updateTodo);

// Delete
router.delete("/:id", deleteTodo);

module.exports = router;
