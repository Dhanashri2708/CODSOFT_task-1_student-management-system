const express = require('express');
const router = express.Router();
const {
  createFee,
  createBulkFees,
  recordPayment,
  getFees,
  getMyFees,
  getFeeById,
  updateFee,
  deleteFee
} = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Admin'), createFee);
router.post('/bulk', protect, authorize('Admin'), createBulkFees);
router.post('/:id/pay', protect, authorize('Admin'), recordPayment);
router.get('/my', protect, authorize('Student'), getMyFees);
router.get('/', protect, getFees);
router.get('/:id', protect, getFeeById);
router.put('/:id', protect, authorize('Admin'), updateFee);
router.delete('/:id', protect, authorize('Admin'), deleteFee);

module.exports = router;