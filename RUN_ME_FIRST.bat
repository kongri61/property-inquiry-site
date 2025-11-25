@echo off
chcp 65001 >nul
echo ========================================
echo Git 저장소 초기화 및 자동 배포 설정
echo ========================================
echo.

cd /d "%~dp0"

echo 현재 디렉토리: %CD%
echo.

echo PowerShell 스크립트 실행 중...
powershell.exe -ExecutionPolicy Bypass -File "setup-git.ps1"

echo.
echo ========================================
echo 설정 완료!
echo ========================================
echo.
echo 다음 단계:
echo 1. 원격 저장소 연결 (필요시):
echo    git remote add origin ^<저장소_URL^>
echo.
echo 2. 자동 배포 실행:
echo    auto-deploy.bat
echo.
pause

