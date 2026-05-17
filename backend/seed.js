import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './src/models/Job.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/freelance-hub';

const seedJobs = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Generate a mock valid ObjectId for the 'client' field
    const dummyClientId = new mongoose.Types.ObjectId();

    const sampleJobs = [
      {
        title: 'Frontend Developer Needed for React Dashboard',
        description: 'Looking for a skilled student to build a responsive admin dashboard using React, Tailwind CSS, and Vite. The design is already provided in Figma. Need someone who can translate designs into pixel-perfect code.',
        budget: 1500,
        category: 'Web Development',
        client: dummyClientId,
        status: 'open'
      },
      {
        title: 'UI/UX Designer for Mobile App MVP',
        description: 'We are a startup looking for a creative student to design screens for our upcoming fitness tracking app. Must have experience with Figma and creating user flow diagrams.',
        budget: 800,
        category: 'Design',
        client: dummyClientId,
        status: 'open'
      },
      {
        title: 'Node.js Backend Developer (API Creation)',
        description: 'Need an experienced backend developer to create robust RESTful APIs for an e-commerce platform. Must be proficient with Express, MongoDB, and JWT authentication.',
        budget: 2000,
        category: 'Web Development',
        client: dummyClientId,
        status: 'open'
      },
      {
        title: 'Content Writer for Tech Blog',
        description: 'Looking for a student who can write high-quality, engaging articles about modern web development trends (AI, React, Next.js). Expecting 4 articles per month.',
        budget: 400,
        category: 'Writing',
        client: dummyClientId,
        status: 'open'
      },
      {
        title: 'Python Script for Data Scraping',
        description: 'I need a Python script to scrape publicly available real estate data into a CSV file. Must use BeautifulSoup or Selenium and handle pagination efficiently.',
        budget: 300,
        category: 'Data Science',
        client: dummyClientId,
        status: 'open'
      }
    ];

    await Job.insertMany(sampleJobs);
    console.log('Successfully inserted 5 sample jobs!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedJobs();
