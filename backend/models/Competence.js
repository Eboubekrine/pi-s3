const db = require('../config/database');

const Competence = {
    create: async (nom) => {
        const [result] = await db.execute(
            'INSERT INTO competence (nom_competence) VALUES (?)',
            [nom]
        );
        return result.insertId;
    },

    findAll: async () => {
        const [rows] = await db.execute('SELECT * FROM competence ORDER BY nom_competence');
        return rows;
    },

    addForUser: async (id_user, id_competence) => {
        try {
            const [result] = await db.execute(
                'INSERT INTO utilisateur_competence (id_user, id_competence) VALUES (?, ?)',
                [id_user, id_competence]
            );
            return result.affectedRows > 0;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') return true;
            throw error;
        }
    },

    getByUser: async (id_user) => {
        const [rows] = await db.execute(
            `SELECT c.* FROM competence c 
             JOIN utilisateur_competence uc ON c.id_competence = uc.id_competence 
             WHERE uc.id_user = ?`,
            [id_user]
        );
        return rows;
    },

    removeFromUser: async (id_user, id_competence) => {
        const [result] = await db.execute(
            'DELETE FROM utilisateur_competence WHERE id_user = ? AND id_competence = ?',
            [id_user, id_competence]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Competence;