// Script pour créer des utilisateurs de test directement avec Node.js
require('dotenv').config();
const db = require('../config/database');
const bcrypt = require('bcryptjs');

async function createTestUsers() {
    try {
        console.log('🔄 Connexion à la base de données...');

        // Hash du mot de passe "password123"
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Nettoyer les données existantes
        console.log('🧹 Nettoyage des anciennes données...');
        await db.execute('SET FOREIGN_KEY_CHECKS = 0');
        await db.execute('TRUNCATE TABLE message');
        await db.execute('TRUNCATE TABLE utilisateur_groupe');
        await db.execute('TRUNCATE TABLE groupe');
        await db.execute('TRUNCATE TABLE amis');
        await db.execute('TRUNCATE TABLE alumni');
        await db.execute('TRUNCATE TABLE utilisateur');
        await db.execute('SET FOREIGN_KEY_CHECKS = 1');

        // Créer plusieurs utilisateurs
        console.log('👥 Création des utilisateurs...');

        const users = [
            ['Admin', 'SupNum', 'admin@supnum.mr', 'ADMIN'],
            ['Diallo', 'Mamadou', 'mamadou@supnum.mr', 'ALUMNI'],
            ['Ba', 'Fatima', 'fatima@supnum.mr', 'ALUMNI'],
            ['Kane', 'Ahmed', 'ahmed@supnum.mr', 'STUDENT'],
            ['Sow', 'Aissata', 'aissata@supnum.mr', 'STUDENT'],
            ['Camara', 'Ibrahim', 'ibrahim@supnum.mr', 'STUDENT'],
            ['Ly', 'Mariam', 'mariam@supnum.mr', 'STUDENT'],
            ['Sy', 'Oumar', 'oumar@supnum.mr', 'STUDENT']
        ];

        for (const [nom, prenom, email, role] of users) {
            await db.execute(
                'INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)',
                [nom, prenom, email, hashedPassword, role]
            );
            console.log(`  ✅ ${prenom} ${nom} (${email}) - ${role}`);
        }

        // Ajouter des profils Alumni
        console.log('\n🎓 Création des profils Alumni...');
        await db.execute(
            'INSERT INTO alumni (id_user, annee_diplome, specialite, entreprise_actuelle, poste) VALUES (?, ?, ?, ?, ?)',
            [2, 2020, 'Génie Logiciel', 'Mauritanie Tech', 'Senior Developer']
        );
        await db.execute(
            'INSERT INTO alumni (id_user, annee_diplome, specialite, entreprise_actuelle, poste) VALUES (?, ?, ?, ?, ?)',
            [3, 2019, 'Réseaux et Sécurité', 'SecureNet MR', 'Security Analyst']
        );
        console.log('  ✅ Profils Alumni créés');

        // Vérifier le résultat
        const [rows] = await db.execute('SELECT COUNT(*) as total FROM utilisateur');
        console.log(`\n✅ SUCCÈS! ${rows[0].total} utilisateurs créés`);
        console.log('\n📧 Tous les comptes utilisent le mot de passe: password123');
        console.log('\n🔑 Connectez-vous avec:');
        console.log('   - ahmed@supnum.mr / password123 (STUDENT)');
        console.log('   - admin@supnum.mr / password123 (ADMIN)');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

createTestUsers();
