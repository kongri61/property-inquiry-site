# 배포 가이드

이 문서는 프로젝트의 자동 배포 설정 및 사용법을 설명합니다.

## 문제 해결

### PowerShell 한글 경로 문제

Windows PowerShell에서 한글 경로가 포함된 디렉토리에서 Git 명령을 실행할 때 문제가 발생할 수 있습니다. 이를 해결하기 위해 다음 설정이 포함되어 있습니다:

1. **UTF-8 인코딩 설정**: 모든 PowerShell 스크립트에서 UTF-8 인코딩을 강제합니다.
2. **Git 한글 경로 지원**: `core.quotepath false` 설정으로 한글 경로를 올바르게 처리합니다.

### Git 저장소 찾기 문제

한글 경로로 인해 Git 저장소를 찾지 못하는 경우, `setup-git.ps1` 스크립트를 실행하여 문제를 해결할 수 있습니다.

## 자동 배포 방법

### 1. 초기 설정

먼저 Git 저장소를 설정합니다:

```powershell
.\setup-git.ps1
```

원격 저장소가 설정되지 않은 경우, 다음 명령으로 추가합니다:

```powershell
git remote add origin <저장소_URL>
```

### 2. 수동 배포

변경사항을 커밋하고 푸시하려면:

```powershell
.\auto-deploy.ps1
```

이 스크립트는 다음을 수행합니다:
- 변경된 파일 확인
- 모든 변경사항 스테이징
- 자동 커밋 (타임스탬프 포함)
- 원격 저장소로 푸시

### 3. 파일 변경 감시 및 자동 배포

파일을 저장할 때마다 자동으로 배포하려면:

```powershell
.\watch-and-deploy.ps1
```

이 스크립트는:
- 파일 변경을 실시간으로 감시
- 변경 감지 시 자동으로 커밋 및 푸시
- Ctrl+C로 종료 가능

### 4. Git Hook을 통한 자동 배포

커밋 후 자동으로 배포하려면 Git hook이 설정되어 있습니다. 일반적인 Git 워크플로우를 사용하면 됩니다:

```powershell
git add .
git commit -m "변경사항 설명"
# 자동으로 푸시 및 배포가 실행됩니다
```

### 5. GitHub Actions를 통한 자동 배포

GitHub에 푸시하면 자동으로 Vercel에 배포됩니다. 다음 시크릿을 GitHub 저장소에 설정해야 합니다:

1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. 다음 시크릿 추가:
   - `VERCEL_TOKEN`: Vercel 대시보드에서 생성한 API 토큰
   - `VERCEL_ORG_ID`: Vercel 프로젝트 설정에서 확인
   - `VERCEL_PROJECT_ID`: Vercel 프로젝트 설정에서 확인

## 스크립트 설명

### setup-git.ps1
- PowerShell UTF-8 인코딩 설정
- Git 한글 경로 지원 설정
- Git 저장소 초기화
- 원격 저장소 확인

### auto-deploy.ps1
- 변경사항 확인 및 스테이징
- 자동 커밋 (타임스탬프 포함)
- 원격 저장소로 푸시

### watch-and-deploy.ps1
- 파일 시스템 변경 감시
- 변경 감지 시 자동 배포 실행
- 백그라운드에서 실행 가능

## 문제 해결

### "Git 저장소를 찾을 수 없습니다" 오류
- `setup-git.ps1`을 실행하여 Git 저장소를 초기화하세요.

### "원격 저장소가 설정되지 않았습니다" 경고
- `git remote add origin <저장소_URL>` 명령으로 원격 저장소를 추가하세요.

### 한글 경로 문제
- 모든 스크립트는 UTF-8 인코딩을 사용하도록 설정되어 있습니다.
- PowerShell을 관리자 권한으로 실행해보세요.

### 푸시 실패
- 원격 저장소 URL을 확인하세요.
- Git 인증 정보를 확인하세요.
- 네트워크 연결을 확인하세요.

## 권장 워크플로우

1. **개발 중**: `watch-and-deploy.ps1`을 실행하여 파일 변경 시 자동 배포
2. **수동 배포**: `auto-deploy.ps1`을 실행하여 즉시 배포
3. **일반 Git 워크플로우**: `git commit` 후 자동으로 배포 (Git hook 사용)


