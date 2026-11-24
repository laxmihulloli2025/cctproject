@echo off
echo ========================================================
echo Pushing SmartPark Cloud to https://github.com/laxmihulloli2025/cctproject.git
echo ========================================================
cd /d "%~dp0"
git branch -M main
git remote set-url origin https://github.com/laxmihulloli2025/cctproject.git
git push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Normal push had conflicts with remote. Forcing push to sync code...
    git push -u origin main --force
)
echo ========================================================
echo Push completed!
echo Repository: https://github.com/laxmihulloli2025/cctproject
echo ========================================================
pause
