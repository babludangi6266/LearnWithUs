
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  phase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Phase',
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correctOption: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Question', QuestionSchema);
