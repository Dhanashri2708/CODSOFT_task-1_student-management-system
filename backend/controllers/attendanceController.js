const Attendance = require('../models/Attendance');

// Mark attendance for one student
exports.markAttendance = async (req, res) => {
  try {
    const record = new Attendance(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Attendance already marked for this student on this date' });
    }
    res.status(400).json({ error: err.message });
  }
};

// Mark attendance for multiple students at once (a whole class) — upserts, so re-submitting corrects existing records
exports.markBulkAttendance = async (req, res) => {
  try {
    const { records } = req.body;

    const results = await Promise.all(
      records.map((r) =>
        Attendance.findOneAndUpdate(
          { student: r.student, date: r.date },
          { ...r },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      )
    );

    res.status(201).json(results);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all attendance, optionally filtered by student/class/date
exports.getAttendance = async (req, res) => {
  try {
    const filter = {};
    if (req.query.student) filter.student = req.query.student;
    if (req.query.className) filter.className = req.query.className;
    if (req.query.date) filter.date = new Date(req.query.date);

    const records = await Attendance.find(filter)
      .populate('student', 'name rollNumber className')
      .populate('markedBy', 'name subject');

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a single attendance record
exports.updateAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a record
exports.deleteAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Attendance record deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get attendance for the currently logged-in student
exports.getMyAttendance = async (req, res) => {
  try {
    if (!req.user.linkedStudent) {
      return res.status(400).json({ error: 'This account is not linked to a student record' });
    }

    const records = await Attendance.find({ student: req.user.linkedStudent })
      .populate('markedBy', 'name subject')
      .sort({ date: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};