const db = require('../config/database');

const Groupe = {
    // CREATE TABLE groupe
    create: async (groupeData) => {
        const { nom, description, id_createur } = groupeData;
        const [result] = await db.execute(
            'INSERT INTO groupe (nom, description, id_createur) VALUES (?, ?, ?)',
            [nom, description, id_createur]
        );
        return result.insertId;
    },

    findAll: async () => {
        const [rows] = await db.execute('SELECT * FROM groupe ORDER BY date_creation DESC');
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM groupe WHERE id_groupe = ?', [id]);
        return rows[0];
    },

    // CREATE TABLE utilisateur_groupe
    addMember: async (id_user, id_groupe) => {
        try {
            const [result] = await db.execute(
                'INSERT INTO utilisateur_groupe (id_user, id_groupe) VALUES (?, ?)',
                [id_user, id_groupe]
            );
            return result.affectedRows > 0;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') return true;
            throw error;
        }
    },

    getMembers: async (id_groupe) => {
        const [rows] = await db.execute(
            `SELECT u.id_user, u.nom, u.prenom 
             FROM utilisateur u 
             JOIN utilisateur_groupe ug ON u.id_user = ug.id_user 
             WHERE ug.id_groupe = ?`,
            [id_groupe]
        );
        return rows;
    },

    getUserGroups: async (id_user) => {
        const [rows] = await db.execute(
            `SELECT g.* 
             FROM groupe g 
             JOIN utilisateur_groupe ug ON g.id_groupe = ug.id_groupe 
             WHERE ug.id_user = ?`,
            [id_user]
        );
        return rows;
    }
};

module.exports = Groupe;
