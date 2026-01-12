// Script de diagnostic complet du système
require('dotenv').config();
const db = require('../config/database');

async function diagnose() {
    try {
        console.log('🔍 DIAGNOSTIC DU SYSTÈME\n');
        console.log('='.repeat(50));

        // 1. Test de connexion DB
        console.log('\n1️⃣ TEST DE CONNEXION À LA BASE DE DONNÉES');
        const [dbTest] = await db.execute('SELECT 1 as test');
        console.log('   ✅ Connexion DB OK');

        // 2. Vérifier les utilisateurs
        console.log('\n2️⃣ VÉRIFIER LES UTILISATEURS');
        const [users] = await db.execute('SELECT id_user, nom, prenom, email, role FROM utilisateur');
        console.log(`   📊 Nombre total d'utilisateurs: ${users.length}`);
        if (users.length === 0) {
            console.log('   ❌ PROBLÈME: Aucun utilisateur dans la base!');
            console.log('   💡 Solution: Exécutez "node setup/create-users.js"');
        } else {
            console.log('   ✅ Utilisateurs trouvés:');
            users.forEach(u => {
                console.log(`      - ${u.prenom} ${u.nom} (${u.email}) [${u.role}]`);
            });
        }

        // 3. Vérifier les groupes
        console.log('\n3️⃣ VÉRIFIER LES GROUPES');
        const [groups] = await db.execute('SELECT id_groupe, nom FROM groupe');
        console.log(`   📊 Nombre total de groupes: ${groups.length}`);
        if (groups.length > 0) {
            groups.forEach(g => console.log(`      - ${g.nom}`));
        }

        // 4. Vérifier la structure de la table
        console.log('\n4️⃣ VÉRIFIER LA STRUCTURE utilisateur');
        const [columns] = await db.execute('SHOW COLUMNS FROM utilisateur');
        console.log('   Colonnes:');
        columns.forEach(c => console.log(`      - ${c.Field} (${c.Type})`));

        // 5. Simuler l'appel API /users
        console.log('\n5️⃣ SIMULER L\'APPEL API /users');
        const [apiUsers] = await db.execute('SELECT * FROM utilisateur ORDER BY date_inscription DESC');
        const safeUsers = apiUsers.map(u => {
            const { mot_de_passe, ...safe } = u;
            return safe;
        });
        console.log(`   ✅ L'API retournerait ${safeUsers.length} utilisateurs`);
        console.log('   Format JSON:', JSON.stringify({ success: true, users: safeUsers }, null, 2).substring(0, 200) + '...');

        console.log('\n' + '='.repeat(50));
        console.log('✅ DIAGNOSTIC TERMINÉ\n');

        // Résumé
        if (users.length === 0) {
            console.log('⚠️  ACTION REQUISE: Créez des utilisateurs avec "node setup/create-users.js"');
        } else {
            console.log('✅ Système OK - Les utilisateurs devraient apparaître dans le frontend');
            console.log('\n📝 Si le frontend montre toujours "0 total":');
            console.log('   1. Ouvrez Console (F12) dans le navigateur');
            console.log('   2. Cherchez les logs "Starting to fetch users..."');
            console.log('   3. Vérifiez le message d\'erreur exact');
        }

        process.exit(0);
    } catch (error) {
        console.error('\n❌ ERREUR:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

diagnose();
