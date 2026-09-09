const express = require('express');
const router = express.Router();
const { 
  applyToOpportunity, 
  getStudentApplications, 
  getOpportunityApplications, 
  updateApplicationStatus 
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Student routes
router.post('/:opportunityId', protect, authorize('Student'), upload.single('resume'), applyToOpportunity);
router.get('/student', protect, authorize('Student'), getStudentApplications);

// Faculty routes
router.get('/opportunity/:opportunityId', protect, authorize('Faculty', 'Admin'), getOpportunityApplications);
router.put('/:id/status', protect, authorize('Faculty', 'Admin'), updateApplicationStatus);

module.exports = router;
