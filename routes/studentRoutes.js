const express = require('express');
const router = express.Router();
const { getAllStudents, submitAnswers, getStudentProgress ,progressReport , addFeedback, getStudentFeedback } = require('../controllers/studentControllers');
const auth = require('../middleware/auth');
const authenticateAdmin = require('../middleware/authenticateAdmin');

// GET all students
router.get('/students' , getAllStudents);

router.post('/submit-answers', auth, submitAnswers);
// GET student progress
router.get('/progress/:studentId', auth, getStudentProgress);
router.get('/progress', auth, progressReport);

// Route for admin to send feedback
router.post('/feedback',authenticateAdmin , addFeedback);

// Route for student to view feedback
router.get('/feedback/:studentId', auth, getStudentFeedback);
module.exports = router;
