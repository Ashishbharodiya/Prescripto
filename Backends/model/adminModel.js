const {Schema, model} = require('mongoose');

const adminSchema = new Schema({
  email: {
    type: String,
    required: true, 
    unique: true,
  },
  name: {
    type: String,
    required: true, 
  },
  password: {
    type: String,
    required: true, 
  },
  role: {
      type: String,
      default: "admin"
  }
}, { timestamps: true });

const Admin = model('Admin', adminSchema);
module.exports = Admin;
