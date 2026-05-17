import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  applyForJob,
  getJobApplications,
  updateApplicationStatus,
  getMyApplications,
} from '../controllers/jobs.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / Semi-public routes
router.route('/').get(getJobs).post(protect, authorize('client'), createJob);
router.route('/my-applications').get(protect, authorize('student'), getMyApplications);
router.route('/:id').get(getJobById);

// Application routes
router.route('/:id/apply').post(protect, authorize('student'), applyForJob);
router.route('/:id/applications').get(protect, authorize('client'), getJobApplications);
router.route('/applications/:appId').put(protect, authorize('client'), updateApplicationStatus);

export default router;
