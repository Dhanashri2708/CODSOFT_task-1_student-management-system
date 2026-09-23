const express = require('express');
const router = express.Router();
const {
  createRecord,
  generateRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord
} = require('../controllers/academicRecordController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Admin', 'Teacher'), createRecord);
router.post('/generate', protect, authorize('Admin', 'Teacher'), generateRecord);
router.get('/', protect, getRecords);
router.get('/:id', protect, getRecordById);
router.put('/:id', protect, authorize('Admin'), updateRecord);
router.delete('/:id', protect, authorize('Admin'), deleteRecord);

module.exports = router;