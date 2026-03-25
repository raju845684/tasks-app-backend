const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const protect = require("../middleware/authMiddleware");
const {
  getTodos, getTodoById, createTodo, updateTodo, deleteTodo, getTodoStats,
} = require("../controllers/todoController");

// All todo routes require authentication
router.use(protect);

// Wrap multer so upload errors don't crash the request
const uploadSingle = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) { req.file = null; req.uploadError = err.message; }
    next();
  });
};

router.get("/", getTodos);
router.get("/status", getTodoStats);
router.get("/:id", getTodoById);
router.post("/", uploadSingle, createTodo);
router.put("/:id", uploadSingle, updateTodo);
router.delete("/:id", deleteTodo);

module.exports = router;
