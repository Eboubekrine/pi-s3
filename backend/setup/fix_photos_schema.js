const db = require('../config/database');

async function fixSchema() {
    try {
        console.log('🚀 Démarrage de la correction du schéma (Photos & Profil)...');

        // 1. Correction de la table utilisateur
        console.log('\n--- Table: utilisateur ---');
        const userCols = [
            { name: 'avatar', type: 'TEXT' },
            { name: 'cv_url', type: 'VARCHAR(255)' },
            { name: 'telephone', type: 'VARCHAR(20)' },
            { name: 'date_naissance', type: 'DATE' },
            { name: 'bio', type: 'TEXT' },
            { name: 'supnum_id', type: 'VARCHAR(50)' },
            { name: 'localisation', type: 'VARCHAR(255)' },
            { name: 'linkedin', type: 'VARCHAR(255)' },
            { name: 'github', type: 'VARCHAR(255)' },
            { name: 'facebook', type: 'VARCHAR(255)' },
            { name: 'entreprise', type: 'VARCHAR(255)' },
            { name: 'poste', type: 'VARCHAR(255)' }
        ];

        for (const col of userCols) {
            try {
                const [check] = await db.execute(`SHOW COLUMNS FROM utilisateur LIKE '${col.name}'`);
                if (check.length === 0) {
                    console.log(`➕ Ajout de la colonne ${col.name}...`);
                    await db.execute(`ALTER TABLE utilisateur ADD COLUMN ${col.name} ${col.type} DEFAULT NULL`);
                } else {
                    console.log(`✅ La colonne ${col.name} existe déjà.`);
                }
            } catch (err) {
                console.error(`❌ Erreur sur utilisateur.${col.name}:`, err.message);
            }
        }

        // 2. Correction de la table message
        console.log('\n--- Table: message ---');
        const messageCols = [
            { name: 'id_groupe', type: 'INT' },
            { name: 'image_url', type: 'VARCHAR(500)' }
        ];

        for (const col of messageCols) {
            try {
                const [check] = await db.execute(`SHOW COLUMNS FROM message LIKE '${col.name}'`);
                if (check.length === 0) {
                    console.log(`➕ Ajout de la colonne ${col.name}...`);
                    await db.execute(`ALTER TABLE message ADD COLUMN ${col.name} ${col.type} DEFAULT NULL`);

                    // Si c'est id_groupe, on essaie d'ajouter la clé étrangère
                    if (col.name === 'id_groupe') {
                        try {
                            await db.execute('ALTER TABLE message ADD CONSTRAINT fk_message_groupe FOREIGN KEY (id_groupe) REFERENCES groupe(id_groupe) ON DELETE SET NULL');
                            console.log('🔗 Clé étrangère id_groupe ajoutée.');
                        } catch (fkErr) {
                            console.log('⚠️ Note: Impossible d\'ajouter la contrainte FK (déjà présente ou table groupe absente).');
                        }
                    }
                } else {
                    console.log(`✅ La colonne ${col.name} existe déjà.`);
                }
            } catch (err) {
                console.error(`❌ Erreur sur message.${col.name}:`, err.message);
            }
        }

        console.log('\n✨ Correction terminée avec succès !');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Erreur critique lors de la migration:', error);
        process.exit(1);
    }
}

fixSchema();
