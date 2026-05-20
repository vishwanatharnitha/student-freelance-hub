import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './src/models/Job.js';
import User from './src/models/User.js';
import Application from './src/models/Application.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/freelance-hub';

const seedJobs = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Job.deleteMany({});
    await Application.deleteMany({});
    
    // Create a dummy client to act as the job poster
    // First remove if exists
    await User.deleteOne({ email: 'seed_client@example.com' });
    const dummyClient = await User.create({
      name: 'TechStartup Inc.',
      email: 'seed_client@example.com',
      password: 'password123', // Will be hashed by pre-save hook
      role: 'client',
      bio: 'We are a fast-growing tech startup looking for talented students to help us build amazing products.',
    });

    const clientId = dummyClient._id;

    const sampleJobs = [
      {
        title: 'Full-Stack Web App Development (React & Node.js)',
        description: 'Looking for a talented student developer to build a modern SaaS application from scratch. Must have experience with React, Tailwind CSS, Node.js, and MongoDB. The project involves creating a dashboard, integrating Stripe payments, and implementing user authentication.',
        budget: 1500,
        category: 'Development',
        client: clientId,
      },
      {
        title: 'UI/UX Design for E-commerce Mobile App',
        description: 'We need a creative designer to revamp our existing e-commerce app. The ideal candidate should have a strong portfolio demonstrating modern, clean, and intuitive mobile interfaces. Deliverables include high-fidelity Figma mockups and an interactive prototype.',
        budget: 800,
        category: 'Design',
        client: clientId,
      },
      {
        title: 'Video Editing for Tech YouTube Channel',
        description: 'Seeking a skilled video editor for a growing tech review channel. You will be responsible for editing 10-15 minute videos, adding motion graphics, sound design, and color grading. Premiere Pro or DaVinci Resolve preferred.',
        budget: 450,
        category: 'Video Editing',
        client: clientId,
      },
      {
        title: 'SEO Optimized Content Writing for Tech Blog',
        description: 'We are looking for a freelance writer to produce high-quality, SEO-optimized articles about artificial intelligence, web development, and cloud computing. Need 4 articles (1500 words each) per month.',
        budget: 300,
        category: 'Writing',
        client: clientId,
      },
      {
        title: 'Social Media Management for Indie Game Studio',
        description: 'Help us grow our community! We need a social media manager to create engaging content, schedule posts, and interact with our audience on Twitter, Instagram, and TikTok for our upcoming indie game launch.',
        budget: 600,
        category: 'Marketing',
        client: clientId,
      },
      {
        title: 'Python Scripting for Data Automation',
        description: 'Need a student to write a Python script that automates data extraction from several APIs, processes the data, and generates a weekly PDF report. Experience with Pandas and ReportLab is a plus.',
        budget: 250,
        category: 'Development',
        client: clientId,
      },
      {
        title: 'React Native Developer for Fitness App MVP',
        description: 'Looking for a React Native developer to build the Minimum Viable Product (MVP) of a new fitness tracking app. Will involve integrating with phone sensors, building workout UI, and communicating with a Firebase backend.',
        budget: 2000,
        category: 'Development',
        client: clientId,
      },
      {
        title: 'Logo and Brand Identity Design for Startup',
        description: 'We need a complete brand identity package including a logo, color palette, typography guidelines, and social media templates for a new eco-friendly packaging company.',
        budget: 500,
        category: 'Design',
        client: clientId,
      },
      {
        title: 'Copywriter for Landing Page Conversion Optimization',
        description: 'Our current landing page has a low conversion rate. We need an experienced copywriter to rewrite the headline, benefits, and call-to-actions to maximize signups for our SaaS product.',
        budget: 350,
        category: 'Writing',
        client: clientId,
      },
      {
        title: '3D Animator for Short Product Explainer',
        description: 'Need a 30-second 3D animation showing how our new smart home device works. Must be proficient in Blender or Maya. We will provide the CAD models and storyboard.',
        budget: 1200,
        category: 'Video Editing',
        client: clientId,
      },
      {
        title: 'Data Analyst for Customer Churn Prediction',
        description: 'Seeking a student with machine learning experience to analyze our customer dataset and build a model to predict churn. Please be comfortable with Jupyter Notebooks, scikit-learn, and providing actionable insights.',
        budget: 900,
        category: 'Development',
        client: clientId,
      },
      {
        title: 'Virtual Assistant for Email Management & Scheduling',
        description: 'Looking for a highly organized student to act as a part-time virtual assistant. Responsibilities include sorting emails, scheduling meetings, and basic data entry. ~10 hours per week.',
        budget: 200,
        category: 'Marketing',
        client: clientId,
      },
      {
        title: 'Shopify Store Setup and Customization',
        description: 'Need help setting up a new Shopify store for a clothing brand. Involves installing a premium theme, customizing the layout, uploading 50 products, and configuring payment gateways.',
        budget: 650,
        category: 'Development',
        client: clientId,
      },
      {
        title: 'Illustration for Childrens Book (10 pages)',
        description: 'We are publishing a short children\'s book and need a talented illustrator to create 10 full-color, whimsical illustrations based on our manuscript. Style should be soft and friendly.',
        budget: 1000,
        category: 'Design',
        client: clientId,
      },
      {
        title: 'Cybersecurity Audit for Small Business Website',
        description: 'Looking for a student studying cybersecurity to perform a vulnerability assessment on our WordPress website and provide a report on how to secure it against common attacks (SQLi, XSS, etc.).',
        budget: 400,
        category: 'Development',
        client: clientId,
      },
      {
        title: 'Translation Services (English to Spanish)',
        description: 'We need to translate our software documentation from English to Spanish. Approximately 5,000 words. Must be fluent in technical terminology for both languages.',
        budget: 250,
        category: 'Writing',
        client: clientId,
      },
      {
        title: 'TikTok Content Creator / Presenter',
        description: 'Looking for a charismatic student to be the face of our brand on TikTok. We will provide scripts and ideas, you will record and lightly edit 3 short videos per week.',
        budget: 450,
        category: 'Marketing',
        client: clientId,
      },
      {
        title: 'Smart Contract Developer (Solidity)',
        description: 'Need a developer to write a basic ERC-20 token smart contract with some custom vesting logic. Must have experience with Hardhat or Truffle and writing unit tests for smart contracts.',
        budget: 1800,
        category: 'Development',
        client: clientId,
      },
      {
        title: 'Podcast Audio Editor and Mixer',
        description: 'Seeking an audio engineer student to edit our weekly 45-minute interview podcast. Tasks include removing background noise, leveling audio, cutting out filler words, and adding intro/outro music.',
        budget: 300,
        category: 'Video Editing', // Close enough category
        client: clientId,
      },
      {
        title: 'Go/Golang Microservice Developer',
        description: 'Looking for someone to rewrite a slow Node.js microservice in Go for better performance. The service processes incoming webhooks and queues them in Redis.',
        budget: 1100,
        category: 'Development',
        client: clientId,
      }
    ];

    await Job.insertMany(sampleJobs);
    console.log(`Successfully inserted ${sampleJobs.length} sample jobs!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedJobs();
