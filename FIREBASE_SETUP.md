# Firebase 설정 가이드

## 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `property-inquiry-site`
4. Google Analytics 사용 설정 (선택사항)
5. "프로젝트 만들기" 클릭

## 2. Firestore 데이터베이스 설정

1. 왼쪽 메뉴에서 "Firestore Database" 클릭
2. "데이터베이스 만들기" 클릭
3. 보안 규칙: "테스트 모드에서 시작" 선택
4. 위치: `asia-northeast3 (서울)` 선택
5. "완료" 클릭

## 3. 웹 앱 등록

1. 프로젝트 개요에서 "웹" 아이콘 클릭
2. 앱 닉네임: `property-inquiry-web`
3. "앱 등록" 클릭
4. Firebase SDK 설정 복사

## 4. 설정 파일 업데이트

`firebase-config.js` 파일의 설정을 실제 Firebase 프로젝트 설정으로 교체:

```javascript
const firebaseConfig = {
    apiKey: "실제_API_키",
    authDomain: "실제_도메인",
    projectId: "실제_프로젝트_ID",
    storageBucket: "실제_스토리지_버킷",
    messagingSenderId: "실제_메시징_ID",
    appId: "실제_앱_ID"
};
```

## 5. 보안 규칙 설정

Firestore 보안 규칙을 다음과 같이 설정:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // 테스트용 (실제 운영 시 수정 필요)
    }
  }
}
```

## 6. 배포

1. GitHub Pages에 배포
2. Firebase 설정이 적용된 사이트 테스트
3. 모바일과 PC 간 데이터 동기화 확인

## 주의사항

- 실제 운영 환경에서는 보안 규칙을 더 엄격하게 설정해야 합니다
- API 키는 공개되어도 되지만, 보안 규칙으로 접근을 제한해야 합니다 