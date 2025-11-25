# Git 저장소 초기화 및 자동 배포 설정 스크립트
# 한글 경로 문제 해결 포함

# PowerShell 인코딩 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Git 저장소 초기화 및 자동 배포 설정" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Git 전역 설정 (한글 경로 지원)
Write-Host "Git 전역 설정 중..." -ForegroundColor Yellow
git config --global core.quotepath false
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8
git config --global core.autocrlf true

# 현재 디렉토리 확인
$currentDir = Get-Location
Write-Host "현재 디렉토리: $currentDir`n" -ForegroundColor Green

# Git 저장소 초기화
if (-not (Test-Path ".git")) {
    Write-Host "Git 저장소 초기화 중..." -ForegroundColor Yellow
    git init
    Write-Host "Git 저장소가 초기화되었습니다.`n" -ForegroundColor Green
} else {
    Write-Host "Git 저장소가 이미 존재합니다.`n" -ForegroundColor Green
}

# 원격 저장소 확인
Write-Host "원격 저장소 확인 중..." -ForegroundColor Yellow
$remote = git remote -v 2>$null
if ($remote) {
    Write-Host "원격 저장소:" -ForegroundColor Cyan
    Write-Host $remote
    Write-Host ""
} else {
    Write-Host "원격 저장소가 설정되지 않았습니다." -ForegroundColor Yellow
    Write-Host "원격 저장소를 설정하려면 다음 명령을 사용하세요:" -ForegroundColor Yellow
    Write-Host "  git remote add origin <저장소_URL>`n" -ForegroundColor White
}

# .gitignore 확인
if (Test-Path ".gitignore") {
    Write-Host ".gitignore 파일이 존재합니다.`n" -ForegroundColor Green
} else {
    Write-Host ".gitignore 파일이 없습니다.`n" -ForegroundColor Yellow
}

# 변경사항 확인
Write-Host "변경사항 확인 중...`n" -ForegroundColor Yellow
$status = git status --porcelain 2>&1
if ($status -and $status -notmatch "fatal") {
    $fileCount = ($status | Measure-Object -Line).Lines
    Write-Host "추적되지 않은 파일: $fileCount 개`n" -ForegroundColor Cyan
    
    # 주요 파일만 표시
    $status | Select-String -Pattern "^\?\?" | Select-Object -First 10 | ForEach-Object {
        $fileName = ($_ -split "\s+")[1]
        Write-Host "  - $fileName" -ForegroundColor Gray
    }
    if ($fileCount -gt 10) {
        Write-Host "  ... 및 $($fileCount - 10) 개 더" -ForegroundColor Gray
    }
    Write-Host ""
} else {
    Write-Host "커밋할 변경사항이 없거나 모든 파일이 이미 추적되고 있습니다.`n" -ForegroundColor Yellow
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "설정 완료!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "다음 단계:" -ForegroundColor Yellow
Write-Host "1. 원격 저장소 설정 (필요시):" -ForegroundColor White
Write-Host "   git remote add origin <저장소_URL>" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 자동 배포 실행:" -ForegroundColor White
Write-Host "   .\auto-deploy.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 파일 변경 감시 모드:" -ForegroundColor White
Write-Host "   .\watch-and-deploy.ps1" -ForegroundColor Gray
Write-Host ""

