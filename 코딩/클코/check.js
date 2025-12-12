const fs = require('fs');
const pako = require('pako');

const combined = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251210.html', 'utf8');
const match = combined.match(/const SRC_GUIDE_B64 = '([^']+)'/);

if (match) {
    const b64 = match[1];
    const compressed = Buffer.from(b64, 'base64');
    const decompressed = pako.ungzip(compressed, { to: 'string' });

    const idx = decompressed.indexOf('function highlightText');
    if (idx > -1) {
        console.log('=== highlightText 함수 ===');
        console.log(decompressed.substring(idx, idx + 500));
    } else {
        console.log('highlightText 함수 없음');
    }

    console.log('\n=== 플레이스홀더 확인 ===');
    console.log('###TAG 포함:', decompressed.includes('###TAG'));
    console.log('FFFC 포함:', decompressed.includes('FFFC'));
}
