-- Script de données de test pour l'application Alumni Network
-- Exécutez ce script APRÈS avoir créé la base de données avec init-db.js

USE supnum_alumni;

-- Nettoyer les données existantes (ATTENTION: cela supprime TOUTES les données)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE message;
TRUNCATE TABLE utilisateur_groupe;
TRUNCATE TABLE groupe;
TRUNCATE TABLE amis;
TRUNCATE TABLE alumni;
TRUNCATE TABLE utilisateur;
SET FOREIGN_KEY_CHECKS = 1;

-- Créer des utilisateurs de test (mot de passe pour tous: "password123")
-- Hash bcrypt de "password123": $2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa

-- 1. Admin
INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role) VALUES
('Admin', 'SupNum', 'admin@supnum.mr', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'ADMIN');

-- 2-3. Alumni
INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role) VALUES
('Diallo', 'Mamadou', 'mamadou@supnum.mr', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'ALUMNI'),
('Ba', 'Fatima', 'fatima@supnum.mr', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'ALUMNI');

-- 4-8. Étudiants
INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role) VALUES
('Kane', 'Ahmed', 'ahmed@supnum.mr', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'STUDENT'),
('Sow', 'Aissata', 'aissata@supnum.mr', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'STUDENT'),
('Camara', 'Ibrahim', 'ibrahim@supnum.mr', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'STUDENT'),
('Ly', 'Mariam', 'mariam@supnum.mr', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'STUDENT'),
('Sy', 'Oumar', 'oumar@supnum.mr', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'STUDENT');

-- Ajouter des profils Alumni
INSERT INTO alumni (id_user, annee_diplome, specialite, entreprise_actuelle, poste, linkedin) VALUES
(2, 2020, 'Génie Logiciel', 'Mauritanie Tech', 'Senior Developer', 'https://linkedin.com/in/mamadou'),
(3, 2019, 'Réseaux et Sécurité', 'SecureNet MR', 'Security Analyst', 'https://linkedin.com/in/fatima');

-- Créer des relations d'amis
-- Relations acceptées (amis confirmés)
INSERT INTO amis (id_demandeur, id_receveur, statut, date_demande) VALUES
(2, 3, 'ACCEPTE', DATE_SUB(NOW(), INTERVAL 10 DAY)),  -- Mamadou & Fatima sont amis
(4, 5, 'ACCEPTE', DATE_SUB(NOW(), INTERVAL 5 DAY)),   -- Ahmed & Aissata sont amis
(2, 4, 'ACCEPTE', DATE_SUB(NOW(), INTERVAL 3 DAY));   -- Mamadou & Ahmed sont amis

-- Requêtes en attente (à accepter/rejeter)
INSERT INTO amis (id_demandeur, id_receveur, statut, date_demande) VALUES
(6, 4, 'EN_ATTENTE', DATE_SUB(NOW(), INTERVAL 2 DAY)),  -- Ibrahim a envoyé une requête à Ahmed
(7, 4, 'EN_ATTENTE', DATE_SUB(NOW(), INTERVAL 1 DAY)),  -- Mariam a envoyé une requête à Ahmed
(5, 6, 'EN_ATTENTE', NOW());                             -- Aissata a envoyé une requête à Ibrahim

-- Créer des groupes
INSERT INTO groupe (nom, description, id_createur, date_creation) VALUES
('Promo 2024', 'Groupe des étudiants de la promotion 2024', 4, DATE_SUB(NOW(), INTERVAL 7 DAY)),
('Alumni Network', 'Réseau des anciens diplômés', 2, DATE_SUB(NOW(), INTERVAL 15 DAY)),
('Projet GL', 'Groupe de travail Génie Logiciel', 5, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Ajouter des membres aux groupes
-- Groupe 1 "Promo 2024" (id_groupe = 1)
INSERT INTO utilisateur_groupe (id_user, id_groupe) VALUES
(4, 1),  -- Ahmed (créateur)
(5, 1),  -- Aissata
(6, 1),  -- Ibrahim
(7, 1);  -- Mariam

-- Groupe 2 "Alumni Network" (id_groupe = 2)
INSERT INTO utilisateur_groupe (id_user, id_groupe) VALUES
(2, 2),  -- Mamadou (créateur)
(3, 2),  -- Fatima
(4, 2);  -- Ahmed

-- Groupe 3 "Projet GL" (id_groupe = 3)
INSERT INTO utilisateur_groupe (id_user, id_groupe) VALUES
(5, 3),  -- Aissata (créateur)
(4, 3),  -- Ahmed
(6, 3);  -- Ibrahim

-- Ajouter quelques messages dans les groupes
-- Messages dans "Promo 2024"
INSERT INTO message (id_expediteur, id_groupe, contenu, date_envoi) VALUES
(4, 1, 'Bienvenue dans le groupe Promo 2024!', DATE_SUB(NOW(), INTERVAL 7 DAY)),
(5, 1, 'Merci Ahmed! Content de faire partie de ce groupe.', DATE_SUB(NOW(), INTERVAL 6 DAY)),
(6, 1, 'Quand est-ce qu on organise notre première réunion?', DATE_SUB(NOW(), INTERVAL 5 DAY));

-- Messages dans "Alumni Network"
INSERT INTO message (id_expediteur, id_groupe, contenu, date_envoi) VALUES
(2, 2, 'Bienvenue aux anciens! Partageons nos expériences.', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(3, 2, 'Excellente initiative Mamadou!', DATE_SUB(NOW(), INTERVAL 14 DAY));

-- Messages privés (one-to-one)
INSERT INTO message (id_expediteur, id_destinataire, contenu, date_envoi) VALUES
(4, 5, 'Salut Aissata, tu as fini le projet?', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(5, 4, 'Oui, je viens de le terminer. Tu veux qu on révise ensemble?', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(2, 4, 'Ahmed, j aimerais discuter de ton projet de fin d études.', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Créer quelques événements
INSERT INTO evenement (titre, description, date_evenement, lieu, id_organisateur) VALUES
('Conférence Tech 2024', 'Grande conférence sur les nouvelles technologies', DATE_ADD(NOW(), INTERVAL 30 DAY), 'Salle de Conférence SupNum', 2),
('Hackathon SupNum', 'Compétition de programmation 24h', DATE_ADD(NOW(), INTERVAL 15 DAY), 'Campus SupNum', 1),
('Meetup Alumni', 'Rencontre informelle des anciens', DATE_ADD(NOW(), INTERVAL 7 DAY), 'Café Le Sahel', 3);

-- Afficher un résumé
SELECT 'RÉSUMÉ DES DONNÉES DE TEST' as '';
SELECT COUNT(*) as 'Utilisateurs créés' FROM utilisateur;
SELECT COUNT(*) as 'Relations amis (acceptées)' FROM amis WHERE statut = 'ACCEPTE';
SELECT COUNT(*) as 'Requêtes en attente' FROM amis WHERE statut = 'EN_ATTENTE';
SELECT COUNT(*) as 'Groupes créés' FROM groupe;
SELECT COUNT(*) as 'Messages (groupes)' FROM message WHERE id_groupe IS NOT NULL;
SELECT COUNT(*) as 'Messages (privés)' FROM message WHERE id_destinataire IS NOT NULL;
SELECT COUNT(*) as 'Événements' FROM evenement;

-- Afficher les comptes de test
SELECT '' as '';
SELECT 'COMPTES DE TEST - Mot de passe pour tous: password123' as '';
SELECT id_user, CONCAT(prenom, ' ', nom) as Nom, email, role FROM utilisateur ORDER BY role, id_user;
