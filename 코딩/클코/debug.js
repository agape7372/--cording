const fs = require('fs');
const content = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', 'utf8');

// SRC_MORNING 내부 확인
const startIdx = content.indexOf('const SRC_MORNING = `');
const endIdx = content.indexOf('`;\n        const SRC_', startIdx);
const morningPart = content.substring(startIdx, endIdx + 2);

console.log('SRC_MORNING 길이:', morningPart.length);

// 이스케이프되지 않은 </script> 찾기
let count = 0;
let idx = 0;
while (true) {
    const found = morningPart.indexOf('</script>', idx);
    if (found === -1) break;
    // 앞에 \가 있는지 확인
    if (morningPart[found - 1] !== '\\') {
        count++;
        console.log('이스케이프 안 된 </script> 위치:', found);
        console.log('주변:', morningPart.substring(found - 20, found + 20));
    }
    idx = found + 1;
}
console.log('이스케이프 안 된 </script> 총:', count);
