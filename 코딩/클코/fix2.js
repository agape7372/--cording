const fs = require('fs');
let combined = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', 'utf8');

// 위치 49885 부터 시작하는 줄바꿈 처리 로직 교체
// 기존: if(str.includes('\\n')){const lines=str.split('\\n');...else return null}
// 새로: str=str.replace(/[\\r\\n]+/g,' ').trim()

const startIdx = 49885; // str.includes('\\n') 시작
const endMarker = "else return null}const cleanStr";
const endIdx = combined.indexOf(endMarker, startIdx);

console.log('시작:', startIdx);
console.log('끝:', endIdx);
console.log('기존 로직:', combined.substring(startIdx - 3, endIdx + 17)); // if( 포함

if (endIdx > -1) {
    // if( 부터 교체해야 함
    const before = combined.substring(0, startIdx - 3); // "if(" 제외
    const after = combined.substring(endIdx + 17); // "else return null}" 이후

    const newLogic = "str=str.replace(/[\\r\\n]+/g,' ').trim();const cleanStr";

    combined = before + newLogic + after;

    fs.writeFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', combined, 'utf8');
    console.log('✅ 수정 완료');
}
