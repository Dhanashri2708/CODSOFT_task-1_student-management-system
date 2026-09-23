const AcademicRecord = require('../models/AcademicRecord');
const Result = require('../models/Result');
const Attendance = require('../models/Attendance');

// Helper: convert overall percentage to a letter grade
function overallGradeFromPercentage(percentage) {
  if (percentage >= 90) return 'A+';
  if (percentage >= 75) return 'A';
  if (percentage >= 60) return 'B';
  if (percentage >= 45) return 'C';
  if (percentage >= 33) return 'D';
  return 'Fail';
}

// 1. MANUAL create — admin types in the final record directly
exports.createRecord = async (req, res) => {
  try {
    const record = new AcademicRecord(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Academic record already exists for this student and year' });
    }
    res.status(400).json({ error: err.message });
  }
};

// 2. AUTO-GENERATE — pulls together existing Result + Attendance data for a student
exports.generateRecord = async (req, res) => {
  try {
    const { student, academicYear, className, section } = req.body;

    // Get every exam result this student has, and populate exam info (subject, maxMarks)
    const results = await Result.find({ student }).populate('exam', 'subject maxMarks examDate');

    if (results.length === 0) {
      return res.status(404).json({ error: 'No exam results found for this student yet' });
    }

    // Build subject-wise breakdown
    const subjects = results.map(r => ({
      subjectName: r.exam.subject,
      marksObtained: r.marksObtained,
      maxMarks: r.exam.maxMarks,
      grade: r.grade,
    }));

    const totalObtained = subjects.reduce((sum, s) => sum + s.marksObtained, 0);
    const totalMax = subjects.reduce((sum, s) => sum + s.maxMarks, 0);
    const overallPercentage = (totalObtained / totalMax) * 100;
    const overallGrade = overallGradeFromPercentage(overallPercentage);

    // Calculate attendance percentage for this student
    const attendanceRecords = await Attendance.find({ student });
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(a => a.status === 'Present').length;
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    const record = await AcademicRecord.findOneAndUpdate(
      { student, academicYear },
      {
        student,
        academicYear,
        className,
        section,
        subjects,
        overallPercentage: overallPercentage.toFixed(2),
        overallGrade,
        attendancePercentage: attendancePercentage.toFixed(2),
        promoted: overallGrade !== 'Fail',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRecords = async (req, res) => {
  try {
    const filter = {};
    if (req.query.student) filter.student = req.query.student;
    if (req.query.academicYear) filter.academicYear = req.query.academicYear;

    const records = await AcademicRecord.find(filter)
      .populate('student', 'name rollNumber className');

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecordById = async (req, res) => {
  try {
    const record = await AcademicRecord.findById(req.params.id).populate('student', 'name rollNumber className');
    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    const record = await AcademicRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const record = await AcademicRecord.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Academic record deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};