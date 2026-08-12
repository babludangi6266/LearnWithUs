const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const importController = require('../controllers/importController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Hardcoded admin credentials
const ADMIN_EMAIL = 'babludangi2000@gmail.com';
const ADMIN_PASSWORD = 'Bablu@9788';

// Admin login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    res.json({ token, admin: { email, role: 'admin' } });
  } else {
    res.status(400).json({ msg: 'Invalid credentials' });
  }
});

// Bulk Import Routes (.xlsx, .csv, .json, .txt)
router.post('/import/phases', upload.single('file'), importController.importPhasesAndQuestions);
router.post('/import/notes', upload.single('file'), importController.importNotes);

// Sample Template Downloads
router.get('/templates/excel', importController.downloadExcelTemplate);
router.get('/templates/notes', importController.downloadNotesTemplate);

module.exports = router;
