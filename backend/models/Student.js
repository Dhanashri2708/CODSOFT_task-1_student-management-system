const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  className: { type: String, required: true },
  section: { type: String },
  dob: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  parentName: { type: String },
  contactNumber: { type: String },
  address: { type: String },
  admissionDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);