const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Hardcoded credentials
const ADMIN_EMAIL = 'babludangi2000@gmail.com';
const ADMIN_PASSWORD = 'Bablu@9788';

// Admin login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(400).json({ msg: 'Invalid credentials' });
  }
});

module.exports = router;
