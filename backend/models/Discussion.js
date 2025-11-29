const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  contentReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    default: null
  },
  category: {
    type: String,
    required: true,
    enum: ['general', 'framework', 'fundamental_rights', 'duties', 'articles', 'amendments', 'other']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Update participants when new replies are added
discussionSchema.pre('save', function(next) {
  if (this.isModified('replies') && this.replies.length > 0) {
    const latestReply = this.replies[this.replies.length - 1];
    if (!this.participants.includes(latestReply.user)) {
      this.participants.push(latestReply.user);
    }
  }
  next();
});

module.exports = mongoose.model('Discussion', discussionSchema);