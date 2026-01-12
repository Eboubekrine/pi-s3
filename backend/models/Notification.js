const db = require('../config/database');

const Notification = {
    create: async (data) => {
        const { id_user, type, contenu, lien } = data;
        const [result] = await db.execute(
            'INSERT INTO notification (id_user, type, contenu, lien) VALUES (?, ?, ?, ?)',
            [id_user, type, contenu, lien || null]
        );
        return result.insertId;
    },

    findAllByUser: async (userId, limit = 20) => {
        const [rows] = await db.execute(
            'SELECT * FROM notification WHERE id_user = ? ORDER BY date_creation DESC LIMIT ?',
            [userId, parseInt(limit)]
        );
        return rows;
    },

    getUnreadCount: async (userId) => {
        const [rows] = await db.execute(
            'SELECT COUNT(*) as count FROM notification WHERE id_user = ? AND est_lu = 0',
            [userId]
        );
        return rows[0].count;
    },

    markAsRead: async (id) => {
        const [result] = await db.execute(
            'UPDATE notification SET est_lu = 1 WHERE id_notification = ?',
            [id]
        );
        return result.affectedRows > 0;
    },

    markAllAsRead: async (userId) => {
        const [result] = await db.execute(
            'UPDATE notification SET est_lu = 1 WHERE id_user = ?',
            [userId]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Notification;
