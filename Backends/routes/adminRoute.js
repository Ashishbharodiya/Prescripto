const express = require('express');
const { RegisterAdmin, loginAdmin, allDoctors, adminDashboard, appointmentCancel, appointmentsAdmin, cashPayments } = require('../controllers/admin');
const authenticateAdmin = require('../middlewares/adminAuth');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const { addDoctor } = require('../controllers/doctorController');
const upload = require('../middlewares/multer');
const { cashPayment } = require('../controllers/userController');


router.post("/login", loginAdmin)

router.post('/registration', adminAuth (['admin']) , RegisterAdmin);
router.post("/add-doctor",   adminAuth (['admin']), upload.single('image'), addDoctor)
router.get("/all-doctors",  adminAuth (['admin']), allDoctors)
router.get("/dashboard", adminAuth (['admin']), adminDashboard)
router.post("/cancel-appointment", adminAuth (['admin']), appointmentCancel)
router.get("/appointments", adminAuth (['admin']), appointmentsAdmin)
router.post('/cash-payment',  adminAuth (['admin']), cashPayments);


module.exports = router;