const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const fs = require('fs');
const htmlTemplate = fs.readFileSync('views/index.html','utf-8');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const emailTemplate = fs.readFileSync("views/email.html", 'utf-8');
const crypto = require('crypto');
const Doctor = require("../model/doctorModel");
const Appointment = require("../model/appointmentModel");



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ashishpatel3025@gmail.com',
      pass: 'pygv dvxz nuwr tdua'
    }
  });


const registration = async (req, res) => {
    try{

       const {userName, firstName, lastName, email, phoneNumber, gender, password, age, address, confirmpassword} = req.body;

       if(!userName || !firstName || !lastName || !email || !phoneNumber || !gender || !password || !age || !address || !confirmpassword ){
        return res.status(400).json({ status: false, message: "All fields are required!" });
      }

      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;


       const username = await User.findOne({userName});
       const useremail = await User.findOne({email});
       const userphone = await User.findOne({phoneNumber});

       if(username){
           return res.status(400).json({ success: false, message: "User already exist" })
       }
       if(useremail){
           return res.status(400).json({ success: false, message: "Email already exist" })
       }
       if(userphone){
           return res.status(400).json({ success: false, message: "Phonenumber already exist" })
       }

       const hashPassword = await bcrypt.hash(password,10);
       const checkpassword = await bcrypt.compare(confirmpassword, hashPassword);
      

       if (!checkpassword) {
           return res.status(400).json({ success: false, message: "password is not match" })
       }

       const user = await User.create({
          userName,
          firstName,
          lastName,
          age,
          gender,
          email,
          address,
          phoneNumber,
          password:hashPassword,
          image: imagePath,  

      })
      console.log(user);
      
      return res.status(200).json({ success: true, data: user,  message: "User registered successfully!" });
    }catch (error){
         return res.status(500).json({status:false,message:error.message})
    }
};


const login = async (req, res) => {
    try{
        
       const { password, user} = req.body;
  
       const loginuser = await  User.findOne({ $or: [{ email: user }, { userName: user }, { phone: user}] });
     
       if(!loginuser){
          return res.status(400).json({ success: false, message: "User not foumd!" })  
      }
  
       const validpassword = await bcrypt.compare(password, loginuser.password);
  
       if(!validpassword){
          return res.status(400).json({ success: false, message: "invelid Username or password" })    
       }
  
       let otp = Math.floor(100000 + Math.random() * 900000);
  
       const otpExpireAt = Date.now() +10 * 60 * 60 * 1000;
  
       const mailOptions = {
          from: 'ashishpatel3025@gmail.com',
          to: loginuser.email,
          subject: 'Your OTP Code for Secure Login',
          html:htmlTemplate.replace('{{otp}}',otp).replace('{{url}}',`http:localhost:3000/verify-otp/${loginuser._id}`)
        };
  
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
  
        loginuser.otp=otp,
        loginuser.otpExpireAt=otpExpireAt
  
        await loginuser.save();
        console.log(loginuser);
        
      return res.status(200).json({ success: true, data:{...loginuser._doc,password:undefined}, message: "Login successful. OTP sent to your email."  })
  
  
    }catch (error){
      return res.status(500).json({status:false,message:error.message})
  }
   };

 
const verifyOtp = async (req, res) => {
    try {
        const { id, otp } = req.body;
  
        const loginUser = await User.findOne({
            _id: id,
             otp: otp,
            otpExpireAt: { $gt: Date.now() },
        }).select("-password");

  
        if (!loginUser) {
            return res.status(400).json({ status: false, message: "Invalid or expired OTP" });
        }
  
        await User.updateOne(
            { _id: loginUser._id },
            { $set: { isVerify: true, otp: null, otpExpireAt: Date.now() } }
        );
  
        loginUser.otp = undefined;  
        loginUser.otpExpireAt = undefined;
  
        await loginUser.save(); 
  
        const token = jwt.sign({
          _id: loginUser?.id,
      }, "oscar", { expiresIn: 60 * 60 });
         
      console.log(token);
      console.log(loginUser);
      
      return res.status(200).json({ status: true, data: loginUser, token: token, message: "OTP verified successfully" });
        
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
  };


  const verifyEmail = async(req, res) =>{
    try{
  
          const {email} = req.body;
  
          const loginUser = await User.findOne({ email });
    
          if (!loginUser) {
            return res.status(400).json({ status: false, message: "User not Found" });
           }
  
           const resetpasswordToken = crypto.randomBytes(25).toString("hex");
           const resetpasswordTokenExpiresIn = Date.now() + (15 * 24 * 60 * 60 * 1000);
    
           loginUser.resetpasswordToken = resetpasswordToken;
           loginUser.resetpasswordTokenExpiresIn = resetpasswordTokenExpiresIn;
           
           await loginUser.save();
  
           const mailOptions = {
            from: 'ashishpatel3025@gmail.com',
            to: loginUser.email,
            subject: 'Password Reset Request',
            html: emailTemplate.replace('{{url}}', `http://localhost:3000/forgetPassword/${loginUser._id}/${resetpasswordToken}`)
          };
  
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
  
          return res.status(200).json({ status: true, message: "Email verify Successfully!", resetpasswordToken });
  
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
  }
  }
  
  const forgetPassword = async(req, res) =>{
    try {
      const { id, resetpasswordToken, newPassword, confirmPassword } = req.body;
  
      const loginUser = await User.findOne({
        _id: id,
        resetpasswordToken: resetpasswordToken,
        resetpasswordTokenExpiresIn: { $gt: Date.now() },
      }).select("-password");
  
     if (!loginUser) {
        return res.status(400).json({ status: false, message: "User not found or token expired." });
      }
  
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ status: false, message: "Passwords must match." });
      }
  
      const hashPassword = await bcrypt.hash(newPassword, 10);
  
       await User.updateOne({ _id: loginUser.id }, { $set: { password: hashPassword, resetpasswordToken: null, resetpasswordTokenExpiresIn:Date.now() } });
  
      return res.status(200).json({ status: true, message: "New Password set successfully!" })
  
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message })
    }
  }

 
  const getProfile = async (req, res) => {
    try {
        const userId = req.user._id;  
          console.log(userId);
          
        const user = await User.findById(userId).select("-password");  

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found!" 
            });
        }

        return res.status(200).json({
            status: true,
            data: user
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};


const allDoctors = async (req, res) => {
  try {
      const doctors = await Doctor.find()
      res.json({ success: true, doctors })

  } catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })
  }
}


const bookAppointment = async (req, res) => {

  try {

      const { docId, slotDate, slotTime } = req.body
      const docData = await Doctor.findById(docId)

      if (!docData.available) {
          return res.json({ success: false, message: 'Doctor Not Available' })
      }

      let slots_booked = docData.slots_booked

      if (slots_booked[slotDate]) {
          if (slots_booked[slotDate].includes(slotTime)) {
              return res.json({ success: false, message: 'Slot Not Available' })
          }
          else {
              slots_booked[slotDate].push(slotTime)
          }
      } else {
          slots_booked[slotDate] = []
          slots_booked[slotDate].push(slotTime)
      }

      const userId = req.user._id;  
      const userData = await User.findById(userId).select("-password")

      delete docData.slots_booked

      const appointment = await Appointment.create({
        userId,
        docId,
        userData,
        docData,
        amount: docData.fees,
        slotTime,
        slotDate,
        date: Date.now()
      });

      await Doctor.findByIdAndUpdate(docId, { slots_booked })

      res.json({ success: true, message: 'Appointment Booked', appointment })

  } catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })
  }

}


const listAppointment = async (req, res) => {
  try {
  
       const userId = req.user._id;  
       const appointments = await Appointment.find({ userId })

      res.json({ success: true, appointments })

  } catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })
  }
}

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;  
    const userId = req.user._id;  
    
    const appointmentData = await Appointment.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointmentData.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    if (appointmentData.cancelled) {
      return res.status(400).json({ success: false, message: 'Appointment already cancelled' });
    }

    await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await Doctor.findById(docId);

    if (!doctorData) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

    await Doctor.findByIdAndUpdate(docId, { slots_booked });

    return res.json({ success: true, message: 'Appointment cancelled successfully' });

  } catch (error) {
    console.error(error);  
    return res.status(500).json({ success: false, message: 'Internal Server Error: ' + error.message });
  }
};

const cashPayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.user._id;

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: 'Appointment ID is required' });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    if (appointment.payment) {
      return res.status(400).json({ success: false, message: 'Payment already made for this appointment' });
    }

    if (appointment.cancelled) {
      return res.status(400).json({ success: false, message: 'Appointment is already cancelled' });
    }

    appointment.payment = true;
    appointment.isCompleted = true; 
    await appointment.save();

    const doctor = await Doctor.findById(appointment.docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const { slotDate, slotTime } = appointment;
    let slotsBooked = doctor.slots_booked;

    if (!slotsBooked[slotDate]) {
      slotsBooked[slotDate] = [];
    }

    if (!slotsBooked[slotDate].includes(slotTime)) {
      slotsBooked[slotDate].push(slotTime);
    }

    doctor.slots_booked = slotsBooked;
    await doctor.save();

    return res.json({ success: true, message: 'Payment marked as Cash on Delivery' });

  } catch (error) {
    console.error(error); 
    return res.status(500).json({ success: false, message: 'Internal Server Error: ' + error.message });
  }
};

const verifyStripe = async (req, res) => {
  try {
    const { appointmentId, success } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: 'Appointment ID is required' });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (success === "true") {
      appointment.payment = true;
      await appointment.save();
      return res.json({ success: true, message: 'Payment Successful' });
    }

    return res.json({ success: false, message: 'Payment Failed' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error: ' + error.message });
  }
};

module.exports = {
    registration,
    login,
    verifyOtp,
    verifyEmail,
    forgetPassword,
    getProfile,
    allDoctors,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    cashPayment,
    verifyStripe
  };