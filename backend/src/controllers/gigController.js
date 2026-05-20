import Gig from '../models/Gig.js';

// @desc    Get all gigs (with pagination and filtering)
// @route   GET /api/gigs
// @access  Public
export const getGigs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filtering
    const filter = { status: 'active' };
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    const gigs = await Gig.find(filter)
      .populate('seller', 'name avatar rating ratingsCount')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      
    const total = await Gig.countDocuments(filter);
    
    res.json({
      gigs,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching gigs' });
  }
};

// @desc    Get single gig by ID
// @route   GET /api/gigs/:id
// @access  Public
export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('seller', 'name avatar bio skills rating ratingsCount');
      
    if (gig) {
      res.json(gig);
    } else {
      res.status(404).json({ message: 'Gig not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching gig' });
  }
};

// @desc    Create a gig
// @route   POST /api/gigs
// @access  Private
export const createGig = async (req, res) => {
  try {
    const { title, description, category, price, skills } = req.body;
    
    const gig = new Gig({
      title,
      description,
      category,
      price,
      skills: skills || [],
      seller: req.user._id // Assumes auth middleware sets req.user
    });
    
    const createdGig = await gig.save();
    res.status(201).json(createdGig);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating gig' });
  }
};

// @desc    Update a gig
// @route   PATCH /api/gigs/:id
// @access  Private
export const updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    
    if (gig) {
      // Check if user is seller
      if (gig.seller.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this gig' });
      }
      
      gig.title = req.body.title || gig.title;
      gig.description = req.body.description || gig.description;
      gig.category = req.body.category || gig.category;
      gig.price = req.body.price || gig.price;
      gig.skills = req.body.skills || gig.skills;
      gig.status = req.body.status || gig.status;
      
      const updatedGig = await gig.save();
      res.json(updatedGig);
    } else {
      res.status(404).json({ message: 'Gig not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating gig' });
  }
};
