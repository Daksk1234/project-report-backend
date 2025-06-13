const jwt = require('jsonwebtoken');

// Middleware to verify token and optionally check for specific role
const authenticate = (requiredRole = null) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (requiredRole && decoded.role !== requiredRole) {
        return res
          .status(403)
          .json({ message: 'Forbidden: Insufficient permissions' });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  };
};

module.exports = authenticate;
