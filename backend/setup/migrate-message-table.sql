-- Migration: Ajouter les colonnes manquantes à la table message
-- Run this if you don't want to reset the entire database

-- Ajouter id_groupe si elle n'existe pas
ALTER TABLE message 
    ADD COLUMN IF NOT EXISTS id_groupe INT AFTER id_destinataire,
    ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) AFTER id_groupe;

-- Ajouter la clé étrangère pour id_groupe (ignorer si déjà existante)
ALTER TABLE message 
    MODIFY COLUMN contenu TEXT;

-- Ajouter la foreign key pour id_groupe
ALTER TABLE message
    ADD CONSTRAINT fk_message_groupe 
    FOREIGN KEY (id_groupe) REFERENCES groupe(id_groupe) ON DELETE CASCADE;
