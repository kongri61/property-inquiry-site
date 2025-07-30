// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyAKWH86caO8oltDaQomsUMT0kX0PqTb_uQ",
    authDomain: "property-inquiry-site.firebaseapp.com",
    projectId: "property-inquiry-site",
    storageBucket: "property-inquiry-site.firebasestorage.app",
    messagingSenderId: "379557316701",
    appId: "1:379557316701:web:6e67d6d0adc84d10bfe5b4",
    measurementId: "G-WPHLXTG1NF"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// Firestore 데이터베이스 참조
const db = firebase.firestore(); 