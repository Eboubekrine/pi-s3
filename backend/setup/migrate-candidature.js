const db = require('../config/database');

async function migrate() {
    try {
        console.log('Creating candidature table...');

        await db.execute(`
            CREATE TABLE IF NOT EXISTS candidature (
                id_candidature INT AUTO_INCREMENT PRIMARY KEY,
                id_offre INT NOT NULL,
                id_user INT NOT NULL,
                cv_url VARCHAR(255) NOT NULL,
                message TEXT,
                statut ENUM('EN_ATTENTE', 'ACCEPTE', 'REFUSE') DEFAULT 'EN_ATTENTE',
                date_postulation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_offre) REFERENCES offre(id_offre) ON DELETE CASCADE,
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
