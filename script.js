// 사용자 정보
let currentUser = null;

// 캐시 무효화를 위한 타임스탬프
console.log('Script.js 로드됨 - 버전 6.0 (2024-12-20 17:00) - 로그인 시 동기화 버튼 표시');

// 강제 캐시 무효화
if (window.location.search.indexOf('force_refresh') === -1) {
    const url = new URL(window.location);
    url.searchParams.set('force_refresh', Date.now());
    window.location.replace(url.toString());
}

// 페이지 로드 시 고정 버튼들 즉시 제거
document.addEventListener('DOMContentLoaded', function() {
    const existingFixedBtns = document.querySelectorAll('#syncBtn, #shareBtn, #syncTestBtn, #forceSyncBtn, #syncButton, #shareButton');
    existingFixedBtns.forEach(btn => {
        console.log('페이지 로드 시 고정 버튼 제거:', btn.id);
        btn.remove();
    });
    
    // 동기화 버튼 강제 숨김 (로그인 상태 확인 전)
    const syncButton = document.getElementById('syncButton');
    if (syncButton) {
        syncButton.style.display = 'none';
        console.log('동기화 버튼 강제 숨김');
    }
});

// window load 시에도 고정 버튼들 제거
window.addEventListener('load', function() {
    const existingFixedBtns = document.querySelectorAll('#syncBtn, #shareBtn, #syncTestBtn, #forceSyncBtn, #syncButton, #shareButton');
    existingFixedBtns.forEach(btn => {
        console.log('윈도우 로드 시 고정 버튼 제거:', btn.id);
        btn.remove();
    });
    
    // 동기화 버튼 강제 숨김 (로그인 상태 확인 전)
    const syncButton = document.getElementById('syncButton');
    if (syncButton) {
        syncButton.style.display = 'none';
        console.log('윈도우 로드 시 동기화 버튼 강제 숨김');
    }
});

// 간단한 실시간 동기화 시스템
let syncInterval = null;

// 실시간 동기화 시작
function startRealtimeSync() {
    console.log('실시간 동기화 시작');
    
    // 5초마다 동기화 체크
    syncInterval = setInterval(() => {
        checkForUpdates();
    }, 5000);
}

// 업데이트 체크
function checkForUpdates() {
    // URL에서 동기화 데이터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const syncData = urlParams.get('sync');
    
    if (syncData) {
        try {
            const decodedData = decodeURIComponent(syncData);
            const urlInquiries = JSON.parse(decodedData);
            
            if (urlInquiries.length !== inquiries.length) {
                console.log('동기화 데이터 발견:', urlInquiries.length, '개');
                inquiries = urlInquiries;
                localStorage.setItem('allInquiries', JSON.stringify(inquiries));
                loadInquiries();
                updateTotalCount();
                
                // URL에서 sync 파라미터 제거
                const newUrl = window.location.href.split('?')[0];
                window.history.replaceState({}, document.title, newUrl);
            }
        } catch (error) {
            console.error('동기화 오류:', error);
        }
    }
}

// 실시간 동기화 중지
function stopRealtimeSync() {
    if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
        console.log('실시간 동기화 중지');
    }
}

// 전역 함수로 동기화 기능 노출 (브라우저 주소창에서 직접 사용 가능)
window.syncData = function() {
    console.log('=== 동기화 시작 ===');
    console.log('현재 데이터 개수:', inquiries.length);
    
    // URL에서 동기화 시도
    if (syncFromURL()) {
        alert(`URL 동기화 완료!\n현재 데이터 개수: ${inquiries.length}개`);
        return;
    }
    
    // Firebase 동기화 시도
    loadInquiriesFromFirestore().then(() => {
        console.log('동기화 완료 - 데이터 개수:', inquiries.length);
        loadInquiries();
        updateTotalCount();
        alert(`Firebase 동기화 완료!\n현재 데이터 개수: ${inquiries.length}개`);
    }).catch(error => {
        console.error('동기화 실패:', error);
        alert('동기화 실패: ' + error.message);
    });
};

window.shareData = function() {
    shareToURL();
};

// 동적 버튼 생성 함수 제거됨

// 간단한 동기화 함수 (주소창에서 직접 사용)
window.sync = function() {
    console.log('sync 함수 호출됨');
    syncData();
};

// 간단한 공유 함수 (주소창에서 직접 사용)
window.share = function() {
    console.log('share 함수 호출됨');
    shareData();
};

// 동기화 시스템
window.perfectSync = function() {
    const dataToShare = JSON.stringify(inquiries);
    const encodedData = encodeURIComponent(dataToShare);
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('sync', encodedData);
    
    const shareUrl = currentUrl.toString();
    
    // QR 코드 생성 (여러 API 시도)
    const qrCodeUrl1 = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;
    const qrCodeUrl2 = `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${encodeURIComponent(shareUrl)}`;
    const qrCodeUrl3 = `https://quickchart.io/qr?text=${encodeURIComponent(shareUrl)}&size=200`;
    
    // 드래그 가능한 창 생성
    const copyArea = document.createElement('div');
    copyArea.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 2px solid #007bff;
        border-radius: 10px;
        padding: 20px;
        z-index: 999999;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        max-width: 90%;
        width: 600px;
        max-height: 80vh;
        overflow-y: auto;
    `;
    copyArea.innerHTML = `
        <h3>📤 동기화</h3>
        <p><strong>현재 데이터: ${inquiries.length}개</strong></p>
        
        <div style="display: flex; gap: 20px; margin: 15px 0;">
            <div style="flex: 1;">
                <h4>📱 모바일에서 스캔:</h4>
                <div style="text-align: center;">
                    <img src="${qrCodeUrl1}" alt="QR Code 1" style="width: 150px; height: 150px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 5px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <img src="${qrCodeUrl2}" alt="QR Code 2" style="width: 150px; height: 150px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 5px; display: none;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <img src="${qrCodeUrl3}" alt="QR Code 3" style="width: 150px; height: 150px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 5px; display: none;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div style="width: 150px; height: 150px; border: 2px dashed #ccc; border-radius: 5px; display: none; align-items: center; justify-content: center; background: #f8f9fa;">
                        <div style="text-align: center; color: #666; font-size: 12px;">
                            QR 코드 생성 실패<br>
                            URL을 직접 복사하세요
                        </div>
                    </div>
                </div>
                <p style="font-size: 12px; color: #666; margin-top: 5px;">QR 코드를 모바일로 스캔하세요</p>
            </div>
            <div style="flex: 1;">
                <h4>💻 PC에서 복사:</h4>
                <textarea readonly style="width: 100%; height: 120px; font-size: 11px; padding: 8px; border: 1px solid #ddd; border-radius: 5px; resize: none;">${shareUrl}</textarea>
                <button onclick="navigator.clipboard.writeText('${shareUrl}').then(() => alert('URL이 클립보드에 복사되었습니다!')).catch(() => alert('복사 실패! URL을 직접 선택해서 복사하세요.'))" style="background: #007bff; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; margin-top: 5px; font-size: 12px;">📋 복사</button>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 15px;">
            <button onclick="this.parentElement.parentElement.remove()" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">닫기</button>
        </div>
        
        <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 15px; font-size: 12px;">
            <strong>💡 사용법:</strong><br>
            1. <strong>모바일</strong>: QR 코드를 카메라로 스캔<br>
            2. <strong>PC</strong>: URL을 복사해서 다른 PC에서 열기<br>
            3. <strong>대안</strong>: URL을 카톡/문자로 전송<br>
            4. 자동으로 데이터가 동기화됩니다!
        </div>
    `;
    document.body.appendChild(copyArea);
    
    console.log('완벽한 동기화 URL 생성:', shareUrl);
};

// 간단한 데이터 통합 함수 (필요시 사용)
window.mergeData = function() {
    alert('데이터 통합 기능은 완벽동기화 버튼으로 대체되었습니다.');
};

// 현재 문의 목록 (실제 문의작성으로만 관리)
let inquiries = [];

// 간단한 동기화 시스템 (Firebase 대체)

// 간단한 URL 기반 동기화 시스템 (Firebase 대체)

// URL에서 데이터 동기화
function syncFromURL() {
    console.log('=== URL 동기화 시작 ===');
    
    try {
        // URL 파라미터에서 데이터 확인
        const urlParams = new URLSearchParams(window.location.search);
        const syncData = urlParams.get('sync');
        
        if (syncData) {
            console.log('URL에서 동기화 데이터 발견');
            const decodedData = decodeURIComponent(syncData);
            const urlInquiries = JSON.parse(decodedData);
            
            if (Array.isArray(urlInquiries) && urlInquiries.length > 0) {
                inquiries = urlInquiries;
                localStorage.setItem('allInquiries', JSON.stringify(inquiries));
                console.log('URL 동기화 완료:', inquiries.length, '개');
                loadInquiries();
                updateTotalCount();
                return true;
            }
        }
        
        return false;
    } catch (error) {
        console.error('URL 동기화 오류:', error);
        return false;
    }
}

// URL로 데이터 공유 (네이버 환경 최적화)
function shareToURL() {
    console.log('=== URL 공유 시작 ===');
    
    try {
        const dataToShare = JSON.stringify(inquiries);
        const encodedData = encodeURIComponent(dataToShare);
        
        // 현재 URL에 동기화 데이터 추가
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('sync', encodedData);
        
        console.log('공유 URL 생성:', currentUrl.toString());
        
        // 네이버 환경에서도 작동하는 공유 방법
        if (navigator.clipboard && window.isSecureContext) {
            // HTTPS 환경에서 클립보드 사용
            navigator.clipboard.writeText(currentUrl.toString()).then(() => {
                alert(`✅ 동기화 URL이 클립보드에 복사되었습니다!\n\n다른 기기에서 이 URL을 열면 데이터가 동기화됩니다.\n\n현재 데이터: ${inquiries.length}개`);
            }).catch(() => {
                // 클립보드 실패 시 수동 표시
                showShareModal(currentUrl.toString());
            });
        } else {
            // HTTP 환경이나 클립보드 지원 안함
            showShareModal(currentUrl.toString());
        }
        
    } catch (error) {
        console.error('URL 공유 오류:', error);
        alert('URL 공유 실패: ' + error.message);
    }
}

// 공유 모달 표시
function showShareModal(url) {
    // 기존 모달 제거
    const existingModal = document.getElementById('shareModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 공유 모달 생성
    const modal = document.createElement('div');
    modal.id = 'shareModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 10px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    
    modalContent.innerHTML = `
        <h3>📤 데이터 공유</h3>
        <p>다른 기기에서 이 URL을 열면 데이터가 동기화됩니다.</p>
        <p><strong>현재 데이터: ${inquiries.length}개</strong></p>
        <textarea readonly style="width: 100%; height: 100px; margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">${url}</textarea>
        <div style="text-align: center;">
            <button onclick="copyToClipboard('${url}')" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px;">복사</button>
            <button onclick="closeShareModal()" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">닫기</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // 모달 외부 클릭 시 닫기
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeShareModal();
        }
    };
}

// 클립보드 복사
function copyToClipboard(text) {
    try {
        navigator.clipboard.writeText(text).then(() => {
            alert('✅ URL이 클립보드에 복사되었습니다!');
        }).catch(() => {
            // 수동 복사 방법
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('✅ URL이 클립보드에 복사되었습니다!');
        });
    } catch (error) {
        alert('복사 실패: ' + error.message);
    }
}

// 공유 모달 닫기
function closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) {
        modal.remove();
    }
}
async function loadInquiriesFromStorage() {
    console.log('=== localStorage에서 데이터 불러오기 시작 ===');
    
    try {
        const savedInquiries = localStorage.getItem('allInquiries');
        
        if (savedInquiries) {
            const loadedInquiries = JSON.parse(savedInquiries);
            inquiries = loadedInquiries;
            console.log('localStorage에서 불러온 데이터:', loadedInquiries.length, '개');
            console.log('localStorage 데이터 ID 목록:', loadedInquiries.map(inq => inq.id));
        } else {
            console.log('localStorage에 데이터 없음 - 빈 배열로 초기화');
            inquiries = [];
        }
        
        return Promise.resolve();
        
    } catch (error) {
        console.error('localStorage 데이터 불러오기 오류:', error);
        inquiries = [];
        return Promise.reject(error);
    }
    
    console.log('=== localStorage 데이터 불러오기 완료 ===');
}

// Firebase 연결 시도 (실패 시 localStorage 사용)
async function loadInquiriesFromFirestore() {
    console.log('=== Firebase 연결 시도 ===');
    
    // Firebase가 초기화되지 않았으면 localStorage 사용
    if (typeof db === 'undefined') {
        console.log('Firebase가 초기화되지 않음 - localStorage 사용');
        return loadInquiriesFromStorage();
    }
    
    try {
        const snapshot = await db.collection('inquiries').orderBy('id', 'desc').get();
        const firestoreInquiries = [];
        
        snapshot.forEach(doc => {
            firestoreInquiries.push(doc.data());
        });
        
        console.log('Firestore에서 불러온 데이터:', firestoreInquiries.length, '개');
        
        if (firestoreInquiries.length > 0) {
            inquiries = firestoreInquiries;
            // localStorage도 동기화
            localStorage.setItem('allInquiries', JSON.stringify(inquiries));
            console.log('Firestore 데이터 사용 및 localStorage 동기화');
        } else {
            // Firestore에 데이터가 없으면 localStorage 확인
            return loadInquiriesFromStorage();
        }
        
        return Promise.resolve();
        
    } catch (error) {
        console.error('Firestore 데이터 불러오기 오류:', error);
        console.log('Firestore 실패 - localStorage 사용');
        return loadInquiriesFromStorage();
    }
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
        
        // Firestore 저장 성공 시 localStorage에도 저장
        localStorage.setItem('allInquiries', JSON.stringify(inquiries));
        console.log('localStorage에도 저장 완료');
        
    } catch (error) {
        console.error('Firestore 데이터 저장 오류:', error);
        console.log('Firestore 저장 실패 - localStorage에만 저장');
        
        // Firestore 저장 실패 시 localStorage에만 저장
        try {
            localStorage.setItem('allInquiries', JSON.stringify(inquiries));
            console.log('localStorage 저장 완료:', inquiries.length, '개');
        } catch (localError) {
            console.error('localStorage 저장 오류:', localError);
        }
    }
    
    console.log('=== Firestore 데이터 저장 완료 ===');
}

// 간단한 동기화 설정 (Firebase 실패 시 localStorage 사용)
function setupRealtimeSync() {
    console.log('=== 동기화 설정 시작 ===');
    
    // Firebase가 사용 가능한지 확인
    if (typeof db !== 'undefined') {
        console.log('Firebase 사용 가능 - 실시간 동기화 설정');
        
        try {
    db.collection('inquiries')
        .orderBy('id', 'desc')
        .onSnapshot(snapshot => {
                    console.log('실시간 데이터 변경 감지 - 문서 개수:', snapshot.size);
            
            const firestoreInquiries = [];
            snapshot.forEach(doc => {
                firestoreInquiries.push(doc.data());
            });
            
                    console.log('Firestore에서 받은 데이터 개수:', firestoreInquiries.length);
                    
                    // Firestore 데이터가 있으면 사용하고 localStorage도 업데이트
            if (firestoreInquiries.length > 0) {
                inquiries = firestoreInquiries;
                        localStorage.setItem('allInquiries', JSON.stringify(inquiries));
                loadInquiries();
                updateTotalCount();
                        console.log('실시간 데이터 업데이트 완료 - localStorage도 동기화됨');
                    } else {
                        console.log('Firestore에 데이터 없음 - localStorage 데이터 유지');
            }
        }, error => {
                    console.error('실시간 동기화 오류:', error);
                    console.log('Firebase 연결 실패 - localStorage만 사용');
                    
                    // Firebase 연결 실패 시 localStorage 데이터 로드
                    const savedInquiries = localStorage.getItem('allInquiries');
                    if (savedInquiries) {
                        try {
                            inquiries = JSON.parse(savedInquiries);
                            loadInquiries();
                            updateTotalCount();
                            console.log('localStorage 데이터로 복구 완료');
                        } catch (parseError) {
                            console.error('localStorage 데이터 파싱 오류:', parseError);
                        }
                    }
                });
            
            console.log('=== Firebase 실시간 동기화 설정 완료 ===');
        } catch (error) {
            console.error('Firebase 실시간 동기화 설정 오류:', error);
            console.log('Firebase 실패 - localStorage만 사용');
        }
    } else {
        console.log('Firebase 사용 불가 - localStorage만 사용');
        console.log('=== localStorage 동기화 설정 완료 ===');
    }
}

// 새로운 ID 생성 함수
function generateNewId() {
    // inquiries 배열이 비어있으면 1부터 시작
    if (inquiries.length === 0) {
        console.log('새 ID 생성 - 첫 번째 문의, ID: 1');
        return 1;
    }
    
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
    console.log('=== 페이지 로드 시작 ===');
    console.log('사용자 에이전트:', navigator.userAgent);
    console.log('Firebase 초기화 상태:', typeof firebase !== 'undefined' ? '성공' : '실패');
    console.log('Firestore DB 상태:', typeof db !== 'undefined' ? '성공' : '실패');
    
    // Firebase 연결 테스트
    if (typeof db !== 'undefined') {
        console.log('Firebase 연결 테스트 시작...');
        db.collection('test').limit(1).get()
            .then(snapshot => {
                console.log('✅ Firebase 연결 성공!');
                console.log('Firebase 프로젝트 ID:', firebase.app().options.projectId);
            })
            .catch(error => {
                console.error('❌ Firebase 연결 실패:', error);
                console.log('오류 코드:', error.code);
                console.log('오류 메시지:', error.message);
            });
    } else {
        console.error('❌ Firebase가 초기화되지 않음');
    }
    
    // 먼저 URL에서 동기화 시도 (자동)
    if (syncFromURL()) {
        console.log('URL 동기화 성공 - 자동으로 데이터 로드됨');
        alert('✅ 자동 동기화 완료!\n현재 데이터: ' + inquiries.length + '개');
        // 동기화 설정
        setupRealtimeSync();
        // 저장된 데이터의 작성자 이름 수정
        fixAuthorNamesInStorage();
    } else {
        // URL 동기화 실패 시 Firebase/localStorage 시도
        loadInquiriesFromFirestore().then(() => {
            console.log('데이터 로드 완료');
            
            // UI 업데이트
            loadInquiries();
            updateTotalCount();
            
            // 동기화 설정
    setupRealtimeSync();
    
    // 저장된 데이터의 작성자 이름 수정
    fixAuthorNamesInStorage();
            
        }).catch(error => {
            console.error('데이터 로드 실패:', error);
            
            // 실패 시 빈 배열로 초기화
            inquiries = [];
            
            // UI 업데이트
            loadInquiries();
            updateTotalCount();
            
            // 동기화 설정
            setupRealtimeSync();
            
            // 저장된 데이터의 작성자 이름 수정
            fixAuthorNamesInStorage();
        });
    }
    
    // "~전부보기" 텍스트 제거
    removeAllPropertyTypeSuffixes();
    
    // 동적 버튼 생성 코드 완전 제거됨
    
    // 기존 고정 버튼들 제거
    const existingFixedBtns = document.querySelectorAll('#syncBtn, #shareBtn, #syncTestBtn, #forceSyncBtn, #syncButton, #shareButton');
    existingFixedBtns.forEach(btn => {
        console.log('고정 버튼 제거:', btn.id);
        btn.remove();
    });
    
    // 동기화 버튼 생성 (항상 실행)
    setTimeout(() => {
        createSyncButton();
    }, 500);
    
    // 로그인 상태 확인 후 동기화 버튼 표시/숨김
    setTimeout(() => {
        if (currentUser) {
            showSyncButton();
            // 데이터 통합 버튼도 표시
            const mergeBtn = document.querySelector('.merge-btn');
            if (mergeBtn) {
                mergeBtn.style.display = 'inline-block';
                mergeBtn.style.visibility = 'visible';
                mergeBtn.style.opacity = '1';
            }
        } else {
            hideSyncButton();
            // 데이터 통합 버튼도 숨김
            const mergeBtn = document.querySelector('.merge-btn');
            if (mergeBtn) {
                mergeBtn.style.display = 'none';
                mergeBtn.style.visibility = 'hidden';
                mergeBtn.style.opacity = '0';
            }
        }
    }, 1000);
    
    // 동적 버튼 생성 호출들 제거됨
    
    // 실시간 동기화 시작
    startRealtimeSync();
    
    // 강화된 데이터 동기화 실행
    syncDataAcrossDevices();
    
    // 로그인 상태 확인
    checkLoginStatus();
    loadInquiries();
    updateTotalCount();
    
    // 복사 방지 기능 추가
    preventCopy();
    
    // 상세주소 필드 디버깅 및 강제 표시 (페이지 로드 시)
    setTimeout(() => {
        console.log('=== 상세주소 필드 디버깅 시작 ===');
        
        // 모든 input 요소 확인
        const allInputs = document.querySelectorAll('input');
        console.log('전체 input 요소 개수:', allInputs.length);
        allInputs.forEach((input, index) => {
            console.log(`Input ${index}:`, input.className, input.placeholder, input.type);
        });
        
        // 상세주소 필드 찾기
        const addressInput = document.querySelector('.address-input');
        console.log('상세주소 필드 찾기 결과:', addressInput);
        
        if (addressInput) {
            console.log('상세주소 필드 정보:', {
                tagName: addressInput.tagName,
                className: addressInput.className,
                placeholder: addressInput.placeholder,
                style: addressInput.style.cssText,
                parentElement: addressInput.parentElement,
                computedStyle: window.getComputedStyle(addressInput).display
            });
            
            // CSS가 제대로 적용되도록 확인만 함
            console.log('상세주소 필드 확인됨 - CSS 스타일 적용됨');
            console.log('페이지 로드 시 상세주소 필드 강제 표시 완료');
        } else {
            console.error('상세주소 필드를 찾을 수 없음 - HTML 구조 확인 필요');
            
            // location-inputs 컨테이너 확인
            const locationInputs = document.querySelector('.location-inputs');
            console.log('location-inputs 컨테이너:', locationInputs);
            if (locationInputs) {
                console.log('location-inputs 자식 요소들:', locationInputs.children);
            }
        }
        
        console.log('=== 상세주소 필드 디버깅 완료 ===');
    }, 500);
    
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
            
            // 동/읍/면 필드 초기화 - 기존 요소만 초기화 (위치 변경 없음)
            const neighborhoodElement = document.getElementById('neighborhoodSelect');
            if (neighborhoodElement) {
                // 기존 요소가 select인 경우에만 초기화
                if (neighborhoodElement.tagName === 'SELECT') {
                    neighborhoodElement.innerHTML = '<option>동/읍/면</option>';
                }
                // input인 경우에는 그대로 유지
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
                '경기도': ['가평군', '고양시 덕양구', '고양시 일산동구', '고양시 일산서구', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시', '동두천시', '부천시', '성남시 분당구', '성남시 수정구', '성남시 중원구', '수원시 권선구', '수원시 영통구', '수원시 장안구', '수원시 팔달구', '시흥시', '안산시 단원구', '안산시 상록구', '안성시', '안양시 동안구', '안양시 만안구', '양평군', '여주시', '연천군', '오산시', '용인시 기흥구', '용인시 수지구', '용인시 처인구', '의왕시', '의정부시', '이천시', '파주시', '평택시', '포천시', '하남시', '화성시', '양주시'],
                '강원도': ['강릉시', '고성군', '동해시', '삼척시', '속초시', '양구군', '양양군', '영월군', '원주시', '인제군', '정선군', '철원군', '춘천시', '태백시', '평창군', '홍천군', '화천군', '횡성군'],
                '충청북도': ['괴산군', '단양군', '보은군', '영동군', '옥천군', '음성군', '제천시', '증평군', '진천군', '청주시 상당구', '청주시 서원구', '청주시 청원구', '청주시 흥덕구', '충주시'],
                '충청남도': ['계룡시', '공주시', '금산군', '논산시', '당진시', '보령시', '부여군', '서산시', '서천군', '아산시', '예산군', '천안시', '천안시 동남구', '천안시 서북구', '청양군', '태안군', '홍성군'],
                '전라북도': ['고창군', '군산시', '김제시', '남원시', '무주군', '부안군', '순창군', '완주군', '익산시', '임실군', '장수군', '전주시 덕진구', '전주시 완산구', '정읍시', '진안군'],
                '전라남도': ['강진군', '고흥군', '곡성군', '광양시', '구례군', '나주시', '담양군', '목포시', '무안군', '보성군', '순천시', '신안군', '여수시', '영광군', '영암군', '완도군', '장성군', '장흥군', '진도군', '함평군', '해남군', '화순군'],
                '경상북도': ['경산시', '경주시', '고령군', '구미시', '김천시', '문경시', '봉화군', '상주시', '성주군', '안동시', '영덕군', '영양군', '영주시', '영천시', '예천군', '울릉군', '울진군', '의성군', '청도군', '청송군', '칠곡군', '포항시', '포항시 남구', '포항시 북구', '군위군'],
                '경상남도': ['거제시', '거창군', '고성군', '김해시', '남해군', '밀양시', '사천시', '산청군', '양산시', '의령군', '진주시', '창녕군', '창원시', '창원시 마산합포구', '창원시 마산회원구', '창원시 성산구', '창원시 의창구', '창원시 진해구', '통영시', '하동군', '함안군', '함양군', '합천군'],
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
            // 매번 새로 요소를 찾아서 참조
            const neighborhoodSelect = document.querySelectorAll('.location-select')[2];
            const district = this.value;
            
            console.log('구/군 선택됨:', district);
            
            // 동/읍/면 필드 초기화는 하지 않음 (구/군 선택 시에 처리)
            
            // 모든 지역을 직접입력으로 처리 (복잡한 동 데이터 제거)
            const hasDetailData = [];
            
            // 모든 지역을 직접입력으로 처리 (복잡한 동 데이터 제거)
            const districtData = {};
            
            // 모든 지역을 직접입력으로 처리 (복잡한 동 데이터 제거)
            console.log('구/군 처리 시작:', district);
            console.log('모든 지역을 직접입력으로 처리');
            
            // 모든 지역을 직접입력으로 처리
            console.log('직접입력 처리 시작:', district);
            if (district && district !== '구/군') {
                    try {
                        // 동/읍/면 필드를 직접입력으로 변경
                        const neighborhoodContainer = document.querySelector('.location-inputs');
                        if (neighborhoodContainer) {
                            // 기존 동/읍/면 필드 제거
                            const oldElement = neighborhoodContainer.querySelector('#neighborhoodSelect');
                            if (oldElement) {
                                oldElement.remove();
                            }
                            
                            // 새로운 input 필드 생성
                            const input = document.createElement('input');
                            input.type = 'text';
                            input.className = 'location-select';
                            input.id = 'neighborhoodSelect';
                            input.placeholder = '직접입력';
                            input.style.width = '100%';
                            input.style.padding = '8px';
                            input.style.border = '1px solid #ddd';
                            input.style.borderRadius = '4px';
                            input.style.fontSize = '14px';
                            input.style.boxSizing = 'border-box';
                            
                        // 상세주소 입력창 앞에 추가
                        const addressInput = neighborhoodContainer.querySelector('.address-input');
                        if (addressInput) {
                            neighborhoodContainer.insertBefore(input, addressInput);
                        } else {
                            // 상세주소 입력창이 없으면 맨 뒤에 추가
                            neighborhoodContainer.appendChild(input);
                        }
                            
                        console.log('직접입력 필드로 변경됨');
                    } else {
                        console.error('neighborhoodContainer를 찾을 수 없음');
                    }
                } catch (error) {
                    console.error('직접입력 필드 변경 중 오류:', error);
                    console.error('오류 스택:', error.stack);
                }
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
                
                // 로그인 성공 후 동기화 버튼 표시
                setTimeout(() => {
                    showSyncButton();
                }, 100);
                
                console.log('로그인 성공:', currentUser);
                
                // 목록 다시 로드 (삭제 버튼 표시) - 현재 데이터 유지
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
            
            // localStorage에 즉시 저장 (로그아웃 상태에서도 작동)
            try {
                localStorage.setItem('allInquiries', JSON.stringify(inquiries));
                console.log('localStorage 저장 완료:', inquiries.length, '개');
            } catch (error) {
                console.error('localStorage 저장 오류:', error);
            }
            
            // Firebase에 저장 시도 (사용 가능한 경우에만)
            if (typeof db !== 'undefined') {
            try {
                console.log('Firestore 저장 시작...');
                await saveInquiriesToFirestore();
                    console.log('Firestore 저장 성공 - 모든 기기에서 동기화됨');
            } catch (error) {
                    console.error('Firestore 저장 실패:', error);
                    console.log('Firebase 연결 실패 - localStorage에만 저장됨');
                }
            } else {
                console.log('Firebase 사용 불가 - localStorage에만 저장됨');
            }
            
            // 새 매물이 추가되었으므로 첫 번째 페이지로 이동
            currentPage = 1;
            
            // UI 즉시 업데이트
            loadInquiries();
            updateTotalCount();
            
            console.log('문의 목록에 추가됨, 총 개수:', inquiries.length);
            
            // 모달 닫기
            closeWriteModal();
            
            // 성공 메시지
            alert('문의가 성공적으로 등록되었습니다.');
            
            // 추가 UI 업데이트 (확실한 표시를 위해)
            setTimeout(() => {
                console.log('추가 UI 업데이트 실행');
                loadInquiries();
                updateTotalCount();
            }, 100);
            
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
    const syncBtn = document.querySelector('.sync-btn');
    const mergeBtn = document.querySelector('.merge-btn');
    
    console.log('updateAuthButton 호출됨');
    console.log('currentUser:', currentUser);
    console.log('authBtn 찾음:', !!authBtn);
    console.log('syncBtn 찾음:', !!syncBtn);
    console.log('mergeBtn 찾음:', !!mergeBtn);
    
    if (authBtn) {
        if (currentUser) {
            authBtn.textContent = '로그아웃';
            console.log('버튼 텍스트: 로그아웃');
            
            // 로그인 시 동기화 버튼 표시
            showSyncButton();
            
            // 로그인 시 데이터 통합 버튼 표시
            if (mergeBtn) {
                mergeBtn.style.display = 'inline-block';
                mergeBtn.style.visibility = 'visible';
                mergeBtn.style.opacity = '1';
                console.log('데이터 통합 버튼 표시됨');
            }
        } else {
            authBtn.textContent = '로그인';
            console.log('버튼 텍스트: 로그인');
            
            // 로그아웃 시 동기화 버튼 숨김
            hideSyncButton();
            
            // 로그아웃 시 데이터 통합 버튼 숨김
            if (mergeBtn) {
                mergeBtn.style.display = 'none';
                mergeBtn.style.visibility = 'hidden';
                mergeBtn.style.opacity = '0';
                console.log('데이터 통합 버튼 숨김');
            }
        }
    } else {
        console.log('인증 버튼을 찾을 수 없음');
    }
}

// 로그인 모달 표시
window.showLoginModal = function() {
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
};

// 로그인 모달 닫기
window.closeLoginModal = function() {
    console.log('로그인 모달 닫기');
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'none';
    }
};

// 인증 토글 (로그인/로그아웃)
window.toggleAuth = function() {
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
        
        // 로그아웃 후 목록 업데이트 (데이터 동기화 없이 현재 상태 유지)
        // 현재 메모리의 inquiries 배열을 그대로 유지하여 삭제된 항목이 다시 나타나지 않도록 함
        loadInquiries(); // 목록 다시 렌더링
        updateTotalCount(); // 총 개수 업데이트
        
        // 로그아웃 시에는 데이터 동기화를 하지 않음 (삭제된 항목이 다시 나타나지 않도록)
        
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
};

// 문의 목록 로드
function loadInquiries() {
    console.log('=== loadInquiries 함수 호출됨 ===');
    console.log('전체 문의 개수:', inquiries.length);
    console.log('현재 페이지:', currentPage);
    console.log('inquiries 배열:', inquiries);
    
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
        
        // 연속적인 일렬번호 계산 (전체 문의 수에서 현재 페이지의 순서를 빼고 역순으로)
        const totalInquiries = inquiries.length;
        const sequentialNumber = totalInquiries - startIndex - index;
        
        row.innerHTML = `
            <td>${sequentialNumber}</td>
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
async function deleteInquiry(inquiryId) {
    console.log('=== 삭제 함수 호출됨 ===');
    console.log('삭제할 ID:', inquiryId);
    console.log('삭제 전 inquiries 개수:', inquiries.length);
    console.log('삭제 전 inquiries 배열:', inquiries);
    console.log('삭제 전 inquiries ID 목록:', inquiries.map(inq => inq.id));
    
    // inquiries 배열이 비어있는지 확인
    if (inquiries.length === 0) {
        console.error('inquiries 배열이 비어있음 - 삭제할 항목이 없습니다');
        alert('삭제할 문의가 없습니다. 먼저 문의를 작성해주세요.');
        return;
    }
    
    // 삭제 확인
    if (!confirm('정말로 이 문의를 삭제하시겠습니까?')) {
        console.log('삭제 취소됨');
        return;
    }
    
    // 문의 목록에서 해당 항목 찾기 및 삭제
    const index = inquiries.findIndex(inquiry => inquiry.id === inquiryId);
    console.log('찾은 인덱스:', index);
    
    if (index !== -1) {
        // 삭제할 항목 로그
        console.log('삭제할 항목:', inquiries[index]);
        
        // 배열에서 제거
        inquiries.splice(index, 1);
        console.log('삭제 후 inquiries 개수:', inquiries.length);
        console.log('삭제 후 inquiries ID 목록:', inquiries.map(inq => inq.id));
        
        // 즉시 localStorage에 저장 (Firebase 권한 문제와 관계없이)
        try {
            localStorage.setItem('allInquiries', JSON.stringify(inquiries));
            console.log('localStorage 저장 완료:', inquiries.length, '개');
            
            // 저장 확인
            const savedData = localStorage.getItem('allInquiries');
            const parsedData = JSON.parse(savedData);
            console.log('저장 확인 - localStorage 데이터 개수:', parsedData.length);
            console.log('저장 확인 - localStorage 데이터 ID 목록:', parsedData.map(inq => inq.id));
        } catch (error) {
            console.error('localStorage 저장 오류:', error);
        }
        
        // Firebase에도 저장 시도 (사용 가능한 경우에만)
        if (typeof db !== 'undefined') {
        try {
            await saveInquiriesToFirestore();
                console.log('Firestore 삭제 동기화 완료 - 모든 기기에서 삭제됨');
        } catch (error) {
                console.error('Firestore 삭제 동기화 실패:', error);
                console.log('Firebase 연결 실패 - localStorage에만 삭제됨');
            }
        } else {
            console.log('Firebase 사용 불가 - localStorage에만 삭제됨');
        }
        
        // 현재 페이지가 비어있고 이전 페이지가 있다면 이전 페이지로 이동
        const totalPages = Math.ceil(inquiries.length / itemsPerPage);
        if (currentPage > totalPages && currentPage > 1) {
            currentPage = totalPages;
            console.log('페이지 이동:', currentPage);
        }
        
        // 목록 다시 로드
        console.log('목록 다시 로드 시작');
        loadInquiries();
        updateTotalCount();
        
        console.log('=== 삭제 완료 ===');
        alert('문의가 삭제되었습니다.');
    } else {
        console.error('삭제할 항목을 찾을 수 없음:', inquiryId);
        alert('삭제할 항목을 찾을 수 없습니다.');
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
window.showWriteModal = function() {
    document.getElementById('writeModal').style.display = 'flex';
    resetForm();
    
    // 상세주소 필드 강제 표시 (캐시 문제 해결)
    setTimeout(() => {
        let addressInput = document.querySelector('.address-input');
        
        // 상세주소 필드가 없으면 생성
        if (!addressInput) {
            console.log('상세주소 필드가 없음 - 새로 생성');
            const locationInputs = document.querySelector('.location-inputs');
            if (locationInputs) {
                addressInput = document.createElement('input');
                addressInput.type = 'text';
                addressInput.placeholder = '상세주소';
                addressInput.className = 'address-input';
                addressInput.style.cssText = `
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    width: 100%;
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    height: auto;
                    min-height: 40px;
                `;
                locationInputs.appendChild(addressInput);
                console.log('상세주소 필드 생성 완료');
            }
        } else {
            // CSS가 제대로 적용되도록 확인만 함
            console.log('상세주소 필드 확인됨 - CSS 스타일 적용됨');
        }
    }, 100);
    
    console.log('문의작성 모달 열림 - 상세주소 필드 강제 표시');
};

// 문의작성 모달 닫기
window.closeWriteModal = function() {
    document.getElementById('writeModal').style.display = 'none';
};

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
        console.log('구함 선택');
    } else {
        tabButtons[1].classList.add('active');
        console.log('내놈 선택');
    }
    
    // 상세주소 필드 확인 (CSS가 자동으로 처리)
    setTimeout(() => {
        const addressInput = document.querySelector('.address-input');
        if (addressInput) {
            console.log('탭 전환 후 상세주소 필드 확인됨');
        }
    }, 50);
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
    
    // 상세주소 필드 초기화 및 항상 표시
    const addressInput = document.querySelector('.address-input');
    if (addressInput) {
        addressInput.style.display = 'block';
        addressInput.style.visibility = 'visible';
        addressInput.style.opacity = '1';
        addressInput.removeAttribute('hidden');
        addressInput.style.height = 'auto';
        addressInput.style.minHeight = '40px';
        addressInput.value = '';
    }
    
    // 탭 초기화 (구함이 기본 선택)
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabButtons[0].classList.add('active'); // 구함 탭 활성화
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
    
    // 내놈일 때만 상세주소 검증 (구함일 때는 상세주소 불필요)
    const isSell = tabBtn.textContent === '내놈';
    if (isSell && (!address.value || !address.value.trim())) {
        console.log('내놈에서 상세주소 미입력');
        alert('상세주소까지 입력해주세요.');
        return false;
    }
    console.log('상세주소 검증 완료 - 구함/내놈:', tabBtn.textContent, '상세주소:', address.value);
    
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
    
    // localStorage에서 데이터 로드 (삭제된 항목이 다시 나타나지 않도록)
    const savedInquiries = localStorage.getItem('allInquiries');
    console.log('localStorage에서 읽은 데이터:', savedInquiries);
    
    if (savedInquiries) {
        try {
            const loadedInquiries = JSON.parse(savedInquiries);
            console.log('파싱된 데이터 개수:', loadedInquiries.length);
            console.log('데이터 ID 목록:', loadedInquiries.map(inq => inq.id));
            
            // 현재 메모리 데이터와 localStorage 데이터 비교
            if (inquiries.length !== loadedInquiries.length) {
                console.log('데이터 불일치 감지');
                console.log('메모리 데이터 개수:', inquiries.length);
                console.log('localStorage 데이터 개수:', loadedInquiries.length);
                
                // 메모리 데이터가 더 많으면 (새로 추가된 데이터가 있으면) localStorage를 업데이트
                if (inquiries.length > loadedInquiries.length) {
                    console.log('메모리 데이터가 더 많음 - localStorage 업데이트');
                    localStorage.setItem('allInquiries', JSON.stringify(inquiries));
                } else {
                    console.log('localStorage 데이터로 메모리 업데이트');
                    inquiries = loadedInquiries;
                }
                
                // UI 강제 업데이트
                currentPage = 1;
                loadInquiries();
                updateTotalCount();
            } else {
                console.log('데이터 일치 - 업데이트 불필요');
            }
            
            console.log('데이터 동기화 완료');
        } catch (error) {
            console.error('데이터 동기화 중 오류:', error);
        }
    } else {
        console.log('localStorage에 데이터 없음 - 빈 배열로 초기화');
        // localStorage에 데이터가 없으면 빈 배열로 초기화
        inquiries = [];
        loadInquiries();
        updateTotalCount();
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

// 디버깅용 함수 - 브라우저 콘솔에서 호출 가능
window.debugSyncButton = function() {
    console.log('=== 동기화 버튼 디버깅 ===');
    console.log('현재 사용자:', currentUser);
    
    // 모든 버튼 찾기
    const syncBtnById = document.getElementById('syncButton');
    const syncBtnByClass = document.querySelector('.sync-btn');
    const allButtons = document.querySelectorAll('button');
    
    console.log('ID로 찾은 버튼:', syncBtnById);
    console.log('클래스로 찾은 버튼:', syncBtnByClass);
    console.log('모든 버튼 개수:', allButtons.length);
    
    allButtons.forEach((btn, index) => {
        console.log(`버튼 ${index}:`, {
            text: btn.textContent,
            id: btn.id,
            className: btn.className,
            style: btn.style.display,
            visible: btn.offsetParent !== null
        });
    });
    
    // 강제로 동기화 버튼 표시
    if (syncBtnByClass) {
        syncBtnByClass.style.display = 'flex';
        syncBtnByClass.style.visibility = 'visible';
        syncBtnByClass.style.opacity = '1';
        syncBtnByClass.classList.add('show');
        console.log('✅ 동기화 버튼 강제 표시 완료');
    } else {
        console.log('❌ 동기화 버튼을 찾을 수 없음');
    }
};

// 동기화 버튼 생성 함수
function createSyncButton() {
    console.log('=== 동기화 버튼 생성 시작 ===');
    
    // 기존 동기화 버튼 제거
    const existingSyncBtn = document.querySelector('.sync-btn');
    if (existingSyncBtn) {
        existingSyncBtn.remove();
        console.log('기존 동기화 버튼 제거됨');
    }
    
    // 새 동기화 버튼 생성
    const headerButtons = document.querySelector('.header-buttons');
    if (headerButtons) {
        const syncBtn = document.createElement('button');
        syncBtn.className = 'sync-btn';
        syncBtn.id = 'syncButton';
        syncBtn.textContent = '📤';
        syncBtn.title = '동기화';
        syncBtn.onclick = function() { perfectSync(); };
        syncBtn.style.display = 'none'; // 기본적으로 숨김
        
        const authBtn = document.querySelector('.auth-btn');
        headerButtons.insertBefore(syncBtn, authBtn);
        console.log('✅ 동기화 버튼 생성 완료');
    } else {
        console.log('❌ header-buttons를 찾을 수 없음');
    }
}

// 동기화 버튼 표시 함수
function showSyncButton() {
    const syncBtn = document.querySelector('.sync-btn');
    if (syncBtn) {
        syncBtn.style.display = 'flex';
        syncBtn.style.visibility = 'visible';
        syncBtn.style.opacity = '1';
        syncBtn.classList.add('show');
        console.log('✅ 동기화 버튼 표시됨');
    }
}

// 동기화 버튼 숨김 함수
function hideSyncButton() {
    const syncBtn = document.querySelector('.sync-btn');
    if (syncBtn) {
        syncBtn.style.display = 'none';
        syncBtn.style.visibility = 'hidden';
        syncBtn.style.opacity = '0';
        syncBtn.classList.remove('show');
        console.log('동기화 버튼 숨김');
    }
}

// 모바일에서 동기화 버튼 강제 표시 함수 (로그인 상태 확인)
window.forceShowSyncButton = function() {
    console.log('=== 모바일 동기화 버튼 강제 표시 (로그인 상태 확인) ===');
    
    // 로그인 상태 확인
    if (!currentUser) {
        console.log('로그아웃 상태 - 동기화 버튼 표시하지 않음');
        return;
    }
    
    // 기존 버튼 찾기
    let syncBtn = document.querySelector('.sync-btn');
    
    if (!syncBtn) {
        // 버튼이 없으면 생성
        const headerButtons = document.querySelector('.header-buttons');
        if (headerButtons) {
            syncBtn = document.createElement('button');
            syncBtn.className = 'sync-btn';
            syncBtn.id = 'syncButton';
            syncBtn.textContent = '📤';
            syncBtn.title = '동기화';
            syncBtn.onclick = function() { perfectSync(); };
            
            const authBtn = document.querySelector('.auth-btn');
            headerButtons.insertBefore(syncBtn, authBtn);
            console.log('✅ 동기화 버튼 생성 완료');
        }
    }
    
    if (syncBtn) {
        syncBtn.style.display = 'flex !important';
        syncBtn.style.visibility = 'visible !important';
        syncBtn.style.opacity = '1 !important';
        syncBtn.classList.add('show');
        console.log('✅ 동기화 버튼 강제 표시 완료 (로그인 상태)');
    }
};

// PC와 모바일 데이터 통합 함수
window.mergeAllData = function() {
    console.log('=== PC와 모바일 데이터 통합 시작 ===');
    
    // 현재 데이터 백업
    const currentData = JSON.parse(JSON.stringify(inquiries));
    console.log('현재 데이터 개수:', currentData.length);
    
    // localStorage에서 모든 데이터 수집
    const allStoredData = [];
    
    // 현재 브라우저의 데이터
    const currentStorage = localStorage.getItem('allInquiries');
    if (currentStorage) {
        try {
            const parsed = JSON.parse(currentStorage);
            if (Array.isArray(parsed)) {
                allStoredData.push(...parsed);
                console.log('현재 브라우저 데이터 추가:', parsed.length);
            }
        } catch (e) {
            console.log('현재 브라우저 데이터 파싱 실패');
        }
    }
    
    // URL에서 동기화 데이터 수집
    const urlParams = new URLSearchParams(window.location.search);
    const syncData = urlParams.get('sync');
    if (syncData) {
        try {
            const decoded = decodeURIComponent(syncData);
            const parsed = JSON.parse(decoded);
            if (Array.isArray(parsed)) {
                allStoredData.push(...parsed);
                console.log('URL 동기화 데이터 추가:', parsed.length);
            }
        } catch (e) {
            console.log('URL 동기화 데이터 파싱 실패');
        }
    }
    
    // 중복 제거 (ID 기준)
    const uniqueData = [];
    const seenIds = new Set();
    
    allStoredData.forEach(item => {
        if (item.id && !seenIds.has(item.id)) {
            seenIds.add(item.id);
            uniqueData.push(item);
        } else if (!item.id) {
            // ID가 없는 경우 새로 생성
            item.id = Date.now() + Math.random();
            uniqueData.push(item);
        }
    });
    
    console.log('통합 전 총 데이터:', allStoredData.length);
    console.log('중복 제거 후 데이터:', uniqueData.length);
    
    // ID 재정렬 (1부터 시작)
    uniqueData.forEach((item, index) => {
        item.id = index + 1;
    });
    
    // 통합된 데이터로 업데이트
    inquiries = uniqueData;
    
    // localStorage에 저장
    localStorage.setItem('allInquiries', JSON.stringify(inquiries));
    
    // UI 업데이트
    loadInquiries();
    updateTotalCount();
    
    // Firebase에도 저장 시도
    saveInquiriesToFirestore().catch(error => {
        console.log('Firebase 저장 실패 (무시됨):', error);
    });
    
    console.log('=== 데이터 통합 완료 ===');
    console.log('최종 데이터 개수:', inquiries.length);
    
    // 결과 표시
    alert(`✅ 데이터 통합 완료!\n\n통합 전: ${allStoredData.length}개\n통합 후: ${inquiries.length}개\n\n중복 제거: ${allStoredData.length - inquiries.length}개`);
    
    return inquiries;
};

// HTML 버튼용 동기화 함수들
function syncData() {
    console.log('=== 동기화 시작 ===');
    console.log('현재 데이터 개수:', inquiries.length);
    
    // URL에서 동기화 시도
    if (syncFromURL()) {
        alert(`URL 동기화 완료!\n현재 데이터 개수: ${inquiries.length}개`);
        return;
    }
    
    // Firebase 동기화 시도
    loadInquiriesFromFirestore().then(() => {
        console.log('동기화 완료 - 데이터 개수:', inquiries.length);
        loadInquiries();
        updateTotalCount();
        alert(`Firebase 동기화 완료!\n현재 데이터 개수: ${inquiries.length}개`);
    }).catch(error => {
        console.error('동기화 실패:', error);
        alert('동기화 실패: ' + error.message);
    });
}

function shareData() {
    shareToURL();
}

// 동기화 테스트 버튼 추가
// 동적 버튼 생성 함수들 제거됨

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