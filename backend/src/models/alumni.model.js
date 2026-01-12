const pool = require('../config/database');

class Alumni {
    static async create({ id_user, annee_diplome, specialite, entreprise_actuelle, poste, linkedin }) {
        const [result] = await pool.execute(
            `INSERT INTO alumni (id_user, annee_diplome, specialite, entreprise_actuelle, poste, linkedin) VALUES (?, ?, ?, ?, ?, ?)`,
            [id_user, annee_diplome, specialite, entreprise_actuelle, poste, linkedin]
        );
        return result.insertId;
    }

    static async findByUserId(id_user) {
        const [rows] = await pool.execute('SELECT * FROM alumni WHERE id_user = ?', [id_user]);
        return rows[0];
    }

    static async update(id_user, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const [result] = await pool.execute(`UPDATE alumni SET ${fields} WHERE id_user = ?`, [...values, id_user]);
        return result.affectedRows > 0;
    }
}

module.exports = Alumni;
