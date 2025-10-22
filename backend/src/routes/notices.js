const express = require('express');
const router = express.Router();
const noticesController = require('../controllers/noticesController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', noticesController.listNotices);
router.post('/', verifyToken, requireRole('faculty'), noticesController.createNotice);
router.put('/:id', verifyToken, requireRole('faculty'), noticesController.updateNotice);
router.delete('/:id', verifyToken, requireRole('faculty'), noticesController.deleteNotice);

module.exports = router;
