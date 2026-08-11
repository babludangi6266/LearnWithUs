const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.get('/', communityController.getItems);
router.post('/', communityController.createItem);
router.post('/:id/upvote', communityController.upvoteItem);
router.delete('/:id', communityController.deleteItem);

module.exports = router;
