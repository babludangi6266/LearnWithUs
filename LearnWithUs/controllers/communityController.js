const CommunityItem = require('../models/CommunityItem');
const Proposal = require('../models/Proposal');

// Get items by type or all items
exports.getItems = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const items = await CommunityItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Error fetching community items:', error);
    res.status(500).json({ message: 'Error fetching community posts' });
  }
};

// Create new item (Idea, Freelance Project, or Incident)
exports.createItem = async (req, res) => {
  try {
    const { type, title, author, category, description, techStack, contactInfo, budget, severity } = req.body;

    if (!type || !title || !description || !contactInfo) {
      return res.status(400).json({ message: 'Title, description, type, and contact info are required' });
    }

    const newItem = new CommunityItem({
      type,
      title,
      author: author || 'Developer',
      category: category || 'General',
      description,
      techStack: Array.isArray(techStack) ? techStack : (techStack ? techStack.split(',').map(s => s.trim()) : []),
      contactInfo,
      budget: budget || 'Negotiable',
      severity: severity || 'Medium',
      status: 'Open',
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating community post:', error);
    res.status(500).json({ message: 'Error creating community post', error });
  }
};

// Upvote an item
exports.upvoteItem = async (req, res) => {
  try {
    const item = await CommunityItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    item.upvotes += 1;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error upvoting item' });
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    await CommunityItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Community item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item' });
  }
};

// Update Gig Lifecycle Status (Open -> In-Progress -> Delivered -> Closed)
exports.updateGigStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await CommunityItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Gig not found' });
    item.status = status;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error updating gig status' });
  }
};

// Proposals & Bidding Controllers
exports.submitProposal = async (req, res) => {
  try {
    const { freelancerName, freelancerEmail, proposalText, bidAmount } = req.body;
    const proposal = new Proposal({
      gigId: req.params.gigId,
      freelancerName,
      freelancerEmail,
      proposalText,
      bidAmount,
    });
    await proposal.save();
    res.status(201).json(proposal);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting proposal' });
  }
};

exports.getProposalsForGig = async (req, res) => {
  try {
    const proposals = await Proposal.find({ gigId: req.params.gigId }).sort({ createdAt: -1 });
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching proposals' });
  }
};
