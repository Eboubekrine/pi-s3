const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', authMiddleware, upload.single('image'), messageController.send);
router.get('/recent', authMiddleware, messageController.getRecent);
router.get('/:userId', authMiddleware, messageController.getConversation);

module.exports = router;
