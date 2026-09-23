const Fee = require('../models/Fee');

// Helper: recalculate status based on amountPaid vs totalAmount
function calculateStatus(totalAmount, amountPaid) {
  if (amountPaid <= 0) return 'Pending';
  if (amountPaid < totalAmount) return 'Partial';
  return 'Paid';
}

// Create a new fee record (assigning fees to a student)
exports.createFee = async (req, res) => {
  try {
    const fee = new Fee(req.body);
    fee.status = calculateStatus(fee.totalAmount, fee.amountPaid);
    await fee.save();
    res.status(201).json(fee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Assign the same fee to a whole class at once
exports.createBulkFees = async (req, res) => {
  try {
    // req.body.students = array of student IDs
    // req.body.feeDetails = { feeType, totalAmount, dueDate, academicYear }
    const records = req.body.students.map(studentId => ({
      student: studentId,
      ...req.body.feeDetails,
      status: 'Pending',
    }));
    const saved = await Fee.insertMany(records);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Record a payment against an existing fee record
exports.recordPayment = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ error: 'Fee record not found' });

    const { amount, paymentMode, transactionId } = req.body;

    fee.amountPaid += amount;
    fee.paymentHistory.push({ amount, paymentMode, transactionId });
    fee.status = calculateStatus(fee.totalAmount, fee.amountPaid);

    await fee.save();
    res.json(fee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get fees, filterable by student / status / academic year
exports.getFees = async (req, res) => {
  try {
    const filter = {};
    if (req.query.student) filter.student = req.query.student;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.academicYear) filter.academicYear = req.query.academicYear;

    const fees = await Fee.find(filter)
      .populate('student', 'name rollNumber className');

    res.json(fees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate('student', 'name rollNumber className');
    if (!fee) return res.status(404).json({ error: 'Fee record not found' });
    res.json(fee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fee) return res.status(404).json({ error: 'Fee record not found' });
    res.json(fee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) return res.status(404).json({ error: 'Fee record not found' });
    res.json({ message: 'Fee record deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get fee records for the currently logged-in student
exports.getMyFees = async (req, res) => {
  try {
    if (!req.user.linkedStudent) {
      return res.status(400).json({ error: 'This account is not linked to a student record' });
    }

    const fees = await Fee.find({ student: req.user.linkedStudent });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};