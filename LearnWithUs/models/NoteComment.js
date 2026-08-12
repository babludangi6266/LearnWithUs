const mongoose = require('mongoose');

const NoteCommentSchema = new mongoose.Schema({
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
  author: { type: String, required: true },
  authorRole: { type: String, default: 'student' },
  text: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('NoteComment', NoteCommentSchema);
