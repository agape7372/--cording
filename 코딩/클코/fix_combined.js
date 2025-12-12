const fs = require('fs');

// 합본 파일 읽기
let combined = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', 'utf8');

// src/morning.html 읽기
let morning = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/src/morning.html', 'utf8');

// 템플릿 리터럴 안에 들어가려면:
// 1. 백틱(`) → \`
// 2. ${ → \${
// 3. \ → \\ (백슬래시도 이스케이프)
// 순서 중요: 백슬래시 먼저, 그 다음 백틱, 그 다음 ${

morning = morning
    .replace(/\\/g, '\\\\')      // \ → \\
    .replace(/`/g, '\\`')        // ` → \`
    .replace(/\$\{/g, '\\${');   // ${ → \${

// SRC_MORNING 교체
const startMarker = 'const SRC_MORNING = `';
const startIdx = combined.indexOf(startMarker);

// 다음 SRC_ 찾기
const nextSrcIdx = combined.indexOf('\n        const SRC_', startIdx + 100);

if (startIdx > -1 && nextSrcIdx > -1) {
    const before = combined.substring(0, startIdx);
    const after = combined.substring(nextSrcIdx);

    combined = before + 'const SRC_MORNING = `' + morning + '`;' + after;

    fs.writeFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', combined, 'utf8');
    console.log('✅ 합본 파일 수정 완료');

    // 검증
    const verify = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', 'utf8');
    const newStart = verify.indexOf('const SRC_MORNING = `');
    const newEnd = verify.indexOf('`;\n        const SRC_', newStart);
    const newPart = verify.substring(newStart, newEnd + 2);

    // 이스케이프 안 된 ${ 확인
    const unescapedDollar = newPart.match(/[^\\]\$\{/g);
    console.log('이스케이프 안 된 ${:', unescapedDollar ? unescapedDollar.length : 0);
} else {
    console.log('❌ 실패');
}
