const express = require('express');
const router = express.Router();
const {
  markAttendance,
  markBulkAttendance,
  getAttendance,
  getMyAttendance,
  updateAttendance,
  deleteAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Admin', 'Teacher'), markAttendance);
router.post('/bulk', protect, authorize('Admin', 'Teacher'), markBulkAttendance);
router.get('/my', protect, authorize('Student'), getMyAttendance);
router.get('/', protect, getAttendance); // Admin, Teacher, Student can all view (filtered)
router.put('/:id', protect, authorize('Admin', 'Teacher'), updateAttendance);
router.delete('/:id', protect, authorize('Admin'), deleteAttendance);

module.exports = router;