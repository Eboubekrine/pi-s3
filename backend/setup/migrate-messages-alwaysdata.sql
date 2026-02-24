-- SCRIPT DE SECOURS (SAFE) - Exécutez ce script dans Alwaysdata
-- Ce script ajoute uniquement les colonnes nécessaires sans toucher aux contraintes qui bloquent.

-- 1. Mise à jour de la table 'message'
ALTER TABLE `message` 
    ADD COLUMN IF NOT EXISTS `id_groupe` INT DEFAULT NULL AFTER `id_destinataire`,
    ADD COLUMN IF NOT EXISTS `image_url` VARCHAR(500) DEFAULT NULL AFTER `id_groupe`;

ALTER TABLE `message` MODIFY COLUMN `contenu` TEXT;

-- 2. Mise à jour des autres tables
ALTER TABLE `offre` 
    ADD COLUMN IF NOT EXISTS `lieu` VARCHAR(100) DEFAULT NULL;

ALTER TABLE `utilisateur`
    ADD COLUMN IF NOT EXISTS `avatar` VARCHAR(255) DEFAULT NULL;
