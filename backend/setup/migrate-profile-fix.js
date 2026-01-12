const db = require('../config/database');

async function migrate() {
    try {
        console.log('Starting Mega-Migration for profile persistence...');

        // Add columns to utilisateur if they don't exist
        const columns = [
            { name: 'supnum_id', type: 'VARCHAR(50)' },
            { name: 'localisation', type: 'VARCHAR(255)' },
            { name: 'linkedin', type: 'VARCHAR(255)' },
            { name: 'github', type: 'VARCHAR(255)' },
            { name: 'facebook', type: 'VARCHAR(255)' },
            { name: 'entreprise', type: 'VARCHAR(255)' },
            { name: 'poste', type: 'VARCHAR(255)' }
        ];

        for (const col of columns) {
            try {
                await db.execute(`ALTER TABLE utilisateur ADD COLUMN ${col.name} ${col.type} DEFAULT NULL;`);
                console.log(`Added column ${col.name} to utilisateur.`);
            } catch (err) {
                console.log(`Column ${col.name} already exists or error: ${err.message}`);
            }
        }

        console.log('Mega-Migration successful!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit();
    }
}

migrate();
