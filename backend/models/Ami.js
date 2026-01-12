const db = require('../config/database');

const Ami = {
    // CREATE TABLE amis
    create: async (id_demandeur, id_receveur) => {
        const [result] = await db.execute(
            'INSERT INTO amis (id_demandeur, id_receveur, statut) VALUES (?, ?, ?)',
            [id_demandeur, id_receveur, 'EN_ATTENTE']
        );
        return result.insertId;
    },

    checkStatus: async (id1, id2) => {
        const [rows] = await db.execute(
            'SELECT * FROM amis WHERE (id_demandeur = ? AND id_receveur = ?) OR (id_demandeur = ? AND id_receveur = ?)',
            [id1, id2, id2, id1]
        );
        return rows[0];
    },

    updateStatus: async (id_relation, statut) => {
        const [result] = await db.execute(
            'UPDATE amis SET statut = ? WHERE id_relation = ?',
            [statut, id_relation]
        );
        return result.affectedRows > 0;
    },

    deleteByUsers: async (id1, id2) => {
        const [result] = await db.execute(
            'DELETE FROM amis WHERE (id_demandeur = ? AND id_receveur = ?) OR (id_demandeur = ? AND id_receveur = ?)',
            [id1, id2, id2, id1]
        );
        return result.affectedRows > 0;
    },

    findByUser: async (userId) => {
        // Find confirmed friends
        const [rows] = await db.execute(
            `SELECT u.id_user, u.nom, u.prenom, u.role, 'amis' as type
             FROM amis a
             JOIN utilisateur u ON (a.id_demandeur = u.id_user OR a.id_receveur = u.id_user)
             WHERE (a.id_demandeur = ? OR a.id_receveur = ?) 
             AND a.statut = 'ACCEPTE'
             AND u.id_user != ?`,
            [userId, userId, userId]
        );
        return rows;
    },

    findRequests: async (userId) => {
        // Find pending requests RECEIVED by user
        const [rows] = await db.execute(
            `SELECT u.id_user, u.nom, u.prenom, u.role, a.date_demande 
             FROM amis a
             JOIN utilisateur u ON a.id_demandeur = u.id_user
             WHERE a.id_receveur = ? AND a.statut = 'EN_ATTENTE'`,
            [userId]
        );
        return rows;
    }
};

module.exports = Ami;
