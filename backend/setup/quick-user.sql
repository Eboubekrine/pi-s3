-- Script ultra-simple pour créer UN utilisateur test
USE alumni_supnum;

-- Supprimer l'utilisateur s'il existe déjà
DELETE FROM utilisateur WHERE email = 'test@supnum.mr';

-- Créer l'utilisateur (mot de passe: password123)
INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role) 
VALUES ('Test', 'User', 'test@supnum.mr', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'STUDENT');

-- Afficher tous les utilisateurs
SELECT id_user, nom, prenom, email, role FROM utilisateur;
