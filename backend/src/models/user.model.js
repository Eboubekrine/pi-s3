const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create({ nom, prenom, email, mot_de_passe, role, telephone }) {
        try {
            const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
            
            console.log('Creating user with data:', { nom, prenom, email, role, telephone });
            
            const [result] = await pool.execute(
                `INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role, telephone, date_inscription) 
                 VALUES (?, ?, ?, ?, ?, ?, NOW())`,
                [nom, prenom, email, hashedPassword, role, telephone]
            );
            
            console.log('User created with ID:', result.insertId);
            return result.insertId;
        } catch (error) {
            console.error('Error in User.create:', error);
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            console.log('Finding user by email:', email);
            const [rows] = await pool.execute(
                'SELECT * FROM utilisateur WHERE email = ?',
                [email]
            );
            return rows[0];
        } catch (error) {
            console.error('Error in findByEmail:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const [rows] = await pool.execute(
                `SELECT id_user, nom, prenom, email, role, date_inscription, 
                        telephone, photo_profil, bio
                 FROM utilisateur WHERE id_user = ?`,
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('Error in findById:', error);
            throw error;
        }
    }

    static async update(id, data) {
        try {
            const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
            const values = Object.values(data);
            
            console.log('Updating user', id, 'with:', data);
            
            const [result] = await pool.execute(
                `UPDATE utilisateur SET ${fields} WHERE id_user = ?`,
                [...values, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in update:', error);
            throw error;
        }
    }

    static async getAllUsers() {
        try {
            const [rows] = await pool.execute(
                `SELECT u.*, a.annee_diplome, a.specialite, a.entreprise_actuelle, a.poste
                 FROM utilisateur u
                 LEFT JOIN alumni a ON u.id_user = a.id_user
                 ORDER BY u.date_inscription DESC`
            );
            return rows;
        } catch (error) {
            console.error('Error in getAllUsers:', error);
            throw error;
        }
    }

    static async searchUsers(query) {
        try {
            const [rows] = await pool.execute(
                `SELECT u.*, a.annee_diplome, a.specialite 
                 FROM utilisateur u
                 LEFT JOIN alumni a ON u.id_user = a.id_user
                 WHERE u.nom LIKE ? OR u.prenom LIKE ? OR u.email LIKE ?
                 ORDER BY u.nom, u.prenom`,
                [`%${query}%`, `%${query}%`, `%${query}%`]
            );
            return rows;
        } catch (error) {
            console.error('Error in searchUsers:', error);
            throw error;
        }
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            console.error('Error in verifyPassword:', error);
            throw error;
        }
    }
}

module.exports = User;