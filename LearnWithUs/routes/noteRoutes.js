const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// Seed notes (clears old data and inserts Java & Spring Boot notes)
router.get('/notes/seed', noteController.seedNotes);
router.post('/notes/seed', noteController.seedNotes);

// Distinct languages list (/api/admin/languages)
router.get('/languages', noteController.getDistinctLanguages);

// Notes CRUD (/api/admin/notes)
router.post('/notes', noteController.addNote);
router.get('/notes', noteController.getAllNotes);
router.delete('/notes/:id', noteController.deleteNote);

// Note Comments Q&A Forum (/api/admin/notes/:noteId/comments)
router.get('/notes/:noteId/comments', noteController.getNoteComments);
router.post('/notes/:noteId/comments', noteController.addNoteComment);

// Notes by language (/api/admin/notes/lang/:language)
router.get('/notes/lang/:language', noteController.getNotesByLanguage);

module.exports = router;
