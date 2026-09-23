const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  examName: { type: String, required: true }, // e.g. "Midterm 2026"
  subject: { type: String, required: true },
  className: { type: String, required: true },
  examDate: { type: Date, required: true },
  maxMarks: { type: Number, required: true },
  passingMarks: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);