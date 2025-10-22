const admin = require('firebase-admin');
const usersService = require('../services/usersService');

// Middleware to verify Firebase ID token (or mock when Firebase not initialized)
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!admin.apps.length) {
    // mock behavior for local/dev: accept special tokens
    if (token === 'mock-faculty') {
      req.user = { uid: 'mock-faculty', email: 'faculty@local', role: 'faculty' };
      return next();
    }
    if (token === 'mock-student') {
      req.user = { uid: 'mock-student', email: 'student@local', role: 'student' };
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized (no token)' });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email };
    // attempt to load role from Firestore users collection
    const data = await usersService.getUserById(decoded.uid);
    if (data) {
      req.user.role = data.role;
      req.user.department = data.department;
      req.user.year = data.year;
    }
    next();
  } catch (err) {
    console.error('verifyToken error', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

module.exports = { verifyToken, requireRole };
