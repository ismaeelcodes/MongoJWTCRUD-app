const asyncHandler = require("express-async-handler");
const Tasks = require("../models/taskModel");
//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Tasks.find({ user_id: req.user.id });
  res.status(200).json(tasks);
});

//@desc Create New contact
//@route POST /api/contacts
//@access private
const createTask = asyncHandler(async (req, res) => {
  console.log("The request body is :", req.body);
  const { title, description, completed } = req.body;
  if (!title || !description) {
    res.status(400);
    throw new Error("All fields are mandatory !");
  }

  const task = await Tasks.create({
    title,
    description,
    completed,
    user_id: req.user.id,
  });

  console.log(task)
  res.status(201).json(task);
});

//@desc Get contact
//@route GET /api/contacts/:id
//@access private
const getTask = asyncHandler(async (req, res) => {
  const task = await Tasks.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  res.status(200).json(task);
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access private
const updateTask = asyncHandler(async (req, res) => {
  console.log(req.body)
  const task = await Tasks.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Contact not found");
  }
  console.log(task)

  if (task.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user contacts");
  }

  const updatedTask = await Tasks.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedTask);
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteTask = asyncHandler(async (req, res) => {
  console.log(req.params.id)
  const task = await Tasks.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Contact not found");
  }
  if (task.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user contacts");
  }
  await Tasks.deleteOne({ _id: req.params.id });
  res.status(200).json(task);
});

module.exports = {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
