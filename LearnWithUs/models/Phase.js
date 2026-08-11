
const mongoose = require('mongoose');

const PhaseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Phase', PhaseSchema);
