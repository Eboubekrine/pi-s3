const pool = require('../config/database');

class Event {
    // Récupérer tous les événements
    static async getAll() {
        const [rows] = await pool.execute(
            `SELECT e.*, u.nom AS organisateur_nom, u.prenom AS organisateur_prenom
             FROM evenement e
             LEFT JOIN utilisateur u ON e.id_organisateur = u.id_user
             ORDER BY e.date_evenement DESC`
        );
        return rows;
    }

    // Récupérer un événement par ID
    static async findById(id) {
        const [rows] = await pool.execute(
            `SELECT e.*, u.nom AS organisateur_nom, u.prenom AS organisateur_prenom
             FROM evenement e
             LEFT JOIN utilisateur u ON e.id_organisateur = u.id_user
             WHERE e.id_evenement = ?`,
            [id]
        );
        return rows[0];
    }

    // Créer un événement
    static async create(data) {
        const { titre, description, date_evenement, lieu, id_organisateur, image } = data;
        const [result] = await pool.execute(
            `INSERT INTO evenement (titre, description, date_evenement, lieu, id_organisateur, image)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [titre, description, date_evenement, lieu, id_organisateur, image || null]
        );
        return result.insertId;
    }

    // Mettre à jour un événement
    static async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);

        const [result] = await pool.execute(
            `UPDATE evenement SET ${fields} WHERE id_evenement = ?`,
            [...values, id]
        );

        if (result.affectedRows === 0) return null;
        return await this.findById(id);
    }

    // Supprimer un événement
    static async delete(id) {
        const [result] = await pool.execute(
            `DELETE FROM evenement WHERE id_evenement = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Event;
