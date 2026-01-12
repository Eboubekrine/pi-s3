@echo off
echo ========================================
echo    Démarrage du Backend (Serveur)
echo ========================================
echo.

cd /d "%~dp0"

REM Vérifier si node_modules existe
if not exist "node_modules\" (
    echo Installation des dépendances...
    call npm install
    echo.
)

echo Démarrage du serveur sur http://localhost:5000
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.

npm run dev
