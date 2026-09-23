const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  date: { type: Date, required: true, default: Date.now },
  status: { type: String, enum: ['Present', 'Absent', 'Leave'], required: true },
  className: { type: String, required: true },
  remarks: { type: String },
}, { timestamps: true });

// Prevent marking the same student twice for the same date
attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);