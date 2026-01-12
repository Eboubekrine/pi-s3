const pool = require('../config/database');

class Offer {
    static async create({ titre, description, entreprise, type_offre, id_user }) {
        const [result] = await pool.execute(
            'INSERT INTO offre (titre, description, entreprise, type_offre, id_user) VALUES (?, ?, ?, ?, ?)',
            [titre, description, entreprise, type_offre, id_user]
        );
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await pool.execute('SELECT * FROM offre ORDER BY date_publication DESC');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM offre WHERE id_offre = ?', [id]);
        return rows[0];
    }

    static async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const [result] = await pool.execute('UPDATE offre SET ' + fields + ' WHERE id_offre = ?', [...values, id]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM offre WHERE id_offre = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Offer;
