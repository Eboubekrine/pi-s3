// Robust migration script
const db = require('../config/database');

async function migrate() {
    try {
        console.log('🚀 Migrating database for profile fields...');

        const columns = [
            { table: 'utilisateur', column: 'avatar', type: 'TEXT' },
            { table: 'utilisateur', column: 'telephone', type: 'VARCHAR(20)' },
            { table: 'utilisateur', column: 'date_naissance', type: 'DATE' },
            { table: 'utilisateur', column: 'bio', type: 'TEXT' },
            { table: 'alumni', column: 'github', type: 'VARCHAR(255)' },
            { table: 'alumni', column: 'facebook', type: 'VARCHAR(255)' },
            { table: 'alumni', column: 'localisation', type: 'VARCHAR(150)' }
        ];

        for (const col of columns) {
            try {
                // Check if column exists
                const [info] = await db.execute(`SHOW COLUMNS FROM ${col.table} LIKE '${col.column}'`);
                if (info.length === 0) {
                    console.log(`   Adding ${col.column} to ${col.table}...`);
                    await db.execute(`ALTER TABLE ${col.table} ADD COLUMN ${col.column} ${col.type}`);
                } else {
                    console.log(`   ${col.column} already exists in ${col.table}.`);
                }
            } catch (e) {
                console.error(`❌ Error on ${col.table}.${col.column}:`, e.message);
            }
        }

        console.log('✅ Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
