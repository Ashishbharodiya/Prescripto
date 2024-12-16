const jwt = require("jsonwebtoken");
const User = require('../model/userModel');

function authenticateUser(roles = []) {
    return async (req, res, next) => {
        try {
            const token = req.headers['authorization']?.split(' ')[1];

            if (!token) {
                return res.status(400).json({
                    status: false,
                    message: "Token required!" 
                });
            }

            const decoded = jwt.verify(token, 'oscar'); 

            const user = await User.findById(decoded._id);

            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "User not found" 
                });
            }

            if (roles.length && !roles.includes(user.role)) {
                return res.status(403).json({
                    status: false,
                    message: "Unauthorized access: insufficient role" 
                });
            }

            req.user = user;

            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    status: false,
                    message: "Invalid or expired token" 
                });
            }
            return res.status(500).json({
                status: false,
                message: "Server error"
            });
        }
    };
}

module.exports = authenticateUser;
