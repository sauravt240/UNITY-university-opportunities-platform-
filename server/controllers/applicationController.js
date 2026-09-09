const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');

exports.applyToOpportunity = async (req, res) => {
  try {
    const opportunityId = req.params.opportunityId;
    const studentId = req.user._id;

    // Check if already applied
    const existingApp = await Application.findOne({ opportunity: opportunityId, student: studentId });
    if (existingApp) {
      return res.status(400).json({ success: false, message: 'You have already applied for this opportunity.' });
    }

    const { coverNote, customAnswers } = req.body;
    let resumeUrl = req.user.resumeUrl;

    if (req.file) {
      resumeUrl = `/uploads/${req.file.filename}`;
    }

    const application = await Application.create({
      opportunity: opportunityId,
      student: studentId,
      coverNote,
      customAnswers: customAnswers ? JSON.parse(customAnswers) : [],
      resumeUrl
    });

    // Increment applicants count
    await Opportunity.findByIdAndUpdate(opportunityId, { $inc: { applicantsCount: 1 } });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('opportunity', 'title company university status deadline')
      .sort('-appliedAt');
      
    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOpportunityApplications = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.opportunityId);
    if (!opportunity) return res.status(404).json({ success: false, message: 'Opportunity not found' });

    if (opportunity.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const applications = await Application.find({ opportunity: req.params.opportunityId })
      .populate('student', 'name email degree year skills resumeUrl')
      .sort('-appliedAt');

    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('opportunity');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    if (application.opportunity.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    application.status = req.body.status;
    await application.save();

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
