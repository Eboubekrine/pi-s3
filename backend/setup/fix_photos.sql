-- Si 'id_groupe' existe déjà, c'est parfait. 
-- Vérifiez maintenant celle-ci qui est la plus IMPORTANTE pour les photos :

ALTER TABLE message ADD COLUMN image_url VARCHAR(500) DEFAULT NULL;

-- Et pour le profil, essayez ces colonnes une par une :
ALTER TABLE utilisateur ADD COLUMN telephone VARCHAR(20) DEFAULT NULL;
ALTER TABLE utilisateur ADD COLUMN date_naissance DATE DEFAULT NULL;
ALTER TABLE utilisateur ADD COLUMN bio TEXT DEFAULT NULL;
ALTER TABLE utilisateur ADD COLUMN localisation VARCHAR(255) DEFAULT NULL;
ALTER TABLE utilisateur ADD COLUMN linkedin VARCHAR(255) DEFAULT NULL;
ALTER TABLE utilisateur ADD COLUMN github VARCHAR(255) DEFAULT NULL;
ALTER TABLE utilisateur ADD COLUMN facebook VARCHAR(255) DEFAULT NULL;
ALTER TABLE utilisateur ADD COLUMN entreprise VARCHAR(255) DEFAULT NULL;
ALTER TABLE utilisateur ADD COLUMN poste VARCHAR(255) DEFAULT NULL;
