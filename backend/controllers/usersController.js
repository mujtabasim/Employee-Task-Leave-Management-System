const supabase = require("../config/supabase");
const bcrypt = require("bcrypt");

// CREATE USER
const createUser = async (req, res) => {
    try {

        const {
            full_name,
            email,
            password,
            role,
            department_id,
            manager_id
        } = req.body;

        const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .maybeSingle();

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from("users")
            .insert([
                {
                    full_name,
                    email,
                    password: hashedPassword,
                    role,
                    department_id: department_id || null,
                    manager_id: manager_id || null
                }
            ])
            .select(
                "id, full_name, email, role, department_id, manager_id, created_at"
            );

        if (error) {
            return res.status(500).json(error);
        }

        res.status(201).json({
            message: "User created successfully",
            user: data[0]
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// GET ALL USERS
const getUsers = async (req, res) => {
    try {

        const { data, error } = await supabase
            .from("users")
            .select(
                "id, full_name, email, role, department_id, manager_id, created_at"
            );

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

// GET USER BY ID
const getUserById = async (req, res) => {
    try {

        const { data, error } = await supabase
            .from("users")
            .select(
                "id, full_name, email, role, department_id, manager_id, created_at"
            )
            .eq("id", req.params.id)
            .single();

        if (error) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(data);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// UPDATE USER
const updateUser = async (req, res) => {
    try {

        const {
            full_name,
            role,
            department_id,
            manager_id
        } = req.body;

        const { data, error } = await supabase
            .from("users")
            .update({
                full_name,
                role,
                department_id,
                manager_id
            })
            .eq("id", req.params.id)
            .select();

        if (error) {
            return res.status(500).json(error);
        }

        if (!data.length) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "User updated successfully",
            user: data[0]
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// DELETE USER
const deleteUser = async (req, res) => {
    try {

        const { error } = await supabase
            .from("users")
            .delete()
            .eq("id", req.params.id);

        if (error) {
            return res.status(500).json(error);
        }

        res.json({
            message: "User deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};