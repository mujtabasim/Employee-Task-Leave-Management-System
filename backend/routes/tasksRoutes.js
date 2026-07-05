const express = require("express");

const router = express.Router();

const {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} = require("../controllers/tasksController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Create Task (Admin & Manager)
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin", "manager"),
    createTask
);

// Get Tasks
router.get(
    "/",
    authMiddleware,
    getTasks
);

// Update Task (Admin & Manager)
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin", "manager"),
    updateTask
);

// Delete Task (Admin only)
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteTask
);

module.exports = router;