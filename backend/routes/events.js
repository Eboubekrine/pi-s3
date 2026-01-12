const express = require('express');
const router = express.Router();
const evenementController = require('../controllers/evenementController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Routes publiques
router.get('/', evenementController.getAllEvents);
router.get('/:id', evenementController.getEventById);

// Routes protégées
router.post('/', authMiddleware, evenementController.createEvent);
router.put('/:id', authMiddleware, evenementController.updateEvent);
router.delete('/:id', authMiddleware, evenementController.deleteEvent);

module.exports = router;