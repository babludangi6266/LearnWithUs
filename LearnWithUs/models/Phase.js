const mongoose = require('mongoose');

const PhaseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  prerequisitePhaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase', default: null },
  passingScore: { type: Number, default: 70 },
});

module.exports = mongoose.model('Phase', PhaseSchema);
