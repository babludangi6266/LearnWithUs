
const Phase = require('../models/Phase');
const Question = require('../models/Question');

// Add a new phase
exports.addPhase = async (req, res) => {
  try {
    const newPhase = new Phase({ name: req.body.name });
    await newPhase.save();
    res.status(201).json(newPhase);
  } catch (error) {
    res.status(500).json({ message: 'Error creating phase' });
  }
};

// Get all phases
exports.getPhases = async (req, res) => {
  try {
    const phases = await Phase.find();
    res.json(phases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching phases' });
  }
};

// Update a phase
exports.updatePhase = async (req, res) => {
  try {
    const updatedPhase = await Phase.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    res.json(updatedPhase);
  } catch (error) {
    res.status(500).json({ message: 'Error updating phase' });
  }
};

// Delete a phase
exports.deletePhase = async (req, res) => {
  try {
    await Phase.findByIdAndDelete(req.params.id);
    await Question.deleteMany({ phase: req.params.id }); // Delete associated questions
    res.json({ message: 'Phase and its questions deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting phase' });
  }
};
