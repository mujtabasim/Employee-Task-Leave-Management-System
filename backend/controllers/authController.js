const supabase = require("../config/supabase");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/jwt");

// Register User
const register = async (req, res) => {

    console.log("Body received:", req.body);

    try {
        const {
            full_name,
            email,
            password,
            role,
            department_id,
            manager_id
        } = req.body;

        // Check if email already exists
        const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
      const { data, error } = await supabase
    .from("users")
    .insert([
        {
            full_name,
            email,
            password: hashedPassword,
            role,
            department_id,
            manager_id
        }
    ])
    .select();

        if (error) {
            return res.status(500).json(error);
        }

        res.status(201).json({
            message: "User registered successfully",
            user: data[0]
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Login User
const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        console.log("Email:", email);

        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        console.log("User:", user);
        console.log("Error:", error);

        if (error || !user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        console.log("Password from request:", password);
        console.log("Password from DB:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);

        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user);

        res.json({
            token,
            user
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        });
    }
};

module.exports = {
    register,
    login
};