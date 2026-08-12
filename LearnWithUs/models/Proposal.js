const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema({
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityItem', required: true },
  freelancerName: { type: String, required: true },
  freelancerEmail: { type: String, required: true },
  proposalText: { type: String, required: true },
  bidAmount: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Proposal', ProposalSchema);
