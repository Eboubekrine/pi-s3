const db = require('../config/database');

const Evenement = {
    create: async (eventData) => {
        const { titre, description, date_evenement, lieu, id_organisateur, image } = eventData;
        const [result] = await db.execute(
            'INSERT INTO evenement (titre, description, date_evenement, lieu, id_organisateur, image) VALUES (?, ?, ?, ?, ?, ?)',
            [titre, description, date_evenement, lieu, id_organisateur, image || null]
        );
        return result.insertId;
    },

    findAll: async (filters = {}, page = 1, limit = 20) => {
        let query = `
            SELECT e.*, u.nom as org_nom, u.prenom as org_prenom 
            FROM evenement e 
            LEFT JOIN utilisateur u ON e.id_organisateur = u.id_user 
            WHERE 1=1
        `;
        const params = [];

        if (filters.id_organisateur) {
            query += ' AND e.id_organisateur = ?';
            params.push(filters.id_organisateur);
        }

        query += ' ORDER BY e.date_evenement ASC LIMIT ? OFFSET ?';
        params.push(parseLimit(limit), parseOffset(page, limit));

        const [rows] = await db.query(query, params);
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute(
            `SELECT e.*, u.nom as org_nom, u.prenom as org_prenom 
             FROM evenement e 
             LEFT JOIN utilisateur u ON e.id_organisateur = u.id_user 
             WHERE id_evenement = ?`,
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
            `UPDATE evenement SET ${setClause} WHERE id_evenement = ?`,
            values
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM evenement WHERE id_evenement = ?', [id]);
        return result.affectedRows > 0;
    }
};

function parseLimit(limit) {
    return parseInt(limit) || 20;
}

function parseOffset(page, limit) {
    return ((parseInt(page) || 1) - 1) * parseLimit(limit);
}

module.exports = Evenement;