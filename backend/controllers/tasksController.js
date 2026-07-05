const supabase = require("../config/supabase");

// ==========================
// CREATE TASK
// ==========================
const createTask = async (req, res) => {
    try {

        const {
            title,
            description,
            assigned_to,
            status,
            due_date
        } = req.body;

        const assigned_by = req.user.user_id;

        const { data, error } = await supabase
            .from("tasks")
            .insert([
                {
                    title,
                    description,
                    assigned_to,
                    assigned_by,
                    status,
                    due_date
                }
            ])
            .select();

        if (error) {
            return res.status(500).json(error);
        }

        res.status(201).json({
            message: "Task created successfully",
            task: data[0]
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// ==========================
// GET TASKS
// ==========================
const getTasks = async (req, res) => {
    try {

        let query = supabase
            .from("tasks")
            .select("*");

        // Employee sirf apni tasks dekhe
        if (req.user.role === "employee") {
            query = query.eq("assigned_to", req.user.user_id);
        }

        const { data, error } = await query;

        if (error) {
            return res.status(500).json(error);
        }

        res.json(data);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// ==========================
// UPDATE TASK
// ==========================
const updateTask = async (req, res) => {
    try {

        const {
            title,
            description,
            assigned_to,
            status,
            due_date
        } = req.body;

        const { data, error } = await supabase
            .from("tasks")
            .update({
                title,
                description,
                assigned_to,
                status,
                due_date
            })
            .eq("id", req.params.id)
            .select();

        if (error) {
            return res.status(500).json(error);
        }

        if (!data.length) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task updated successfully",
            task: data[0]
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// ==========================
// DELETE TASK
// ==========================
const deleteTask = async (req, res) => {
    try {

        const { error } = await supabase
            .from("tasks")
            .delete()
            .eq("id", req.params.id);

        if (error) {
            return res.status(500).json(error);
        }

        res.json({
            message: "Task deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};