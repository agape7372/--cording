const fs = require('fs');

// 합본 파일 읽기
let combined = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', 'utf8');

// src/morning.html 읽기
let morning = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/src/morning.html', 'utf8');

// 템플릿 리터럴 안에 들어가려면 backtick과 ${를 이스케이프 해야 함
morning = morning.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

// SRC_MORNING 교체
const startMarker = 'const SRC_MORNING = `';
const startIdx = combined.indexOf(startMarker);

// 다음 SRC_ 찾기 (SRC_WEEKEND 등)
const nextSrcIdx = combined.indexOf('\n        const SRC_', startIdx + 100);

if (startIdx > -1 && nextSrcIdx > -1) {
    // 기존 SRC_MORNING 부분을 새 것으로 교체
    const before = combined.substring(0, startIdx);
    const after = combined.substring(nextSrcIdx);

    combined = before + 'const SRC_MORNING = `' + morning + '`;' + after;

    fs.writeFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', combined, 'utf8');
    console.log('✅ 합본 파일 업데이트 완료');
    console.log('새 파일 크기:', (combined.length / 1024).toFixed(1), 'KB');

    // 검증
    console.log('\n=== 검증 ===');
    console.log('전산화인지 포함:', combined.includes("'전산화인지':'전산화 인지치료'"));
    console.log('CRLF 처리 포함:', combined.includes('/[\\r\\n]/.test(str)'));
} else {
    console.log('❌ 마커 찾기 실패');
    console.log('startIdx:', startIdx);
    console.log('nextSrcIdx:', nextSrcIdx);
}
