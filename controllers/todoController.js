const Todo = require("../models/Todo");
const uploadToCloudinary = require("../config/cloudinaryUpload");

// GET all todos (only the logged-in user's)
exports.getTodos = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { userId: req.user.id };
    if (status) filter.status = status;
    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single todo
exports.getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE todo
exports.createTodo = async (req, res) => {
  try {
    const { title, date, priority, description } = req.body;

    if (!title || !date || !priority || !description)
      return res.status(400).json({ message: "All fields are required: title, date, priority, description" });

    let image = "";
    if (req.file?.buffer) {
      image = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
    }

    const todo = await Todo.create({
      title, date, priority, description, image,
      userId: req.user.id,
    });

    res.status(201).json(todo);
  } catch (err) {
    console.error("createTodo error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE todo
exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    const updateData = { ...req.body };
    if (req.file?.buffer) {
      updateData.image = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
    }

    const updated = await Todo.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE todo
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET stats (only for the logged-in user)
exports.getTodoStats = async (req, res) => {
  try {
    const base = { userId: req.user.id };
    const total = await Todo.countDocuments(base);

    if (total === 0)
      return res.json({ total: 0, completed: 0, inProgress: 0, notStarted: 0 });

    const [completedCount, inProgressCount, notStartedCount] = await Promise.all([
      Todo.countDocuments({ ...base, status: "Completed" }),
      Todo.countDocuments({ ...base, status: "In Progress" }),
      Todo.countDocuments({ ...base, status: "Not Started" }),
    ]);

    res.json({
      total,
      completed: Math.round((completedCount / total) * 100),
      inProgress: Math.round((inProgressCount / total) * 100),
      notStarted: Math.round((notStartedCount / total) * 100),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
