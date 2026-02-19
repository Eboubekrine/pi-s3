-- Script simple pour créer UN utilisateur de test
-- Exécutez ce script dans MySQL Workbench

USE supnum_alumni;

-- Créer un utilisateur de test
-- Mot de passe: password123
-- Hash bcrypt de "password123"
INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role) VALUES
('Test', 'User', 'test@supnum.mr', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'STUDENT');

-- Vérifier que l'utilisateur a été créé
SELECT id_user, nom, prenom, email, role FROM utilisateur WHERE email = 'test@supnum.mr';
