const Event = require('../models/event.model');
const EventUser = require('../models/eventUser.model');

class EventController {

    // Récupérer tous les événements
    static async getAllEvents(req, res) {
        try {
            const events = await Event.getAll();
            res.json({ success: true, data: events });
        } catch (error) {
            console.error('Get all events error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }

    // Récupérer un événement par ID
    static async getEventById(req, res) {
        try {
            const id = req.params.id;
            const event = await Event.findById(id);
            if (!event) return res.status(404).json({ success: false, message: 'الحدث غير موجود' });
            res.json({ success: true, data: event });
        } catch (error) {
            console.error('Get event by id error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }

    // Créer un événement
    static async createEvent(req, res) {
        try {
            const data = req.body;
            if (req.file) data.image = req.file.filename;

            // Ajout de l'organisateur
            if (req.user && req.user.id) data.id_organisateur = req.user.id;

            const eventId = await Event.create(data);
            res.status(201).json({ success: true, message: 'تم إنشاء الحدث', data: { id: eventId } });
        } catch (error) {
            console.error('Create event error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }

    // Mettre à jour un événement
    static async updateEvent(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            if (req.file) data.image = req.file.filename;

            const updatedEvent = await Event.update(id, data);
            if (!updatedEvent) return res.status(404).json({ success: false, message: 'الحدث غير موجود' });

            res.json({ success: true, message: 'تم تحديث الحدث', data: updatedEvent });
        } catch (error) {
            console.error('Update event error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }

    // Supprimer un événement
    static async deleteEvent(req, res) {
        try {
            const id = req.params.id;
            const deleted = await Event.delete(id);
            if (!deleted) return res.status(404).json({ success: false, message: 'الحدث غير موجود' });

            res.json({ success: true, message: 'تم حذف الحدث' });
        } catch (error) {
            console.error('Delete event error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }

    // Inscrire un utilisateur à un événement
    static async registerForEvent(req, res) {
        try {
            const eventId = req.params.id;
            const userId = req.user.id;

            const result = await EventUser.register(eventId, userId);
            if (!result) {
                return res.status(400).json({ success: false, message: 'المستخدم مسجل مسبقاً في هذا الحدث' });
            }

            res.json({ success: true, message: 'تم التسجيل في الحدث بنجاح' });
        } catch (error) {
            console.error('Register for event error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }

    // Annuler l'inscription à un événement
    static async unregisterFromEvent(req, res) {
        try {
            const eventId = req.params.id;
            const userId = req.user.id;

            const result = await EventUser.unregister(eventId, userId);
            if (!result) {
                return res.status(404).json({ success: false, message: 'المستخدم غير مسجل في هذا الحدث' });
            }

            res.json({ success: true, message: 'تم إلغاء التسجيل في الحدث بنجاح' });
        } catch (error) {
            console.error('Unregister from event error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }

    // Récupérer tous les utilisateurs inscrits à un événement
    static async getEventParticipants(req, res) {
        try {
            const eventId = req.params.id;
            const users = await EventUser.getUsersByEvent(eventId);
            res.json({ success: true, data: users });
        } catch (error) {
            console.error('Get event participants error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }
}

module.exports = EventController;
