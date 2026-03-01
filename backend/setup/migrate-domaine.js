/**
 * Migration: Add 'domaine' column to utilisateur table
 * Domains: DSI, RSS, DWM
 */
const db = require('../config/database');

async function migrate() {
    try {
        console.log('🔄 Adding domaine column to utilisateur table...');

        await db.execute(`
            ALTER TABLE utilisateur 
            ADD COLUMN IF NOT EXISTS domaine ENUM('DSI','RSS','DWM') DEFAULT NULL AFTER role
        `).catch(async (err) => {
            // MariaDB/MySQL < 10.0 may not support IF NOT EXISTS for columns
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('   Column domaine already exists, skipping.');
            } else {
                // Try without IF NOT EXISTS
                try {
                    await db.execute(`ALTER TABLE utilisateur ADD COLUMN domaine ENUM('DSI','RSS','DWM') DEFAULT NULL AFTER role`);
                } catch (e) {
                    if (e.code === 'ER_DUP_FIELDNAME') {
                        console.log('   Column domaine already exists, skipping.');
                    } else {
                        throw e;
                    }
                }
            }
        });

        console.log('✅ Migration completed successfully!');
        console.log('   Column "domaine" (ENUM: DSI, RSS, DWM) added to utilisateur table.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

migrate();
