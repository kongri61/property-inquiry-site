// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "property-inquiry-site.firebaseapp.com",
    projectId: "property-inquiry-site",
    storageBucket: "property-inquiry-site.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdefghijklmnop"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// Firestore 데이터베이스 참조
const db = firebase.firestore(); 