const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  feeType: { type: String, required: true }, // e.g. "Tuition", "Transport", "Exam Fee"
  totalAmount: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  dueDate: { type: Date, required: true },
  academicYear: { type: String, required: true }, // e.g. "2026-2027"
  status: { type: String, enum: ['Pending', 'Partial', 'Paid'], default: 'Pending' },
  paymentHistory: [{
    amount: Number,
    paidOn: { type: Date, default: Date.now },
    paymentMode: { type: String, enum: ['Cash', 'Card', 'UPI', 'Bank Transfer'] },
    transactionId: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);