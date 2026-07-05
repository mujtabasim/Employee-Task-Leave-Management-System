const supabase = require("../config/supabase");

const getDashboardStats = async (req, res) => {
  try {
    // Total Tasks
    const { count: totalTasks, error: taskError } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true });

    if (taskError) throw taskError;

    // Pending Tasks
    const { count: pendingTasks, error: pendingError } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending");

    if (pendingError) throw pendingError;

    // Approved Leaves
    const { count: approvedLeaves, error: leaveError } = await supabase
      .from("leave_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "Approved");

    if (leaveError) throw leaveError;

    // Total Employees
    const { count: employees, error: userError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (userError) throw userError;

    res.json({
      totalTasks,
      pendingTasks,
      approvedLeaves,
      employees,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};