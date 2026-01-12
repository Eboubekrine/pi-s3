const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
};

async function createAdmin() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.query('USE alumni_supnum');

        const nom = 'Admin';
        const prenom = 'SupNum';
        const email = 'admin@supnum.mr';
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const role = 'ADMIN';

        // Check if exists
        const [existing] = await connection.execute('SELECT * FROM utilisateur WHERE email = ?', [email]);
        if (existing.length > 0) {
            console.log('⚠️ Admin account already exists (admin@supnum.mr)');
            process.exit(0);
        }

        await connection.execute(
            'INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)',
            [nom, prenom, email, hashedPassword, role]
        );

        console.log('✅ Admin account created successfully!');
        console.log('Email: admin@supnum.mr');
        console.log('Password: admin123');

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
