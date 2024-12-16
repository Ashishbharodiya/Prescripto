const express = require('express');
const { loginDoctor, changeAvailablity, doctorProfile, doctorList, doctorDashboard, appointmentComplete, appointmentsDoctor, appointmentCanceled, appointmentCancell } = require('../controllers/doctorController');
const router = express.Router();
const doctorsAuth = require('../middlewares/doctorsAuth');
const adminAuth = require('../middlewares/adminAuth');
const { appointmentCancel } = require('../controllers/admin');
const { cancelAppointment } = require('../controllers/userController');


router.post("/login", loginDoctor)


router.post("/change-availability",  adminAuth (['admin']), changeAvailablity)
router.get("/profile", doctorsAuth(['doctor']), doctorProfile);
router.get("/list", doctorList);
 router.get("/dashboard",  doctorsAuth(['doctor']), doctorDashboard)
 router.post("/complete-appointment", doctorsAuth(['doctor']), appointmentComplete)
 router.get("/appointments",  doctorsAuth(['doctor']), appointmentsDoctor)
 router.post("/cancel-appointment",  doctorsAuth(['doctor']), appointmentCancel)


module.exports = router;    

