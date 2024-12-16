const express = require('express');
const { registration, login, verifyOtp, forgetPassword, verifyEmail, getProfile, allDoctors, bookAppointment, listAppointment, cancelAppointment, cashPayment, verifyStripe } = require('../controllers/userController');
const authenticateUser = require('../middlewares/jwtAuth');
const jwtAuth = require('../middlewares/jwtAuth');
const upload = require('../middlewares/multer');
const router = express.Router();

router.post('/registration', upload.single('image'), registration);
router.post('/login',login);
router.post('/verify-otp', verifyOtp);
router.post('/verifyEmail', verifyEmail)
router.post('/forgetPassword', forgetPassword)

router.get('/profile', jwtAuth(['user']), getProfile);
router.get("/all-doctors",  jwtAuth(['user']), allDoctors)
router.post("/book-appointment", jwtAuth(['user']), bookAppointment);
router.get("/appointments",  jwtAuth(['user']), listAppointment)
router.post("/cancel-appointment",  jwtAuth(['user']), cancelAppointment)
router.post('/cash-payment',  jwtAuth(['user']), cashPayment);
router.post("/verifyStripe",  jwtAuth(['user']), verifyStripe)


module.exports = router;