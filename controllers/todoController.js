const Todo = require("../models/Todo");

// GET all todos
exports.getTodos = async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
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
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { title, date, priority, description } = req.body;

    // Cloudinary returns the hosted URL in req.file.path
    const image = req.file ? req.file.path : "";

    const todo = await Todo.create({
      title,
      date,
      priority,
      description,
      image,
    });

    res.json(todo);
  } catch (error) {
    console.log(error);
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
    const todo = await Todo.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE todo
exports.deleteTodo = async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

// TO GET TODO STATRUS
exports.getTodoStats = async (req, res) => {
  try {
    const total = await Todo.countDocuments();

    const completed = await Todo.countDocuments({ status: "Completed" });
    const inProgress = await Todo.countDocuments({ status: "In Progress" });
    const notStarted = await Todo.countDocuments({ status: "Not Started" });

    res.json({
      total,
      completed,
      inProgress,
      notStarted,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
