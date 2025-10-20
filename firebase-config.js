// Firebase 설정 - 환경변수 사용
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyAKWH86caO8oltDaQomsUMT0kX0PqTb_uQ",
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "property-inquiry-site.firebaseapp.com",
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || "property-inquiry-site",
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "property-inquiry-site.firebasestorage.app",
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "379557316701",
    appId: process.env.VITE_FIREBASE_APP_ID || "1:379557316701:web:6e67d6d0adc84d10bfe5b4",
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WPHLXTG1NF"
};

// Firebase 초기화 (오류 처리 포함)
try {
    // Firebase가 이미 초기화되었는지 확인
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log('✅ Firebase 초기화 성공');
    } else {
        console.log('✅ Firebase 이미 초기화됨');
    }
    
    // Firestore 데이터베이스 참조
    const db = firebase.firestore();
    
    // Firestore 설정
    db.settings({
        timestampsInSnapshots: true
    });
    
    console.log('✅ Firestore 설정 완료');
    
} catch (error) {
    console.error('❌ Firebase 초기화 실패:', error);
    console.log('Firebase 없이 localStorage만 사용합니다.');
}