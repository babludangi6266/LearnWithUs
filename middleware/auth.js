const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.student = decoded.student; // Ensure this matches your payload structure
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ msg: 'Invalid token' });
  }
};

module.exports = auth;
