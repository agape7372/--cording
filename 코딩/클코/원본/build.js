/**
 * 첼TOP 빌드 스크립트 (gzip 압축 통합)
 *
 * 사용법: node build.js
 *
 * src/ 폴더의 개별 파일들을 합쳐서 dist/ 폴더에 합본 HTML 생성
 * guide.html은 gzip 압축 후 Base64 인코딩
 */

const fs = require('fs');
const path = require('path');
const pako = require('pako');

// 경로 설정
const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

console.log('========================================');
console.log('   첼TOP 빌드 스크립트 (gzip 압축)');
console.log('========================================\n');

// dist 폴더 생성
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('📁 dist 폴더 생성됨');
}

// 파일 읽기
console.log('📂 소스 파일 읽는 중...');

let mainTemplate, reviewHtml, morningHtml, weekendHtml, guideHtml;

try {
    mainTemplate = fs.readFileSync(path.join(srcDir, 'main.html'), 'utf8');
    console.log('   ✅ main.html');
} catch (e) {
    console.error('   ❌ main.html 읽기 실패:', e.message);
    process.exit(1);
}

try {
    reviewHtml = fs.readFileSync(path.join(srcDir, 'review.html'), 'utf8');
    console.log('   ✅ review.html (' + (reviewHtml.length / 1024).toFixed(1) + 'KB)');
} catch (e) {
    console.error('   ❌ review.html 읽기 실패:', e.message);
    process.exit(1);
}

try {
    morningHtml = fs.readFileSync(path.join(srcDir, 'morning.html'), 'utf8');
    console.log('   ✅ morning.html (' + (morningHtml.length / 1024).toFixed(1) + 'KB)');
} catch (e) {
    console.error('   ❌ morning.html 읽기 실패:', e.message);
    process.exit(1);
}

try {
    weekendHtml = fs.readFileSync(path.join(srcDir, 'weekend.html'), 'utf8');
    console.log('   ✅ weekend.html (' + (weekendHtml.length / 1024).toFixed(1) + 'KB)');
} catch (e) {
    console.error('   ❌ weekend.html 읽기 실패:', e.message);
    process.exit(1);
}

try {
    guideHtml = fs.readFileSync(path.join(srcDir, 'guide.html'), 'utf8');
    console.log('   ✅ guide.html (' + (guideHtml.length / 1024).toFixed(1) + 'KB)');
} catch (e) {
    console.error('   ❌ guide.html 읽기 실패:', e.message);
    process.exit(1);
}

// 변환 처리
console.log('\n🔧 변환 처리 중...');

// review.html, morning.html, weekend.html: 그대로 사용
const reviewEscaped = reviewHtml;
const morningEscaped = morningHtml;
const weekendEscaped = weekendHtml;
console.log('   ✅ review/morning/weekend 준비 완료');

// guide.html: gzip 압축 후 Base64 인코딩
const guideCompressed = pako.gzip(guideHtml);
const guideBase64 = Buffer.from(guideCompressed).toString('base64');
console.log('   ✅ guide gzip 압축 완료');
console.log('      원본: ' + (guideHtml.length / 1024).toFixed(1) + 'KB → 압축: ' + (guideBase64.length / 1024).toFixed(1) + 'KB (' + ((1 - guideBase64.length / (guideHtml.length * 1.37)) * 100).toFixed(0) + '% 절감)');

// main.html에 pako CDN 추가 및 해제 코드 수정
let mainModified = mainTemplate;

// pako CDN 추가 (head 태그 끝에)
mainModified = mainModified.replace(
    '</head>',
    '    <script src="https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js"></script>\n</head>'
);

// guide 해제 코드 수정 (gzip 해제 추가)
mainModified = mainModified.replace(
    `const SRC_GUIDE_BYTES = Uint8Array.from(atob(SRC_GUIDE_B64), c => c.charCodeAt(0));
        const SRC_GUIDE_BLOB = new Blob([SRC_GUIDE_BYTES], {type: 'text/html;charset=utf-8'});`,
    `const SRC_GUIDE_COMPRESSED = Uint8Array.from(atob(SRC_GUIDE_B64), c => c.charCodeAt(0));
        const SRC_GUIDE_BYTES = pako.ungzip(SRC_GUIDE_COMPRESSED);
        const SRC_GUIDE_BLOB = new Blob([SRC_GUIDE_BYTES], {type: 'text/html;charset=utf-8'});`
);

// 플레이스홀더 교체
console.log('\n📝 합본 생성 중...');

let output = mainModified
    .replace('{{REVIEW_PLACEHOLDER}}', reviewEscaped)
    .replace('{{MORNING_PLACEHOLDER}}', morningEscaped)
    .replace('{{WEEKEND_PLACEHOLDER}}', weekendEscaped)
    .replace('{{GUIDE_PLACEHOLDER}}', guideBase64);

// 날짜 포맷
const now = new Date();
const dateStr = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}`;

// 파일 저장
const outputFileName = `첼TOP_합본_${dateStr}.html`;
const outputPath = path.join(distDir, outputFileName);

fs.writeFileSync(outputPath, output, 'utf8');

console.log('   ✅ 저장 완료: ' + outputFileName);
console.log('\n========================================');
console.log('   빌드 완료!');
console.log('========================================');
console.log('\n📊 결과:');
console.log('   - 원본 총 용량: ' + ((reviewHtml.length + morningHtml.length + weekendHtml.length + guideHtml.length) / 1024).toFixed(1) + 'KB');
console.log('   - 합본 용량: ' + (output.length / 1024).toFixed(1) + 'KB');
console.log('   - 출력 파일: dist/' + outputFileName);
console.log('\n💡 이 파일을 배포하세요!');
