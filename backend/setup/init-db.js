const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
};

const schema = `
CREATE DATABASE IF NOT EXISTS supnum_alumni;
USE supnum_alumni;

CREATE TABLE IF NOT EXISTS utilisateur (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'ALUMNI', 'ADMIN') NOT NULL,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alumni (
    id_alumni INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT UNIQUE,
    annee_diplome INT,
    specialite VARCHAR(100),
    entreprise_actuelle VARCHAR(150),
    poste VARCHAR(150),
    linkedin VARCHAR(255),
    FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS offre (
    id_offre INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    description TEXT,
    entreprise VARCHAR(150),
    type_offre ENUM('STAGE', 'EMPLOI'),
    date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_user INT,
    FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS message (
    id_message INT AUTO_INCREMENT PRIMARY KEY,
    contenu TEXT NOT NULL,
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_expediteur INT,
    id_destinataire INT,
    id_groupe INT,
    FOREIGN KEY (id_expediteur) REFERENCES utilisateur(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_destinataire) REFERENCES utilisateur(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_groupe) REFERENCES groupe(id_groupe) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS groupe (
    id_groupe INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    description TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_createur INT,
    FOREIGN KEY (id_createur) REFERENCES utilisateur(id_user) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS utilisateur_groupe (
    id_user INT,
    id_groupe INT,
    PRIMARY KEY (id_user, id_groupe),
    FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_groupe) REFERENCES groupe(id_groupe) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS evenement (
    id_evenement INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    description TEXT,
    date_evenement DATE,
    lieu VARCHAR(150),
    id_organisateur INT,
    FOREIGN KEY (id_organisateur) REFERENCES utilisateur(id_user) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS amis (
    id_relation INT AUTO_INCREMENT PRIMARY KEY,
    id_demandeur INT NOT NULL,
    id_receveur INT NOT NULL,
    date_demande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('EN_ATTENTE', 'ACCEPTE', 'REFUSE') DEFAULT 'EN_ATTENTE',
    FOREIGN KEY (id_demandeur) REFERENCES utilisateur(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_receveur) REFERENCES utilisateur(id_user) ON DELETE CASCADE,
    UNIQUE KEY unique_relation (id_demandeur, id_receveur)
);

CREATE TABLE IF NOT EXISTS partenaire (
    id_partenaire INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    secteur VARCHAR(100),
    ville VARCHAR(100),
    site_web VARCHAR(255),
    logo VARCHAR(255),
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

`;

async function initDB() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL server');

        const statements = schema.split(';').filter(cmd => cmd.trim());

        for (let statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
                console.log('Executed:', statement.substring(0, 50) + '...');
            }
        }

        console.log('✅ Database initialized successfully');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        process.exit(1);
    }
}

initDB();
