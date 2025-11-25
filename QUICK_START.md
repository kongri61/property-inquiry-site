# 빠른 시작 가이드

## 자동 배포 설정 완료

모든 자동 배포 스크립트가 준비되었습니다. 다음 단계를 따라하세요.

## 1단계: Git 저장소 초기화

프로젝트 디렉토리에서 PowerShell을 열고 다음 명령을 실행하세요:

```powershell
.\setup-git.ps1
```

또는

```powershell
.\init-and-deploy.ps1
```

## 2단계: 원격 저장소 연결 (GitHub 저장소가 있는 경우)

```powershell
git remote add origin https://github.com/사용자명/저장소명.git
```

## 3단계: 초기 커밋 및 푸시

### 방법 1: 자동 배포 스크립트 사용 (권장)

```powershell
.\auto-deploy.ps1
```

이 스크립트는:
- 모든 변경사항을 자동으로 스테이징
- 타임스탬프가 포함된 커밋 메시지로 자동 커밋
- 원격 저장소로 자동 푸시

### 방법 2: 수동 커밋

```powershell
git add .
git commit -m "초기 커밋: 자동 배포 설정 완료"
git push origin main
```

## 4단계: 자동 배포 활성화

### 옵션 A: 파일 변경 감시 모드 (개발 중 권장)

```powershell
.\watch-and-deploy.ps1
```

파일을 저장할 때마다 자동으로 커밋, 푸시, 배포가 실행됩니다.

### 옵션 B: Git Hook 사용 (기본 설정됨)

일반적인 Git 워크플로우를 사용하면 자동으로 배포됩니다:

```powershell
git add .
git commit -m "변경사항 설명"
# 자동으로 푸시 및 배포 실행
```

## 문제 해결

### PowerShell에서 한글 경로 인식 문제

모든 스크립트는 UTF-8 인코딩을 사용하도록 설정되어 있습니다. 
스크립트를 실행하면 자동으로 인코딩이 설정됩니다.

### Git 저장소를 찾을 수 없음

```powershell
.\setup-git.ps1
```

를 실행하여 Git 저장소를 초기화하세요.

### 원격 저장소 연결 실패

원격 저장소 URL을 확인하고 다시 시도하세요:

```powershell
git remote -v
git remote set-url origin <새로운_URL>
```

## 다음 단계

1. ✅ Git 저장소 초기화 완료
2. ✅ 자동 배포 스크립트 준비 완료
3. ⏳ 원격 저장소 연결 (필요시)
4. ⏳ 초기 커밋 및 푸시
5. ⏳ 자동 배포 활성화

모든 준비가 완료되었습니다! 위의 단계를 따라 진행하세요.

