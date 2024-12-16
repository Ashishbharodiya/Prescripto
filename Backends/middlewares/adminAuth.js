const jwt = require("jsonwebtoken");
const Admin = require('../model/adminModel');

function authenticateAdmin(roles = []) {
    return async (req, res, next) => {
        try {
            const Atoken = req.headers['authorization']?.split(' ')[1];

            if (!Atoken) {
                return res.status(400).json({
                    status: false,
                    message: "Atoken required!" 
                });
            }

            const decoded = jwt.verify(Atoken, 'oscar'); 

            const admin = await Admin.findById(decoded._id);

            if (!admin) {
                return res.status(404).json({
                    status: false,
                    message: "Admin not found" 
                });
            }

            if (roles.length && !roles.includes(admin.role)) {
                return res.status(403).json({
                    status: false,
                    message: "Unauthorized access: insufficient role" 
                });
            }

            req.admin = admin;

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

module.exports = authenticateAdmin;
