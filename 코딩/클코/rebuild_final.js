const fs = require('fs');

// 원본 20251210 복사
let combined = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/원본/첼TOP_합본_20251210.html', 'utf8');
console.log('원본 로드:', (combined.length / 1024).toFixed(1), 'KB');

// 1. 전산화인지 추가 (TREATMENT_CODES에)
const oldCodes = "const TREATMENT_CODES={'ESWT'";
const newCodes = "const TREATMENT_CODES={'전산화인지':'전산화 인지치료','ESWT'";
if (!combined.includes("'전산화인지'")) {
    combined = combined.replace(oldCodes, newCodes);
    console.log('✅ 전산화인지 추가');
} else {
    console.log('⏭️ 전산화인지 이미 있음');
}

// 2. CRLF 처리 수정 - 정확한 문자열로
// 기존: if(str.includes('\n')){const lines=str.split('\n');const matchLine=lines.find(l=>l.replace(/\s/g,'').includes(patientName.replace(/\s/g,'')));if(matchLine)str=matchLine;else return null}
// 변경: str=str.replace(/[\r\n]+/g,' ').trim();

// SRC_MORNING 내부 (템플릿 리터럴 이스케이프)
const oldNewline1 = "if(str.includes('\\\\n')){const lines=str.split('\\\\n');const matchLine=lines.find(l=>l.replace(/\\\\s/g,'').includes(patientName.replace(/\\\\s/g,'')));if(matchLine)str=matchLine;else return null}";
const newNewline1 = "str=str.replace(/[\\\\r\\\\n]+/g,' ').trim()";

if (combined.includes(oldNewline1)) {
    combined = combined.replace(oldNewline1, newNewline1);
    console.log('✅ SRC_MORNING CRLF 처리 수정');
} else {
    console.log('❌ SRC_MORNING 줄바꿈 로직 못찾음');
    // 다른 형태 시도
    const alt = combined.indexOf("str.includes('\\\\n')");
    if (alt > -1) {
        console.log('  대안 위치 발견:', alt, combined.substring(alt, alt + 100));
    }
}

// 일반 스크립트 내부 (이스케이프 없음)
const oldNewline2 = "if(str.includes('\\n')){const lines=str.split('\\n');const matchLine=lines.find(l=>l.replace(/\\s/g,'').includes(patientName.replace(/\\s/g,'')));if(matchLine)str=matchLine;else return null}";
const newNewline2 = "str=str.replace(/[\\r\\n]+/g,' ').trim()";

if (combined.includes(oldNewline2)) {
    combined = combined.replace(oldNewline2, newNewline2);
    console.log('✅ 일반 스크립트 CRLF 처리 수정');
} else {
    console.log('⏭️ 일반 스크립트 줄바꿈 로직 없음 (또는 이미 수정됨)');
}

// 3. C+CPM/COM 규칙 추가 (SRC_MORNING 내부)
const oldCPM1 = "floorNote:'2층'}}for(let i=0";
const newCPM1 = "floorNote:'2층'}}if(/^C.+CPM$/.test(cleanStr)||/^C.+COM$/.test(cleanStr)){const suffixes=[];const rem=str.replace(new RegExp(patientName,'gi'),'').replace(/^C/i,'').replace(/CPM$|COM$/i,'');const parens=rem.match(/\\\\([^\\\\)]+\\\\)/g);if(parens)suffixes.push(...parens);(rem.match(/\\\\b[AB]\\\\b/g)||[]).forEach(g=>suffixes.push(GROUP_MAPPING[g]||g));return{found:true,name:'운동치료Ⅱ',remark:suffixes.join(''),floorMove:false,floorNote:''}}for(let i=0";

if (combined.includes(oldCPM1) && !combined.includes('C.+CPM')) {
    combined = combined.replace(oldCPM1, newCPM1);
    console.log('✅ C+CPM 규칙 추가');
} else if (combined.includes('C.+CPM')) {
    console.log('⏭️ C+CPM 이미 있음');
} else {
    console.log('❌ C+CPM 삽입 위치 못찾음');
}

// 4. 접미C 규칙 추가 (SRC_MORNING 내부)
const oldSuffix1 = "floorNote:''}}return{found:false";
const newSuffix1 = "floorNote:''}}if(/C$/.test(cleanStr)&&!/^C/.test(cleanStr)&&!/CPM$/.test(cleanStr)&&!/COM$/.test(cleanStr)&&cleanStr.length<=10){const suffixes=[];const rem=str.replace(new RegExp(patientName,'gi'),'').replace(/C$/i,'');const parens=rem.match(/\\\\([^\\\\)]+\\\\)/g);if(parens)suffixes.push(...parens);(rem.match(/\\\\b[AB]\\\\b/g)||[]).forEach(g=>suffixes.push(GROUP_MAPPING[g]||g));return{found:true,name:'운동치료Ⅱ',remark:suffixes.join(''),floorMove:false,floorNote:''}}return{found:false";

if (combined.includes(oldSuffix1) && !combined.includes('/C$/.test')) {
    combined = combined.replace(oldSuffix1, newSuffix1);
    console.log('✅ 접미C 규칙 추가');
} else if (combined.includes('/C$/.test')) {
    console.log('⏭️ 접미C 이미 있음');
} else {
    console.log('❌ 접미C 삽입 위치 못찾음');
}

// 저장
fs.writeFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', combined, 'utf8');
console.log('\n✅ 저장 완료:', (combined.length / 1024).toFixed(1), 'KB');

// 검증
const verify = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', 'utf8');
console.log('\n=== 검증 ===');
console.log('전산화인지:', verify.includes("'전산화인지':'전산화 인지치료'"));

const srcStart = verify.indexOf('const SRC_MORNING = `');
const srcEnd = verify.indexOf('`;', srcStart);
console.log('SRC_MORNING 시작:', srcStart);
console.log('SRC_MORNING 끝:', srcEnd);
console.log('SRC_MORNING 정상:', srcEnd > srcStart);
