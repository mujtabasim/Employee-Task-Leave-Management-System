const express = require("express");

const router = express.Router();

const {
    applyLeave,
    getLeaveRequests,
    updateLeaveStatus,
    deleteLeave
} = require("../controllers/leaveController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ===================================
// Employee Apply Leave
// ===================================
router.post(
    "/",
    authMiddleware,
    roleMiddleware("employee"),
    applyLeave
);

// ===================================
// View Leave Requests
// Employee -> Own Leaves
// Admin & Manager -> All Leaves
// ===================================
router.get(
    "/",
    authMiddleware,
    getLeaveRequests
);

// ===================================
// Approve / Reject Leave
// Admin & Manager Only
// ===================================
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin", "manager"),
    updateLeaveStatus
);

// ===================================
// Delete Leave
// Controller decides whether user
// is allowed to delete
// ===================================
router.delete(
    "/:id",
    authMiddleware,
    deleteLeave
);

module.exports = router;