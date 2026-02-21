-- 1. Seeding Data for SupNum Alumni App
-- Events, Job Offers, and Partners

-- 2. Add high-quality events
-- IMPORTANT: Update id_organisateur to valid id_user if needed (1 is usually Admin)

INSERT INTO evenement (titre, description, date_debut, lieu, image_url, id_organisateur) VALUES
('Conférence Intelligence Artificielle 2026', 'Découvrez les dernières avancées en IA générative et LLM. Une journée de talks avec des experts internationaux.', '2026-05-15', 'Amphi Main, SupNum', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000', 1),
('Atelier Web3 & Blockchain', 'Apprenez à développer des Smart Contracts avec Solidity. Workshop pratique pour débutants et intermédiaires.', '2026-06-10', 'Labo 2, SupNum', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000', 1),
('Coding Bootcamp: React & Node.js', '3 jours intensifs pour maîtriser le stack MERN. Projets réels et mentorat personnalisé.', '2026-07-20', 'Espace Coworking', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000', 1);

-- 3. Add high-quality offers
INSERT INTO offre (titre, description, entreprise, type_offre, lieu, id_user) VALUES
('Développeur Fullstack React/Node', 'Nous recherchons un stagiaire passionné par le web pour rejoindre notre équipe agile.', 'TechSolutions Mauritanie', 'STAGE', 'Nouakchott (Remote partial)', 1),
('Data Scientist Junior', 'Participation à l analyse de données massives pour des projets de smart city.', 'SmartData MR', 'EMPLOI', 'Nouadhibou', 1),
('Développeur Mobile Flutter', 'Création d applications mobiles innovantes pour le secteur financier.', 'FinTech Africa', 'ALTERNANCE', 'Nouakchott', 1);

-- 4. Add partners/companies
-- Check if table exists, else create it
CREATE TABLE IF NOT EXISTS partenaire (
    id_partenaire INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    description TEXT,
    secteur VARCHAR(100),
    logo_url VARCHAR(500),
    site_web VARCHAR(255),
    id_user INT,
    FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE SET NULL
);

INSERT INTO partenaire (nom, description, secteur, logo_url, site_web) VALUES
('Chinguitel', 'Opérateur de télécommunications majeur en Mauritanie, offrant des services mobiles et internet de pointe.', 'Téléphonie', 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Chinguitel_Logo.png', 'https://www.chinguitel.mr'),
('Mattel', 'Premier opérateur de téléphonie mobile en Mauritanie, Mattel accompagne la transformation numérique du pays.', 'Télécoms', 'https://www.mattel.mr/sites/all/themes/mattel/logo.png', 'https://www.mattel.mr'),
('Banque Populaire de Mauritanie', 'Acteur clé du secteur financier, la BPM investit massivement dans la fintech et le digital banking.', 'Banque & Finance', 'https://bpm.mr/assets/images/logo.png', 'https://bpm.mr');
