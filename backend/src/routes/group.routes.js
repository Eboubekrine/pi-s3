const express = require('express');
const router = express.Router();
const GroupController = require('../controllers/group.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');

// Routes pour les groupes
router.get('/', authMiddleware, GroupController.getAllGroups);
router.get('/:id', authMiddleware, GroupController.getGroupById);
router.post('/', authMiddleware, adminMiddleware, GroupController.createGroup);
router.put('/:id', authMiddleware, adminMiddleware, GroupController.updateGroup);
router.delete('/:id', authMiddleware, adminMiddleware, GroupController.deleteGroup);

module.exports = router;
