const express = require('express');
const router = express.Router();
const {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Admin'), createTeacher);
router.get('/', protect, authorize('Admin', 'Teacher'), getTeachers);
router.get('/:id', protect, getTeacherById);
router.put('/:id', protect, authorize('Admin'), updateTeacher);
router.delete('/:id', protect, authorize('Admin'), deleteTeacher);

module.exports = router;