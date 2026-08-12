const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.get('/', communityController.getItems);
router.post('/', communityController.createItem);
router.post('/:id/upvote', communityController.upvoteItem);
router.put('/:id/status', communityController.updateGigStatus);
router.delete('/:id', communityController.deleteItem);

// Gig Proposal & Bidding routes
router.get('/:gigId/proposals', communityController.getProposalsForGig);
router.post('/:gigId/proposals', communityController.submitProposal);

module.exports = router;
