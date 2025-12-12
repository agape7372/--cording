const fs = require('fs');
const content = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', 'utf8');

// SRC_MORNING 부분 확인
const startIdx = content.indexOf('const SRC_MORNING = `');
const endPattern = '`;\n        const SRC_';
const endIdx = content.indexOf(endPattern, startIdx);

console.log('SRC_MORNING 시작:', startIdx);
console.log('SRC_MORNING 끝:', endIdx);

if (startIdx > -1 && endIdx > -1) {
    const morningPart = content.substring(startIdx, endIdx + 2);
    console.log('길이:', morningPart.length);

    // 백틱 개수 (이스케이프 안 된 것)
    let unescapedCount = 0;
    for (let i = 0; i < morningPart.length; i++) {
        if (morningPart[i] === '`' && (i === 0 || morningPart[i-1] !== '\\')) {
            unescapedCount++;
        }
    }
    console.log('이스케이프 안 된 백틱:', unescapedCount);

    // ${} 확인
    const templateLiterals = morningPart.match(/\$\{[^}]+\}/g);
    console.log('${} 패턴:', templateLiterals ? templateLiterals.length : 0);
    if (templateLiterals) {
        console.log('샘플:', templateLiterals.slice(0, 3));
    }
}
