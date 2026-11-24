@echo off
echo ========================================================
echo Pushing SmartPark Cloud to GitHub (laxmihulloli2025)
echo ========================================================
cd /d "%~dp0"
git branch -M main
git push -u origin main
echo ========================================================
echo Done! If prompted, authenticate in the Git browser window.
echo ========================================================
pause
