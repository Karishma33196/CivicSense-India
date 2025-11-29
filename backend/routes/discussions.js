const express = require('express');
const Discussion = require('../models/Discussion');
const Content = require('../models/Content');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all discussions with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const discussions = await Discussion.find({ isActive: true })
      .populate('author', 'name role')
      .populate('contentReference', 'title')
      .populate('replies.user', 'name role')
      .populate('participants', 'name role')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Discussion.countDocuments({ isActive: true });

    res.json({
      discussions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalDiscussions: total
    });
  } catch (error) {
    console.error('Error fetching discussions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single discussion by ID
router.get('/:id', async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('author', 'name role')
      .populate('contentReference', 'title content')
      .populate('replies.user', 'name role')
      .populate('participants', 'name role');

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    res.json(discussion);
  } catch (error) {
    console.error('Error fetching discussion:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new discussion (Authenticated users only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, contentReference } = req.body;

    const discussion = new Discussion({
      title,
      description,
      category,
      contentReference: contentReference || null,
      author: req.user._id,
      participants: [req.user._id] // Add author as first participant
    });

    await discussion.save();
    await discussion.populate('author', 'name role');
    await discussion.populate('contentReference', 'title');

    res.status(201).json(discussion);
  } catch (error) {
    console.error('Error creating discussion:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add reply to discussion (Authenticated users only)
router.post('/:id/replies', auth, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message is required' });
    }

    const discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          replies: {
            user: req.user._id,
            message: message.trim()
          }
        }
      },
      { new: true }
    )
    .populate('author', 'name role')
    .populate('contentReference', 'title')
    .populate('replies.user', 'name role')
    .populate('participants', 'name role');

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    res.json(discussion);
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get discussions by content reference
router.get('/content/:contentId', async (req, res) => {
  try {
    const discussions = await Discussion.find({ 
      contentReference: req.params.contentId,
      isActive: true 
    })
    .populate('author', 'name role')
    .populate('replies.user', 'name role')
    .sort({ updatedAt: -1 });

    res.json(discussions);
  } catch (error) {
    console.error('Error fetching content discussions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete discussion (Author or Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Check if user is author or admin
    if (discussion.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this discussion' });
    }

    await Discussion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    console.error('Error deleting discussion:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;