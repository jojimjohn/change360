const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get token from authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  try {
    // Verify token and add user ID to request object
    const decoded = jwt.verify(token, 'secret_key');
    req.userId = decoded.address;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
