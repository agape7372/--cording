const fs = require('fs');
const content = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', 'utf8');

// 메인 스크립트 추출 (마지막 <script>...</script>)
const lastScriptStart = content.lastIndexOf('<script>') + 8;
const lastScriptEnd = content.lastIndexOf('</script>');
const mainScript = content.substring(lastScriptStart, lastScriptEnd);

console.log('메인 스크립트 길이:', mainScript.length);

try {
    new Function(mainScript);
    console.log('✅ JavaScript 문법 OK');
} catch (e) {
    console.log('❌ 문법 오류:', e.message);

    // 오류 위치 찾기
    const match = e.message.match(/position (\d+)/);
    if (match) {
        const pos = parseInt(match[1]);
        console.log('오류 위치 주변:', mainScript.substring(pos - 50, pos + 50));
    }
}
