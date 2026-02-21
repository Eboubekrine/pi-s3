const Offre = require('../models/Offre');

const offreController = {
    create: async (req, res) => {
        try {
            // Security Check - Only ALUMNI and ADMIN can create offers
            if (req.user.role !== 'ALUMNI' && req.user.role !== 'ADMIN') {
                return res.status(403).json({ success: false, message: 'Only Alumni and Admins can create offers' });
            }
            const { titre, description, entreprise, type_offre, lieu } = req.body;
            const id_user = req.user.userId;

            if (!titre || !entreprise || !type_offre) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const id = await Offre.create({
                titre, description, entreprise, type_offre, id_user, lieu
            });

            res.status(201).json({ success: true, message: 'Offre created', id });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const { page, limit, type, entreprise, userId } = req.query;
            const filters = { type_offre: type, entreprise, id_user: userId };

            console.log('GET /offres - filters:', filters);
            const offres = await Offre.findAll(filters, page, limit);
            console.log('GET /offres - count:', offres.length);
            res.json({ success: true, data: offres });
        } catch (error) {
            console.error('GET /offres - error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const offre = await Offre.findById(req.params.id);
            if (!offre) return res.status(404).json({ message: 'Offre not found' });
            res.json({ success: true, data: offre });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const offre = await Offre.findById(req.params.id);
            if (!offre) return res.status(404).json({ message: 'Offre not found' });

            // Security Check - Only the Creator or Admin can update
            if (req.user.role === 'STUDENT' || (req.user.role !== 'ADMIN' && offre.id_user !== req.user.userId)) {
                return res.status(403).json({ success: false, message: 'Unauthorized: Students cannot edit offers' });
            }

            const success = await Offre.update(req.params.id, req.body);
            if (!success) return res.status(404).json({ message: 'Offre not found' });
            res.json({ success: true, message: 'Offre updated' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const offre = await Offre.findById(req.params.id);
            if (!offre) return res.status(404).json({ message: 'Offre not found' });

            // Security Check - Only the Creator or Admin can delete
            if (req.user.role === 'STUDENT' || (req.user.role !== 'ADMIN' && offre.id_user !== req.user.userId)) {
                return res.status(403).json({ success: false, message: 'Unauthorized: Students cannot delete offers' });
            }

            const success = await Offre.delete(req.params.id);
            if (!success) return res.status(404).json({ message: 'Offre not found' });
            res.json({ success: true, message: 'Offre deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = offreController;