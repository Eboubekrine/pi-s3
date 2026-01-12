const db = require('../config/database');

const Alumni = {
    // Correspond à: CREATE TABLE alumni (...)

    create: async (alumniData) => {
        const { id_user, annee_diplome, specialite, entreprise_actuelle, poste, linkedin, github, facebook, localisation, disponible_mentorat } = alumniData;
        const [result] = await db.execute(
            'INSERT INTO alumni (id_user, annee_diplome, specialite, entreprise_actuelle, poste, linkedin, github, facebook, localisation, disponible_mentorat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id_user, annee_diplome, specialite, entreprise_actuelle, poste, linkedin, github || null, facebook || null, localisation || null, disponible_mentorat || 0]
        );
        return result.insertId;
    },

    findByUserId: async (userId) => {
        const [rows] = await db.execute(
            'SELECT * FROM alumni WHERE id_user = ?',
            [userId]
        );
        return rows[0];
    },

    update: async (userId, alumniData) => {
        const fields = Object.keys(alumniData);
        if (fields.length === 0) return false;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = Object.values(alumniData);
        values.push(userId);

        const [result] = await db.execute(
            `UPDATE alumni SET ${setClause} WHERE id_user = ?`,
            values
        );
        return result.affectedRows > 0;
    }
};

module.exports = Alumni;