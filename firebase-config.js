// Firebase 설정
// ⚠️ 실제 Firebase 프로젝트 설정으로 교체해야 합니다!
// Firebase Console → 프로젝트 설정 → 웹 앱 → SDK 설정 및 구성에서 복사

const firebaseConfig = {
    apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // 실제 API 키로 교체
    authDomain: "property-inquiry-site.firebaseapp.com", // 실제 도메인으로 교체
    projectId: "property-inquiry-site", // 실제 프로젝트 ID로 교체
    storageBucket: "property-inquiry-site.appspot.com", // 실제 스토리지 버킷으로 교체
    messagingSenderId: "123456789012", // 실제 메시징 ID로 교체
    appId: "1:123456789012:web:abcdefghijklmnop" // 실제 앱 ID로 교체
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// Firestore 데이터베이스 참조
const db = firebase.firestore(); 