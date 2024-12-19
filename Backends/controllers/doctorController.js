const Doctor = require("../model/doctorModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Appointment = require("../model/appointmentModel");


const addDoctor = async(req, res) => {

       try{

        const { name, email, password, specialization, contactNumber, address, gender, availability, degree, experience, about, fees } = req.body;

        if ( !name || !email || !password || !specialization || !contactNumber || !address || !gender || !availability || !degree || !experience || !about || !fees){
            return res.status(400).json({ status: false, message: "All fields are required!" });
        }

        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const doctorname = await Doctor.findOne({name});
        const doctoremail = await Doctor.findOne({email});
        const doctorphone = await Doctor.findOne({contactNumber});

        if(doctorname){
            return res.status(400).json({ success: false, message: "name already exist" })
        }
        if(doctoremail){
            return res.status(400).json({ success: false, message: "Email already exist" })
        }
        if(doctorphone){
            return res.status(400).json({ success: false, message: "contactNumber already exist" })
        }

        const hashPassword = await bcrypt.hash(password,10);

        const doctor = await Doctor.create({
            name,
            email,
            password:hashPassword,
            specialization,
            contactNumber,
            address,
            gender,
            availability,
            image: imagePath,
            degree,
            experience,
            about,
            fees
  
        }) 
        
        return res.status(200).json({ success: true, data: doctor,  message: "User registered successfully!" });

       } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Server error. Please try again later.'
            });
        }
}

const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body;

        if (!docId) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID is required.'
            });
        }

        const docData = await Doctor.findById(docId);

        if (!docData) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found.'
            });
        }

        const updatedDoc = await Doctor.findByIdAndUpdate(
            docId,
            { available: !docData.available }, 
            { new: true }  
        );

        return res.status(200).json({
            success: true,
            message: updatedDoc.available ? 'Doctor is now available.' : 'Doctor is now unavailable.',
            doctor: updatedDoc
        });
    } catch (error) {
        console.error('Error changing availability:', error);

        return res.status(500).json({
            success: false,
            message: 'Error changing availability.',
            error: error.message
        });
    }
};

const doctorProfile = async (req, res) => {
    try {
        const doctorId = req.doctor._id; 

        const profileData = await Doctor.findById(doctorId);

        if (!profileData) {
            return res.status(404).json({
                status: false,
                message: "Doctor not found!" 
            });
        }

        return res.status(200).json({
            status: true,
            data: profileData
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({
            status: false,
            message: error.message || "Server error"
        });
    }
};

const doctorList = async (req, res) => {
    try {

        const doctors = await Doctor.find()
        console.log(doctors);
        
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}





const loginDoctor = async (req, res) => {
    try {
        const { password, doctor } = req.body;

        const logindoctor = await Doctor.findOne({ $or: [{ email: doctor }, { name: doctor }] });

        if (!logindoctor) {
            return res.status(400).json({ success: false, message: "User not found!" });
        }

        const validpassword = await bcrypt.compare(password, logindoctor.password);

        if (!validpassword) {
            return res.status(400).json({ success: false, message: "Invalid Username or password" });
        }

        const Dtoken = jwt.sign({
            _id: logindoctor?.id,
        }, "oscar", { expiresIn: 60 * 60 });

        console.log(Dtoken);

        return res.status(200).json({
            success: true,
            Dtoken,
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

const doctorDashboard = async(req, res) =>{
     try{

        const { docId } = req.body

        const appointments = await Appointment.find( docId );
    
        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

     }  catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const appointmentsDoctor = async(req, res) =>{
    try{

      const { docId } = req.body
      const appointments = await Appointment.find();
      console.log(appointments);
      
      res.json({ success: true, appointments })

    }catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })
  }
}

const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;  

        if (!docId || !appointmentId) {
            return res.status(400).json({ success: false, message: 'Doctor ID and Appointment ID are required.' });
        }

        const appointmentData = await Appointment.findById(appointmentId);

        if (!appointmentData) {
            return res.status(404).json({ success: false, message: 'Appointment not found.' });
        }

        if (appointmentData.docId.toString() === docId) {
            return res.status(403).json({ success: false, message: 'Doctor ID does not match the appointment.' });
        }

        if (appointmentData.isCompleted) {
            return res.status(400).json({ success: false, message: 'Appointment is already completed.' });
        }

        await Appointment.findByIdAndUpdate(appointmentId, { isCompleted: true }, { new: true });

        return res.status(200).json({ success: true, message: 'Appointment marked as completed.' });
    } catch (error) {
        console.error('Error completing appointment:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

const appointmentCancel = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;

        if (!docId || !appointmentId) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID and Appointment ID are required'
            });
        }

        const appointmentData = await Appointment.findById(appointmentId);

        if (!appointmentData) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        if (appointmentData.docId.toString() !== docId) {
            return res.status(403).json({
                success: false,
                message: 'Doctor ID does not match the appointment'
            });
        }

        await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });

        res.json({
            success: true,
            message: 'Appointment Cancelled'
        });

    } catch (error) {
        console.log('Error while cancelling appointment:', error);

        res.status(500).json({
            success: false,
            message: 'An error occurred while cancelling the appointment',
            error: error.message || error
        });
    }
};


module.exports = {
    addDoctor,
    loginDoctor,
    changeAvailablity,
    doctorProfile,
    doctorList,
     doctorDashboard,
     appointmentComplete,
     appointmentsDoctor,
     appointmentCancel
};

