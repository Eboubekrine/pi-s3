-- SCRIPT DE MIGRATION POUR ALWAYSDATA
-- Ce script ajoute les colonnes nécessaires pour la messagerie et les groupes

-- 1. Mise à jour de la table 'message'
ALTER TABLE `message` 
    ADD COLUMN IF NOT EXISTS `id_groupe` INT DEFAULT NULL AFTER `id_destinataire`,
    ADD COLUMN IF NOT EXISTS `image_url` VARCHAR(500) DEFAULT NULL AFTER `id_groupe`,
    MODIFY COLUMN `contenu` TEXT;

-- 2. Ajout de la clé étrangère (OPTIONNEL - Ignorer si erreur)
-- ALTER TABLE `message`
--     ADD CONSTRAINT `fk_msg_grp_final` 
--     FOREIGN KEY (`id_groupe`) REFERENCES `groupe`(`id_groupe`) ON DELETE SET NULL;

-- 3. Mise à jour de la table 'offre' (pour les lieux)
ALTER TABLE `offre` 
    ADD COLUMN IF NOT EXISTS `lieu` VARCHAR(100) DEFAULT NULL;

-- 4. Vérification de la table 'utilisateur' (pour les avatars)
ALTER TABLE `utilisateur`
    ADD COLUMN IF NOT EXISTS `avatar` VARCHAR(255) DEFAULT NULL;
