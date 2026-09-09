const University = require('../models/University');

exports.getUniversities = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) throw new Error('DB not connected');
    const universities = await University.find();
    res.json({ success: true, count: universities.length, data: universities });
  } catch (error) {
    console.log('DB Connection failed, using mock data for UI demo');
    const mockUniversities = [
      { _id: 'mock1', name: 'Stanford University', city: 'Stanford', state: 'CA', country: 'USA' },
      { _id: 'mock2', name: 'MIT', city: 'Cambridge', state: 'MA', country: 'USA' },
      { _id: 'mock3', name: 'IIT Delhi', city: 'New Delhi', state: 'Delhi', country: 'India' }
    ];
    res.json({ success: true, count: mockUniversities.length, data: mockUniversities });
  }
};

exports.createUniversity = async (req, res) => {
  try {
    const university = await University.create(req.body);
    res.status(201).json({ success: true, data: university });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
