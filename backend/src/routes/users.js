const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/', verifyToken, usersController.createUserProfile);
router.get('/:id', verifyToken, usersController.getUserProfile);

// Admin actions
router.get('/', verifyToken, requireRole('faculty'), usersController.listPending);
router.post('/:id/approve', verifyToken, requireRole('faculty'), usersController.approve);

module.exports = router;
