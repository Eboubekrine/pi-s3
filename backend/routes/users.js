const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Routes publiques
router.get('/search', userController.searchUsers);

// Routes protégées
router.get('/suggestions', authMiddleware, userController.getSuggestions);
router.get('/:id', authMiddleware, userController.getUserById);

// Routes pour admin seulement
router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
router.put('/:id/status', authMiddleware, adminMiddleware, userController.updateUserStatus);
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);

module.exports = router;