
const Question = require('../models/Question');

// Add a new question to a specific phase
exports.addQuestion = async (req, res) => {
  try {
    const newQuestion = new Question({
      phase: req.params.phaseId,
      question: req.body.question,
      options: req.body.options,
      correctOption: req.body.correctOption,
    });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Error creating question' });
  }
};

// Get questions by phase ID
exports.getQuestionsByPhase = async (req, res) => {
  try {
    const questions = await Question.find({ phase: req.params.phaseId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions' });
  }
};


exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question' });
  }
};



exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions' });
  }
};