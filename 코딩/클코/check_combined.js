const fs = require('fs');
const pako = require('pako');

const combined = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', 'utf8');
const match = combined.match(/const SRC_MORNING_B64 = "([^"]+)"/);

if (match) {
    const dec = pako.ungzip(Buffer.from(match[1], 'base64'), {to:'string'});

    console.log('=== 합본 내 morning.html 확인 ===');
    console.log('전산화인지 in TREATMENT_CODES:', dec.includes("'전산화인지':'전산화 인지치료'"));
    console.log('CRLF 처리 (/[\\r\\n]/):', dec.includes('/[\\r\\n]/.test(str)'));
    console.log('윗줄 합치기 (matchIdx-1):', dec.includes('matchIdx-1'));

    // src 파일과 비교
    const src = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/src/morning.html', 'utf8');
    console.log('\n=== src vs 합본 ===');
    console.log('src 길이:', src.length);
    console.log('합본 내 길이:', dec.length);
    console.log('동일:', src === dec);
} else {
    console.log('SRC_MORNING_B64 못찾음');
}
