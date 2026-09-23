const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  marksObtained: { type: Number, required: true },
  grade: { type: String }, // e.g. "A", "B", "Fail" — we'll auto-calculate this
  remarks: { type: String },
}, { timestamps: true });

resultSchema.index({ student: 1, exam: 1 }, { unique: true }); // one result per student per exam

module.exports = mongoose.model('Result', resultSchema);