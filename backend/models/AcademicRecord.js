const mongoose = require('mongoose');

const academicRecordSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  academicYear: { type: String, required: true }, // e.g. "2026-2027"
  className: { type: String, required: true },
  section: { type: String },
  subjects: [{
    subjectName: String,
    marksObtained: Number,
    maxMarks: Number,
    grade: String,
  }],
  overallPercentage: { type: Number },
  overallGrade: { type: String },
  attendancePercentage: { type: Number },
  promoted: { type: Boolean, default: false },
  remarks: { type: String },
}, { timestamps: true });

academicRecordSchema.index({ student: 1, academicYear: 1 }, { unique: true }); // one record per student per year

module.exports = mongoose.model('AcademicRecord', academicRecordSchema);