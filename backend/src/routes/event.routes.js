const express = require('express');
const router = express.Router();
const EventController = require('../controllers/event.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');
const upload = require('../utils/upload');

// 🔹 Routes publiques
router.get('/', EventController.getAllEvents); // Tous les événements
router.get('/:id', EventController.getEventById); // Détails d'un événement

// 🔹 Routes pour les administrateurs
router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    upload.single('image'),
    EventController.createEvent
);

router.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    upload.single('image'),
    EventController.updateEvent
);

router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    EventController.deleteEvent
);

// 🔹 Routes pour les utilisateurs connectés
router.post(
    '/:id/register',
    authMiddleware,
    EventController.registerForEvent
);

router.delete(
    '/:id/unregister',
    authMiddleware,
    EventController.unregisterFromEvent
);

router.get(
    '/:id/participants',
    authMiddleware,
    EventController.getEventParticipants
);

module.exports = router;
