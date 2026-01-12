const pool = require('../config/database');

class Message {
    static async create({ senderId, recipientId, content }) {
        const [result] = await pool.execute(
            'INSERT INTO message (contenu, id_expediteur, id_destinataire) VALUES (?, ?, ?)',
            [content, senderId, recipientId]
        );
        return result.insertId;
    }

    static async getByUserId(userId) {
        const [rows] = await pool.execute(
            'SELECT * FROM message WHERE id_expediteur = ? OR id_destinataire = ? ORDER BY date_envoi DESC',
            [userId, userId]
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM message WHERE id_message = ?', [id]);
        return rows[0];
    }

    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM message WHERE id_message = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Message;
