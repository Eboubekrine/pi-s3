const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, notificationController.getAll);
router.get('/unread-count', authMiddleware, notificationController.getUnreadCount);
router.put('/:id/read', authMiddleware, notificationController.markRead);
router.put('/read-all', authMiddleware, notificationController.markAllRead);

module.exports = router;
