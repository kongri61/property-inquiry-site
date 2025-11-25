@echo off
chcp 65001 >nul
echo ========================================
echo 즉시 배포 시작
echo ========================================
echo.

cd /d "%~dp0"

powershell.exe -ExecutionPolicy Bypass -File "deploy-now.ps1"

pause

