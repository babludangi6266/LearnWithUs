const mongoose = require('mongoose');
const Student = require('../models/Student');
const Phase = require('../models/Phase');

// Helper to find student safely by Mongo ObjectId or Email string
async function findStudentByIdOrEmail(identifier, selectFields = null) {
  if (!identifier) return null;
  const isMongoId = mongoose.Types.ObjectId.isValid(identifier);
  const query = isMongoId ? Student.findById(identifier) : Student.findOne({ email: identifier });
  return selectFields ? query.select(selectFields) : query;
}

// Submit answers for a quiz
const submitAnswers = async (req, res) => {
  try {
    const { phaseId, answers, score: reqScore, totalQuestions } = req.body;
    let studentId = req.student ? (req.student.id || req.student._id) : req.body.studentId;

    let student = await findStudentByIdOrEmail(studentId);
    if (!student && req.student && req.student.email) {
      student = await Student.findOne({ email: req.student.email });
    }

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    let score = reqScore;
    if (score === undefined && answers) {
      const phase = await Phase.findById(phaseId).populate('questions');
      if (!phase) {
        return res.status(404).json({ msg: "Phase not found" });
      }

      score = 0;
      phase.questions.forEach((question, index) => {
        if (answers[index] === question.correctOption) {
          score++;
        }
      });
    }

    // Check if phase already attempted
    const existingProgressIndex = student.progress.findIndex(p => p.phaseId.toString() === phaseId);
    if (existingProgressIndex > -1) {
      student.progress[existingProgressIndex].score = score;
      student.progress[existingProgressIndex].totalScore = totalQuestions || 3;
    } else {
      student.progress.push({
        phaseId,
        score,
        totalScore: totalQuestions || 3,
      });
    }

    await student.save();

    res.json({
      msg: "Quiz submitted successfully",
      score,
      totalQuestions: totalQuestions || 3,
      progress: student.progress,
    });
  } catch (err) {
    console.error('Error submitting quiz answers:', err);
    res.status(500).json({ msg: "Error submitting quiz answers" });
  }
};

// Get progress for a student
const getStudentProgress = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await findStudentByIdOrEmail(studentId, 'progress totalScore totalScoreObtained progressPercentage');

    if (!student) {
      return res.json({ progress: [], totalScore: 0, totalScoreObtained: 0, progressPercentage: 0 });
    }

    res.json({
      progress: student.progress || [],
      totalScore: student.totalScore || 0,
      totalScoreObtained: student.totalScoreObtained || 0,
      progressPercentage: student.progressPercentage || 0
    });
  } catch (err) {
    console.error('Error fetching student progress:', err);
    res.json({ progress: [], totalScore: 0, totalScoreObtained: 0, progressPercentage: 0 });
  }
};

const updateStudentProgress = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const { phaseId, score, totalScore } = req.body;

    const student = await findStudentByIdOrEmail(studentId);
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    const existingIndex = student.progress.findIndex(p => p.phaseId.toString() === phaseId);
    if (existingIndex > -1) {
      student.progress[existingIndex].score = score;
      student.progress[existingIndex].totalScore = totalScore;
    } else {
      student.progress.push({ phaseId, score, totalScore });
    }

    await student.save();
    res.json(student);
  } catch (err) {
    console.error('Error updating student progress:', err);
    res.status(500).json({ msg: "Error updating student progress" });
  }
};

const progressReport = async (req, res) => {
  try {
    const studentId = req.student ? (req.student.id || req.student._id) : null;
    const student = await findStudentByIdOrEmail(studentId);

    if (!student) {
      return res.json([]);
    }

    res.json(student.progress.map(p => ({
      phaseId: p.phaseId,
      score: p.score,
      totalQuestions: p.totalScore || p.totalQuestions || 3
    })));
  } catch (err) {
    console.error(err.message);
    res.json([]);
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching students' });
  }
};

const addFeedback = async (req, res) => {
  try {
    const { studentId, message } = req.body;
    const student = await findStudentByIdOrEmail(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.feedback.push({
      adminId: req.admin?.email || 'admin@learnwithus.io',
      message,
    });

    await student.save();
    res.status(200).json({ message: 'Feedback sent successfully' });
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({ message: 'Error adding feedback', error });
  }
};

// Get feedback for a student (handles ObjectId OR email string)
const getStudentFeedback = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await findStudentByIdOrEmail(studentId, 'feedback');

    if (!student) {
      return res.json([]);
    }

    res.status(200).json(student.feedback || []);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.json([]);
  }
};

module.exports = {
  submitAnswers,
  getAllStudents,
  getStudentProgress,
  updateStudentProgress,
  progressReport,
  addFeedback,
  getStudentFeedback,
};
