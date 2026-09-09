const Opportunity = require('../models/Opportunity');

exports.createOpportunity = async (req, res) => {
  try {
    req.body.postedBy = req.user._id;
    // req.body.university should be sent from frontend or derived from req.user
    if (!req.body.university) req.body.university = req.user.university;

    const opportunity = await Opportunity.create(req.body);
    res.status(201).json({ success: true, data: opportunity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOpportunities = async (req, res) => {
  try {
    const { university, category, location, minCgpa } = req.query;
    let query = {};

    if (university) query.university = university;
    if (category) query.category = category;
    
    // In a real app, you would add geospatial queries for radius search here using $nearSphere

    const opportunities = await Opportunity.find(query)
      .populate('postedBy', 'name department')
      .sort('-createdAt');
      
    res.json({ success: true, count: opportunities.length, data: opportunities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('postedBy', 'name department bio');
      
    if (!opportunity) return res.status(404).json({ success: false, message: 'Not found' });
    
    res.json({ success: true, data: opportunity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOpportunity = async (req, res) => {
  try {
    let opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ success: false, message: 'Not found' });

    if (opportunity.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    opportunity = await Opportunity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: opportunity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ success: false, message: 'Not found' });

    if (opportunity.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await opportunity.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
