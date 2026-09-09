const express = require('express');
const router = express.Router();
const { 
  createOpportunity, 
  getOpportunities, 
  getOpportunity, 
  updateOpportunity, 
  deleteOpportunity 
} = require('../controllers/opportunityController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getOpportunities)
  .post(protect, authorize('Faculty', 'Admin', 'Student'), createOpportunity);

router.route('/:id')
  .get(getOpportunity)
  .put(protect, authorize('Faculty', 'Admin', 'Student'), updateOpportunity)
  .delete(protect, authorize('Faculty', 'Admin', 'Student'), deleteOpportunity);

module.exports = router;
