const express = require('express');
const router = express.Router();
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentsByClass

} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Admin'), createStudent);
router.get('/', protect, authorize('Admin', 'Teacher'), getStudents);
router.get('/by-class', protect, authorize('Admin', 'Teacher'), getStudentsByClass);
router.get('/:id', protect, getStudentById); // any logged-in user can view one
router.put('/:id', protect, authorize('Admin'), updateStudent);
router.delete('/:id', protect, authorize('Admin'), deleteStudent);


module.exports = router;