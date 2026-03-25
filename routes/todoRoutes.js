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

// GET all / filtered
router.get("/", getTodos);

// Dashboard stats
router.get("/status", getTodoStats);

// GET single todo
router.get("/:id", getTodoById);

// Create
router.post("/", upload.single("image"), createTodo);

// Update
router.put("/:id", upload.single("image"), updateTodo);

// Delete
router.delete("/:id", deleteTodo);

module.exports = router;
