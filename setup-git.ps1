# Git 저장소 설정 및 한글 경로 문제 해결 스크립트
# PowerShell 인코딩 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

# Git 전역 설정 (한글 경로 지원)
git config --global core.quotepath false
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8
git config --global core.autocrlf true

# 현재 디렉토리 확인
$currentDir = Get-Location
Write-Host "현재 디렉토리: $currentDir" -ForegroundColor Green

# Git 저장소 초기화 (이미 있으면 스킵)
if (-not (Test-Path ".git")) {
    Write-Host "Git 저장소 초기화 중..." -ForegroundColor Yellow
    git init
    Write-Host "Git 저장소가 초기화되었습니다." -ForegroundColor Green
} else {
    Write-Host "Git 저장소가 이미 존재합니다." -ForegroundColor Green
}

# 원격 저장소 확인
$remote = git remote -v
if ($remote) {
    Write-Host "원격 저장소:" -ForegroundColor Cyan
    Write-Host $remote
} else {
    Write-Host "원격 저장소가 설정되지 않았습니다." -ForegroundColor Yellow
    Write-Host "원격 저장소를 설정하려면 다음 명령을 사용하세요:" -ForegroundColor Yellow
    Write-Host "git remote add origin <저장소_URL>" -ForegroundColor Yellow
}

Write-Host "`n설정이 완료되었습니다!" -ForegroundColor Green


