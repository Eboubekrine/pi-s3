const db = require('../config/database');

const User = {
    // Correspond à: CREATE TABLE utilisateur (...)

    create: async (userData) => {
        const { nom, prenom, email, mot_de_passe, role, avatar, telephone, date_naissance, bio, cv_url } = userData;
        const [result] = await db.execute(
            'INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role, avatar, telephone, date_naissance, bio, cv_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [nom, prenom, email, mot_de_passe, role, avatar || null, telephone || null, date_naissance || null, bio || null, cv_url || null]
        );
        return result.insertId;
    },

    findByEmail: async (email) => {
        const [rows] = await db.execute(
            'SELECT * FROM utilisateur WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    findById: async (id) => {
        const [rows] = await db.execute(
            'SELECT * FROM utilisateur WHERE id_user = ?',
            [id]
        );
        return rows[0];
    },

    findAll: async () => {
        const [rows] = await db.execute(`
            SELECT u.*, a.disponible_mentorat 
            FROM utilisateur u 
            LEFT JOIN alumni a ON u.id_user = a.id_user 
            ORDER BY u.date_inscription DESC
        `);
        return rows;
    },

    update: async (id, userData) => {
        const fields = Object.keys(userData);
        if (fields.length === 0) return false;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = Object.values(userData);
        values.push(id);

        const [result] = await db.execute(
            `UPDATE utilisateur SET ${setClause} WHERE id_user = ?`,
            values
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM utilisateur WHERE id_user = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = User;