const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function seedDatabase() {
    try {
        console.log('🌱 Démarrage de l\'initialisation de la base de données...');

        // 1. Création des tables
        await db.execute(`
            CREATE TABLE IF NOT EXISTS utilisateur (
                id_user INT AUTO_INCREMENT PRIMARY KEY,
                nom VARCHAR(100) NOT NULL,
                prenom VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                mot_de_passe VARCHAR(255) NOT NULL,
                role ENUM('STUDENT', 'ALUMNI', 'ADMIN') NOT NULL,
                date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS alumni (
                id_alumni INT AUTO_INCREMENT PRIMARY KEY,
                id_user INT UNIQUE,
                annee_diplome INT,
                specialite VARCHAR(100),
                entreprise_actuelle VARCHAR(150),
                poste VARCHAR(150),
                linkedin VARCHAR(255),
                FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
            )
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS competence (
                id_competence INT AUTO_INCREMENT PRIMARY KEY,
                nom_competence VARCHAR(100) NOT NULL
            )
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS utilisateur_competence (
                id_user INT,
                id_competence INT,
                PRIMARY KEY (id_user, id_competence),
                FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE,
                FOREIGN KEY (id_competence) REFERENCES competence(id_competence) ON DELETE CASCADE
            )
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS offre (
                id_offre INT AUTO_INCREMENT PRIMARY KEY,
                titre VARCHAR(150) NOT NULL,
                description TEXT,
                entreprise VARCHAR(150),
                type_offre ENUM('STAGE', 'EMPLOI'),
                date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                id_user INT,
                FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE SET NULL
            )
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS message (
                id_message INT AUTO_INCREMENT PRIMARY KEY,
                contenu TEXT NOT NULL,
                date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                id_expediteur INT,
                id_destinataire INT,
                FOREIGN KEY (id_expediteur) REFERENCES utilisateur(id_user) ON DELETE CASCADE,
                FOREIGN KEY (id_destinataire) REFERENCES utilisateur(id_user) ON DELETE CASCADE
            )
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS groupe (
                id_groupe INT AUTO_INCREMENT PRIMARY KEY,
                nom VARCHAR(150) NOT NULL,
                description TEXT,
                date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                id_createur INT,
                FOREIGN KEY (id_createur) REFERENCES utilisateur(id_user) ON DELETE SET NULL
            )
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS utilisateur_groupe (
                id_user INT,
                id_groupe INT,
                PRIMARY KEY (id_user, id_groupe),
                FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE,
                FOREIGN KEY (id_groupe) REFERENCES groupe(id_groupe) ON DELETE CASCADE
            )
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS evenement (
                id_evenement INT AUTO_INCREMENT PRIMARY KEY,
                titre VARCHAR(150) NOT NULL,
                description TEXT,
                date_evenement DATE,
                lieu VARCHAR(150),
                id_organisateur INT,
                FOREIGN KEY (id_organisateur) REFERENCES utilisateur(id_user) ON DELETE SET NULL
            )
        `);

        console.log('✅ Tables créées avec succès');

        // 2. Insérer les compétences
        const competences = [
            'JavaScript', 'React', 'Node.js', 'Python', 'Java',
            'PHP', 'HTML/CSS', 'SQL', 'MongoDB', 'AWS',
            'Docker', 'Git', 'UI/UX Design', 'Machine Learning', 'Cybersecurity'
        ];

        for (const competence of competences) {
            await db.execute(
                'INSERT IGNORE INTO competence (nom_competence) VALUES (?)',
                [competence]
            );
        }

        console.log('✅ Compétences insérées');

        // 3. Créer l'utilisateur admin
        const hashedPassword = await bcrypt.hash('Admin123!', 10);
        
        await db.execute(
            'INSERT IGNORE INTO utilisateur (nom, prenom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)',
            ['Admin', 'System', 'admin@supnum.mr', hashedPassword, 'ADMIN']
        );

        console.log('✅ Utilisateur admin créé');

        // 4. Créer des utilisateurs de test
        const testUsers = [
            {
                nom: 'Ahmed',
                prenom: 'Mohamed',
                email: 'ahmed@supnum.mr',
                password: 'Password123',
                role: 'ALUMNI',
                alumniData: {
                    annee_diplome: 2022,
                    specialite: 'Informatique',
                    entreprise_actuelle: 'TechCorp',
                    poste: 'Software Engineer',
                    linkedin: 'https://linkedin.com/in/ahmed'
                }
            },
            {
                nom: 'Fatima',
                prenom: 'Sidi',
                email: 'fatima@supnum.mr',
                password: 'Password123',
                role: 'STUDENT'
            }
        ];

        for (const user of testUsers) {
            const userPassword = await bcrypt.hash(user.password, 10);
            
            const [result] = await db.execute(
                'INSERT IGNORE INTO utilisateur (nom, prenom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)',
                [user.nom, user.prenom, user.email, userPassword, user.role]
            );

            if (user.role === 'ALUMNI' && result.insertId) {
                await db.execute(
                    'INSERT IGNORE INTO alumni (id_user, annee_diplome, specialite, entreprise_actuelle, poste, linkedin) VALUES (?, ?, ?, ?, ?, ?)',
                    [result.insertId, user.alumniData.annee_diplome, user.alumniData.specialite, 
                     user.alumniData.entreprise_actuelle, user.alumniData.poste, user.alumniData.linkedin]
                );
            }
        }

        console.log('✅ Utilisateurs de test créés');

        // 5. Créer des événements de test
        await db.execute(`
            INSERT IGNORE INTO evenement (titre, description, date_evenement, lieu, id_organisateur)
            VALUES 
            ('Hackathon SupNum 2024', 'Hackathon annuel pour les étudiants et anciens étudiants', '2024-06-15', 'Campus SupNum', 1),
            ('Workshop React', 'Formation intensive sur React.js et les bonnes pratiques', '2024-05-20', 'Salle A12', 1),
            ('Conférence IA', 'L\'avenir de l\'intelligence artificielle dans l\'industrie', '2024-07-10', 'Auditorium Principal', 1)
        `);

        console.log('✅ Événements de test créés');

        // 6. Créer des offres de test
        await db.execute(`
            INSERT IGNORE INTO offre (titre, description, entreprise, type_offre, id_user)
            VALUES 
            ('Développeur Full Stack', 'Recherche d\'un développeur full stack avec expérience en React et Node.js', 'TechCorp', 'EMPLOI', 1),
            ('Stage en Data Science', 'Stage de 6 mois en data science pour étudiants en dernière année', 'DataSystems', 'STAGE', 1),
            ('Ingénieur DevOps', 'Poste d\'ingénieur DevOps avec expérience en AWS et Docker', 'CloudTech', 'EMPLOI', 1)
        `);

        console.log('✅ Offres de test créées');

        console.log('\n🎉 Base de données initialisée avec succès !');
        console.log('\n🔑 Identifiants de test :');
        console.log('Admin: admin@supnum.mr / Admin123!');
        console.log('Alumni: ahmed@supnum.mr / Password123');
        console.log('Student: fatima@supnum.mr / Password123');

    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

seedDatabase();