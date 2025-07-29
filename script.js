// 사용자 정보
let currentUser = null;

// 샘플 데이터 (상세 정보 포함)
let inquiries = [
    {
        id: 58,
        type: 'sell',
        category: '상가 매매 전부 보기',
        title: '구월동 아시아드 사거리 주차장건물 1층상가 매도 의뢰',
        author: '박**',
        date: '2025-06-11',
        details: {
            transactionType: '매매',
            location: '인천광역시 남동구 구월동',
            price: '협의',
            propertyType: '상가 매매 전부 보기',
            contact: '010-1234-5678',
            content: '구월동 아시아드 사거리 주차장건물 1층상가 매도 의뢰합니다. 위치가 좋고 교통이 편리합니다. 관심 있으신 분 연락 부탁드립니다.'
        }
    },
    {
        id: 57,
        type: 'sell',
        category: '건물 매매 전부 보기',
        title: '토지와 2종 근생 사무실용도 통건물 매도 의뢰',
        author: '김**',
        date: '2025-06-02',
        details: {
            transactionType: '매매',
            location: '경기도 성남시 분당구',
            price: '협의',
            propertyType: '건물 매매 전부 보기',
            contact: '010-2345-6789',
            content: '토지와 2종 근생 사무실용도 통건물 매도 의뢰합니다. 사무실로 사용하기 좋은 위치입니다.'
        }
    },
    {
        id: 56,
        type: 'sell',
        category: '상가 매매 전부 보기',
        title: '뷰티샵',
        author: '이**',
        date: '2025-05-29',
        details: {
            transactionType: '매매',
            location: '서울특별시 강남구',
            price: '협의',
            propertyType: '상가 매매 전부 보기',
            contact: '010-3456-7890',
            content: '뷰티샵 매도 의뢰합니다. 고객층이 안정적이고 수익성이 좋습니다.'
        }
    },
    {
        id: 55,
        type: 'sell',
        category: '상가 매매 전부 보기',
        title: '상가 1개호 팝니다',
        author: '유**',
        date: '2025-05-25',
        details: {
            transactionType: '매매',
            location: '인천광역시 연수구',
            price: '협의',
            propertyType: '상가 매매 전부 보기',
            contact: '010-4567-8901',
            content: '상가 1개호 팝니다. 위치가 좋고 임대 수익이 안정적입니다.'
        }
    },
    {
        id: 54,
        type: 'sell',
        category: '상가 매매 전부 보기',
        title: '상가 매매 희망합니다.',
        author: '장**',
        date: '2025-05-20',
        details: {
            transactionType: '매매',
            location: '경기도 부천시',
            price: '협의',
            propertyType: '상가 매매 전부 보기',
            contact: '010-5678-9012',
            content: '상가 매매 희망합니다. 좋은 조건으로 거래하겠습니다.'
        }
    },
    {
        id: 53,
        type: 'sell',
        category: '상가 매매 전부 보기',
        title: '인하대학교 근접 상가 건물 매매',
        author: '진**',
        date: '2025-05-15',
        details: {
            transactionType: '매매',
            location: '인천광역시 미추홀구',
            price: '협의',
            propertyType: '상가 매매 전부 보기',
            contact: '010-6789-0123',
            content: '인하대학교 근접 상가 건물 매매합니다. 학생들이 많이 지나다니는 위치입니다.'
        }
    },
    {
        id: 52,
        type: 'sell',
        category: '상가 매매 전부 보기',
        title: '문의 남깁니다.',
        author: '홍**',
        date: '2025-05-10',
        details: {
            transactionType: '매매',
            location: '서울특별시 마포구',
            price: '협의',
            propertyType: '상가 매매 전부 보기',
            contact: '010-7890-1234',
            content: '문의 남깁니다. 상가 매매에 관심 있으신 분 연락 부탁드립니다.'
        }
    },
    {
        id: 51,
        type: 'buy',
        category: '상가 임대 전부 보기',
        title: '인천시청역 근방으로 구합니다',
        author: '박**',
        date: '2025-05-05',
        details: {
            transactionType: '월세',
            location: '인천광역시 남동구',
            price: '협의',
            propertyType: '상가 임대 전부 보기',
            contact: '010-8901-2345',
            content: '인천시청역 근방으로 상가를 구합니다. 월세로 임대 가능한 곳 연락 부탁드립니다.'
        }
    },
    {
        id: 50,
        type: 'sell',
        category: '상가 매매 전부 보기',
        title: '매매 원합니다',
        author: '김**',
        date: '2025-05-01',
        details: {
            transactionType: '매매',
            location: '경기도 안산시',
            price: '협의',
            propertyType: '상가 매매 전부 보기',
            contact: '010-9012-3456',
            content: '매매 원합니다. 좋은 조건으로 거래하겠습니다.'
        }
    },
    {
        id: 49,
        type: 'sell',
        category: '상가 매매 전부 보기',
        title: '상가 매매',
        author: '이**',
        date: '2025-04-28',
        details: {
            transactionType: '매매',
            location: '인천광역시 부평구',
            price: '협의',
            propertyType: '상가 매매 전부 보기',
            contact: '010-0123-4567',
            content: '상가 매매합니다. 관심 있으신 분 연락 부탁드립니다.'
        }
    }
];

let currentPage = 1;
const itemsPerPage = 10; 

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('페이지 로드됨');
    // 로그인 상태 확인
    checkLoginStatus();
    loadInquiries();
    updateTotalCount();
    
    // 복사 방지 기능 추가
    preventCopy();
    
    // 매물종류 버튼 클릭 이벤트
    const propertyBtns = document.querySelectorAll('.property-btn');
    propertyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.property-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 초기 상세주소 필수 표시 설정 (기본값은 구해요)
    const addressLabel = document.querySelector('.address-label');
    if (addressLabel) {
        addressLabel.innerHTML = '상세주소';
    }
    
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
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('로그인 폼 제출됨');
            
            const loginId = document.getElementById('loginId').value;
            const loginPassword = document.getElementById('loginPassword').value;
            
            console.log('입력된 아이디:', loginId);
            console.log('입력된 비밀번호:', loginPassword);
            
            // 로그인 검증
            if (loginId === 'kongri61' && loginPassword === 'rlaehdghk61@') {
                
                currentUser = {
                    id: loginId,
                    name: '사용자',
                    role: 'user'
                };
                
                // 로그인 정보 저장
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // 모달 닫기
                closeLoginModal();
                updateAuthButton();
                
                console.log('로그인 성공:', currentUser);
                
                // 목록 다시 로드 (삭제 버튼 표시)
                loadInquiries();
                
                // 폼 초기화
                this.reset();
            } else {
                alert('아이디 또는 비밀번호가 올바르지 않습니다.');
                console.log('로그인 실패');
            }
        });
    }
    
    // 문의작성 폼 이벤트 리스너
    const buyForm = document.getElementById('buyForm');
    if (buyForm) {
        buyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 수집
            const inquiryData = {
                type: document.querySelector('.tab-btn.active').textContent === '구해요' ? 'buy' : 'sell',
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
            
            // 유효성 검사
            if (!validateForm(inquiryData)) {
                return;
            }
            
            // 새 문의 추가
            const newInquiry = {
                id: inquiries.length + 1,
                type: inquiryData.type,
                category: inquiryData.propertyType,
                title: inquiryData.title,
                author: inquiryData.name + '**',
                date: inquiryData.date,
                details: {
                    transactionType: inquiryData.transactionType,
                    location: `${inquiryData.location.city} ${inquiryData.location.district} ${inquiryData.location.neighborhood} ${inquiryData.location.address}`,
                    price: inquiryData.price || '협의',
                    propertyType: inquiryData.propertyType,
                    contact: inquiryData.contact,
                    content: inquiryData.content
                }
            };
            
            inquiries.unshift(newInquiry);
            
            // 성공 메시지
            alert('문의가 성공적으로 등록되었습니다.');
            
            // 모달 닫기
            closeWriteModal();
            loadInquiries();
            updateTotalCount();
            
            // 폼 초기화
            resetForm();
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
}); 

// 복사 방지 기능
function preventCopy() {
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
    console.log('로그인 모달 표시');
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'flex';
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
    if (currentUser) {
        // 로그아웃
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateAuthButton();
        console.log('로그아웃 완료');
    } else {
        // 로그인 모달 표시
        showLoginModal();
    }
    
    // 목록 다시 로드 (삭제 버튼 표시/숨김)
    loadInquiries();
}

// 문의 목록 로드
function loadInquiries() {
    const tbody = document.getElementById('inquiryList');
    const deleteHeader = document.getElementById('deleteHeader');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageInquiries = inquiries.slice(startIndex, endIndex);
    
    // 삭제 헤더 표시/숨김
    if (deleteHeader) {
        deleteHeader.style.display = currentUser ? 'table-cell' : 'none';
    }
    
    tbody.innerHTML = '';
    
    pageInquiries.forEach(inquiry => {
        const row = document.createElement('tr');
        const deleteButton = currentUser ? `<button class="delete-btn" onclick="deleteInquiry(${inquiry.id})">삭제</button>` : '';
        
        row.innerHTML = `
            <td>${inquiry.id}</td>
            <td><span class="tag ${inquiry.type === 'sell' ? 'sell' : 'buy'}">${inquiry.type === 'sell' ? '팔아요' : '구해요'}</span></td>
            <td><span class="clickable-text" onclick="showDetailModal(${inquiry.id})">${inquiry.category}</span></td>
            <td><span class="clickable-text" onclick="showDetailModal(${inquiry.id})">${inquiry.title}</span></td>
            <td>${inquiry.author}</td>
            <td>${inquiry.date}</td>
            <td>${deleteButton}</td>
        `;
        tbody.appendChild(row);
    });
    
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
    document.getElementById('totalCount').textContent = inquiries.length;
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
            <p><strong>구분:</strong> <span class="tag ${inquiry.type === 'sell' ? 'sell' : 'buy'}">${inquiry.type === 'sell' ? '팔아요' : '구해요'}</span></p>
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
        // 구해요일 때는 상세주소 필수 표시 제거
        const addressLabel = document.querySelector('.address-label');
        if (addressLabel) {
            addressLabel.innerHTML = '상세주소';
        }
    } else {
        tabButtons[1].classList.add('active');
        // 팔아요일 때는 상세주소 필수 표시 추가
        const addressLabel = document.querySelector('.address-label');
        if (addressLabel) {
            addressLabel.innerHTML = '상세주소 <span class="required">* 필수</span>';
        }
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

// 폼 유효성 검사
function validateForm(data) {
    // 거래유형 선택 확인
    const selectedTransactionType = document.querySelector('.radio-btn.active');
    if (!selectedTransactionType) {
        alert('거래유형을 선택해주세요.');
        return false;
    }
    
    // 위치 입력 확인
    const city = document.querySelector('.location-select').value;
    const district = document.querySelectorAll('.location-select')[1].value;
    const neighborhoodElement = document.querySelectorAll('.location-select')[2];
    const address = document.querySelector('.address-input').value;
    
    // 동/읍/면 검증 (select 또는 input 모두 처리)
    let neighborhood = '';
    if (neighborhoodElement.tagName === 'SELECT') {
        neighborhood = neighborhoodElement.value;
    } else if (neighborhoodElement.tagName === 'INPUT') {
        neighborhood = neighborhoodElement.value;
    }
    
    if (city === '시/도' || district === '구/군' || 
        (neighborhoodElement.tagName === 'SELECT' && neighborhood === '동/읍/면') || 
        (neighborhoodElement.tagName === 'INPUT' && !neighborhood.trim())) {
        // 구해요/팔아요에 따른 다른 안내 메시지
        const isSell = document.querySelector('.tab-btn.active').textContent === '팔아요';
        if (isSell) {
            alert('위치 정보를 모두 입력해주세요.');
        } else {
            alert('위치정보를 동/읍/면까지 입력해주세요.');
        }
        return false;
    }
    
    // 구해요/팔아요에 따른 상세주소 검증
    const isSell = document.querySelector('.tab-btn.active').textContent === '팔아요';
    if (isSell && !address.trim()) {
        alert('상세주소까지 입력해주세요.');
        return false;
    }
    
    // 매물종류 선택 확인
    const selectedProperty = document.querySelector('.property-btn.active');
    if (!selectedProperty) {
        alert('매물종류를 선택해주세요.');
        return false;
    }
    
    if (!data.name.trim()) {
        alert('이름을 입력해주세요.');
        return false;
    }
    
    if (!data.contact.trim()) {
        alert('연락처를 입력해주세요.');
        return false;
    }
    
    if (!data.title.trim()) {
        alert('제목을 입력해주세요.');
        return false;
    }
    
    if (!data.content.trim()) {
        alert('상세내용을 입력해주세요.');
        return false;
    }
    
    // 개인정보 동의 확인
    const termsAgree = document.getElementById('termsAgree').checked;
    if (!termsAgree) {
        alert('이용약관에 동의해주세요.');
        return false;
    }
    
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