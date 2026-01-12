const express = require('express');
const router = express.Router();
const groupeController = require('../controllers/groupeController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, groupeController.create);
router.get('/', authMiddleware, groupeController.getAll);
router.get('/my-groups', authMiddleware, groupeController.getMyGroups);
router.post('/:id/join', authMiddleware, groupeController.join);
router.get('/:id/members', authMiddleware, groupeController.getMembers);

module.exports = router;
