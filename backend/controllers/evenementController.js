const Evenement = require('../models/Evenement');

const evenementController = {
    create: async (req, res) => {
        try {
            // Security Check - Only ALUMNI and ADMIN can create events
            const role = req.user.role?.toUpperCase();
            if (role !== 'ALUMNI' && role !== 'ADMIN') {
                return res.status(403).json({ success: false, message: 'Only Alumni and Admins can create events' });
            }

            const { titre, description, date_evenement, lieu, type } = req.body;
            const id_organisateur = req.user.userId;

            let image = req.body.image; // HTML Base64 or URL

            if (!titre || !date_evenement) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const id = await Evenement.create({
                titre,
                description,
                date_evenement,
                lieu,
                id_organisateur,
                image,
                type_evenement: type || 'Event'
            });

            res.status(201).json({ success: true, message: 'Event created', id });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            console.log('📥 GET /evenements called', req.query);
            const { page, limit, upcoming, userId } = req.query;
            const filters = {
                upcoming: upcoming === 'true',
                id_organisateur: userId
            };

            const events = await Evenement.findAll(filters, page, limit);
            console.log(`   Found ${events.length} events`);
            res.json({ success: true, data: events });
        } catch (error) {
            console.error('❌ Error in getAll events:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const event = await Evenement.findById(req.params.id);
            if (!event) return res.status(404).json({ message: 'Event not found' });
            res.json({ success: true, data: event });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const event = await Evenement.findById(req.params.id);
            if (!event) return res.status(404).json({ message: 'Event not found' });

            // Security Check - Only the Creator (Alumni/Admin) or any Admin can update
            if (req.user.role === 'STUDENT' || (req.user.role !== 'ADMIN' && event.id_organisateur !== req.user.userId)) {
                return res.status(403).json({ success: false, message: 'Unauthorized: Students cannot edit events' });
            }

            const success = await Evenement.update(req.params.id, req.body);
            if (!success) return res.status(404).json({ message: 'Event not found' });
            res.json({ success: true, message: 'Event updated' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const event = await Evenement.findById(req.params.id);
            if (!event) return res.status(404).json({ message: 'Event not found' });

            // Security Check - Only the Creator or Admin can delete
            if (req.user.role === 'STUDENT' || (req.user.role !== 'ADMIN' && event.id_organisateur !== req.user.userId)) {
                return res.status(403).json({ success: false, message: 'Unauthorized: Students cannot delete events' });
            }

            const success = await Evenement.delete(req.params.id);
            if (!success) return res.status(404).json({ message: 'Event not found' });
            res.json({ success: true, message: 'Event deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = evenementController;