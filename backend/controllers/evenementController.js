const Evenement = require('../models/Evenement');

const evenementController = {
    create: async (req, res) => {
        try {
            // Security Check - Allow STUDENT, ALUMNI, and ADMIN
            const role = req.user.role?.toUpperCase();
            if (role !== 'STUDENT' && role !== 'ALUMNI' && role !== 'ADMIN') {
                return res.status(403).json({ success: false, message: 'Only Students, Alumni and Admins can create events' });
            }

            const { titre, description, date_evenement, lieu } = req.body;
            const id_organisateur = req.user.userId;

            let image = req.body.image; // Keep URL if provided
            if (req.file) {
                // Construct the full URL for the uploaded image
                image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            }

            if (!titre || !date_evenement) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            console.log('📝 Creating event:', { titre, image });

            const id = await Evenement.create({
                titre, description, date_evenement, lieu, id_organisateur, image
            });

            res.status(201).json({ success: true, message: 'Event created', id });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            console.log('📥 GET /evenements called', req.query);
            const { page, limit, upcoming } = req.query;
            const filters = { upcoming: upcoming === 'true' };

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
            const success = await Evenement.update(req.params.id, req.body);
            if (!success) return res.status(404).json({ message: 'Event not found' });
            res.json({ success: true, message: 'Event updated' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const success = await Evenement.delete(req.params.id);
            if (!success) return res.status(404).json({ message: 'Event not found' });
            res.json({ success: true, message: 'Event deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = evenementController;