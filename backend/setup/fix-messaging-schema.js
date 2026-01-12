const db = require('../config/database');

async function migrate() {
    try {
        console.log('🚀 Starting specific schema fixes (Messaging & Jobs)...');

        // 1. Fix message table
        console.log('Checking message table...');
        const [messageCols] = await db.execute('DESCRIBE message');
        if (!messageCols.find(c => c.Field === 'id_groupe')) {
            console.log('➕ Adding id_groupe to message table...');
            await db.execute('ALTER TABLE message ADD COLUMN id_groupe INT NULL');
            // Attempt to add foreign key but ignore if it fails (might be different engine)
            try {
                await db.execute('ALTER TABLE message ADD FOREIGN KEY (id_groupe) REFERENCES groupe(id_groupe) ON DELETE SET NULL');
            } catch (e) { console.log('   (FK warning: ' + e.message + ')'); }
        }

        // 2. Fix offre table
        console.log('Checking offre table...');
        const [offreCols] = await db.execute('DESCRIBE offre');
        if (!offreCols.find(c => c.Field === 'lieu')) {
            console.log('➕ Adding lieu to offre table...');
            await db.execute('ALTER TABLE offre ADD COLUMN lieu VARCHAR(100) NULL');
        }

        console.log('✅ Fixes applied successfully!');
    } catch (error) {
        console.error('❌ Critical failure during migration:', error);
    } finally {
        process.exit();
    }
}

migrate();
