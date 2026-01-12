const db = require('../config/database');

async function migrate() {
    try {
        console.log('Adding disponible_mentorat to alumni table...');

        // Add disponible_mentorat column (default to false)
        await db.execute(`
            ALTER TABLE alumni 
            ADD COLUMN disponible_mentorat TINYINT(1) DEFAULT 0
        `);

        console.log('Migration successful!');
    } catch (error) {
        if (error.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Column already exists, skipping.');
        } else {
            console.error('Migration failed:', error);
        }
    } finally {
        process.exit();
    }
}

migrate();
