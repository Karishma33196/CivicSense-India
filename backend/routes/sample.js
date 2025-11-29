const express = require('express');
const Content = require('../models/Content');
const User = require('../models/User');
const router = express.Router();

// Add sample content (for testing)
router.post('/sample-content', async (req, res) => {
  try {
    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@constitution.gov' });
    
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    const sampleContent = [
      {
        title: 'Fundamental Rights - Article 14',
        content: 'Article 14 of the Indian Constitution guarantees equality before law and equal protection of laws to all persons within the territory of India. This means the State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.',
        category: 'fundamental_rights',
        author: adminUser._id,
        tags: ['equality', 'article14', 'fundamental-rights'],
        isApproved: true
      },
      {
        title: 'Preamble of Indian Constitution',
        content: 'The Preamble to the Constitution of India is a brief introductory statement that sets out the guiding purpose and principles of the document. It declares India to be a Sovereign Socialist Secular Democratic Republic committed to Justice, Liberty, Equality, and Fraternity.',
        category: 'framework',
        author: adminUser._id,
        tags: ['preamble', 'constitution', 'framework'],
        isApproved: true
      },
      {
        title: 'Fundamental Duties - Article 51A',
        content: 'Article 51A specifies the Fundamental Duties of the citizens. These duties were added by the 42nd Amendment in 1976. They include respecting the Constitution, national flag, and national anthem, upholding sovereignty and integrity of India, and promoting harmony.',
        category: 'duties',
        author: adminUser._id,
        tags: ['duties', 'article51a', 'citizen-responsibilities'],
        isApproved: true
      },
      {
        title: 'Right to Education - Article 21A',
        content: 'Article 21A states that the State shall provide free and compulsory education to all children of the age of six to fourteen years in such manner as the State may, by law, determine. This fundamental right was added by the 86th Constitutional Amendment in 2002.',
        category: 'fundamental_rights',
        author: adminUser._id,
        tags: ['education', 'article21a', 'rights'],
        isApproved: true
      }
    ];

    // Clear existing content and insert new
    await Content.deleteMany({});
    const createdContent = await Content.insertMany(sampleContent);
    
    res.json({
      message: 'Sample content created successfully',
      content: createdContent
    });
  } catch (error) {
    console.error('Error creating sample content:', error);
    res.status(500).json({ message: 'Error creating sample content' });
  }
});

// Get all sample content
router.get('/sample-content', async (req, res) => {
  try {
    const content = await Content.find().populate('author', 'name role');
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content' });
  }
});

module.exports = router;