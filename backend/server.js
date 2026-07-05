require("dotenv").config();

const express = require("express");
const cors = require("cors");

const supabase = require("./config/supabase");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/usersRoutes");
const taskRoutes = require("./routes/tasksRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const dashboardRoutes = require("./routes/dashboardRoutes");
const departmentRoutes = require("./routes/departmentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/leave", leaveRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/departments", departmentRoutes);

app.get("/", (req, res) => {
    res.send("Employee Task System Backend Running");
});

// Test database connection
app.get("/test-db", async (req, res) => {

    const { data, error } = await supabase
        .from("users")
        .select("*");

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);

});

app.get("/debug-users", async (req, res) => {
    const { data, error } = await supabase
        .from("users")
        .select("*");

    res.json({
        data,
        error
    });
});

// Protected Route
app.get("/protected", authMiddleware, (req, res) => {
    res.json({
        message: "Access granted",
        user: req.user
    });
});

// Start Server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});