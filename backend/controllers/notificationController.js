const Notification = require('../models/Notification');

const notificationController = {
    getAll: async (req, res) => {
        try {
            const notifications = await Notification.findAllByUser(req.user.userId);
            res.json({ success: true, data: notifications });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getUnreadCount: async (req, res) => {
        try {
            const count = await Notification.getUnreadCount(req.user.userId);
            res.json({ success: true, count });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    markRead: async (req, res) => {
        try {
            await Notification.markAsRead(req.params.id);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    markAllRead: async (req, res) => {
        try {
            await Notification.markAllAsRead(req.user.userId);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = notificationController;
