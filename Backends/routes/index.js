const express = require('express');
const router = express.Router();
const user = require('./userRoute');
const admin = require('./adminRoute');
const doctor = require('./doctorRoute');

router.use('/user',user);
router.use('/admin',admin);
router.use('/doctor',doctor);

module.exports = router;

