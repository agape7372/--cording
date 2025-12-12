// parseToken 시뮬레이션
function parseToken(rawToken) {
    let name = String(rawToken).normalize('NFKC').replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    if (!name) return null;
    let results = [];
    if (name.includes('전산화인지')) {
        results.push({ code: 'COG', source: 'prefix' });
        name = name.replace('전산화인지', '').trim() || '전산화인지';
    }
    return { name, found: results };
}

// 테스트
const tokens = ['전산화인지', '김명복'];
console.log('토큰:', tokens);

for (let k = 0; k < tokens.length; k++) {
    let result = parseToken(tokens[k]);
    console.log(`\n토큰[${k}] = "${tokens[k]}"`);
    console.log('parseToken 결과:', result);

    // COG 처리 로직
    if (result && result.found.some(f => f.code === 'COG') && k + 1 < tokens.length && !/^[A-Za-z]/.test(tokens[k + 1])) {
        console.log('-> 다음 토큰을 이름으로 사용');
        result.name = tokens[++k];
        console.log('-> 변경된 결과:', result);
    }
}
