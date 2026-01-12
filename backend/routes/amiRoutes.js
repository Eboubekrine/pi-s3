const express = require('express');
const router = express.Router();
const amiController = require('../controllers/amiController');
const { authMiddleware } = require('../middleware/auth');

router.post('/request/:userId', authMiddleware, amiController.sendRequest);
router.get('/', authMiddleware, amiController.getFriends);
router.get('/requests', authMiddleware, amiController.getRequests);
router.put('/respond', authMiddleware, amiController.respondRequest);
router.put('/accept/:userId', authMiddleware, amiController.acceptRequest);
router.delete('/reject/:userId', authMiddleware, amiController.removeFriend);
router.delete('/:userId', authMiddleware, amiController.removeFriend);
router.get('/status/:userId', authMiddleware, amiController.checkFriendship);

module.exports = router;
