const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        {
            user_id: user.id,
            role: user.role,
            department_id: user.department_id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES
        }
    );
};

module.exports = generateToken;