const supabase = require("../config/supabase");

// ==========================
// GET ALL DEPARTMENTS
// ==========================
const getDepartments = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("departments")
            .select("*")
            .order("name", { ascending: true });

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
// GET DEPARTMENT BY ID
// ==========================
const getDepartmentById = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("departments")
            .select("*")
            .eq("id", req.params.id)
            .single();

        if (error) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        res.json(data);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

// ==========================
// CREATE DEPARTMENT
// ==========================
const createDepartment = async (req, res) => {

    try {

        const { name } = req.body;

        const { data: existingDepartment } = await supabase
            .from("departments")
            .select("id")
            .eq("name", name)
            .maybeSingle();

        if (existingDepartment) {
            return res.status(400).json({
                message: "Department already exists"
            });
        }

        const { data, error } = await supabase
            .from("departments")
            .insert([
                {
                    name
                }
            ])
            .select();

        if (error) {
            return res.status(500).json(error);
        }

        res.status(201).json({
            message: "Department created successfully",
            department: data[0]
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

// ==========================
// UPDATE DEPARTMENT
// ==========================
const updateDepartment = async (req, res) => {

    try {

        const { name } = req.body;

        const { data, error } = await supabase
            .from("departments")
            .update({
                name
            })
            .eq("id", req.params.id)
            .select();

        if (error) {
            return res.status(500).json(error);
        }

        if (!data.length) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        res.json({
            message: "Department updated successfully",
            department: data[0]
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

// ==========================
// DELETE DEPARTMENT
// ==========================
const deleteDepartment = async (req, res) => {

    try {

        const { error } = await supabase
            .from("departments")
            .delete()
            .eq("id", req.params.id);

        if (error) {
            return res.status(500).json(error);
        }

        res.json({
            message: "Department deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

module.exports = {

    getDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment

};