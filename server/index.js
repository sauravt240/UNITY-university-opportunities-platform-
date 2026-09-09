require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth');
const universityRoutes = require('./routes/universities');
const opportunityRoutes = require('./routes/opportunities');
const applicationRoutes = require('./routes/applications');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const seedIfEmpty = async () => {
  try {
    const User = require('./models/User');
    const Opportunity = require('./models/Opportunity');
    const bcrypt = require('bcryptjs');
    
    const count = await Opportunity.countDocuments();
    if (count === 0) {
      console.log('Database empty. Seeding initial data...');
      const password = await bcrypt.hash('password123', 10);
      
      // Create some faculty users
      const faculty1 = await User.create({ 
        name: 'Dr. Sarah Johnson', 
        email: 'sarah.j@mit.edu', 
        password, 
        role: 'Faculty', 
        university: 'MIT', 
        department: 'Brain and Cognitive Sciences' 
      });
      
      const faculty2 = await User.create({ 
        name: 'Prof. James Wilson', 
        email: 'j.wilson@stanford.edu', 
        password, 
        role: 'Faculty', 
        university: 'Stanford University', 
        department: 'Computer Science' 
      });

      await Opportunity.create([
        { 
          title: 'Neural Network Architectures for Memory', 
          category: 'Research', 
          department: 'Neuroscience', 
          description: 'Looking for a talented student to work on NLP models and hippocampal memory formation. This project involves deep learning and computational neuroscience.', 
          postedBy: faculty1._id, 
          university: 'MIT', 
          location: { city: 'Cambridge', state: 'MA', country: 'USA', geo: { type: 'Point', coordinates: [-71.0942, 42.3601] } }, 
          compensation: { type: 'Stipend', amount: '$2500/month' }, 
          requirements: { minQualification: 'Undergraduate', skills: ['Python', 'PyTorch', 'Neuroscience'] }, 
          applicationSettings: { deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } 
        },
        { 
          title: 'Summer Internship - Frontend Engineering', 
          category: 'Internship', 
          department: 'Software Engineering', 
          description: 'Join our lab to build a modern web application for research data visualization using React and Three.js.', 
          postedBy: faculty2._id, 
          university: 'Stanford University', 
          location: { city: 'Stanford', state: 'CA', country: 'USA', geo: { type: 'Point', coordinates: [-122.1697, 37.4275] } }, 
          compensation: { type: 'Stipend', amount: '$2000/month' }, 
          requirements: { minQualification: 'Undergraduate', skills: ['React', 'Three.js', 'Tailwind'] }, 
          applicationSettings: { deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) } 
        },
        { 
          title: 'Quantum Algorithms Research Assistant', 
          category: 'Research', 
          department: 'Physics', 
          description: 'Help develop and test quantum algorithms for cryptography. Experience with Qiskit preferred.', 
          postedBy: faculty1._id, 
          university: 'University of Oxford', 
          location: { city: 'Oxford', country: 'UK', geo: { type: 'Point', coordinates: [-1.2577, 51.7520] } }, 
          compensation: { type: 'Stipend', amount: '£1500/month' }, 
          requirements: { minQualification: 'PhD', skills: ['Quantum Mechanics', 'Qiskit', 'Python'] }, 
          applicationSettings: { deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) } 
        },
        { 
          title: 'Data Collection Surveyor - Urban Planning', 
          category: 'Project', 
          department: 'Sociology', 
          description: 'Help collect survey data from local communities regarding urban development and public transport efficiency.', 
          postedBy: faculty2._id, 
          university: 'Delhi University', 
          location: { city: 'New Delhi', country: 'India', geo: { type: 'Point', coordinates: [77.2090, 28.6139] } }, 
          compensation: { type: 'Unpaid' }, 
          requirements: { minQualification: 'Any', skills: ['Communication', 'Data Entry'] }, 
          applicationSettings: { deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) } 
        },
        { 
          title: 'Teaching Assistant - Machine Learning 101', 
          category: 'Teaching Assistant', 
          department: 'Computer Science', 
          description: 'Assist in grading assignments and conducting lab sessions for the introductory ML course.', 
          postedBy: faculty2._id, 
          university: 'Stanford University', 
          location: { city: 'Stanford', state: 'CA', country: 'USA', geo: { type: 'Point', coordinates: [-122.1697, 37.4275] } }, 
          compensation: { type: 'Project Allowance', amount: '$1000/semester' }, 
          requirements: { minQualification: 'Undergraduate', skills: ['Machine Learning', 'Python'], yearOfStudy: '3rd Year' }, 
          applicationSettings: { deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) } 
        },
        { 
          title: 'AI Ethics Policy Research', 
          category: 'Research', 
          department: 'Philosophy/Law', 
          description: 'Investigate the legal and ethical implications of generative AI in higher education.', 
          postedBy: faculty1._id, 
          university: 'Harvard University', 
          location: { city: 'Cambridge', state: 'MA', country: 'USA', geo: { type: 'Point', coordinates: [-71.1167, 42.3770] } }, 
          compensation: { type: 'Stipend', amount: '$1800/month' }, 
          requirements: { minQualification: 'Postgraduate', skills: ['Legal Research', 'Ethics'] }, 
          applicationSettings: { deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) } 
        },
        { 
          title: 'Climate Change Impact Study', 
          category: 'Field Work', 
          department: 'Environmental Science', 
          description: 'Join our team for a field study on coastal erosion and its impact on local biodiversity.', 
          postedBy: faculty2._id, 
          university: 'UC Berkeley', 
          location: { city: 'Berkeley', state: 'CA', country: 'USA', geo: { type: 'Point', coordinates: [-122.2730, 37.8715] } }, 
          compensation: { type: 'Mixed', amount: '$500/week + Travel' }, 
          requirements: { minQualification: 'Undergraduate', skills: ['GIS', 'Field Sampling'] }, 
          applicationSettings: { deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000) } 
        },
        { 
          title: 'Mobile App Developer - Health Tech', 
          category: 'Internship', 
          department: 'Bio-Engineering', 
          description: 'Develop a React Native application for monitoring patient vitals in remote areas.', 
          postedBy: faculty1._id, 
          university: 'IIT Bombay', 
          location: { city: 'Mumbai', country: 'India', geo: { type: 'Point', coordinates: [72.9165, 19.1334] } }, 
          compensation: { type: 'Stipend', amount: '₹20,000/month' }, 
          requirements: { minQualification: 'Undergraduate', skills: ['React Native', 'Firebase'] }, 
          applicationSettings: { deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000) } 
        },
        { 
          title: 'Blockchain for Supply Chain Security', 
          category: 'Project', 
          department: 'Information Technology', 
          description: 'Research and prototype a blockchain-based solution for tracking pharmaceutical supplies.', 
          postedBy: faculty2._id, 
          university: 'ETH Zurich', 
          location: { city: 'Zurich', country: 'Switzerland', geo: { type: 'Point', coordinates: [8.5417, 47.3769] } }, 
          compensation: { type: 'Certificate Only' }, 
          requirements: { minQualification: 'Postgraduate', skills: ['Solidity', 'Blockchain'] }, 
          applicationSettings: { deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000) } 
        },
        { 
          title: 'Psychology Experiment Coordinator', 
          category: 'Research', 
          department: 'Psychology', 
          description: 'Coordinate and run behavioral experiments involving human subjects.', 
          postedBy: faculty1._id, 
          university: 'Yale University', 
          location: { city: 'New Haven', state: 'CT', country: 'USA', geo: { type: 'Point', coordinates: [-72.9223, 41.3163] } }, 
          compensation: { type: 'Stipend', amount: '$15/hour' }, 
          requirements: { minQualification: 'Any', skills: ['Organization', 'Communication'] }, 
          applicationSettings: { deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) } 
        }
      ]);
      console.log('Database seeded successfully!');
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('MongoDB Connected (Local)');
  } catch (err) {
    console.log('Local MongoDB failed. Starting In-Memory DB...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('In-Memory MongoDB Connected!');
  }
  await seedIfEmpty();
};
connectDB();

// Routes Middleware
app.use('/api/auth', authRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
