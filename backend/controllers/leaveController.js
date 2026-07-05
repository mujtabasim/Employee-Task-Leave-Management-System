const supabase = require("../config/supabase");

// ==========================
// APPLY LEAVE
// ==========================
const applyLeave = async (req, res) => {
    try {

        const {
            start_date,
            end_date,
            reason
        } = req.body;

        const employee_id = req.user.user_id;

        const { data, error } = await supabase
            .from("leave_requests")
            .insert([
                {
                    employee_id,
                    start_date,
                    end_date,
                    reason,
                    status: "pending"
                }
            ])
            .select();

        if (error) {
            return res.status(500).json(error);
        }

        res.status(201).json({
            message: "Leave request submitted successfully",
            leave: data[0]
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};

// ==========================
// VIEW LEAVE REQUESTS
// ==========================
const getLeaveRequests = async (req, res) => {

    try {

        let query = supabase
            .from("leave_requests")
            .select("*");

        // Employee sirf apni leaves dekhe
        if (req.user.role === "employee") {
            query = query.eq("employee_id", req.user.user_id);
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
// APPROVE / REJECT LEAVE
// ==========================
const updateLeaveStatus = async (req, res) => {

    try {

        const { status } = req.body;

        if (
            status !== "approved" &&
            status !== "rejected"
        ) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const { data, error } = await supabase
            .from("leave_requests")
            .update({
                status,
                reviewed_by: req.user.user_id
            })
            .eq("id", req.params.id)
            .select();

        if (error) {
            return res.status(500).json(error);
        }

        if (!data.length) {
            return res.status(404).json({
                message: "Leave request not found"
            });
        }

        res.json({
            message: "Leave updated successfully",
            leave: data[0]
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

// ==========================
// DELETE LEAVE
// ==========================
const deleteLeave = async (req, res) => {

    try {

        let query = supabase
            .from("leave_requests")
            .delete()
            .eq("id", req.params.id);

        // Employee sirf apni pending leave delete kar sakta hai
        if (req.user.role === "employee") {
            query = query
                .eq("employee_id", req.user.user_id)
                .eq("status", "pending");
        }

        const { error } = await query;

        if (error) {
            return res.status(500).json(error);
        }

        res.json({
            message: "Leave deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

module.exports = {
    applyLeave,
    getLeaveRequests,
    updateLeaveStatus,
    deleteLeave
};