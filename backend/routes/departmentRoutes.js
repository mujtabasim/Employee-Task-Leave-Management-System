const express = require("express");

const router = express.Router();

const {

    getDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment

} = require("../controllers/departmentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ===================================
// Get All Departments
// ===================================
router.get(
    "/",
    authMiddleware,
    getDepartments
);

// ===================================
// Get Department By ID
// ===================================
router.get(
    "/:id",
    authMiddleware,
    getDepartmentById
);

// ===================================
// Create Department
// ===================================
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createDepartment
);

// ===================================
// Update Department
// ===================================
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateDepartment
);

// ===================================
// Delete Department
// ===================================
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteDepartment
);

module.exports = router;