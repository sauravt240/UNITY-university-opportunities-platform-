const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Opportunity = require('./models/Opportunity');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data (optional, but good for a clean start)
    // await User.deleteMany({ email: { $ne: 'admin@unity.com' } });
    // await Opportunity.deleteMany({});

    const password = await bcrypt.hash('password123', 10);

    // Create Faculty Users
    const faculties = [
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.j@mit.edu',
        password,
        role: 'Faculty',
        university: 'MIT',
        department: 'Brain and Cognitive Sciences',
        bio: 'Professor of Neuroscience specializing in computational models of memory.'
      },
      {
        name: 'Prof. James Wilson',
        email: 'j.wilson@stanford.edu',
        password,
        role: 'Faculty',
        university: 'Stanford University',
        department: 'Computer Science',
        bio: 'Leading researcher in Human-Computer Interaction and Social Computing.'
      },
      {
        name: 'Dr. Emily Chen',
        email: 'e.chen@harvard.edu',
        password,
        role: 'Faculty',
        university: 'Harvard University',
        department: 'Economics',
        bio: 'Focusing on behavioral economics and market design.'
      },
      {
        name: 'Prof. Rajesh Kumar',
        email: 'rkumar@iitd.ac.in',
        password,
        role: 'Faculty',
        university: 'IIT Delhi',
        department: 'Electrical Engineering',
        bio: 'Expert in VLSI design and embedded systems.'
      },
      {
        name: 'Dr. Elena Rodriguez',
        email: 'elena.r@ox.ac.uk',
        password,
        role: 'Faculty',
        university: 'University of Oxford',
        department: 'Physics',
        bio: 'Working on quantum computing and information theory.'
      }
    ];

    const createdFaculties = [];
    for (const f of faculties) {
      let user = await User.findOne({ email: f.email });
      if (!user) {
        user = await User.create(f);
      }
      createdFaculties.push(user);
    }

    console.log('Faculties created/verified.');

    const opportunities = [
      {
        title: 'Neural Network Architectures for Memory',
        category: 'Research',
        department: 'Neuroscience',
        description: 'We are seeking a research assistant to help design and test new neural network architectures that mimic hippocampal memory formation. Ideal candidate has strong Python skills and background in deep learning.',
        postedBy: createdFaculties[0]._id,
        university: 'MIT',
        location: { city: 'Cambridge', state: 'MA', country: 'USA', geo: { type: 'Point', coordinates: [-71.0942, 42.3601] } },
        compensation: { type: 'Stipend', amount: '$2500/month', benefits: ['Lab Access', 'Publication Credit'] },
        requirements: { minQualification: 'Undergraduate', skills: ['Python', 'PyTorch', 'Neuroscience Basics'], positionsAvailable: 2 },
        applicationSettings: { deadline: new Date('2026-06-30'), mode: 'Apply on Platform' }
      },
      {
        title: 'Full Stack Developer for Research Portal',
        category: 'Project',
        department: 'Software Engineering',
        description: 'Help build a collaborative portal for inter-university research sharing. This project involves React, Node.js, and MongoDB.',
        postedBy: createdFaculties[1]._id,
        university: 'Stanford University',
        location: { city: 'Stanford', state: 'CA', country: 'USA', geo: { type: 'Point', coordinates: [-122.1697, 37.4275] } },
        compensation: { type: 'Certificate Only', benefits: ['Mentorship', 'Letter of Recommendation'] },
        requirements: { minQualification: 'Undergraduate', skills: ['React', 'Node.js', 'Tailwind CSS'], positionsAvailable: 3 },
        applicationSettings: { deadline: new Date('2026-05-15'), mode: 'Apply on Platform' }
      },
      {
        title: 'Market Analysis Internship',
        category: 'Internship',
        department: 'Economics',
        description: 'Summer internship focused on analyzing market trends in developing economies. You will work with large datasets and perform statistical analysis.',
        postedBy: createdFaculties[2]._id,
        university: 'Harvard University',
        location: { city: 'Boston', state: 'MA', country: 'USA', geo: { type: 'Point', coordinates: [-71.0589, 42.3601] } },
        compensation: { type: 'Stipend', amount: '$3000/total', duration: '3 Months' },
        requirements: { minQualification: 'Postgraduate', skills: ['R', 'Stata', 'Econometrics'], positionsAvailable: 1 },
        applicationSettings: { deadline: new Date('2026-05-30'), mode: 'Apply on Platform' }
      },
      {
        title: 'Teaching Assistant - Digital Circuits',
        category: 'Teaching Assistant',
        department: 'Electrical Engineering',
        description: 'TA needed for the Fall semester to assist with lab sessions and grading for the Digital Logic Design course.',
        postedBy: createdFaculties[3]._id,
        university: 'IIT Delhi',
        location: { city: 'New Delhi', state: 'Delhi', country: 'India', geo: { type: 'Point', coordinates: [77.1926, 28.5450] } },
        compensation: { type: 'Project Allowance', amount: '₹15,000/month' },
        requirements: { minQualification: 'Undergraduate', skills: ['Verilog', 'Digital Design'], yearOfStudy: '3rd Year or above', positionsAvailable: 5 },
        applicationSettings: { deadline: new Date('2026-07-15'), mode: 'Apply on Platform' }
      },
      {
        title: 'Quantum Algorithms Research',
        category: 'Research',
        department: 'Physics',
        description: 'Opportunity to work on optimizing quantum algorithms for noisy intermediate-scale quantum (NISQ) devices.',
        postedBy: createdFaculties[4]._id,
        university: 'University of Oxford',
        location: { city: 'Oxford', country: 'UK', geo: { type: 'Point', coordinates: [-1.2577, 51.7520] } },
        compensation: { type: 'Mixed', amount: '£1200/month', benefits: ['Conference Travel Fund'] },
        requirements: { minQualification: 'PhD', skills: ['Quantum Mechanics', 'Qiskit', 'Algorithms'], positionsAvailable: 1 },
        applicationSettings: { deadline: new Date('2026-08-01'), mode: 'Apply on Platform' }
      },
      {
        title: 'User Experience Study - Educational Tools',
        category: 'Project',
        department: 'Design',
        description: 'Participate in a UX study for new educational software. Conduct interviews and usability tests.',
        postedBy: createdFaculties[1]._id,
        university: 'Stanford University',
        location: { city: 'Remote', country: 'Global' },
        compensation: { type: 'Stipend', amount: '$500 for the project' },
        requirements: { minQualification: 'Any', skills: ['UX Research', 'Communication'], positionsAvailable: 10 },
        applicationSettings: { deadline: new Date('2026-06-10'), mode: 'Apply on Platform' }
      }
    ];

    for (const opp of opportunities) {
      const exists = await Opportunity.findOne({ title: opp.title, university: opp.university });
      if (!exists) {
        await Opportunity.create(opp);
      }
    }

    console.log('Opportunities seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
