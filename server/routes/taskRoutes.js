const express = require('express');
const { isAuthenticated} = require('../middleware/auth');
const { Op } = require("sequelize");
const sequelize = require("../config/database"); 
const Task = require("../models/Task");

const router = express.Router();

// get all task api
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { UserId: req.user.id } });
    console.log("Fetched tasks:", tasks);
    res.status(200).send(tasks); 
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).send({ error: "Failed to fetch tasks" });
  }
});


// create task api
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const tasks = await Task.create({ ...req.body, UserId: req.user.id });
    console.log("Task created:", tasks); // Log the task created
    res.status(201).send(tasks);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).send({ error: "Failed to create task" });
  }
});

// uPdate Task

router.put('/:id',isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { title, content, status, dueDate } = req.body;

  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update the task with new data
    task.title = title || task.title;
    task.content = content || task.content;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;

    await task.save();
    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the task', details: error.message });
  }
});

// Delete task api
router.delete('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the task', details: error.message });
  }
});


// Search Task
router.get("/search-tasks", isAuthenticated, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      error: true,
      message: "Search query is required",
    });
  }
  try {
    // Use LOWER() to make the search case-insensitive for SQLite
    const matchingTasks = await Task.findAll({
      where: {
        UserId: req.user.id, // Ensure tasks are specific to the logged-in user
        [Op.or]: [
          sequelize.where(sequelize.fn("LOWER", sequelize.col("title")), {
            [Op.like]: `%${query.toLowerCase()}%`,
          }),
          sequelize.where(sequelize.fn("LOWER", sequelize.col("content")), {
            [Op.like]: `%${query.toLowerCase()}%`,
          }),
        ],
      },
    });

    return res.json({
      error: false,
      tasks: matchingTasks,
      message: "Tasks matching the search query retrieved successfully",
    });
  } catch (error) {
    console.error("Error searching tasks:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});


module.exports = router;
