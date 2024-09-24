// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const StudentSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   progress: [
//     {
//       phaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase' },
//       score: { type: Number },
//       totalScore: { type: Number },
//     }
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });



// StudentSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// const Student = mongoose.model('Student', StudentSchema);

// module.exports = Student;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  progress: [
    {
      phaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase' },
      score: { type: Number },
      totalScore: { type: Number },
    }
  ],
  feedback: [
    {
      adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
      message: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

StudentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
