const db = require('../config/database');

const Offre = {
    create: async (offreData) => {
        const { titre, description, entreprise, type_offre, id_user, lieu } = offreData;
        const [result] = await db.execute(
            'INSERT INTO offre (titre, description, entreprise, type_offre, id_user, lieu) VALUES (?, ?, ?, ?, ?, ?)',
            [titre, description, entreprise, type_offre, id_user, lieu || null]
        );
        return result.insertId;
    },

    findAll: async (filters = {}, page = 1, limit = 20) => {
        let query = `
            SELECT o.*, u.nom as user_nom, u.prenom as user_prenom 
            FROM offre o 
            LEFT JOIN utilisateur u ON o.id_user = u.id_user 
            WHERE 1=1
        `;
        const params = [];

        if (filters.type_offre) {
            query += ' AND o.type_offre = ?';
            params.push(filters.type_offre);
        }

        if (filters.entreprise) {
            query += ' AND o.entreprise LIKE ?';
            params.push(`%${filters.entreprise}%`);
        }

        if (filters.id_user) {
            query += ' AND o.id_user = ?';
            params.push(filters.id_user);
        }

        const safeLimit = Number(parseLimit(limit));
        const safeOffset = Number(parseOffset(page, limit));

        query += ` ORDER BY o.date_publication DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;

        const [rows] = await db.execute(query, params);
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute(
            `SELECT o.*, u.nom as user_nom, u.prenom as user_prenom 
             FROM offre o 
             LEFT JOIN utilisateur u ON o.id_user = u.id_user 
             WHERE id_offre = ?`,
            [id]
        );
        return rows[0];
    },

    update: async (id, data) => {
        const fields = Object.keys(data);
        if (fields.length === 0) return false;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = Object.values(data);
        values.push(id);

        const [result] = await db.execute(
            `UPDATE offre SET ${setClause} WHERE id_offre = ?`,
            values
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM offre WHERE id_offre = ?', [id]);
        return result.affectedRows > 0;
    }
};

function parseLimit(limit) {
    return parseInt(limit) || 20;
}

function parseOffset(page, limit) {
    return ((parseInt(page) || 1) - 1) * parseLimit(limit);
}

module.exports = Offre;