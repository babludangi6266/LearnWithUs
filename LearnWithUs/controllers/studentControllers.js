
const Student = require('../models/Student');
const Question = require('../models/Question');
const mongoose = require('mongoose');
// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const submitAnswers = async (req, res) => {
  try {
    const { phaseId, answers } = req.body;
    const studentId = req.student.id;

    let score = 0;

    // Fetch all questions for the phase
    const questions = await Question.find({ phase: phaseId });

    // Calculate score
    questions.forEach(question => {
      if (answers[question._id] === question.correctOption) {
        score += 1;
      }
    });

    // Find the student
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if phase already exists in progress
    const existingPhase = student.progress.find(p => p.phaseId.toString() === phaseId);

    if (existingPhase) {
      existingPhase.score = score;
      existingPhase.totalScore = questions.length;
    } else {
      student.progress.push({ phaseId, score, totalScore: questions.length });
    }

   // console.log('Updated Progress:', student.progress); // Log the updated progress before saving

    // Save student data
    await student.save();

    // Return the response
    res.status(200).json({ 
      score, 
      totalQuestions: questions.length, // Ensure this is returned
  progressData: student.progress,
  totalScoreObtained: student.totalScoreObtained,
  progressPercentage: student.progressPercentage,
    });
  } catch (error) {
    console.error('Error submitting answers:', error);
    res.status(500).json({ message: 'Error submitting answers', error });
  }
};



const getStudentProgress = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ msg: "Invalid student ID" });
    }

    // Fetch student progress
    const student = await Student.findById(studentId).select('progress totalScore totalScoreObtained progressPercentage');

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    res.json({
      progress: student.progress,
      totalScore: student.totalScore,
      totalScoreObtained: student.totalScoreObtained,
      progressPercentage: student.progressPercentage
    });
  } catch (err) {
    console.error('Error fetching student progress:', err);
    res.status(500).json({ msg: "Error fetching student progress" });
  }
};


const updateStudentProgress = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const { phaseId, score, totalScore } = req.body;

    // Validate studentId
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ msg: "Invalid student ID" });
    }

    // Validate phaseId
    if (!phaseId || !mongoose.Types.ObjectId.isValid(phaseId)) {
      return res.status(400).json({ msg: "Invalid phase ID" });
    }

    // Update or create progress
    const student = await Student.findOneAndUpdate(
      { _id: studentId, 'progress.phaseId': phaseId },
      { $set: { 'progress.$.score': score, 'progress.$.totalScore': totalScore } },
      { new: true, upsert: true }
    );

    if (!student) {
      return res.status(404).json({ msg: "Student not found or phase not updated" });
    }

    res.json(student);
  } catch (err) {
    console.error('Error updating student progress:', err);
    res.status(500).json({ msg: "Error updating student progress" });
  }
};

const progressReport = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).populate('progress.phaseId', 'name');

    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

res.json(student.progress.map(p => ({
  phaseId: p.phaseId,
  score: p.score,
  totalQuestions: p.totalQuestions 
})));
} catch (err) {
console.error(err.message);
res.status(500).send('Server error');
}
};

const addFeedback = async (req, res) => {
  try {
    const { studentId, message } = req.body;

    // Find the student by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Add feedback to the student's feedback array
    student.feedback.push({
      adminId: req.admin.email, // Assuming the admin email is used for ID
      message,
    });

    await student.save();

    res.status(200).json({ message: 'Feedback sent successfully' });
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({ message: 'Error adding feedback', error });
  }
};
// Get feedback for a student
const getStudentFeedback = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const student = await Student.findById(studentId).select('feedback');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student.feedback);
  } catch (error) {
    console.error('Error fetching fweedback:', error);
    res.status(500).json({ message: 'Error fetching feedback', error });
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
