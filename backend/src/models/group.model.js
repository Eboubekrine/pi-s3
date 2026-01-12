const pool = require('../config/database');

class Group {
    static async create({ nom, description, id_createur }) {
        const [result] = await pool.execute(
            'INSERT INTO groupe (nom, description, id_createur) VALUES (?, ?, ?)',
            [nom, description, id_createur]
        );
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await pool.execute('SELECT * FROM groupe ORDER BY date_creation DESC');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM groupe WHERE id_groupe = ?', [id]);
        return rows[0];
    }

    static async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const [result] = await pool.execute('UPDATE groupe SET ' + fields + ' WHERE id_groupe = ?', [...values, id]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM groupe WHERE id_groupe = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Group;
