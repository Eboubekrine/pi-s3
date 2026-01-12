const Offer = require('../models/offer.model');

class OfferController {

    // Créer une offre
    static async createOffer(req, res) {
        try {
            const data = req.body;
            const offerId = await Offer.create(data);
            res.status(201).json({ success: true, message: 'تم إنشاء العرض', data: { id: offerId } });
        } catch (error) {
            console.error('Create offer error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }

    // Obtenir toutes les offres
    static async getAllOffers(req, res) {
        try {
            const offers = await Offer.getAll();
            res.json({ success: true, data: offers });
        } catch (error) {
            console.error('Get all offers error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }

    // Obtenir une offre par ID
    static async getOfferById(req, res) {
        try {
            const id = req.params.id;
            const offer = await Offer.findById(id);
            if (!offer) return res.status(404).json({ success: false, message: 'العرض غير موجود' });
            res.json({ success: true, data: offer });
        } catch (error) {
            console.error('Get offer by id error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }

    // Mettre à jour une offre
    static async updateOffer(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            const updated = await Offer.update(id, data);
            if (!updated) return res.status(404).json({ success: false, message: 'العرض غير موجود' });
            res.json({ success: true, message: 'تم تحديث العرض', data: updated });
        } catch (error) {
            console.error('Update offer error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }

    // Supprimer une offre
    static async deleteOffer(req, res) {
        try {
            const id = req.params.id;
            const deleted = await Offer.delete(id);
            if (!deleted) return res.status(404).json({ success: false, message: 'العرض غير موجود' });
            res.json({ success: true, message: 'تم حذف العرض' });
        } catch (error) {
            console.error('Delete offer error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }
}

module.exports = OfferController;
