-- 1. Nettoyage des anciennes données
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM notification;
DELETE FROM candidature;
DELETE FROM partenaire;
DELETE FROM evenement;
DELETE FROM offre;
DELETE FROM amis;
DELETE FROM alumni;
-- On garde uniquement l'admin et l'alumni par défaut
DELETE FROM utilisateur WHERE email NOT IN ('admin@supnum.mr', 'ahmed@supnum.mr');

SET FOREIGN_KEY_CHECKS = 1;

-- 2. Ajout des nouveaux utilisateurs (Etudiants et Alumni)
-- Password: Password123
INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role, est_verifie, ville, bio, avatar) VALUES
('Sidi', 'Mohamed', 'sidi@supnum.mr', '$2a$10$N9qo8uLOickgx2ZMRZoMye3YkG6k.ZMhQ7pL6YpM3eGd3cJN1TJvK', 'STUDENT', TRUE, 'Nouakchott', 'Étudiant passionné par la cybersécurité.', 'https://i.pravatar.cc/150?u=sidi'),
('Fatimetou', 'Zahra', 'fatima@supnum.mr', '$2a$10$N9qo8uLOickgx2ZMRZoMye3YkG6k.ZMhQ7pL6YpM3eGd3cJN1TJvK', 'ALUMNI', TRUE, 'Nouadhibou', 'Développeuse Fullstack chez MauriTech.', 'https://i.pravatar.cc/150?u=fatima'),
('Mariem', 'Saleh', 'mariem@supnum.mr', '$2a$10$N9qo8uLOickgx2ZMRZoMye3YkG6k.ZMhQ7pL6YpM3eGd3cJN1TJvK', 'STUDENT', TRUE, 'Nouakchott', 'Future data scientist.', 'https://i.pravatar.cc/150?u=mariem');

-- 3. Profils Alumni (Utilisation de sous-requêtes pour les IDs)
INSERT INTO alumni (id_user, supnum_id, annee_diplome, specialite, entreprise_actuelle, poste_actuel)
SELECT id_user, '2Y005', 2023, 'Développement Web', 'MauriTech', 'Lead Developer' 
FROM utilisateur WHERE email = 'fatima@supnum.mr';

-- 4. Événements
INSERT INTO evenement (titre, description, date_evenement, lieu, image, type, id_organisateur)
SELECT 'Tech Days Nouakchott', 'Une série de conférences sur les nouvelles technologies en Mauritanie.', '2026-04-10', 'Palais des Congrès', 'https://images.unsplash.com/photo-1540575861501-7ad0582373f3?auto=format&fit=crop&q=80&w=1000', 'Event', id_user
FROM utilisateur WHERE email = 'admin@supnum.mr'
UNION ALL
SELECT 'Workshop Cybersecurity', 'Apprenez les bases de la défense contre les cyberattaques avec des experts.', '2026-05-02', 'Salle 102, SupNum', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000', 'Challenge', id_user
FROM utilisateur WHERE email = 'admin@supnum.mr'
UNION ALL
SELECT 'Pitch Your Startup', 'Présentez vos idées de startups devant un jury d''investisseurs.', '2026-06-12', 'CCI Mauritanie', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1000', 'Contest', id_user
FROM utilisateur WHERE email = 'admin@supnum.mr';

-- 5. Offres
INSERT INTO offre (titre, description, entreprise, type_offre, lieu, id_user)
SELECT 'Ingénieur Système & Réseaux', 'Maintenance et évolution de notre infrastructure Cloud.', 'Mauritel', 'EMPLOI', 'Nouakchott', id_user
FROM utilisateur WHERE email = 'admin@supnum.mr'
UNION ALL
SELECT 'Stage Mobile Flutter', 'Développement d’une application de livraison locale.', 'E-Boutique', 'STAGE', 'Remote', id_user
FROM utilisateur WHERE email = 'admin@supnum.mr'
UNION ALL
SELECT 'Community Manager Tech', 'Gestion des réseaux sociaux pour une startup innovante.', 'MauriMarketing', 'ALTERNANCE', 'Nouakchott', id_user
FROM utilisateur WHERE email = 'admin@supnum.mr';

-- 6. Partenaires
INSERT INTO partenaire (nom, secteur, ville, site_web, logo) VALUES
('Mauritel', 'Télécoms', 'Nouakchott', 'https://www.mauritel.mr', 'https://www.mauritel.mr/sites/all/themes/mauritel/logo.png'),
('Nouakchott Digital Center', 'Formation', 'Nouakchott', 'https://ndc.mr', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=300'),
('Startup Mauritanie', 'Innovation', 'Nouakchott', 'https://startup.mr', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=300');

-- 7. Relations (Amis) - IDs dynamiques pour éviter l'erreur #1452
INSERT INTO amis (id_demandeur, id_receveur, statut)
SELECT (SELECT id_user FROM utilisateur WHERE email = 'admin@supnum.mr'), (SELECT id_user FROM utilisateur WHERE email = 'ahmed@supnum.mr'), 'ACCEPTE'
UNION ALL
SELECT (SELECT id_user FROM utilisateur WHERE email = 'sidi@supnum.mr'), (SELECT id_user FROM utilisateur WHERE email = 'admin@supnum.mr'), 'ACCEPTE'
UNION ALL
SELECT (SELECT id_user FROM utilisateur WHERE email = 'fatima@supnum.mr'), (SELECT id_user FROM utilisateur WHERE email = 'sidi@supnum.mr'), 'EN_ATTENTE';

-- 8. Notifications
INSERT INTO notification (id_user, type, contenu, lien)
SELECT id_user, 'INFO', 'Nouveau workshop ajouté le 02 Mai !', '/dashboard/events'
FROM utilisateur WHERE email = 'sidi@supnum.mr'
UNION ALL
SELECT id_user, 'URGENT', 'Une offre d''emploi correspond à votre profil chez Mauritel.', '/dashboard/offers'
FROM utilisateur WHERE email = 'fatima@supnum.mr';
