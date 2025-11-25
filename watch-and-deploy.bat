@echo off
chcp 65001 >nul
echo 파일 변경 감시 및 자동 배포 시작...
echo 종료하려면 Ctrl+C를 누르세요.
echo.

cd /d "%~dp0"

powershell.exe -ExecutionPolicy Bypass -File "watch-and-deploy.ps1"

pause

