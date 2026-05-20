import express from 'express';
import { getGigs, getGigById, createGig, updateGig } from '../controllers/gigController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getGigs)
  .post(protect, createGig);

router.route('/:id')
  .get(getGigById)
  .patch(protect, updateGig);

export default router;
