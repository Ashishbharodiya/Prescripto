const {Schema, model} = require('mongoose');

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true, 
  },
  lastName: {
    type: String,
    required: true, 
  },
  email: {
    type: String,
    required: true, 
    unique: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    required: true, 
    unique: true,
  },
  gender: {
    type: String,
    require: true
  },
  password: {
    type: String,
    required: true, 
    unique: true
  },
  image: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
  },
    otp: {
      type: String,
      default: null
    },
  address: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetpasswordToken:{
       type: String,
       default: null
  },
  resetpasswordTokenExpiresIn: {
    type: Date,
    default: Date.now() 
  },
  isVerify: {
    type: Boolean,
    default: false
  },
  role: {
      type: String,
      default: "user"
  },
  otpExpireAt:{
    type: Date,
    default: Date.now() 
  }
}, { timestamps: true });

const User = model('User', userSchema);
module.exports = User;
