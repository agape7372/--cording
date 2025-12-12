/**
 * 첼 TOP - 메인 JavaScript
 * 랜딩 페이지 및 탭 전환 로직
 */

// ========================================
// 앱 진입 (랜딩페이지 -> 메인)
// ========================================
function enterApp(appName) {
    const landingPage = document.getElementById('landing-page');
    const appLayout = document.getElementById('app-layout');

    landingPage.classList.add('fade-out');

    setTimeout(() => {
        appLayout.classList.add('active');
        switchTab(appName);
    }, 300);
}

// ========================================
// 탭 전환 로직
// ========================================
function switchTab(tabName) {
    // 요소 참조
    const btnReview = document.getElementById('btn-review');
    const btnMorning = document.getElementById('btn-morning');
    const btnGuide = document.getElementById('btn-guide');
    const reviewFrame = document.getElementById('frame-review');
    const morningFrame = document.getElementById('frame-morning');
    const guideFrame = document.getElementById('frame-guide');

    // 모든 탭 비활성화
    btnReview.classList.remove('active');
    btnMorning.classList.remove('active');
    btnGuide.classList.remove('active');
    reviewFrame.classList.add('hidden');
    morningFrame.classList.add('hidden');
    guideFrame.classList.add('hidden');

    // 선택된 탭 활성화
    if (tabName === 'review') {
        btnReview.classList.add('active');
        reviewFrame.classList.remove('hidden');
    } else if (tabName === 'morning') {
        btnMorning.classList.add('active');
        morningFrame.classList.remove('hidden');
    } else if (tabName === 'guide') {
        btnGuide.classList.add('active');
        guideFrame.classList.remove('hidden');
    }
}

// ========================================
// 홈으로 이동
// ========================================
function goHome() {
    const landingPage = document.getElementById('landing-page');
    const appLayout = document.getElementById('app-layout');

    appLayout.classList.remove('active');

    setTimeout(() => {
        landingPage.classList.remove('fade-out');
    }, 300);
}

// ========================================
// 키보드 단축키 (보너스 기능)
// ========================================
document.addEventListener('keydown', function (e) {
    // Ctrl + 1/2/3 으로 탭 전환
    if (e.ctrlKey && !e.shiftKey && !e.altKey) {
        const appLayout = document.getElementById('app-layout');
        if (!appLayout.classList.contains('active')) return;

        switch (e.key) {
            case '1':
                e.preventDefault();
                switchTab('review');
                break;
            case '2':
                e.preventDefault();
                switchTab('morning');
                break;
            case '3':
                e.preventDefault();
                switchTab('guide');
                break;
        }
    }

    // ESC로 홈으로
    if (e.key === 'Escape') {
        const appLayout = document.getElementById('app-layout');
        if (appLayout.classList.contains('active')) {
            goHome();
        }
    }
});
