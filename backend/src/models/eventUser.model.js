const pool = require('../config/database');

class EventUser {
    // Inscrire un utilisateur à un événement
    static async register(eventId, userId) {
        // Vérifier si l'utilisateur est déjà inscrit
        const [existing] = await pool.execute(
            'SELECT * FROM utilisateur_evenement WHERE id_evenement = ? AND id_user = ?',
            [eventId, userId]
        );
        if (existing.length > 0) return false; // déjà inscrit

        const [result] = await pool.execute(
            'INSERT INTO utilisateur_evenement (id_evenement, id_user) VALUES (?, ?)',
            [eventId, userId]
        );
        return result.affectedRows > 0;
    }

    // Désinscrire un utilisateur d'un événement
    static async unregister(eventId, userId) {
        const [result] = await pool.execute(
            'DELETE FROM utilisateur_evenement WHERE id_evenement = ? AND id_user = ?',
            [eventId, userId]
        );
        return result.affectedRows > 0;
    }

    // Obtenir tous les utilisateurs inscrits à un événement
    static async getParticipants(eventId) {
        const [rows] = await pool.execute(
            `SELECT u.id_user, u.nom, u.prenom, u.email, u.role
             FROM utilisateur u
             JOIN utilisateur_evenement ue ON u.id_user = ue.id_user
             WHERE ue.id_evenement = ?`,
            [eventId]
        );
        return rows;
    }

    // Vérifier si un utilisateur est inscrit à un événement
    static async isRegistered(eventId, userId) {
        const [rows] = await pool.execute(
            'SELECT * FROM utilisateur_evenement WHERE id_evenement = ? AND id_user = ?',
            [eventId, userId]
        );
        return rows.length > 0;
    }

    // Obtenir tous les événements d’un utilisateur
    static async getUserEvents(userId) {
        const [rows] = await pool.execute(
            `SELECT e.id_evenement, e.titre, e.description, e.date_evenement, e.lieu
             FROM evenement e
             JOIN utilisateur_evenement ue ON e.id_evenement = ue.id_evenement
             WHERE ue.id_user = ?`,
            [userId]
        );
        return rows;
    }
}

module.exports = EventUser;
