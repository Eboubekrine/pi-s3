const db = require('../config/database');

async function migrate() {
    try {
        console.log('Adding cv_url to utilisateur table...');

        await db.execute(`
            ALTER TABLE utilisateur 
            ADD COLUMN cv_url VARCHAR(255) DEFAULT NULL;
        `);

        console.log('Migration successful!');
    } catch (error) {
        console.error('Migration failed (it might already exist):', error);
    } finally {
        process.exit();
    }
}

migrate();
