const express = require("express");

const router = express.Router();

const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require("../controllers/usersController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Create User
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createUser
);

// Get All Users
router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin", "manager"),
    getUsers
);

// Get User By ID
router.get(
    "/:id",
    authMiddleware,
    getUserById
);

// Update User
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateUser
);

// Delete User
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteUser
);

module.exports = router;