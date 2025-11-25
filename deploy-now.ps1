# 즉시 배포 스크립트 - 프로젝트 디렉토리에서 실행
# PowerShell 인코딩 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

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
    $result = & $gitPath $Arguments 2>&1
    return $result
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "즉시 배포 시작" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 현재 디렉토리 확인
$currentDir = Get-Location
Write-Host "작업 디렉토리: $currentDir`n" -ForegroundColor Green

# Git 저장소 확인
if (-not (Test-Path ".git")) {
    Write-Host "Git 저장소를 초기화합니다..." -ForegroundColor Yellow
    Invoke-Git @("init") | Out-Null
    Write-Host "Git 저장소가 초기화되었습니다.`n" -ForegroundColor Green
}

# Git 설정
Invoke-Git @("config", "--global", "core.quotepath", "false") | Out-Null
Invoke-Git @("config", "--global", "i18n.commitencoding", "utf-8") | Out-Null
Invoke-Git @("config", "--global", "i18n.logoutputencoding", "utf-8") | Out-Null

# 변경사항 확인
Write-Host "변경사항 확인 중...`n" -ForegroundColor Yellow
$status = Invoke-Git @("status", "--porcelain")

if (-not $status -or ($status -is [System.Array] -and $status.Count -eq 0)) {
    Write-Host "커밋할 변경사항이 없습니다.`n" -ForegroundColor Yellow
    
    # 원격 저장소 확인 및 푸시 시도
    $remote = Invoke-Git @("remote", "get-url", "origin") 2>$null
    if ($remote) {
        $branch = Invoke-Git @("branch", "--show-current")
        if (-not $branch) { $branch = "main" }
        Write-Host "이미 커밋된 내용을 푸시합니다...`n" -ForegroundColor Yellow
        Invoke-Git @("push", "origin", $branch)
    }
    exit 0
}

# 변경사항 표시
Write-Host "변경된 파일:" -ForegroundColor Cyan
Invoke-Git @("status", "--short")
Write-Host ""

# 모든 변경사항 추가
Write-Host "변경사항을 스테이징 중..." -ForegroundColor Yellow
Invoke-Git @("add", "-A") | Out-Null

# 커밋 메시지 생성
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "자동 배포: $timestamp"

# 커밋
Write-Host "커밋 중..." -ForegroundColor Yellow
$commitResult = Invoke-Git @("commit", "-m", $commitMessage)
if ($LASTEXITCODE -ne 0) {
    Write-Host "커밋 실패 또는 커밋할 변경사항이 없습니다.`n" -ForegroundColor Red
    exit 1
}
Write-Host "커밋 완료: $commitMessage`n" -ForegroundColor Green

# 원격 저장소 확인
$remote = Invoke-Git @("remote", "get-url", "origin") 2>$null
if (-not $remote) {
    Write-Host "경고: 원격 저장소가 설정되지 않았습니다." -ForegroundColor Yellow
    Write-Host "원격 저장소를 설정하려면 다음 명령을 사용하세요:" -ForegroundColor Yellow
    Write-Host "  git remote add origin <저장소_URL>`n" -ForegroundColor White
    exit 0
}

# 현재 브랜치 확인
$branch = Invoke-Git @("branch", "--show-current")
if (-not $branch) {
    $branch = "main"
    Invoke-Git @("checkout", "-b", $branch) 2>$null | Out-Null
}

# 푸시
Write-Host "원격 저장소로 푸시 중..." -ForegroundColor Yellow
$pushResult = Invoke-Git @("push", "origin", $branch)

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "배포가 완료되었습니다!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "커밋: $commitMessage" -ForegroundColor Cyan
    Write-Host "브랜치: $branch" -ForegroundColor Cyan
    Write-Host "원격 저장소: $remote`n" -ForegroundColor Cyan
} else {
    Write-Host "`n푸시 실패. 원격 저장소 설정을 확인하세요.`n" -ForegroundColor Red
    exit 1
}

