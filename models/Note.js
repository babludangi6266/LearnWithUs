
const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Note', NoteSchema);
