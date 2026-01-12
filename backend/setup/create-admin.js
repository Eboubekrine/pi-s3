const bcrypt = require('bcryptjs');
const db = require('../config/database');
require('dotenv').config();

async function createAdmin() {
    const email = 'admin@supnum.mr';
    const password = 'adminpassword';
    const nom = 'Admin';
    const prenom = 'Super';

    try {
        console.log(`🚀 Creating admin account: ${email}...`);

        // Check if exists
        const [rows] = await db.execute('SELECT * FROM utilisateur WHERE email = ?', [email]);
        if (rows.length > 0) {
            console.log('⚠️  User already exists. Updating to ADMIN role and resetting password...');
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.execute(
                'UPDATE utilisateur SET role = "ADMIN", mot_de_passe = ?, nom = ?, prenom = ? WHERE email = ?',
                [hashedPassword, nom, prenom, email]
            );
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.execute(
                'INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, "ADMIN")',
                [nom, prenom, email, hashedPassword]
            );
            console.log('✅ Admin account created successfully!');
        }

        console.log('\n-----------------------------------');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-----------------------------------\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
