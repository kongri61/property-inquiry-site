# 자동 배포 스크립트 (한글 경로 지원)
# PowerShell 인코딩 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

# Git 경로 찾기
$gitPath = "git"
if (Test-Path "C:\Program Files\Git\bin\git.exe") {
    $gitPath = "C:\Program Files\Git\bin\git.exe"
} elseif (Test-Path "C:\Program Files (x86)\Git\bin\git.exe") {
    $gitPath = "C:\Program Files (x86)\Git\bin\git.exe"
}

# Git 명령 실행 함수
function Invoke-Git {
    param([string[]]$Arguments)
    & $gitPath $Arguments
}

# Git 전역 설정 확인
Invoke-Git @("config", "--global", "core.quotepath", "false")
Invoke-Git @("config", "--global", "i18n.commitencoding", "utf-8")
Invoke-Git @("config", "--global", "i18n.logoutputencoding", "utf-8")

# 현재 디렉토리 확인
$currentDir = Get-Location
Write-Host "현재 디렉토리: $currentDir" -ForegroundColor Green

# Git 저장소 확인
if (-not (Test-Path ".git")) {
    Write-Host "오류: Git 저장소를 찾을 수 없습니다." -ForegroundColor Red
    Write-Host "먼저 'setup-git.ps1'을 실행하거나 'git init'을 실행하세요." -ForegroundColor Yellow
    exit 1
}

# 변경사항 확인
$status = Invoke-Git @("status", "--porcelain") 2>&1
if (-not $status) {
    Write-Host "커밋할 변경사항이 없습니다." -ForegroundColor Yellow
    # 푸시만 시도 (이미 커밋된 내용이 있을 수 있음)
    $branch = Invoke-Git @("branch", "--show-current")
    if (-not $branch) {
        $branch = "main"
    }
    $remote = Invoke-Git @("remote", "get-url", "origin") 2>$null
    if ($remote) {
        Write-Host "이미 커밋된 내용을 푸시합니다..." -ForegroundColor Yellow
        Invoke-Git @("push", "origin", $branch)
        if ($LASTEXITCODE -eq 0) {
            Write-Host "푸시가 완료되었습니다!" -ForegroundColor Green
        }
    }
    exit 0
}

# 변경사항 표시
Write-Host "`n변경된 파일:" -ForegroundColor Cyan
Invoke-Git @("status", "--short")

# 모든 변경사항 추가
Write-Host "`n변경사항을 스테이징 중..." -ForegroundColor Yellow
Invoke-Git @("add", "-A")

# 커밋 메시지 생성 (타임스탬프 포함)
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "자동 배포: $timestamp"

# 커밋
Write-Host "커밋 중..." -ForegroundColor Yellow
Invoke-Git @("commit", "-m", $commitMessage)

if ($LASTEXITCODE -ne 0) {
    Write-Host "커밋 실패 또는 커밋할 변경사항이 없습니다." -ForegroundColor Red
    exit 1
}

# 원격 저장소 확인
$remote = Invoke-Git @("remote", "get-url", "origin") 2>$null
if (-not $remote) {
    Write-Host "경고: 원격 저장소가 설정되지 않았습니다." -ForegroundColor Yellow
    Write-Host "원격 저장소를 설정하려면 다음 명령을 사용하세요:" -ForegroundColor Yellow
    Write-Host "git remote add origin <저장소_URL>" -ForegroundColor Yellow
    exit 0
}

# 현재 브랜치 확인
$branch = Invoke-Git @("branch", "--show-current")
if (-not $branch) {
    $branch = "main"
    Invoke-Git @("checkout", "-b", $branch) 2>$null
}

# 푸시
Write-Host "`n원격 저장소로 푸시 중..." -ForegroundColor Yellow
Invoke-Git @("push", "origin", $branch)

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n배포가 완료되었습니다!" -ForegroundColor Green
    Write-Host "커밋: $commitMessage" -ForegroundColor Cyan
    Write-Host "브랜치: $branch" -ForegroundColor Cyan
} else {
    Write-Host "`n푸시 실패. 원격 저장소 설정을 확인하세요." -ForegroundColor Red
    exit 1
}

