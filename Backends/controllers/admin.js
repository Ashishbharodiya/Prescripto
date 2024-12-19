const Admin = require("../model/adminModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require("../model/doctorModel");
const User = require("../model/userModel");
const Appointment = require("../model/appointmentModel");



const RegisterAdmin = async(req, res) => {
           try{
                
            const {email, name, password} = req.body;

             if ( !email || !password){
                return res.status(400).json({ status: false, message: "All fields are required!" });
             }

             const adminemail = await Admin.findOne({email});
             const adminname = await Admin.findOne({name});

             if(adminemail){
                return res.status(400).json({ success: false, message: "Email already exist" })
            }
           
            if(adminname){
                return res.status(400).json({ success: false, message: "name already exist" })
            }
            
            const hashPassword = await bcrypt.hash(password,10);
  
            const admin = await Admin.create({              
                email,
                name,
                password:hashPassword
            })
    
            return res.status(200).json({ success: true, data: admin,  message: "Admin registered successfully!" });     
           }  catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Server error. Please try again later.'
            });
        }
}


const loginAdmin = async (req, res) => {
    try {
        const { password, admin } = req.body;

        const loginadmin = await Admin.findOne({ $or: [{ email: admin }, { name: admin }] });

        if (!loginadmin) {
            return res.status(400).json({ success: false, message: "User not found!" });
        }

        const validpassword = await bcrypt.compare(password, loginadmin.password);

        if (!validpassword) {
            return res.status(400).json({ success: false, message: "Invalid Username or password" });
        }

        const Atoken = jwt.sign({
            _id: loginadmin?.id,
        }, "oscar", { expiresIn: 60 * 60 });


        return res.status(200).json({
            success: true,
            Atoken,
            message: 'Login successful'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
}


const allDoctors = async ( req, res) =>{
       try{

           const doctors = await Doctor.find()

           return res.json({
            success: true,
            message: 'Doctors fetched successfully.', 
            doctors
        });

       } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
}

const adminDashboard = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        const users = await User.find();
        const appointments = await Appointment.find();

        const paidAppointments = appointments.filter(appointment => appointment.payment);
        const cancelledAppointments = appointments.filter(appointment => appointment.cancelled);

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse(),  
            paidAppointmentsCount: paidAppointments.length,
            cancelledAppointmentsCount: cancelledAppointments.length,
            paidAppointments: paidAppointments, 
            cancelledAppointments: cancelledAppointments  
        };

        console.log("Admin Dashboard Data:", dashData); 
        res.json({ success: true, dashData });

    } catch (error) {
        console.error(error);  
        res.json({ success: false, message: error.message });
    }
};


const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (appointment.isCompleted) {
            return res.status(400).json({ success: false, message: 'Appointment is already completed and cannot be cancelled' });
        }

        if (appointment.cancelled) {
            return res.status(400).json({ success: false, message: 'Appointment is already cancelled' });
        }

        appointment.cancelled = true;

        if (appointment.paymentStatus === 'paid') {
            appointment.paymentStatus = 'refunded';
        }

        await appointment.save();

        res.json({ success: true, message: 'Appointment successfully cancelled' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await Appointment.find()
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

const cashPayments = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (appointment.paymentStatus === 'paid') {
            return res.status(400).json({ success: false, message: 'Payment has already been made' });
        }

        if (appointment.cancelled) {
            return res.status(400).json({ success: false, message: 'Appointment is cancelled and cannot be paid for' });
        }

        appointment.paymentStatus = 'paid';

        await appointment.save();

        res.json({ success: true, message: 'Cash payment successfully processed' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};






module.exports = {
    RegisterAdmin,
    loginAdmin,
    allDoctors,
    adminDashboard,
    appointmentCancel,
    appointmentsAdmin,
    cashPayments
};