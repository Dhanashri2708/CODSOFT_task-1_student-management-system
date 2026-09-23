const Result = require('../models/Result');
const Exam = require('../models/Exam');

// Helper: calculate grade based on percentage
function calculateGrade(marksObtained, maxMarks, passingMarks) {
  if (marksObtained < passingMarks) return 'Fail';
  const percentage = (marksObtained / maxMarks) * 100;
  if (percentage >= 90) return 'A+';
  if (percentage >= 75) return 'A';
  if (percentage >= 60) return 'B';
  if (percentage >= 45) return 'C';
  return 'D';
}

exports.createResult = async (req, res) => {
  try {
    const exam = await Exam.findById(req.body.exam);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    const grade = calculateGrade(req.body.marksObtained, exam.maxMarks, exam.passingMarks);

    const result = new Result({ ...req.body, grade });
    await result.save();
    res.status(201).json(result);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Result already exists for this student and exam' });
    }
    res.status(400).json({ error: err.message });
  }
};

// Bulk entry for a whole class after an exam
exports.createBulkResults = async (req, res) => {
  try {
    const exam = await Exam.findById(req.body.exam);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    const resultsWithGrades = req.body.results.map(r => ({
      student: r.student,
      exam: req.body.exam,
      marksObtained: r.marksObtained,
      grade: calculateGrade(r.marksObtained, exam.maxMarks, exam.passingMarks),
    }));

    const saved = await Result.insertMany(resultsWithGrades, { ordered: false });
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getResults = async (req, res) => {
  try {
    const filter = {};
    if (req.query.student) filter.student = req.query.student;
    if (req.query.exam) filter.exam = req.query.exam;

    const results = await Result.find(filter)
      .populate('student', 'name rollNumber className')
      .populate('exam', 'examName subject maxMarks examDate');

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!result) return res.status(404).json({ error: 'Result not found' });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Result not found' });
    res.json({ message: 'Result deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get exam results for the currently logged-in student
exports.getMyResults = async (req, res) => {
  try {
    if (!req.user.linkedStudent) {
      return res.status(400).json({ error: 'This account is not linked to a student record' });
    }

    const results = await Result.find({ student: req.user.linkedStudent })
      .populate('exam', 'examName subject maxMarks examDate');

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};