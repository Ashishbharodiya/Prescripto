const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
    {
        name: {
          type: String,
          required: true, 
          trim: true,
          unique: true,
        },
        email: {
          type: String,
          required: true, 
          unique: true,
          lowercase: true,
          trim: true,
        },
        password: {
          type: String,
          required: true, 
        },
        specialization: {
          type: String,
          required: true, 
          trim: true,
        },
        contactNumber: {
          type: String,
          required: true, 
          unique: true,
          trim: true,
        },
        address: {
          type: String,
          required: true, 
          trim: true,
        },
        gender: {
          type: String,
          enum: ['Male', 'Female', 'Other'],
          required: true, 
        },
        image: {
          type: String,
          required: true, 
        },
        degree: {
          type: String,
          required: true, 
        },
        experience: {
          type: String,
          required: true, 
        },
        about: {
          type: String,
          required: true, 
        },
        available: {
          type: Boolean,
          default: true,
        },
        fees: {
          type: Number,
          required: true, 
        },
        availability: {
          days: {
            type: [String],
            required: true, 
          },
          time: {
            type: String,
            required: true, 
          },
        }, 
         role: {
          type: String,
          default: "doctor"
         },

        slots_booked: {
          type: Object,
          default: {},
        },
      },
      { timestamps: true }
);

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
