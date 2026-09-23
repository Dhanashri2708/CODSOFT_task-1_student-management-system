const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  qualification: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  contactNumber: { type: String },
  email: { type: String, unique: true },
  address: { type: String },
  joiningDate: { type: Date, default: Date.now },
  classesAssigned: [{ type: String }], // e.g. ["10-A", "9-B"]
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);