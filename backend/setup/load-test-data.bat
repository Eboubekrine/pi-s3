@echo off
REM Script pour charger les données de test dans supnum_alumni
REM Usage: Double-cliquez sur ce fichier

echo ========================================
echo    Chargement des données de test
echo ========================================
echo.
echo ATTENTION: Ce script va SUPPRIMER toutes les données existantes
echo et les remplacer par des données de test.
echo.
echo Comptes créés (mot de passe: password123):
echo - admin@supnum.mr (ADMIN)
echo - ahmed@supnum.mr (STUDENT) - Utilisateur principal pour tests
echo - Et 6 autres utilisateurs...
echo.
pause

echo.
echo Connexion à MySQL...
mysql -u root -p alumni_supnum < test-data.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo    SUCCÈS! Données de test chargées
    echo ========================================
    echo.
    echo Connectez-vous avec:
    echo   Email: ahmed@supnum.mr
    echo   Mot de passe: password123
    echo.
    echo Vous verrez:
    echo - 2 requêtes d'ami en attente
    echo - 3 groupes avec plusieurs membres
    echo - Des messages de test
) else (
    echo.
    echo ERREUR: Le chargement a échoué
    echo Vérifiez que MySQL est démarré et que vous avez le bon mot de passe
)

echo.
pause
