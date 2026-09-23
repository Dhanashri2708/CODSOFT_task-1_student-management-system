const express = require('express');
const router = express.Router();
const {
  createResult,
  createBulkResults,
  getResults,
   getMyResults,
  updateResult,
  deleteResult
} = require('../controllers/resultController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Admin', 'Teacher'), createResult);
router.post('/bulk', protect, authorize('Admin', 'Teacher'), createBulkResults);
router.get('/my', protect, authorize('Student'), getMyResults);
router.get('/', protect, getResults);
router.put('/:id', protect, authorize('Admin', 'Teacher'), updateResult);
router.delete('/:id', protect, authorize('Admin'), deleteResult);

module.exports = router;