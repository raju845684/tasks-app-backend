const Todo = require("../models/Todo");

// GET all todos
exports.getTodos = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single todo
exports.getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE todo
exports.createTodo = async (req, res) => {
  try {
    const { title, date, priority, description } = req.body;

    if (!title || !date || !priority || !description) {
      return res.status(400).json({ message: "All fields are required: title, date, priority, description" });
    }

    // req.file.path is the Cloudinary URL; falls back to "" if upload failed
    const image = req.file ? req.file.path : "";

    if (req.uploadError) {
      console.warn("Image upload skipped:", req.uploadError);
    }

    const todo = await Todo.create({ title, date, priority, description, image });
    res.status(201).json(todo);
  } catch (error) {
    console.error("createTodo error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE todo
exports.updateTodo = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.path;
    }
    const todo = await Todo.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE todo
exports.deleteTodo = async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET todo stats (returns percentages)
exports.getTodoStats = async (req, res) => {
  try {
    const total = await Todo.countDocuments();

    if (total === 0) {
      return res.json({ total: 0, completed: 0, inProgress: 0, notStarted: 0 });
    }

    const completedCount = await Todo.countDocuments({ status: "Completed" });
    const inProgressCount = await Todo.countDocuments({ status: "In Progress" });
    const notStartedCount = await Todo.countDocuments({ status: "Not Started" });

    res.json({
      total,
      completed: Math.round((completedCount / total) * 100),
      inProgress: Math.round((inProgressCount / total) * 100),
      notStarted: Math.round((notStartedCount / total) * 100),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
