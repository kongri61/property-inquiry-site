# 파일 변경 감시 및 자동 배포 스크립트
# PowerShell 인코딩 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

# Git 전역 설정 확인
git config --global core.quotepath false
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8

Write-Host "파일 변경 감시를 시작합니다..." -ForegroundColor Green
Write-Host "종료하려면 Ctrl+C를 누르세요.`n" -ForegroundColor Yellow

# 감시할 파일 패턴
$filePatterns = @("*.html", "*.css", "*.js", "*.json", "*.md", "*.txt", "*.xml")

# FileSystemWatcher 생성
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = Get-Location
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# 변경 이벤트 핸들러
$action = {
    $path = $Event.SourceEventArgs.FullPath
    $changeType = $Event.SourceEventArgs.ChangeType
    $fileName = Split-Path $path -Leaf
    
    # .git 디렉토리 무시
    if ($path -match "\.git") { return }
    
    # 감시할 파일 패턴 확인
    $shouldWatch = $false
    foreach ($pattern in $filePatterns) {
        if ($fileName -like $pattern) {
            $shouldWatch = $true
            break
        }
    }
    
    if ($shouldWatch) {
        Write-Host "`n[$changeType] $fileName" -ForegroundColor Cyan
        
        # 짧은 딜레이 후 배포 (연속 변경 방지)
        Start-Sleep -Seconds 2
        
        # 자동 배포 스크립트 실행
        $scriptPath = Join-Path $PSScriptRoot "auto-deploy.ps1"
        if (Test-Path $scriptPath) {
            Write-Host "자동 배포를 시작합니다..." -ForegroundColor Yellow
            & $scriptPath
        }
    }
}

# 이벤트 등록
Register-ObjectEvent $watcher "Changed" -Action $action | Out-Null
Register-ObjectEvent $watcher "Created" -Action $action | Out-Null
Register-ObjectEvent $watcher "Deleted" -Action $action | Out-Null

# 무한 대기
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    $watcher.Dispose()
    Write-Host "`n파일 감시를 종료합니다." -ForegroundColor Yellow
}


