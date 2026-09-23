const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Checks the request has a valid JWT, attaches the user to req.user
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // "Bearer <token>"
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }
};

// Restricts a route to specific roles, e.g. authorize('Admin', 'Teacher')
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Role '${req.user.role}' is not allowed to access this resource` });
    }
    next();
  };
};