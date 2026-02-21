-- 1. Reset Tables
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS candidature;
DROP TABLE IF EXISTS partenaire;
DROP TABLE IF EXISTS utilisateur_competence;
DROP TABLE IF EXISTS utilisateur_groupe;
DROP TABLE IF EXISTS groupe;
DROP TABLE IF EXISTS amis;
DROP TABLE IF EXISTS evenement;
DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS offre;
DROP TABLE IF EXISTS alumni;
DROP TABLE IF EXISTS utilisateur;

SET FOREIGN_KEY_CHECKS = 1;

-- 2. Utilisateurs (Restored all legacy columns)
CREATE TABLE utilisateur (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'ALUMNI', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avatar VARCHAR(500),
    bio TEXT,
    telephone VARCHAR(20),
    date_naissance DATE, -- Restored
    cv_url VARCHAR(500), -- Restored
    statut_professionnel VARCHAR(100), -- Restored
    poste VARCHAR(150), -- Restored
    entreprise VARCHAR(150), -- Restored
    linkedin VARCHAR(255),
    github VARCHAR(255),
    facebook VARCHAR(255), -- Restored
    ville VARCHAR(100),
    pays VARCHAR(100),
    est_verifie BOOLEAN DEFAULT FALSE,
    est_actif BOOLEAN DEFAULT TRUE
);

-- 3. Alumni (Restored legacy columns)
CREATE TABLE alumni (
    id_alumni INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT UNIQUE,
    supnum_id VARCHAR(20) UNIQUE,
    annee_diplome INT,
    specialite VARCHAR(100),
    promotion VARCHAR(50), -- Restored
    entreprise_actuelle VARCHAR(150),
    poste_actuel VARCHAR(150),
    poste VARCHAR(150), -- Restored
    linkedin VARCHAR(255),
    github VARCHAR(255),
    facebook VARCHAR(255), -- Restored
    localisation VARCHAR(255), -- Restored
    disponible_mentorat BOOLEAN DEFAULT FALSE, -- Restored
    FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
);

-- 4. Amis
CREATE TABLE amis (
    id_relation INT AUTO_INCREMENT PRIMARY KEY,
    id_demandeur INT,
    id_receveur INT,
    statut ENUM('EN_ATTENTE', 'ACCEPTE', 'REFUSE', 'BLOQUE') DEFAULT 'EN_ATTENTE',
    date_demande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_demandeur) REFERENCES utilisateur(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_receveur) REFERENCES utilisateur(id_user) ON DELETE CASCADE
);

-- 5. Offres
CREATE TABLE offre (
    id_offre INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    description TEXT,
    entreprise VARCHAR(150),
    type_offre ENUM('STAGE', 'EMPLOI', 'ALTERNANCE', 'FREELANCE'),
    lieu VARCHAR(150),
    date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    est_active BOOLEAN DEFAULT TRUE,
    id_user INT,
    FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE SET NULL
);

-- 6. Candidatures
CREATE TABLE candidature (
    id_candidature INT AUTO_INCREMENT PRIMARY KEY,
    id_offre INT,
    id_user INT,
    cv_url VARCHAR(500),
    message TEXT,
    statut ENUM('EN_ATTENTE', 'EN_REVISION', 'ACCEPTE', 'REFUSE') DEFAULT 'EN_ATTENTE',
    date_postulation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_offre) REFERENCES offre(id_offre) ON DELETE CASCADE,
    FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
);

-- 7. Événements
CREATE TABLE evenement (
    id_evenement INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    description TEXT,
    date_evenement DATE,
    lieu VARCHAR(150),
    image VARCHAR(500),
    type ENUM('Event', 'Challenge', 'Contest') DEFAULT 'Event',
    id_organisateur INT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_organisateur) REFERENCES utilisateur(id_user) ON DELETE SET NULL
);

-- 8. Messages
CREATE TABLE message (
    id_message INT AUTO_INCREMENT PRIMARY KEY,
    contenu TEXT NOT NULL,
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    est_lu BOOLEAN DEFAULT FALSE,
    id_expediteur INT,
    id_destinataire INT,
    FOREIGN KEY (id_expediteur) REFERENCES utilisateur(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_destinataire) REFERENCES utilisateur(id_user) ON DELETE CASCADE
);

-- 9. Notifications
CREATE TABLE notification (
    id_notification INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT,
    type VARCHAR(50),
    contenu TEXT,
    lien VARCHAR(255),
    est_lu BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
);

-- 10. Partenaires
CREATE TABLE partenaire (
    id_partenaire INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    secteur VARCHAR(100),
    ville VARCHAR(100),
    site_web VARCHAR(255),
    logo VARCHAR(500),
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Compétences
CREATE TABLE utilisateur_competence (
    id_user INT,
    competence VARCHAR(100),
    niveau ENUM('DEBUTANT', 'INTERMEDIAIRE', 'AVANCE', 'EXPERT'),
    PRIMARY KEY (id_user, competence),
    FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
);

-- 12. Groupes
CREATE TABLE groupe (
    id_groupe INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    description TEXT,
    avatar VARCHAR(500),
    id_createur INT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_createur) REFERENCES utilisateur(id_user) ON DELETE SET NULL
);

-- 13. Utilisateurs Groupes
CREATE TABLE utilisateur_groupe (
    id_user INT,
    id_groupe INT,
    role ENUM('ADMIN', 'MEMBRE') DEFAULT 'MEMBRE',
    PRIMARY KEY (id_user, id_groupe),
    FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_groupe) REFERENCES groupe(id_groupe) ON DELETE CASCADE
);

-- 14. Seed Data (Admin et Alumni par défaut)
INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role, est_verifie) VALUES
('Admin', 'System', 'admin@supnum.mr', '$2a$10$N9qo8uLOickgx2ZMRZoMye3YkG6k.ZMhQ7pL6YpM3eGd3cJN1TJvK', 'ADMIN', TRUE),
('Ahmed', 'Mohamed', 'ahmed@supnum.mr', '$2a$10$N9qo8uLOickgx2ZMRZoMye3YkG6k.ZMhQ7pL6YpM3eGd3cJN1TJvK', 'ALUMNI', TRUE);

INSERT INTO alumni (id_user, supnum_id, annee_diplome, specialite) 
SELECT id_user, '2Y001', 2022, 'Génie Logiciel' FROM utilisateur WHERE email = 'ahmed@supnum.mr';