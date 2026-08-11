const mongoose = require('mongoose');

const CommunityItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['idea', 'freelance', 'incident'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: 'Anonymous Developer',
  },
  category: {
    type: String,
    default: 'General',
  },
  description: {
    type: String,
    required: true,
  },
  techStack: [
    {
      type: String,
    }
  ],
  contactInfo: {
    type: String,
    required: true,
  },
  // Freelance Specific
  budget: {
    type: String,
    default: 'Negotiable',
  },
  // Incident Specific
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  status: {
    type: String,
    default: 'Open',
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CommunityItem', CommunityItemSchema);
