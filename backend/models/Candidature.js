const db = require('../config/database');

const Candidature = {
    create: async (data) => {
        const { id_offre, id_user, cv_url, message } = data;
        const [result] = await db.execute(
            'INSERT INTO candidature (id_offre, id_user, cv_url, message) VALUES (?, ?, ?, ?)',
            [id_offre, id_user, cv_url, message || null]
        );
        return result.insertId;
    },

    findByUser: async (userId) => {
        const [rows] = await db.execute(`
            SELECT c.*, o.titre, o.entreprise, o.lieu, o.type_offre
            FROM candidature c
            JOIN offre o ON c.id_offre = o.id_offre
            WHERE c.id_user = ?
            ORDER BY c.date_postulation DESC
        `, [userId]);
        return rows;
    },

    findByOffre: async (offreId) => {
        const [rows] = await db.execute(`
            SELECT c.*, u.nom, u.prenom, u.email, u.avatar
            FROM candidature c
            JOIN utilisateur u ON c.id_user = u.id_user
            WHERE c.id_offre = ?
            ORDER BY c.date_postulation DESC
        `, [offreId]);
        return rows;
    },

    updateStatut: async (id, statut) => {
        const [result] = await db.execute(
            'UPDATE candidature SET statut = ? WHERE id_candidature = ?',
            [statut, id]
        );
        return result.affectedRows > 0;
    },

    checkExisting: async (userId, offreId) => {
        const [rows] = await db.execute(
            'SELECT id_candidature FROM candidature WHERE id_user = ? AND id_offre = ?',
            [userId, offreId]
        );
        return rows.length > 0;
    }
};

module.exports = Candidature;
