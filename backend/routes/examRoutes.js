const express = require('express');
const router = express.Router();
const {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam
} = require('../controllers/examController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Admin', 'Teacher'), createExam);
router.get('/', protect, getExams);
router.get('/:id', protect, getExamById);
router.put('/:id', protect, authorize('Admin', 'Teacher'), updateExam);
router.delete('/:id', protect, authorize('Admin'), deleteExam);

module.exports = router;