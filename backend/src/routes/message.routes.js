const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/message.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Obtenir tous les messages de l'utilisateur
router.get('/', authMiddleware, MessageController.getUserMessages);

// Envoyer un message
router.post('/', authMiddleware, MessageController.sendMessage);

// Mettre à jour un message (marquer comme lu)
router.put('/:id/read', authMiddleware, MessageController.markAsRead);

// Obtenir un message par ID
router.get('/:id', authMiddleware, MessageController.getMessageById);

// Supprimer un message
router.delete('/:id', authMiddleware, MessageController.deleteMessage);

// Obtenir la conversation avec un utilisateur spécifique
router.get('/conversation/:userId', authMiddleware, MessageController.getConversation);

module.exports = router;
