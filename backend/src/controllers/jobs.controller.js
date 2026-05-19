import Job from '../models/Job.js';
import Application from '../models/Application.js';

// Create a new job (Client only)
export const createJob = async (req, res) => {
  try {
    const { title, description, budget, category } = req.body;

    const job = new Job({
      title,
      description,
      budget,
      category,
      client: req.user._id,
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all jobs (Public/Authenticated)
export const getJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    const jobs = await Job.find({ ...keyword, ...category }).populate('client', 'name avatar');

    if (jobs.length === 0) {
      const fallbackJobs = [
        {
          _id: 'fallback_1',
          title: 'Full-Stack Web App Development (React & Node.js)',
          description: 'Looking for a talented student developer to build a modern SaaS application from scratch. Must have experience with React, Tailwind CSS, Node.js, and MongoDB. The project involves creating a dashboard, integrating Stripe payments, and implementing user authentication.',
          budget: 1500,
          category: 'Development',
          client: { name: 'TechStartup Inc.' },
          createdAt: new Date().toISOString()
        },
        {
          _id: 'fallback_2',
          title: 'UI/UX Design for E-commerce Mobile App',
          description: 'We need a creative designer to revamp our existing e-commerce app. The ideal candidate should have a strong portfolio demonstrating modern, clean, and intuitive mobile interfaces. Deliverables include high-fidelity Figma mockups and an interactive prototype.',
          budget: 800,
          category: 'Design',
          client: { name: 'RetailFlow' },
          createdAt: new Date().toISOString()
        },
        {
          _id: 'fallback_3',
          title: 'Video Editing for Tech YouTube Channel',
          description: 'Seeking a skilled video editor for a growing tech review channel. You will be responsible for editing 10-15 minute videos, adding motion graphics, sound design, and color grading. Premiere Pro or DaVinci Resolve preferred.',
          budget: 450,
          category: 'Video Editing',
          client: { name: 'TechReviewer' },
          createdAt: new Date().toISOString()
        },
        {
          _id: 'fallback_4',
          title: 'SEO Optimized Content Writing for Tech Blog',
          description: 'We are looking for a freelance writer to produce high-quality, SEO-optimized articles about artificial intelligence, web development, and cloud computing. Need 4 articles (1500 words each) per month.',
          budget: 300,
          category: 'Writing',
          client: { name: 'DevWeekly' },
          createdAt: new Date().toISOString()
        },
        {
          _id: 'fallback_5',
          title: 'Social Media Management for Indie Game Studio',
          description: 'Help us grow our community! We need a social media manager to create engaging content, schedule posts, and interact with our audience on Twitter, Instagram, and TikTok for our upcoming indie game launch.',
          budget: 600,
          category: 'Marketing',
          client: { name: 'PixelForge Games' },
          createdAt: new Date().toISOString()
        },
        {
          _id: 'fallback_6',
          title: 'Python Scripting for Data Automation',
          description: 'Need a student to write a Python script that automates data extraction from several APIs, processes the data, and generates a weekly PDF report. Experience with Pandas and ReportLab is a plus.',
          budget: 250,
          category: 'Data Science',
          client: { name: 'AnalyticsPro' },
          createdAt: new Date().toISOString()
        }
      ];

      // If keyword or category is present, try to filter the fallback jobs
      let filteredFallback = fallbackJobs;
      if (req.query.keyword) {
        filteredFallback = filteredFallback.filter(job => job.title.toLowerCase().includes(req.query.keyword.toLowerCase()));
      }
      if (req.query.category) {
        filteredFallback = filteredFallback.filter(job => job.category === req.query.category);
      }

      return res.json(filteredFallback);
    }

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('client', 'name avatar');

    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply for a job (Student only)
export const applyForJob = async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      student: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new Application({
      job: jobId,
      student: req.user._id,
      coverLetter,
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get applications for a client's job (Client only)
export const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ job: jobId }).populate('student', 'name email skills bio');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update application status (Client only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.appId).populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student's applied jobs (Student only)
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id }).populate('job');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
