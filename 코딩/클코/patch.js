const fs = require('fs');
let content = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', 'utf8');

// 1. 전산화인지 추가
if (!content.includes("'전산화인지'")) {
    content = content.replace(
        "const TREATMENT_CODES={'ESWT'",
        "const TREATMENT_CODES={'전산화인지':'전산화 인지치료','ESWT'"
    );
    console.log('1. 전산화인지 추가');
}

// 2. CRLF split 수정: [\\n,] → [\\r\\n,]
// SRC_MORNING 내부에서는 \\n이 \\\\n으로 저장됨
content = content.replace(/split\(\/\[\\\\n,\]\+\/\)/g, 'split(/[\\\\r\\\\n,]+/)');
console.log('2. CRLF split 수정');

fs.writeFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', content, 'utf8');
console.log('저장 완료, 크기:', content.length);

// 검증
const verify = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', 'utf8');
console.log('전산화인지:', verify.includes("'전산화인지':'전산화 인지치료'"));
console.log('CRLF split:', verify.includes('[\\\\r\\\\n,]'));
