const express = require('express');
const Content = require('../models/Content');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all content
router.get('/', async (req, res) => {
  try {
    const content = await Content.find().populate('author', 'name role');
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create content (Educator and Legal Expert)
router.post('/', auth, authorize('educator', 'legal_expert'), async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    
    const newContent = new Content({
      title,
      content,
      category,
      tags,
      author: req.user._id
    });

    await newContent.save();
    await newContent.populate('author', 'name role');
    
    res.status(201).json(newContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete content (Author or Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Check if user is author or admin
    if (content.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this content' });
    }

    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve content (Admin only)
router.patch('/:id/approve', auth, authorize('admin'), async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate('author', 'name role');
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;