const fs = require('fs');
let content = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/src/morning.html', 'utf8');

// 파일에는 \\n이 두 개의 백슬래시로 저장되어 있음
const searchStr = "str.includes('\\\\n')){const lines=str.split('\\\\n')";
const replaceStr = "/[\\r\\n]/.test(str)){const lines=str.split(/\\r?\\n|\\r/)";

const idx = content.indexOf(searchStr);
console.log('검색 위치:', idx);

if (idx > -1) {
    content = content.substring(0, idx) + replaceStr + content.substring(idx + searchStr.length);
    fs.writeFileSync('C:/Users/agape/Desktop/코딩/클코/원본/src/morning.html', content, 'utf8');
    console.log('✅ CRLF 처리 수정 완료');
} else {
    console.log('❌ 못찾음');
}
