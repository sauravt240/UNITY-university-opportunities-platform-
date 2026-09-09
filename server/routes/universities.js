const express = require('express');
const router = express.Router();
const { getUniversities, createUniversity } = require('../controllers/universityController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getUniversities)
  .post(protect, authorize('Admin'), createUniversity);

module.exports = router;
