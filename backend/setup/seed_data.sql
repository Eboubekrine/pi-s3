-- 1. Seeding Haute Qualité pour SupNum Connect
-- Attention : Assurez-vous que l'Admin (ID 1) existe déjà

-- 2. Événements avec de vraies images Unsplash
INSERT INTO evenement (titre, description, date_evenement, lieu, image, id_organisateur) VALUES
('Sommet de l''IA en Mauritanie 2026', 'Le plus grand rassemblement tech de l''année. Keynotes sur les LLM et le futur du travail.', '2026-05-20', 'Palais des Congrès, Nouakchott', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000', 1),
('Atelier Développement Cloud Native', 'Séance pratique sur Docker, Kubernetes et AWS pour les étudiants et diplômés.', '2026-06-15', 'Labo Silicon, SupNum', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000', 1),
('Hackathon FinTech Africa', '48 heures pour transformer le secteur bancaire avec des solutions innovantes.', '2026-07-05', 'Espace Technopole', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000', 1);

-- 3. Offres de haute qualité
INSERT INTO offre (titre, description, entreprise, type_offre, lieu, id_user) VALUES
('Développeur React/Node Senior', 'Rejoignez une équipe dynamique pour construire la plateforme du futur.', 'TechSolutions MR', 'EMPLOI', 'Nouakchott / Hybride', 1),
('Stage Data Scientist (LLM)', 'Opportunité unique de travailler sur le traitement du langage naturel en Arabe/Hassanya.', 'Innovate Labs', 'STAGE', 'Nouadhibou', 1),
('Alternance DevOps & SRE', 'Apprenez à gérer des infrastructures à grande échelle avec nos experts.', 'FinTech Hub', 'ALTERNANCE', 'Remote', 1);

-- 4. Partenaires stratégiques
INSERT INTO partenaire (nom, secteur, ville, site_web, logo) VALUES
('Chinguitel', 'Télécoms', 'Nouakchott', 'https://www.chinguitel.mr', 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Chinguitel_Logo.png'),
('SmartData RIM', 'Data Science', 'Nouadhibou', 'https://www.smartdata.mr', 'https://images.unsplash.com/photo-1551288049-bbda38656a93?auto=format&fit=crop&q=80&w=300'),
('Banque de Mauritanie', 'Finance', 'Nouakchott', 'https://www.bpm.mr', 'https://images.unsplash.com/photo-1611095973763-4140195a24c9?auto=format&fit=crop&q=80&w=300');

-- 5. Notifications tests
INSERT INTO notification (id_user, type, contenu, lien) VALUES
(1, 'INFO', 'Bienvenue sur la nouvelle version de SupNum Connect ! Explorez les événements.', '/dashboard/events'),
(1, 'ALERTE', 'Votre profil est à 80% complet. Ajoutez une bio.', '/dashboard/profile');
