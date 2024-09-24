
const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// Add a new note
router.post('/notes', noteController.addNote);

// Get all notes
router.get('/notes', noteController.getAllNotes);

// Get notes by language
router.get('/notes/:language', noteController.getNotesByLanguage);
router.get('/languages', noteController.getDistinctLanguages);

module.exports = router;
