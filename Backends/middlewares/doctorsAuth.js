const jwt = require("jsonwebtoken");
const User = require('../model/userModel');
const Doctor = require("../model/doctorModel");

function authenticateUser(roles = []) {
    return async (req, res, next) => {
        try {
            const Dtoken = req.headers['authorization']?.split(' ')[1];

            if (!Dtoken) {
                return res.status(400).json({
                    status: false,
                    message: "Dtoken required!" 
                });
            }

            const decoded = jwt.verify(Dtoken, 'oscar');  

            const doctor = await Doctor.findById(decoded._id);

            if (!doctor) {
                return res.status(404).json({
                    status: false,
                    message: "User not found" 
                });
            }

            if (roles.length && !roles.includes(doctor.role)) {
                return res.status(403).json({
                    status: false,
                    message: "Unauthorized access: insufficient role" 
                });
            }

            req.doctor = doctor;

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
