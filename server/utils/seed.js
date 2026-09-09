require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const University = require('../models/University');
const Opportunity = require('../models/Opportunity');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/opportunity_db');
    console.log('MongoDB Connected for Seeding');

    // Clear DB
    await User.deleteMany();
    await University.deleteMany();
    await Opportunity.deleteMany();

    // 1. Create Universities
    const universities = await University.insertMany([
      { name: 'Stanford University', city: 'Stanford', state: 'CA', country: 'USA', location: { coordinates: [-122.1697, 37.4275] }, website: 'https://stanford.edu' },
      { name: 'MIT', city: 'Cambridge', state: 'MA', country: 'USA', location: { coordinates: [-71.0942, 42.3601] }, website: 'https://mit.edu' },
      { name: 'IIT Delhi', city: 'New Delhi', state: 'Delhi', country: 'India', location: { coordinates: [77.1855, 28.5450] }, website: 'https://iitd.ac.in' },
    ]);

    // 2. Create Users
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      { name: 'Admin User', email: 'admin@platform.com', password, role: 'Admin', university: universities[0]._id, isVerified: true },
      { name: 'Dr. Alan Turing', email: 'alan@stanford.edu', password, role: 'Faculty', university: universities[0]._id, department: 'Computer Science', isVerified: true },
      { name: 'John Doe', email: 'john@student.edu', password, role: 'Student', university: universities[1]._id, degree: 'BTech', year: '3rd Year', skills: ['React', 'Nodejs'], isVerified: true }
    ]);

    // 3. Create Opportunities
    await Opportunity.insertMany([
      {
        title: 'Research Assistant in AI',
        category: 'Research',
        department: 'Computer Science',
        description: 'Looking for a talented student to work on NLP models.',
        postedBy: users[1]._id,
        university: universities[0]._id,
        location: { city: 'Stanford', state: 'CA', country: 'USA' },
        compensation: { type: 'Stipend', amount: '$1500/month' },
        requirements: { minQualification: 'Undergraduate', skills: ['Python', 'NLP', 'PyTorch'] },
        applicationSettings: { deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } // 30 days from now
      },
      {
        title: 'Summer Internship - Fullstack Developer',
        category: 'Internship',
        department: 'Software Engineering',
        description: 'Join our lab to build a modern web application for data visualization.',
        postedBy: users[1]._id,
        university: universities[0]._id,
        location: { city: 'Remote', state: 'N/A', country: 'Global' },
        compensation: { type: 'Stipend', amount: '$2000/month' },
        requirements: { minQualification: 'Undergraduate', skills: ['React', 'Nodejs', 'MongoDB'] },
        applicationSettings: { deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) } // 15 days from now
      }
    ]);

    console.log('Database Seeded!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
