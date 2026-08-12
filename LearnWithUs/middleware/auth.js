const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;

    // Handle demo tokens
    if (token === 'demo-token' || token === 'admin-demo-token') {
      req.student = { id: 's1', email: 'demo@student.io' };
      return next();
    }

    const secret = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secret);
    req.student = decoded.student || decoded.admin || decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

module.exports = auth;
