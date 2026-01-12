const express = require('express');
const router = express.Router();
const OfferController = require('../controllers/offer.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');

// Routes pour les offres
router.get('/', authMiddleware, OfferController.getAllOffers);
router.get('/:id', authMiddleware, OfferController.getOfferById);
router.post('/', authMiddleware, adminMiddleware, OfferController.createOffer);
router.put('/:id', authMiddleware, adminMiddleware, OfferController.updateOffer);
router.delete('/:id', authMiddleware, adminMiddleware, OfferController.deleteOffer);

module.exports = router;
