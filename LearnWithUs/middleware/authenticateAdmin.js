const jwt = require('jsonwebtoken');

// Middleware to authenticate admin
const authenticateAdmin = (req, res, next) => {
    const token = req.header('Authorization');
  
    // Check if no token
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
  
    try {
      // Token usually comes in the format "Bearer <token>"
      const actualToken = token.split(' ')[1]; // Extract the token after 'Bearer'
  
      const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
      req.admin = decoded; // Set the admin info in req.admin
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
    }
  };
module.exports = authenticateAdmin;
