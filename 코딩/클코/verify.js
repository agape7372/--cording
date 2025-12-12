const fs = require('fs');
const pako = require('pako');

const verify = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251210.html', 'utf8');
const verifyMatch = verify.match(/const SRC_GUIDE_B64 = "([^"]+)"/);

if (verifyMatch) {
    console.log('B64 길이:', verifyMatch[1].length);
    const vCompressed = Buffer.from(verifyMatch[1], 'base64');
    const vDecompressed = pako.ungzip(vCompressed, { to: 'string' });

    console.log('압축 해제 길이:', vDecompressed.length);
    console.log('uFFFC 포함:', vDecompressed.includes('\uFFFC'));
    console.log('###TAG 포함:', vDecompressed.includes('###TAG'));

    const hlIdx = vDecompressed.indexOf('function highlightText');
    if (hlIdx > -1) {
        console.log('\n=== highlightText 함수 ===');
        console.log(vDecompressed.substring(hlIdx, hlIdx + 450));
    }
} else {
    console.log('SRC_GUIDE_B64 못찾음');
}
