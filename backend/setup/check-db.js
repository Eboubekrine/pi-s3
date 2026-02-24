const db = require('./config/database');

async function checkSchema() {
    try {
        console.log('--- TABLE: message ---');
        const [msgCols] = await db.execute('DESCRIBE message');
        console.table(msgCols);

        console.log('\n--- TABLE: utilisateur ---');
        const [userCols] = await db.execute('DESCRIBE utilisateur');
        console.table(userCols);

        console.log('\n--- TABLE: groupe ---');
        const [groupCols] = await db.execute('DESCRIBE groupe');
        console.table(groupCols);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error checking schema:', error.message);
        process.exit(1);
    }
}

checkSchema();
