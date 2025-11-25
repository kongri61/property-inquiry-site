@echo off
chcp 65001 >nul
echo 자동 배포 시작...
echo.

cd /d "%~dp0"

powershell.exe -ExecutionPolicy Bypass -File "auto-deploy.ps1"

pause

