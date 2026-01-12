const db = require('../config/database');

async function migrate() {
    try {
        console.log('Creating notification table...');

        await db.execute(`
            CREATE TABLE IF NOT EXISTS notification (
                id_notification INT AUTO_INCREMENT PRIMARY KEY,
                id_user INT NOT NULL,
                type ENUM('MESSAGE', 'FRIEND_REQUEST', 'APPLICATION', 'EVENT', 'MENTORAT') NOT NULL,
                contenu TEXT NOT NULL,
                lien VARCHAR(255),
                est_lu TINYINT(1) DEFAULT 0,
                date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
            )
        `);

        console.log('Migration successful!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit();
    }
}

migrate();
