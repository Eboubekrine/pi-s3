const db = require('../config/database');

async function migrate() {
    try {
        console.log('🚀 Starting migration: adding date_expiration to offre table...');

        await db.execute(`
            ALTER TABLE offre 
            ADD COLUMN IF NOT EXISTS date_expiration DATE DEFAULT NULL
        `);

        console.log('✅ Migration successful: date_expiration added to offre table.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
