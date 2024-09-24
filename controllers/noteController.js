
const Note = require('../models/Note');

// Add a new note
exports.addNote = async (req, res) => {
  try {
    const { language, title, content } = req.body;
    const newNote = new Note({
      language,
      title,
      content
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note' });
  }
};

// Get all notes
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
};

// Get notes by language
exports.getNotesByLanguage = async (req, res) => {
    try {
      const notes = await Note.find({ language: req.params.language });
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching notes' });
    }
  };
exports.getDistinctLanguages = async (req, res) => {
    try {
      const languages = await Note.distinct('language');
      res.json(languages);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching languages' });
    }
  };