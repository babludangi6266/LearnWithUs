const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// Seed notes (clears old data and inserts Java & Spring Boot notes)
router.get('/seed', noteController.seedNotes);
router.post('/seed', noteController.seedNotes);

// Distinct languages list
router.get('/languages', noteController.getDistinctLanguages);

// Notes CRUD
router.post('/notes', noteController.addNote);
router.get('/notes', noteController.getAllNotes);
router.delete('/notes/:id', noteController.deleteNote);

// Notes by language
router.get('/notes/:language', noteController.getNotesByLanguage);

module.exports = router;
