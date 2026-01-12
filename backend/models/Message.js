const db = require('../config/database');

const Message = {
    // CREATE TABLE message
    create: async (messageData) => {
        const { contenu, id_expediteur, id_destinataire, id_groupe, image_url } = messageData;
        const [result] = await db.execute(
            'INSERT INTO message (contenu, id_expediteur, id_destinataire, id_groupe, image_url) VALUES (?, ?, ?, ?, ?)',
            [contenu, id_expediteur, id_destinataire || null, id_groupe || null, image_url || null]
        );
        return result.insertId;
    },

    getConversation: async (user1_id, user2_id) => {
        const [rows] = await db.execute(
            `SELECT m.*, u.nom, u.prenom 
             FROM message m 
             JOIN utilisateur u ON m.id_expediteur = u.id_user 
             WHERE (id_expediteur = ? AND id_destinataire = ?) 
                OR (id_expediteur = ? AND id_destinataire = ?) 
             ORDER BY date_envoi ASC`,
            [user1_id, user2_id, user2_id, user1_id]
        );
        return rows;
    },

    getGroupMessages: async (groupId) => {
        const [rows] = await db.execute(
            `SELECT m.*, u.nom, u.prenom 
             FROM message m 
             JOIN utilisateur u ON m.id_expediteur = u.id_user 
             WHERE id_groupe = ?
             ORDER BY date_envoi ASC`,
            [groupId]
        );
        return rows;
    },

    getUserConversations: async (userId) => {
        // This is a bit complex as we want distinct users interacted with
        // Simplified query to get recent messages involving user
        const [rows] = await db.execute(
            `SELECT m.* 
             FROM message m 
             WHERE id_expediteur = ? OR id_destinataire = ? 
             ORDER BY date_envoi DESC`,
            [userId, userId]
        );
        return rows;
    }
};

module.exports = Message;
