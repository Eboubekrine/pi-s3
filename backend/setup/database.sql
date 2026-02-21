-- 1. إنشاء قاعدة البيانات (قم بتعطيل هذه الأسطر في Alwaysdata/Vercel)
-- CREATE DATABASE IF NOT EXISTS supnum_alumni;
-- USE supnum_alumni;

-- 2. إعادة ضبط الجداول (Reset Tables)
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS candidature;
DROP TABLE IF EXISTS partenaire;
DROP TABLE IF EXISTS utilisateur_groupe;
DROP TABLE IF EXISTS groupe;
DROP TABLE IF EXISTS connexion;
DROP TABLE IF EXISTS evenement;
DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS offre;
DROP TABLE IF EXISTS alumni;
DROP TABLE IF EXISTS utilisateur;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS utilisateur (
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
    date_naissance DATE,
    cv_url VARCHAR(500),
    statut_professionnel VARCHAR(100),
    poste VARCHAR(150),
    entreprise VARCHAR(150),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    facebook VARCHAR(255),
    ville VARCHAR(100),
    pays VARCHAR(100),
    est_verifie BOOLEAN DEFAULT FALSE,
    est_actif BOOLEAN DEFAULT TRUE
);

-- 3. جدول الخريجين
CREATE TABLE IF NOT EXISTS alumni (
    id_alumni INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT UNIQUE,
    supnum_id VARCHAR(20) UNIQUE,
    annee_diplome INT,
    specialite VARCHAR(100),
    promotion VARCHAR(50),
    entreprise_actuelle VARCHAR(150),
    poste_actuel VARCHAR(150),
    poste VARCHAR(150),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    facebook VARCHAR(255),
    localisation VARCHAR(255),
    disponible_mentorat BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
);


-- 6. جدول العروض (وظائف/تدريبات)
CREATE TABLE IF NOT EXISTS offre (
    id_offre INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    description TEXT,
    entreprise VARCHAR(150),
    type_offre ENUM('STAGE', 'EMPLOI', 'ALTERNANCE', 'FREELANCE'),
    type_contrat VARCHAR(50),
    lieu VARCHAR(150),
    salaire_min DECIMAL(10,2),
    salaire_max DECIMAL(10,2),
    date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_expiration DATE,
    est_active BOOLEAN DEFAULT TRUE,
    id_user INT,
    FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE SET NULL
);

-- 7. جدول الرسائل
CREATE TABLE IF NOT EXISTS message (
    id_message INT AUTO_INCREMENT PRIMARY KEY,
    contenu TEXT NOT NULL,
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    est_lu BOOLEAN DEFAULT FALSE,
    id_expediteur INT,
    id_destinataire INT,
    id_groupe INT,
    FOREIGN KEY (id_expediteur) REFERENCES utilisateur(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_destinataire) REFERENCES utilisateur(id_user) ON DELETE CASCADE
);

-- 8. جدول المجموعات
CREATE TABLE IF NOT EXISTS groupe (
    id_groupe INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    description TEXT,
    avatar VARCHAR(500),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_createur INT,
    est_prive BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_createur) REFERENCES utilisateur(id_user) ON DELETE SET NULL
);

-- 9. جدول أعضاء المجموعات
CREATE TABLE IF NOT EXISTS utilisateur_groupe (
    id_user INT,
    id_groupe INT,
    role ENUM('ADMIN', 'MODERATEUR', 'MEMBRE') DEFAULT 'MEMBRE',
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_user, id_groupe),
    FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_groupe) REFERENCES groupe(id_groupe) ON DELETE CASCADE
);

-- 10. جدول الأحداث
CREATE TABLE IF NOT EXISTS evenement (
    id_evenement INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    description TEXT,
    type_evenement VARCHAR(50),
    date_debut DATE,
    date_fin DATE,
    lieu VARCHAR(150),
    image_url VARCHAR(500),
    capacite_max INT,
    est_actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_organisateur INT,
    FOREIGN KEY (id_organisateur) REFERENCES utilisateur(id_user) ON DELETE SET NULL
);

-- 11. جدول الصداقات/الاتصالات
CREATE TABLE IF NOT EXISTS connexion (
    id_demandeur INT,
    id_receveur INT,
    statut ENUM('EN_ATTENTE', 'ACCEPTE', 'BLOQUE', 'SUPPRIME') DEFAULT 'EN_ATTENTE',
    date_demande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_reponse TIMESTAMP NULL,
    PRIMARY KEY (id_demandeur, id_receveur),
    FOREIGN KEY (id_demandeur) REFERENCES utilisateur(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_receveur) REFERENCES utilisateur(id_user) ON DELETE CASCADE
);


-- 13. إنشاء مستخدم المدير (كلمة المرور: Admin123!)
INSERT IGNORE INTO utilisateur (nom, prenom, email, mot_de_passe, role, est_verifie) VALUES
('Admin', 'System', 'admin@supnum.mr', '$2a$10$N9qo8uLOickgx2ZMRZoMye3YkG6k.ZMhQ7pL6YpM3eGd3cJN1TJvK', 'ADMIN', TRUE);

-- 14. إنشاء خريج تجريبي (كلمة المرور: Password123)
INSERT IGNORE INTO utilisateur (nom, prenom, email, mot_de_passe, role, est_verifie) VALUES
('Ahmed', 'Mohamed', 'ahmed@supnum.mr', '$2a$10$N9qo8uLOickgx2ZMRZoMye3YkG6k.ZMhQ7pL6YpM3eGd3cJN1TJvK', 'ALUMNI', TRUE);

INSERT IGNORE INTO alumni (id_user, supnum_id, annee_diplome, specialite) 
SELECT id_user, '2Y001', 2022, 'Informatique' FROM utilisateur WHERE email = 'ahmed@supnum.mr';