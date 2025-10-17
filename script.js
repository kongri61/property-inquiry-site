// 사용자 정보
let currentUser = null;

// 기본 샘플 데이터 (항상 고정)
const defaultInquiries = [
    {
        id: 58,
        type: 'sell',
        category: '상가 매매',
        title: '구월동 아시아드 사거리 주차장건물 1층상가 매도 의뢰',
        author: '박**',
        date: '2025-06-11',
        details: {
            transactionType: '매매',
            location: '인천광역시 남동구 구월동',
            price: '협의',
            propertyType: '상가 매매',
            contact: '010-1234-5678',
            content: '구월동 아시아드 사거리 주차장건물 1층상가 매도 의뢰합니다. 위치가 좋고 교통이 편리합니다. 관심 있으신 분 연락 부탁드립니다.'
        }
    },
    {
        id: 57,
        type: 'sell',
        category: '건물 매매',
        title: '토지와 2종 근생 사무실용도 통건물 매도 의뢰',
        author: '김**',
        date: '2025-06-02',
        details: {
            transactionType: '매매',
            location: '경기도 성남시 분당구',
            price: '협의',
            propertyType: '건물 매매',
            contact: '010-2345-6789',
            content: '토지와 2종 근생 사무실용도 통건물 매도 의뢰합니다. 사무실로 사용하기 좋은 위치입니다.'
        }
    },
    {
        id: 56,
        type: 'sell',
        category: '상가 매매',
        title: '뷰티샵',
        author: '이**',
        date: '2025-05-29',
        details: {
            transactionType: '매매',
            location: '서울특별시 강남구',
            price: '협의',
            propertyType: '상가 매매',
            contact: '010-3456-7890',
            content: '뷰티샵 매도 의뢰합니다. 고객층이 안정적이고 수익성이 좋습니다.'
        }
    },
    {
        id: 55,
        type: 'sell',
        category: '상가 매매',
        title: '상가 1개호 팝니다',
        author: '유**',
        date: '2025-05-25',
        details: {
            transactionType: '매매',
            location: '인천광역시 연수구',
            price: '협의',
            propertyType: '상가 매매',
            contact: '010-4567-8901',
            content: '상가 1개호 팝니다. 위치가 좋고 임대 수익이 안정적입니다.'
        }
    },
    {
        id: 54,
        type: 'sell',
        category: '상가 매매',
        title: '상가 매매 희망합니다.',
        author: '장**',
        date: '2025-05-20',
        details: {
            transactionType: '매매',
            location: '경기도 부천시',
            price: '협의',
            propertyType: '상가 매매',
            contact: '010-5678-9012',
            content: '상가 매매 희망합니다. 좋은 조건으로 거래하겠습니다.'
        }
    },
    {
        id: 53,
        type: 'sell',
        category: '상가 매매',
        title: '인하대학교 근접 상가 건물 매매',
        author: '진**',
        date: '2025-05-15',
        details: {
            transactionType: '매매',
            location: '인천광역시 미추홀구',
            price: '협의',
            propertyType: '상가 매매',
            contact: '010-6789-0123',
            content: '인하대학교 근접 상가 건물 매매합니다. 학생들이 많이 지나다니는 위치입니다.'
        }
    },
    {
        id: 52,
        type: 'sell',
        category: '상가 매매',
        title: '문의 남깁니다.',
        author: '홍**',
        date: '2025-05-10',
        details: {
            transactionType: '매매',
            location: '서울특별시 마포구',
            price: '협의',
            propertyType: '상가 매매',
            contact: '010-7890-1234',
            content: '문의 남깁니다. 상가 매매에 관심 있으신 분 연락 부탁드립니다.'
        }
    },
    {
        id: 51,
        type: 'buy',
        category: '상가 임대',
        title: '인천시청역 근방으로 구합니다',
        author: '박**',
        date: '2025-05-05',
        details: {
            transactionType: '월세',
            location: '인천광역시 남동구',
            price: '협의',
            propertyType: '상가 임대',
            contact: '010-8901-2345',
            content: '인천시청역 근방으로 상가를 구합니다. 월세로 임대 가능한 곳 연락 부탁드립니다.'
        }
    },
    {
        id: 50,
        type: 'sell',
        category: '상가 매매',
        title: '매매 원합니다',
        author: '김**',
        date: '2025-05-01',
        details: {
            transactionType: '매매',
            location: '경기도 안산시',
            price: '협의',
            propertyType: '상가 매매',
            contact: '010-9012-3456',
            content: '매매 원합니다. 좋은 조건으로 거래하겠습니다.'
        }
    },
    {
        id: 49,
        type: 'sell',
        category: '상가 매매',
        title: '상가 매매',
        author: '이**',
        date: '2025-04-28',
        details: {
            transactionType: '매매',
            location: '인천광역시 부평구',
            price: '협의',
            propertyType: '상가 매매',
            contact: '010-0123-4567',
            content: '상가 매매합니다. 관심 있으신 분 연락 부탁드립니다.'
        }
    }
];

// 현재 문의 목록 (기본 데이터 + 새로 추가된 데이터)
let inquiries = [...defaultInquiries];

// Firebase Firestore 데이터 동기화 함수들

// Firestore에서 데이터 불러오기
async function loadInquiriesFromFirestore() {
    console.log('=== Firestore에서 데이터 불러오기 시작 ===');
    
    try {
        const snapshot = await db.collection('inquiries').orderBy('id', 'desc').get();
        const firestoreInquiries = [];
        
        snapshot.forEach(doc => {
            firestoreInquiries.push(doc.data());
        });
        
        console.log('Firestore에서 불러온 데이터:', firestoreInquiries.length, '개');
        console.log('Firestore 데이터 ID 목록:', firestoreInquiries.map(inq => inq.id));
        
        if (firestoreInquiries.length > 0) {
            // Firestore에 데이터가 있으면 사용
            inquiries = firestoreInquiries;
            console.log('Firestore 데이터 사용');
        } else {
            // Firestore에 데이터가 없으면 현재 메모리의 데이터 유지 (기본 데이터로 되돌아가지 않음)
            console.log('Firestore에 데이터 없음 - 현재 메모리 데이터 유지');
            // inquiries 배열을 그대로 유지하여 삭제된 항목이 다시 나타나지 않도록 함
        }
        
        // UI 업데이트
        loadInquiries();
        updateTotalCount();
        
    } catch (error) {
        console.error('Firestore 데이터 불러오기 오류:', error);
        // 오류 시 현재 메모리의 데이터 유지 (기본 데이터로 되돌아가지 않음)
        console.log('Firestore 오류 - 현재 메모리 데이터 유지');
        loadInquiries();
        updateTotalCount();
    }
    
    console.log('=== Firestore 데이터 불러오기 완료 ===');
}

// Firestore에 데이터 저장하기
async function saveInquiriesToFirestore() {
    console.log('=== Firestore에 데이터 저장 시작 ===');
    console.log('저장할 데이터 개수:', inquiries.length);
    
    try {
        // 기존 데이터 삭제
        const snapshot = await db.collection('inquiries').get();
        const batch = db.batch();
        
        snapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        // 새 데이터 추가
        inquiries.forEach(inquiry => {
            const docRef = db.collection('inquiries').doc();
            batch.set(docRef, inquiry);
        });
        
        await batch.commit();
        console.log('Firestore 데이터 저장 완료');
        
    } catch (error) {
        console.error('Firestore 데이터 저장 오류:', error);
    }
    
    console.log('=== Firestore 데이터 저장 완료 ===');
}

// 실시간 데이터 동기화 설정
function setupRealtimeSync() {
    console.log('=== 실시간 동기화 설정 시작 ===');
    
    db.collection('inquiries')
        .orderBy('id', 'desc')
        .onSnapshot(snapshot => {
            console.log('실시간 데이터 변경 감지');
            
            const firestoreInquiries = [];
            snapshot.forEach(doc => {
                firestoreInquiries.push(doc.data());
            });
            
            if (firestoreInquiries.length > 0) {
                inquiries = firestoreInquiries;
                loadInquiries();
                updateTotalCount();
                console.log('실시간 데이터 업데이트 완료');
            }
        }, error => {
            console.error('실시간 동기화 오류:', error);
        });
    
    console.log('=== 실시간 동기화 설정 완료 ===');
}

// 새로운 ID 생성 함수
function generateNewId() {
    // 현재 inquiries 배열에서 가장 큰 ID 찾기
    const maxId = Math.max(...inquiries.map(inquiry => inquiry.id));
    const newId = maxId + 1;
    console.log('새 ID 생성 - 현재 최대 ID:', maxId, '새 ID:', newId);
    return newId;
}

let currentPage = 1;
const itemsPerPage = 10;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('페이지 로드됨');
    console.log('사용자 에이전트:', navigator.userAgent);
    
    // Firestore에서 데이터 불러오기 (삭제된 항목이 다시 나타나지 않도록 수정)
    // localStorage에 저장된 데이터가 있으면 그것을 사용하고, 없으면 Firestore에서 불러옴
    const savedInquiries = localStorage.getItem('allInquiries');
    if (savedInquiries) {
        try {
            const loadedInquiries = JSON.parse(savedInquiries);
            inquiries = loadedInquiries;
            console.log('localStorage에서 데이터 로드:', loadedInquiries.length, '개');
        } catch (error) {
            console.error('localStorage 데이터 파싱 오류:', error);
            loadInquiriesFromFirestore();
        }
    } else {
        loadInquiriesFromFirestore();
    }
    
    // 실시간 동기화 설정
    setupRealtimeSync();
    
    // 저장된 데이터의 작성자 이름 수정
    fixAuthorNamesInStorage();
    
    // "~전부보기" 텍스트 제거
    removeAllPropertyTypeSuffixes();
    
    // 강화된 데이터 동기화 실행
    syncDataAcrossDevices();
    
    // 로그인 상태 확인
    checkLoginStatus();
    loadInquiries();
    updateTotalCount();
    
    // 복사 방지 기능 추가
    preventCopy();
    
    // 모바일에서 추가 초기화
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        console.log('모바일 기기 감지됨 - 추가 초기화 실행');
        // 모바일에서 지연된 초기화
        setTimeout(() => {
            loadInquiries();
            updateTotalCount();
        }, 200);
        
        // 모바일에서 추가 강화된 동기화
        setTimeout(() => {
            console.log('모바일 강화된 동기화 실행');
            syncDataAcrossDevices();
        }, 500);
        
        // 모바일에서 최종 동기화
        setTimeout(() => {
            console.log('모바일 최종 동기화 실행');
            forceSaveAndSync();
        }, 1000);
    }
    
    // 매물종류 버튼 클릭 이벤트
    const propertyBtns = document.querySelectorAll('.property-btn');
    propertyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.property-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });        
    
    // 지역 선택 연동
    const locationSelect = document.querySelector('.location-select');
    if (locationSelect) {
        locationSelect.addEventListener('change', function() {
            const districtSelect = document.querySelectorAll('.location-select')[1];
            const neighborhoodSelect = document.querySelectorAll('.location-select')[2];
            const city = this.value;
            
            console.log('시/도 선택됨:', city);
            
            // 구/군 옵션 초기화
            districtSelect.innerHTML = '<option>구/군</option>';
            
            // 동/읍/면 필드 초기화 - 기존 input이 있다면 select로 교체
            const existingInput = neighborhoodSelect.parentNode.querySelector('input.location-select');
            if (existingInput) {
                const newSelect = document.createElement('select');
                newSelect.className = 'location-select';
                newSelect.innerHTML = '<option>동/읍/면</option>';
                existingInput.parentNode.replaceChild(newSelect, existingInput);
            } else {
                neighborhoodSelect.innerHTML = '<option>동/읍/면</option>';
            }
            
            // 전국 시/도 데이터
            const cityData = {
                '서울특별시': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
                '부산광역시': ['강서구', '금정구', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구', '기장군'],
                '대구광역시': ['남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구'],
                '인천광역시': ['계양구', '남구', '남동구', '동구', '부평구', '서구', '연수구', '중구', '강화군', '옹진군'],
                '광주광역시': ['광산구', '남구', '동구', '북구', '서구'],
                '대전광역시': ['대덕구', '동구', '서구', '유성구', '중구'],
                '울산광역시': ['남구', '동구', '북구', '울주군', '중구'],
                '세종특별자치시': ['세종특별자치시'],
                '경기도': ['가평군', '고양시 덕양구', '고양시 일산동구', '고양시 일산서구', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시', '동두천시', '부천시', '성남시 분당구', '성남시 수정구', '성남시 중원구', '수원시 권선구', '수원시 영통구', '수원시 장안구', '수원시 팔달구', '시흥시', '안산시 단원구', '안산시 상록구', '안성시', '안양시 동안구', '안양시 만안구', '양평군', '여주시', '연천군', '오산시', '용인시 기흥구', '용인시 수지구', '용인시 처인구', '의왕시', '의정부시', '이천시', '파주시', '평택시', '포천시', '하남시', '화성시'],
                '강원도': ['강릉시', '고성군', '동해시', '삼척시', '속초시', '양구군', '양양군', '영월군', '원주시', '인제군', '정선군', '철원군', '춘천시', '태백시', '평창군', '홍천군', '화천군', '횡성군'],
                '충청북도': ['괴산군', '단양군', '보은군', '영동군', '옥천군', '음성군', '제천시', '증평군', '진천군', '청주시 상당구', '청주시 서원구', '청주시 청원구', '청주시 흥덕구', '충주시'],
                '충청남도': ['계룡시', '공주시', '금산군', '논산시', '당진시', '보령시', '부여군', '서산시', '서천군', '아산시', '예산군', '천안시 동남구', '천안시 서북구', '청양군', '태안군', '홍성군'],
                '전라북도': ['고창군', '군산시', '김제시', '남원시', '무주군', '부안군', '순창군', '완주군', '익산시', '임실군', '장수군', '전주시 덕진구', '전주시 완산구', '정읍시', '진안군'],
                '전라남도': ['강진군', '고흥군', '곡성군', '광양시', '구례군', '나주시', '담양군', '목포시', '무안군', '보성군', '순천시', '신안군', '여수시', '영광군', '영암군', '완도군', '장성군', '장흥군', '진도군', '함평군', '해남군', '화순군'],
                '경상북도': ['경산시', '경주시', '고령군', '구미시', '김천시', '문경시', '봉화군', '상주시', '성주군', '안동시', '영덕군', '영양군', '영주시', '영천시', '예천군', '울릉군', '울진군', '의성군', '청도군', '청송군', '칠곡군', '포항시 남구', '포항시 북구', '군위군'],
                '경상남도': ['거제시', '거창군', '고성군', '김해시', '남해군', '밀양시', '사천시', '산청군', '양산시', '의령군', '진주시', '창녕군', '창원시 마산합포구', '창원시 마산회원구', '창원시 성산구', '창원시 의창구', '창원시 진해구', '통영시', '하동군', '함안군', '함양군', '합천군'],
                '제주특별자치도': ['서귀포시', '제주시']
            };
            
            // 선택된 시/도에 따른 구/군 옵션 추가
            if (cityData[city]) {
                cityData[city].forEach(district => {
                    const option = document.createElement('option');
                    option.value = district;
                    option.textContent = district;
                    districtSelect.appendChild(option);
                });
                console.log(`${city} 구/군 옵션 추가됨`);
            }
        });
    }
    
    // 구/군 선택 시 동/읍/면 옵션 생성
    const districtSelect = document.querySelectorAll('.location-select')[1];
    if (districtSelect) {
        districtSelect.addEventListener('change', function() {
            const neighborhoodSelect = document.querySelectorAll('.location-select')[2];
            const district = this.value;
            
            console.log('구/군 선택됨:', district);
            
            // 동/읍/면 필드 초기화 - 기존 input이 있다면 select로 교체
            const existingInput = neighborhoodSelect.parentNode.querySelector('input.location-select');
            if (existingInput) {
                const newSelect = document.createElement('select');
                newSelect.className = 'location-select';
                newSelect.innerHTML = '<option>동/읍/면</option>';
                existingInput.parentNode.replaceChild(newSelect, existingInput);
            } else {
                neighborhoodSelect.innerHTML = '<option>동/읍/면</option>';
            }
            
            // 상세 동 데이터가 있는 구/군들
            const hasDetailData = [
                // 서울특별시
                '강남구', '서초구', '마포구', '송파구', '영등포구', '강서구', '성동구', '광진구', '용산구', '중구', '종로구', '은평구', '서대문구', '동대문구', '성북구', '강북구', '도봉구', '노원구', '중랑구', '동작구', '관악구', '금천구', '구로구', '양천구', '강동구',
                // 인천광역시
                '연수구', '남동구', '부평구', '계양구', '중구', '남구', '동구', '서구',
                // 경기도
                '안양시 만안구', '안양시 동안구', '부천시', '시흥시', '성남시 분당구', '성남시 수정구', '성남시 중원구', '수원시 권선구', '수원시 영통구', '수원시 장안구', '수원시 팔달구'
            ];
            
            // 특별한 키 매핑
            let searchKey = district;
            const selectedCity = document.querySelector('.location-select').value;
            
            if (selectedCity === '서울특별시' && district === '중구') {
                searchKey = '서울중구';
            } else if (selectedCity === '인천광역시') {
                if (district === '중구') searchKey = '인천중구';
                else if (district === '남구') searchKey = '인천남구';
                else if (district === '동구') searchKey = '인천동구';
                else if (district === '서구') searchKey = '인천서구';
            }
            
            // 상세 동 데이터
            const districtData = {
                // 서울특별시
                '강남구': ['개포동', '논현동', '대치동', '도곡동', '삼성동', '세곡동', '수서동', '신사동', '압구정동', '역삼동', '일원동', '청담동'],
                '서초구': ['반포동', '방배동', '서초동', '양재동', '우면동', '잠원동', '청담동'],
                '마포구': ['공덕동', '구수동', '노고산동', '대흥동', '도화동', '동교동', '망원동', '상암동', '서교동', '성산동', '신수동', '연남동', '염리동', '용강동', '중동', '창전동', '토정동', '하중동', '합정동', '현석동'],
                '송파구': ['가락동', '문정동', '방이동', '송파동', '신천동', '잠실동', '장지동', '풍납동'],
                '영등포구': ['당산동', '대림동', '도림동', '문래동', '신길동', '양평동', '여의도동', '영등포동', '정동'],
                '강서구': ['가양동', '개화동', '공항동', '과해동', '내발산동', '냉천동', '대저동', '마곡동', '명지동', '방화동', '오곡동', '오쇠동', '외발산동', '우장동', '원당동', '월경동', '자곡동', '정곡동', '중곡동', '증산동', '진곡동', '창동', '천왕동', '청룡동', '태화동', '풍년동', '화곡동'],
                '성동구': ['금호동', '도선동', '마장동', '사근동', '상왕십리동', '성수동', '송정동', '신당동', '안암동', '왕십리동', '용답동', '응봉동', '이태원동', '장안동', '중앙동', '청구동', '하왕십리동', '행당동', '현석동', '홍익동'],
                '광진구': ['광장동', '구의동', '군자동', '능동', '자양동', '중곡동', '화양동'],
                '용산구': ['갈월동', '남영동', '도원동', '문배동', '보광동', '산천동', '서계동', '용문동', '원효로동', '이촌동', '이태원동', '장충동', '중림동', '청파동', '한강로동', '효창동', '후암동'],
                '서울중구': ['광희동', '남대문로동', '남산동', '남학동', '다동', '대림동', '덕수동', '도렴동', '봉래동', '봉학동', '북창동', '산림동', '상림동', '서소문동', '세종로동', '소공동', '수표동', '수하동', '순화동', '신당동', '쌍림동', '예관동', '예장동', '오장동', '을지로동', '의주로동', '인현동', '장교동', '장충동', '저동', '정동', '주교동', '주자동', '중림동', '초동', '충무로동', '충신동', '태평로동', '필동', '황학동', '회현동', '흥인동'],
                '종로구': ['가회동', '견지동', '경운동', '계동', '공평동', '관수동', '관철동', '관훈동', '교남동', '교북동', '교서동', '교촌동', '궁정동', '권농동', '낙원동', '내수동', '내자동', '누상동', '누하동', '당주동', '도렴동', '돈의동', '돈화동', '동숭동', '명륜동', '묘동', '봉익동', '봉원동', '부암동', '사간동', '사직동', '삼봉동', '삼성동', '상림동', '서린동', '세종로동', '소격동', '송월동', '송현동', '수송동', '숭인동', '신교동', '신문로동', '안국동', '연건동', '연지동', '예지동', '오동동', '옥인동', '와룡동', '운니동', '원남동', '원서동', '이화동', '익선동', '인사동', '인의동', '장사동', '재동', '적선동', '종로동', '중학동', '중앙동', '창성동', '창덕동', '청운동', '청진동', '체부동', '충신동', '통의동', '통인동', '팔판동', '필운동', '행촌동', '혜화동', '화동', '효자동', '훈정동'],
                '은평구': ['갈현동', '구산동', '녹번동', '대조동', '덕은동', '불광동', '신사동', '역촌동', '응암동', '증산동', '진관동'],
                '서대문구': ['남가좌동', '냉천동', '대신동', '대현동', '미근동', '봉원동', '북가좌동', '북아현동', '신촌동', '연희동', '영천동', '옥천동', '창천동', '천연동', '충현동', '합동', '현저동', '홍대동', '홍은동', '화북동', '환일동'],
                '동대문구': ['답십리동', '신설동', '용두동', '이문동', '장안동', '전농동', '제기동', '청량리동', '회기동', '휘경동'],
                '성북구': ['길음동', '돈암동', '동선동', '동소문동', '보문동', '삼선동', '상월곡동', '석관동', '성북동', '안암동', '월곡동', '장위동', '정릉동', '종암동', '중앙동', '하월곡동'],
                '강북구': ['미아동', '번동', '삼양동', '송중동', '송천동', '수유동', '우이동', '인수동'],
                '도봉구': ['도봉동', '방학동', '쌍문동', '창동'],
                '노원구': ['공릉동', '상계동', '월계동', '중계동', '하계동'],
                '중랑구': ['망우동', '묵동', '면목동', '상봉동', '신내동', '중화동'],
                '동작구': ['노량진동', '대방동', '동작동', '본동', '사당동', '상도동', '신대방동', '흑석동'],
                '관악구': ['봉천동', '신림동'],
                '금천구': ['가산동', '독산동', '시흥동'],
                '구로구': ['가리봉동', '개봉동', '고척동', '구로동', '궁동', '신도림동', '오류동', '천왕동', '항동'],
                '양천구': ['목동', '신월동', '신정동'],
                '강동구': ['강일동', '고덕동', '길동', '둔촌동', '명일동', '상일동', '성내동', '암사동', '천호동'],
                
                // 인천광역시
                '연수구': ['동춘동', '선학동', '송도동', '연수동', '옥련동', '원인재동', '청학동'],
                '남동구': ['구월동', '남촌동', '논현동', '도화동', '만수동', '수산동', '운연동', '인수동', '작전동', '청림동'],
                '부평구': ['구산동', '부개동', '부평동', '산곡동', '삼산동', '십정동', '일신동', '청천동'],
                '계양구': ['작전동', '서운동', '임학동', '용종동', '병방동', '방축동', '동양동', '귤현동', '상야동', '하야동', '평동', '노오지동', '선주지동', '이화동', '오류동', '마전동', '왕길동', '아라동'],
                '인천중구': ['신포동', '연안동', '신흥동', '도원동', '율목동', '동인천동', '개항동', '영종동', '운서동', '용유동', '을왕동', '덕적동', '백령동', '대청동', '영흥동', '덕적도동', '자월동', '연평동', '항동'],
                '인천남구': ['숭의동', '용현동', '학익동', '도화동', '주안동', '관교동', '문학동'],
                '인천동구': ['만석동', '화수동', '송현동', '화평동', '창영동', '금곡동', '송림동'],
                '인천서구': ['대곡동', '백석동', '시천동', '검단동', '마전동', '왕길동', '오류동', '원당동', '당하동', '아라동'],
                
                // 경기도
                '안양시 만안구': ['안양동', '석수동', '박달동', '관양동', '평촌동', '인덕원동', '과림동', '호계동'],
                '안양시 동안구': ['비산동', '신촌동', '원평동', '평안동'],
                '부천시': ['심곡동', '부천동', '중동', '신중동', '상동', '대산동', '소사동', '범박동', '성곡동', '오정동', '원종동', '도당동', '약대동', '고강동', '작동'],
                '시흥시': ['정왕동', '신천동', '배곧동', '연성동', '장곡동', '능곡동', '대야동', '광석동', '송도동', '은행동', '안현동', '매화동', '도창동', '금이동', '과림동', '계수동', '화정동', '시흥동'],
                '성남시 분당구': ['분당동', '정자동', '야탑동', '서현동', '수내동', '정자동', '율동', '백현동', '판교동', '운중동'],
                '성남시 수정구': ['수진동', '단대동', '신촌동', '고등동', '상적동', '양지동', '복정동', '창곡동', '신흥동'],
                '성남시 중원구': ['성남동', '중앙동', '금광동', '은행동', '상대원동', '여수동', '도촌동', '갈현동', '하대원동'],
                '수원시 권선구': ['권선동', '서둔동', '곡반정동', '입북동', '당수동', '오목천동', '고색동', '오류동', '탑동', '평동', '원천동', '이의동', '장지동', '대황교동', '영통동', '신동', '망포동'],
                '수원시 영통구': ['영통동', '신동', '망포동', '매탄동', '권선동', '곡반정동', '입북동', '당수동', '오목천동', '고색동', '오류동', '탑동', '평동', '원천동', '이의동', '장지동', '대황교동'],
                '수원시 장안구': ['장안동', '조원동', '연무동', '상광교동', '하광교동', '율천동', '영화동', '송죽동', '조원동', '연무동', '상광교동', '하광교동', '율천동', '영화동', '송죽동'],
                '수원시 팔달구': ['팔달동', '영동', '중동', '구천동', '남수동', '우만동', '인계동', '지동', '화서동', '매교동', '매산동', '고등동', '우만동', '인계동', '지동', '화서동', '매교동', '매산동']
            };
            
            // 상세 동 데이터가 있는 경우
            if (hasDetailData.includes(district) && districtData[searchKey]) {
                // 상세 동 목록 추가
                districtData[searchKey].forEach(neighborhood => {
                    const option = document.createElement('option');
                    option.value = neighborhood;
                    option.textContent = neighborhood;
                    neighborhoodSelect.appendChild(option);
                });
                console.log(`${searchKey} 동/읍/면 옵션 추가됨`);
            } else if (district && district !== '구/군') {
                // 상세 동 데이터가 없는 경우 - 직접입력 필드로 변경
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'location-select';
                input.placeholder = '동/읍/면 직접입력';
                input.style.width = '100%';
                input.style.padding = '8px';
                input.style.border = '1px solid #ddd';
                input.style.borderRadius = '4px';
                input.style.fontSize = '14px';
                input.style.boxSizing = 'border-box';
                
                // 기존 select를 input으로 교체
                neighborhoodSelect.parentNode.replaceChild(input, neighborhoodSelect);
                
                console.log('직접입력 필드로 변경됨');
            }
        });
    }
    
    // 로그인 폼 이벤트 리스너
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('로그인 폼 찾음, 이벤트 리스너 추가');
        
        // 기존 이벤트 리스너 제거 (중복 방지)
        loginForm.removeEventListener('submit', loginForm._submitHandler);
        
        // 새로운 이벤트 리스너 추가
        loginForm._submitHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('=== 로그인 폼 제출됨 ===');
            
            const loginIdInput = document.getElementById('loginId');
            const loginPasswordInput = document.getElementById('loginPassword');
            
            if (!loginIdInput || !loginPasswordInput) {
                console.error('로그인 입력 필드를 찾을 수 없음');
                alert('로그인 입력 필드를 찾을 수 없습니다. 페이지를 새로고침해주세요.');
                return;
            }
            
            const loginId = loginIdInput.value;
            const loginPassword = loginPasswordInput.value;
            
            console.log('=== 로그인 입력값 ===');
            console.log('원본 아이디:', `"${loginId}"`);
            console.log('원본 비밀번호:', `"${loginPassword}"`);
            console.log('아이디 길이:', loginId.length);
            console.log('비밀번호 길이:', loginPassword.length);
            
            // 공백 제거 후 비교
            const trimmedId = loginId.trim();
            const trimmedPassword = loginPassword.trim();
            
            console.log('=== 공백 제거 후 ===');
            console.log('공백 제거된 아이디:', `"${trimmedId}"`);
            console.log('공백 제거된 비밀번호:', `"${trimmedPassword}"`);
            console.log('공백 제거된 아이디 길이:', trimmedId.length);
            console.log('공백 제거된 비밀번호 길이:', trimmedPassword.length);
            
            // 기기 정보
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            console.log('기기 타입:', isMobile ? '모바일' : 'PC');
            console.log('User Agent:', navigator.userAgent);
            
            // 로그인 검증
            const expectedId = 'kongri61';
            const expectedPassword = 'rlaehdghk61@';
            
            console.log('=== 로그인 검증 ===');
            console.log('기대값 - ID:', `"${expectedId}"`, 'PW:', `"${expectedPassword}"`);
            console.log('실제값 - ID:', `"${trimmedId}"`, 'PW:', `"${trimmedPassword}"`);
            console.log('ID 일치:', trimmedId === expectedId);
            console.log('PW 일치:', trimmedPassword === expectedPassword);
            
            if (trimmedId === expectedId && trimmedPassword === expectedPassword) {
                console.log('=== 로그인 성공 ===');
                
                currentUser = {
                    id: trimmedId,
                    name: '사용자',
                    role: 'user'
                };
                
                // 로그인 정보 저장
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                console.log('localStorage에 사용자 정보 저장됨');
                
                // 모달 닫기
                closeLoginModal();
                updateAuthButton();
                
                console.log('로그인 성공:', currentUser);
                
                // 목록 다시 로드 (삭제 버튼 표시)
                loadInquiriesFromFirestore(); // Firestore에서 데이터 로드
                loadInquiries(); // 목록 다시 렌더링
                updateTotalCount(); // 총 개수 업데이트
                
                // 강화된 데이터 동기화
                syncDataAcrossDevices();
                
                // 모바일에서 추가 처리
                if (isMobile) {
                    console.log('모바일 로그인 후 추가 처리');
                    setTimeout(() => {
                        loadInquiries();
                        updateTotalCount();
                        console.log('모바일 로그인 후 지연 업데이트 완료');
                    }, 500);
                }
                
                // 폼 초기화
                this.reset();
                
                // 성공 메시지
                alert('로그인 성공!');
                
            } else {
                console.log('=== 로그인 실패 ===');
                console.log('로그인 실패 - 입력값 불일치');
                
                // 비밀유지를 위해 상세한 오류 메시지 제거
                alert('아이디 또는 비밀번호가 올바르지 않습니다.');
            }
        };
        
        loginForm.addEventListener('submit', loginForm._submitHandler);
        console.log('로그인 폼 이벤트 리스너 등록 완료');
        
    } else {
        console.error('로그인 폼을 찾을 수 없음');
    }
    
    // 문의작성 폼 이벤트 리스너
    const buyForm = document.getElementById('buyForm');
    if (buyForm) {
        buyForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('문의작성 폼 제출됨');
            
            // 폼 데이터 수집
            const inquiryData = {
                type: document.querySelector('.tab-btn.active').textContent === '구함' ? 'buy' : 'sell',
                transactionType: document.querySelector('.radio-btn.active').textContent,
                location: {
                    city: document.querySelector('.location-select').value,
                    district: document.querySelectorAll('.location-select')[1].value,
                    neighborhood: (() => {
                        const neighborhoodElement = document.querySelectorAll('.location-select')[2];
                        if (neighborhoodElement.tagName === 'SELECT') {
                            return neighborhoodElement.value;
                        } else if (neighborhoodElement.tagName === 'INPUT') {
                            return neighborhoodElement.value;
                        }
                        return '';
                    })(),
                    address: document.querySelector('.address-input').value
                },
                price: document.querySelector('.price-input').value,
                propertyType: document.querySelector('.property-btn.active').textContent,
                name: document.querySelector('.name-input').value,
                contact: document.querySelector('.contact-input').value,
                title: document.querySelector('.title-input').value,
                content: document.querySelector('.content-textarea').value,
                date: new Date().toISOString().split('T')[0]
            };
            
            console.log('수집된 폼 데이터:', inquiryData);
            
            // 유효성 검사
            if (!validateForm(inquiryData)) {
                console.log('폼 유효성 검사 실패');
                return;
            }
            
            console.log('폼 유효성 검사 통과');
            
            // 새 문의 추가
            const newInquiry = {
                id: generateNewId(),
                type: inquiryData.type,
                category: inquiryData.propertyType.replace(' 전부 보기', ''),
                title: inquiryData.title,
                author: inquiryData.name.charAt(0) + '**',
                date: inquiryData.date,
                details: {
                    transactionType: inquiryData.transactionType,
                    location: `${inquiryData.location.city} ${inquiryData.location.district} ${inquiryData.location.neighborhood} ${inquiryData.location.address}`,
                    price: inquiryData.price || '협의',
                    propertyType: inquiryData.propertyType.replace(' 전부 보기', ''),
                    contact: inquiryData.contact,
                    content: inquiryData.content
                }
            };
            
            console.log('새 문의 객체:', newInquiry);
            
            inquiries.unshift(newInquiry);
            console.log('매물 등록 후 inquiries 배열:', inquiries);
            console.log('매물 등록 후 inquiries ID 목록:', inquiries.map(inq => inq.id));
            
            // Firestore에 저장 강제 실행
            console.log('Firestore 저장 시작...');
            await saveInquiriesToFirestore(); // Firestore에 저장
            console.log('Firestore 저장 완료');
            
            // 강화된 데이터 저장 및 동기화
            forceSaveAndSync();
            
            console.log('문의 목록에 추가됨, 총 개수:', inquiries.length);
            
            // 성공 메시지
            alert('문의가 성공적으로 등록되었습니다.');
            
            // 모바일에서 페이지 새로고침 안내
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                setTimeout(() => {
                    if (confirm('모바일에서 새 매물이 보이지 않는다면 페이지를 새로고침하시겠습니까?')) {
                        location.reload();
                    }
                }, 1000);
            }
            
            // 모달 닫기
            closeWriteModal();
            
            // 목록 강제 업데이트 (모바일 대응)
            console.log('목록 업데이트 시작');
            
            // 새 매물이 추가되었으므로 첫 번째 페이지로 이동
            currentPage = 1;
            
            loadInquiries();
            updateTotalCount();
            
            // 새 매물이 첫 페이지 맨 위에 표시되도록 강제 새로고침
            setTimeout(() => {
                console.log('새 매물 첫 페이지 표시를 위한 강제 업데이트');
                currentPage = 1;
                loadInquiries();
                updateTotalCount();
            }, 100);
            
            // 추가 강제 업데이트 (더 확실하게)
            setTimeout(() => {
                console.log('추가 강제 업데이트 실행');
                currentPage = 1;
                loadInquiriesFromFirestore();
                loadInquiries();
                updateTotalCount();
            }, 300);
            
            // 모바일에서 DOM 업데이트 강제 적용
            setTimeout(() => {
                console.log('지연된 목록 업데이트 실행');
                loadInquiriesFromFirestore(); // 모바일에서도 Firestore에서 데이터 로드
                updateTotalCount();
                
                // 테이블 강제 리렌더링
                const tbody = document.getElementById('inquiryList');
                if (tbody) {
                    tbody.style.display = 'none';
                    setTimeout(() => {
                        tbody.style.display = '';
                        loadInquiriesFromFirestore(); // 모바일에서도 Firestore에서 데이터 로드
                    }, 50);
                }
            }, 100);
            
            // 모바일에서 강화된 동기화
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                setTimeout(() => {
                    console.log('모바일 매물 등록 후 강화된 동기화');
                    syncDataAcrossDevices();
                }, 200);
                
                setTimeout(() => {
                    console.log('모바일 매물 등록 후 최종 동기화');
                    forceSaveAndSync();
                }, 500);
            }
            
            // 폼 초기화
            resetForm();
            
            console.log('문의 등록 완료');
        });
    }
    
    // 파일 선택 버튼 클릭
    const fileBtn = document.querySelector('.file-btn');
    if (fileBtn) {
        fileBtn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*,.pdf,.doc,.docx';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const fileInput = document.querySelector('.file-input');
                    const deleteBtn = document.querySelector('.file-delete-btn');
                    if (fileInput) {
                        fileInput.value = file.name;
                        // 삭제 버튼 표시
                        if (deleteBtn) {
                            deleteBtn.style.display = 'inline-block';
                        }
                    }
                }
            };
            input.click();
        });
    }
    
    // 모바일에서 폼 제출 버튼 클릭 이벤트 추가
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            console.log('제출 버튼 클릭됨');
            // 폼 제출 이벤트를 수동으로 트리거
            const form = document.getElementById('buyForm');
            if (form) {
                form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }
        });
    }
}); 

// 복사 방지 기능 (개발자 도구를 위해 일시적으로 비활성화)
function preventCopy() {
    console.log('복사 방지 기능 비활성화됨 - 개발자 도구 사용 가능');
    
    // 모든 복사 방지 기능을 주석 처리
    /*
    // 텍스트 선택 방지
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
    });
    
    // 우클릭 방지
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
    
    // 키보드 단축키 방지
    document.addEventListener('keydown', function(e) {
        // Ctrl+C (복사)
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
        }
        // Ctrl+A (전체 선택)
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
        }
        // Ctrl+X (잘라내기)
        if (e.ctrlKey && e.key === 'x') {
            e.preventDefault();
        }
        // Ctrl+V (붙여넣기)
        if (e.ctrlKey && e.key === 'v') {
            e.preventDefault();
        }
        // Ctrl+S (저장)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
        }
        // Ctrl+P (인쇄)
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
        }
        // F12 (개발자 도구)
        if (e.key === 'F12') {
            e.preventDefault();
        }
    });
    
    // 드래그 방지
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
    });
    */
}

// 로그인 상태 확인
function checkLoginStatus() {
    console.log('로그인 상태 확인 중...');
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        console.log('저장된 사용자:', currentUser);
        updateAuthButton();
    } else {
        console.log('저장된 사용자 없음');
    }
}

// 인증 버튼 업데이트
function updateAuthButton() {
    const authBtn = document.querySelector('.auth-btn');
    if (authBtn) {
        if (currentUser) {
            authBtn.textContent = '로그아웃';
            console.log('버튼 텍스트: 로그아웃');
        } else {
            authBtn.textContent = '로그인';
            console.log('버튼 텍스트: 로그인');
        }
    } else {
        console.log('인증 버튼을 찾을 수 없음');
    }
}

// 로그인 모달 표시
function showLoginModal() {
    console.log('로그인 모달 표시 함수 호출');
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        // 로그인 폼 초기화
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
            console.log('로그인 폼 초기화 완료');
            
            // 자동완성 방지를 위한 추가 설정
            const loginIdInput = document.getElementById('loginId');
            const loginPasswordInput = document.getElementById('loginPassword');
            
            if (loginIdInput) {
                loginIdInput.value = '';
                loginIdInput.setAttribute('autocomplete', 'off');
                loginIdInput.setAttribute('autocapitalize', 'off');
                loginIdInput.setAttribute('autocorrect', 'off');
                loginIdInput.setAttribute('spellcheck', 'false');
                loginIdInput.setAttribute('data-form-type', 'other');
            }
            
            if (loginPasswordInput) {
                loginPasswordInput.value = '';
                loginPasswordInput.setAttribute('autocomplete', 'new-password');
                loginPasswordInput.setAttribute('autocapitalize', 'off');
                loginPasswordInput.setAttribute('autocorrect', 'off');
                loginPasswordInput.setAttribute('spellcheck', 'false');
                loginPasswordInput.setAttribute('data-form-type', 'other');
                loginPasswordInput.setAttribute('data-lpignore', 'true');
                loginPasswordInput.setAttribute('data-1p-ignore', 'true');
                loginPasswordInput.setAttribute('data-bwignore', 'true');
                // 안내창 방지를 위한 추가 속성
                loginPasswordInput.removeAttribute('title');
                loginPasswordInput.setAttribute('aria-label', '비밀번호 입력');
            }
            
            // 더미 필드들에 값 설정 (브라우저가 이 필드들을 자동완성하도록 유도)
            const dummyUsername = loginForm.querySelector('input[autocomplete="username"]');
            const dummyPassword = loginForm.querySelector('input[autocomplete="current-password"]');
            
            if (dummyUsername) {
                dummyUsername.value = 'dummy_username';
            }
            if (dummyPassword) {
                dummyPassword.value = 'dummy_password';
            }
        }
        
        loginModal.style.display = 'flex';
        console.log('로그인 모달 표시됨');
        
        // 추가 자동완성 방지 - 포커스 이벤트에서 값 초기화
        setTimeout(() => {
            const loginIdInput = document.getElementById('loginId');
            const loginPasswordInput = document.getElementById('loginPassword');
            
            if (loginIdInput) {
                loginIdInput.addEventListener('focus', function() {
                    if (this.value && this.value !== '') {
                        this.value = '';
                    }
                });
            }
            
            if (loginPasswordInput) {
                // 비밀번호 필드 포커스 시 안내창 완전 제거
                loginPasswordInput.addEventListener('focus', function() {
                    if (this.value && this.value !== '') {
                        this.value = '';
                    }
                    // 안내창 완전 제거
                    this.removeAttribute('title');
                    this.setAttribute('title', '');
                    this.removeAttribute('title');
                    // 추가 안내창 방지 속성
                    this.setAttribute('data-lpignore', 'true');
                    this.setAttribute('data-1p-ignore', 'true');
                    this.setAttribute('data-bwignore', 'true');
                });
                
                // 비밀번호 필드 클릭 시 즉시 값 초기화 및 안내창 완전 제거
                loginPasswordInput.addEventListener('click', function() {
                    setTimeout(() => {
                        if (this.value && this.value !== '') {
                            this.value = '';
                        }
                        // 안내창 완전 제거
                        this.removeAttribute('title');
                        this.setAttribute('title', '');
                        this.removeAttribute('title');
                        // 추가 안내창 방지 속성
                        this.setAttribute('data-lpignore', 'true');
                        this.setAttribute('data-1p-ignore', 'true');
                        this.setAttribute('data-bwignore', 'true');
                    }, 10);
                });
                
                // 마우스 오버 시에도 안내창 제거
                loginPasswordInput.addEventListener('mouseenter', function() {
                    this.removeAttribute('title');
                    this.setAttribute('title', '');
                    this.removeAttribute('title');
                });
            }
        }, 100);
        
        // 모바일에서 추가 처리
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            console.log('모바일 로그인 모달 추가 처리');
            // 모바일에서 입력 필드 포커스
            setTimeout(() => {
                const loginIdInput = document.getElementById('loginId');
                if (loginIdInput) {
                    loginIdInput.focus();
                    console.log('모바일 로그인 ID 필드 포커스');
                }
            }, 200);
        }
    } else {
        console.log('로그인 모달을 찾을 수 없음');
    }
}

// 로그인 모달 닫기
function closeLoginModal() {
    console.log('로그인 모달 닫기');
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'none';
    }
}

// 인증 토글 (로그인/로그아웃)
function toggleAuth() {
    console.log('toggleAuth 호출됨, currentUser:', currentUser);
    console.log('기기 타입:', /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? '모바일' : 'PC');
    
    if (currentUser) {
        // 로그아웃
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateAuthButton();
        console.log('로그아웃 완료');
        
        // 로그인 폼 초기화
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
            console.log('로그인 폼 초기화 완료');
        }
        
        // 로그아웃 후 목록 업데이트 (Firestore에서 다시 불러오지 않음)
        // 현재 메모리의 inquiries 배열을 그대로 유지하여 삭제된 항목이 다시 나타나지 않도록 함
        loadInquiries(); // 목록 다시 렌더링
        updateTotalCount(); // 총 개수 업데이트
        
        // 강화된 데이터 동기화
        syncDataAcrossDevices();
        
    } else {
        // 로그인 모달 표시
        console.log('로그인 모달 표시 시도');
        showLoginModal();
        
        // 모바일에서 추가 처리
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            console.log('모바일 로그인 모달 표시 후 추가 처리');
            setTimeout(() => {
                const loginModal = document.getElementById('loginModal');
                if (loginModal && loginModal.style.display !== 'flex') {
                    console.log('모바일에서 로그인 모달 강제 표시');
                    loginModal.style.display = 'flex';
                }
            }, 100);
        }
    }
}

// 문의 목록 로드
function loadInquiries() {
    console.log('loadInquiries 함수 호출됨');
    console.log('전체 문의 개수:', inquiries.length);
    console.log('현재 페이지:', currentPage);
    
    // 새로 등록한 매물이 맨 위에 오도록 정렬 (ID 내림차순)
    const sortedInquiries = [...inquiries].sort((a, b) => b.id - a.id);
    console.log('정렬된 문의 데이터 ID 목록:', sortedInquiries.map(inq => inq.id));
    
    const tbody = document.getElementById('inquiryList');
    const deleteHeader = document.getElementById('deleteHeader');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageInquiries = sortedInquiries.slice(startIndex, endIndex);
    
    console.log('페이지 범위:', startIndex, '~', endIndex);
    console.log('현재 페이지 문의 개수:', pageInquiries.length);
    
    // 삭제 헤더 표시/숨김
    if (deleteHeader) {
        deleteHeader.style.display = currentUser ? 'table-cell' : 'none';
    }
    
    if (!tbody) {
        console.error('inquiryList tbody를 찾을 수 없음');
        return;
    }
    
    tbody.innerHTML = '';
    
    pageInquiries.forEach((inquiry, index) => {
        console.log(`문의 ${index + 1}:`, inquiry);
        const row = document.createElement('tr');
        const deleteButton = currentUser ? `<button class="delete-btn" onclick="deleteInquiry(${inquiry.id})">삭제</button>` : '';
        
        // 작성자 이름 처리 - 첫 글자만 표시 (강화된 버전)
        let authorDisplay = inquiry.author;
        if (inquiry.author) {
            // 모든 경우에 첫 글자만 표시
            const firstName = inquiry.author.split('**')[0]; // ** 이전 부분만 추출
            if (firstName.length > 0) {
                authorDisplay = firstName.charAt(0) + '**';
            } else {
                authorDisplay = inquiry.author.charAt(0) + '**';
            }
        }
        
        row.innerHTML = `
            <td>${inquiry.id}</td>
            <td><span class="tag ${inquiry.type === 'sell' ? 'sell' : 'buy'}">${inquiry.type === 'sell' ? '내놈' : '구함'}</span></td>
            <td><span class="clickable-text" onclick="showDetailModal(${inquiry.id})">${formatPropertyTypeForMobile(inquiry.category)}</span></td>
            <td><span class="clickable-text" onclick="showDetailModal(${inquiry.id})">${inquiry.title}</span></td>
            <td>${authorDisplay}</td>
            <td>${inquiry.date}</td>
            <td>${deleteButton}</td>
        `;
        tbody.appendChild(row);
    });
    
    console.log('목록 렌더링 완료');
    updatePagination();
}

// 문의 삭제 함수
function deleteInquiry(inquiryId) {
    // 삭제 확인
    if (!confirm('정말로 이 문의를 삭제하시겠습니까?')) {
        return;
    }
    
    // 문의 목록에서 해당 항목 찾기 및 삭제
    const index = inquiries.findIndex(inquiry => inquiry.id === inquiryId);
    if (index !== -1) {
        inquiries.splice(index, 1);
        saveInquiriesToFirestore(); // Firestore에 저장
        
        // 현재 페이지가 비어있고 이전 페이지가 있다면 이전 페이지로 이동
        const totalPages = Math.ceil(inquiries.length / itemsPerPage);
        if (currentPage > totalPages && currentPage > 1) {
            currentPage = totalPages;
        }
        
        // 목록 다시 로드
        loadInquiries();
        updateTotalCount();
        
        alert('문의가 삭제되었습니다.');
    }
}

// 전체 개수 업데이트
function updateTotalCount() {
    console.log('updateTotalCount 함수 호출됨');
    console.log('업데이트할 총 개수:', inquiries.length);
    
    const totalCountElement = document.getElementById('totalCount');
    if (totalCountElement) {
        totalCountElement.textContent = inquiries.length;
        console.log('총 개수 업데이트 완료:', inquiries.length);
    } else {
        console.error('totalCount 요소를 찾을 수 없음');
    }
}

// 페이지네이션 업데이트
function updatePagination() {
    const totalPages = Math.ceil(inquiries.length / itemsPerPage);
    const pagination = document.querySelector('.pagination');
    const pageButtons = pagination.querySelectorAll('.page-btn:not(.next):not(.last)');
    
    pageButtons.forEach((btn, index) => {
        if (index < totalPages) {
            btn.style.display = 'inline-block';
            btn.classList.toggle('active', index + 1 === currentPage);
        } else {
            btn.style.display = 'none';
        }
    });
}

// 페이지 변경
function changePage(page) {
    currentPage = page;
    loadInquiries();
}

// 다음 페이지
function nextPage() {
    const totalPages = Math.ceil(inquiries.length / itemsPerPage);
    if (currentPage < totalPages) {
        changePage(currentPage + 1);
    }
}

// 마지막 페이지
function lastPage() {
    const totalPages = Math.ceil(inquiries.length / itemsPerPage);
    changePage(totalPages);
}

// 문의작성 모달 표시
function showWriteModal() {
    document.getElementById('writeModal').style.display = 'flex';
    resetForm();
}

// 문의작성 모달 닫기
function closeWriteModal() {
    document.getElementById('writeModal').style.display = 'none';
}

// 상세보기 모달 표시
function showDetailModal(inquiryId) {
    console.log('상세보기 모달 호출됨, inquiryId:', inquiryId);
    console.log('현재 사용자:', currentUser);
    
    // 로그인 상태 확인
    if (!currentUser) {
        return; // 로그인하지 않은 경우 아무 반응 없음
    }
    
    const inquiry = inquiries.find(inq => inq.id === inquiryId);
    if (!inquiry) return;
    
    const detailContent = document.getElementById('detailContent');
    detailContent.innerHTML = `
        <div class="detail-item">
            <h4>기본 정보</h4>
            <p><strong>번호:</strong> ${inquiry.id}</p>
            <p><strong>구분:</strong> <span class="tag ${inquiry.type === 'sell' ? 'sell' : 'buy'}">${inquiry.type === 'sell' ? '내놈' : '구함'}</span></p>
            <p><strong>거래종류:</strong> ${inquiry.category}</p>
            <p><strong>제목:</strong> ${inquiry.title}</p>
            <p><strong>작성자:</strong> ${inquiry.author}</p>
            <p><strong>등록일:</strong> ${inquiry.date}</p>
        </div>
        <div class="detail-item">
            <h4>상세 정보</h4>
            <p><strong>거래유형:</strong> ${inquiry.details.transactionType}</p>
            <p><strong>위치:</strong> ${inquiry.details.location}</p>
            <p><strong>희망금액:</strong> ${inquiry.details.price}</p>
            <p><strong>매물종류:</strong> ${inquiry.details.propertyType}</p>
            <p><strong>연락처:</strong> ${inquiry.details.contact}</p>
        </div>
        <div class="detail-item">
            <h4>상세내용</h4>
            <p>${inquiry.details.content}</p>
        </div>
    `;
    
    document.getElementById('detailModal').style.display = 'flex';
}

// 상세보기 모달 닫기
function closeDetailModal() {
    document.getElementById('detailModal').style.display = 'none';
}

// 탭 전환
function switchTab(tab) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    if (tab === 'buy') {
        tabButtons[0].classList.add('active');
    } else {
        tabButtons[1].classList.add('active');
    }
}

// 라디오 버튼 선택
function selectRadio(button, value) {
    const radioGroup = button.parentElement;
    const radioButtons = radioGroup.querySelectorAll('.radio-btn');
    radioButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

// 폼 초기화
function resetForm() {
    document.getElementById('buyForm').reset();
    document.querySelectorAll('.radio-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.radio-btn').classList.add('active');
    document.querySelectorAll('.property-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.property-btn').classList.add('active');
    document.getElementById('termsAgree').checked = false;
}

// 파일 삭제 함수
function deleteFile() {
    const fileInput = document.querySelector('.file-input');
    const deleteBtn = document.querySelector('.file-delete-btn');
    
    if (fileInput) {
        fileInput.value = '';
        // 삭제 버튼 숨기기
        if (deleteBtn) {
            deleteBtn.style.display = 'none';
        }
    }
}

// 폼 유효성 검사 (문의작성 폼 전용)
function validateForm(data) {
    console.log('문의작성 폼 유효성 검사 시작');
    
    // 문의작성 모달이 열려있는지 확인
    const writeModal = document.getElementById('writeModal');
    if (!writeModal || writeModal.style.display !== 'flex') {
        console.log('문의작성 모달이 열려있지 않음 - 검사 중단');
        return false;
    }
    
    // 문의작성 모달 내부 요소들이 존재하는지 확인
    const tabBtn = document.querySelector('.tab-btn.active');
    const radioBtn = document.querySelector('.radio-btn.active');
    const propertyBtn = document.querySelector('.property-btn.active');
    
    if (!tabBtn || !radioBtn || !propertyBtn) {
        console.log('문의작성 모달 내부 요소를 찾을 수 없음 - 검사 중단');
        return false;
    }
    
    // 거래유형 선택 확인
    if (!radioBtn) {
        console.log('거래유형 미선택');
        alert('거래유형을 선택해주세요.');
        return false;
    }
    console.log('거래유형 선택됨:', radioBtn.textContent);
    
    // 위치 입력 확인
    const city = document.querySelector('.location-select');
    const district = document.querySelectorAll('.location-select')[1];
    const neighborhoodElement = document.querySelectorAll('.location-select')[2];
    const address = document.querySelector('.address-input');
    
    if (!city || !district || !neighborhoodElement || !address) {
        console.log('위치 입력 요소를 찾을 수 없음');
        alert('위치 정보를 입력해주세요.');
        return false;
    }
    
    console.log('위치 정보:', { 
        city: city.value, 
        district: district.value, 
        address: address.value 
    });
    
    // 동/읍/면 검증 (select 또는 input 모두 처리)
    let neighborhood = '';
    if (neighborhoodElement.tagName === 'SELECT') {
        neighborhood = neighborhoodElement.value;
    } else if (neighborhoodElement.tagName === 'INPUT') {
        neighborhood = neighborhoodElement.value;
    }
    
    console.log('동/읍/면:', neighborhood);
    
    if (city.value === '시/도' || district.value === '구/군' || 
        (neighborhoodElement.tagName === 'SELECT' && neighborhood === '동/읍/면') || 
        (neighborhoodElement.tagName === 'INPUT' && !neighborhood.trim())) {
        // 구함/내놈에 따른 다른 안내 메시지
        const isSell = tabBtn.textContent === '내놈';
        console.log('위치 정보 미입력, isSell:', isSell);
        if (isSell) {
            alert('위치 정보를 모두 입력해주세요.');
        } else {
            alert('위치정보를 동/읍/면까지 입력해주세요.');
        }
        return false;
    }
    
    // 내놈일 때 상세주소 검증 추가
    const isSell = tabBtn.textContent === '내놈';
    if (isSell && (!address.value || !address.value.trim())) {
        console.log('내놈에서 상세주소 미입력');
        alert('상세주소까지 입력해주세요.');
        return false;
    }
    
    // 매물종류 선택 확인
    if (!propertyBtn) {
        console.log('매물종류 미선택');
        alert('매물종류를 선택해주세요.');
        return false;
    }
    console.log('매물종류 선택됨:', propertyBtn.textContent);
    
    if (!data.name.trim()) {
        console.log('이름 미입력');
        alert('이름을 입력해주세요.');
        return false;
    }
    
    if (!data.contact.trim()) {
        console.log('연락처 미입력');
        alert('연락처를 입력해주세요.');
        return false;
    }
    
    if (!data.title.trim()) {
        console.log('제목 미입력');
        alert('제목을 입력해주세요.');
        return false;
    }
    
    if (!data.content.trim()) {
        console.log('상세내용 미입력');
        alert('상세내용을 입력해주세요.');
        return false;
    }
    
    // 개인정보 동의 확인
    const termsAgree = document.getElementById('termsAgree');
    if (!termsAgree || !termsAgree.checked) {
        console.log('이용약관 미동의');
        alert('이용약관에 동의해주세요.');
        return false;
    }
    
    console.log('문의작성 폼 유효성 검사 통과');
    return true;
}

// 전화번호 자동 하이픈 추가 함수
function formatPhoneNumber(input) {
    // 숫자만 추출
    let value = input.value.replace(/[^0-9]/g, '');
    
    // 길이에 따라 하이픈 추가
    if (value.length <= 3) {
        input.value = value;
    } else if (value.length <= 7) {
        input.value = value.slice(0, 3) + '-' + value.slice(3);
    } else if (value.length <= 11) {
        input.value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
    } else {
        input.value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
    }
}

// 모달 외부 클릭 시 닫기
window.addEventListener('click', function(e) {
    const loginModal = document.getElementById('loginModal');
    const writeModal = document.getElementById('writeModal');
    const detailModal = document.getElementById('detailModal');
    
    if (e.target === loginModal) {
        closeLoginModal();
    }
    
    if (e.target === writeModal) {
        closeWriteModal();
    }
    
    if (e.target === detailModal) {
        closeDetailModal();
    }
}); 

// localStorage에 저장된 데이터의 작성자 이름을 강제로 수정하는 함수
function fixAuthorNamesInStorage() {
    console.log('저장된 데이터의 작성자 이름 수정 시작');
    const savedInquiries = localStorage.getItem('allInquiries');
    
    if (savedInquiries) {
        try {
            const loadedInquiries = JSON.parse(savedInquiries);
            let modified = false;
            
            loadedInquiries.forEach(inquiry => {
                if (inquiry.author && inquiry.author.includes('**')) {
                    // ** 이전 부분만 추출하여 첫 글자만 표시
                    const firstName = inquiry.author.split('**')[0];
                    if (firstName.length > 1) {
                        inquiry.author = firstName.charAt(0) + '**';
                        modified = true;
                        console.log('작성자 이름 수정:', firstName, '→', inquiry.author);
                    }
                }
            });
            
            if (modified) {
                localStorage.setItem('allInquiries', JSON.stringify(loadedInquiries));
                console.log('작성자 이름 수정 완료');
            }
        } catch (error) {
            console.error('작성자 이름 수정 중 오류:', error);
        }
    }
}

// 모바일과 PC 간의 데이터 동기화 강화 함수
function syncDataAcrossDevices() {
    console.log('=== 기기 간 데이터 동기화 시작 ===');
    
    // 현재 기기 정보 로깅
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log('현재 기기 타입:', isMobile ? '모바일' : 'PC');
    console.log('사용자 에이전트:', navigator.userAgent);
    
    // Firestore에서 데이터 강제 로드
    const savedInquiries = localStorage.getItem('allInquiries');
    console.log('Firestore에서 읽은 데이터:', savedInquiries);
    
    if (savedInquiries) {
        try {
            const loadedInquiries = JSON.parse(savedInquiries);
            console.log('파싱된 데이터 개수:', loadedInquiries.length);
            console.log('데이터 ID 목록:', loadedInquiries.map(inq => inq.id));
            
            // 데이터 업데이트
            inquiries = loadedInquiries;
            
            // UI 강제 업데이트
            currentPage = 1;
            loadInquiries();
            updateTotalCount();
            
            console.log('데이터 동기화 완료');
        } catch (error) {
            console.error('데이터 동기화 중 오류:', error);
        }
    } else {
        console.log('localStorage에 데이터 없음 - Firestore에서 로드 시도');
        // localStorage에 데이터가 없으면 Firestore에서 로드하되, 기본 데이터로 되돌아가지 않도록 함
        loadInquiriesFromFirestore();
    }
    
    console.log('=== 기기 간 데이터 동기화 완료 ===');
}

// 강제 데이터 저장 및 동기화
function forceSaveAndSync() {
    console.log('=== 강제 저장 및 동기화 시작 ===');
    
    try {
        // 현재 데이터를 Firestore에 강제 저장
        const dataToSave = JSON.stringify(inquiries);
        localStorage.setItem('allInquiries', dataToSave);
        console.log('강제 저장 완료:', inquiries.length, '개');
        
        // 저장 확인
        const savedData = localStorage.getItem('allInquiries');
        console.log('저장 확인:', savedData ? '성공' : '실패');
        
        // 즉시 동기화
        syncDataAcrossDevices();
        
    } catch (error) {
        console.error('강제 저장 중 오류:', error);
    }
    
    console.log('=== 강제 저장 및 동기화 완료 ===');
}

// 기존 데이터에서 "~전부보기" 텍스트 제거
function removeAllPropertyTypeSuffixes() {
    inquiries.forEach(inquiry => {
        if (inquiry.category && inquiry.category.includes(' 전부 보기')) {
            inquiry.category = inquiry.category.replace(' 전부 보기', '');
        }
        if (inquiry.details && inquiry.details.propertyType && inquiry.details.propertyType.includes(' 전부 보기')) {
            inquiry.details.propertyType = inquiry.details.propertyType.replace(' 전부 보기', '');
        }
    });
}

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    removeAllPropertyTypeSuffixes();
});

// 모바일에서 거래종류 텍스트를 두 줄로 나누는 함수
function formatPropertyTypeForMobile(text) {
    console.log('formatPropertyTypeForMobile 호출됨:', text);
    
    if (!text) return '';
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log('모바일 감지:', isMobile);
    
    if (!isMobile) {
        console.log('PC 환경 - 원본 텍스트 반환:', text);
        return text;
    }
    
    // 모바일에서만 두 줄로 나누기
    const mappings = {
        '상가 임대': '상가<br>임대',
        '사무실 임대': '사무실<br>임대',
        '상가 매매': '상가<br>매매',
        '건물 매매': '건물<br>매매',
        '건물매매': '건물<br>매매',
        '사무실 매매': '사무실<br>매매',
        '토지 매매': '토지<br>매매',
        '토지 임대': '토지<br>임대',
        '아파트 매매': '아파트<br>매매',
        '아파트 임대': '아파트<br>임대',
        '빌라 매매': '빌라<br>매매',
        '빌라 임대': '빌라<br>임대',
        '원룸 매매': '원룸<br>매매',
        '원룸 임대': '원룸<br>임대',
        '오피스텔 매매': '오피스텔<br>매매',
        '오피스텔 임대': '오피스텔<br>임대',
        '기타': '기타'
    };
    
    const result = mappings[text] || text;
    console.log('변환 결과:', text, '→', result);
    return result;
}