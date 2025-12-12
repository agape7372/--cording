const fs = require('fs');

// 원본 20251210 복사해서 20251211로
let combined = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/원본/첼TOP_합본_20251210.html', 'utf8');

// morning.html 수정사항 반영
// 1. 전산화인지 추가
// 2. CRLF 처리
// 3. 윗줄 합치기
// 4. 제외 키워드 추가

// TREATMENT_CODES에 전산화인지 추가
const oldCodes = "const TREATMENT_CODES={'ESWT'";
const newCodes = "const TREATMENT_CODES={'전산화인지':'전산화 인지치료','ESWT'";
if (!combined.includes("'전산화인지'")) {
    combined = combined.replace(oldCodes, newCodes);
    console.log('✅ 전산화인지 추가');
}

// CRLF 처리: \n → [\r\n]
const oldNewline = "str.includes('\\\\n')){const lines=str.split('\\\\n')";
const newNewline = "/[\\\\r\\\\n]/.test(str)){const lines=str.split(/\\\\r?\\\\n|\\\\r/)";
if (combined.includes(oldNewline)) {
    combined = combined.replace(oldNewline, newNewline);
    console.log('✅ CRLF 처리 추가');
}

// 윗줄 합치기: matchLine → matchIdx
const oldMatch = "matchLine=lines.find(l=>l.replace(/\\\\s/g,'').includes(patientName.replace(/\\\\s/g,'')));if(matchLine)str=matchLine;else return null}";
const newMatch = "matchIdx=lines.findIndex(l=>l.replace(/\\\\s/g,'').includes(patientName.replace(/\\\\s/g,'')));if(matchIdx===-1)return null;str=(matchIdx>0?lines[matchIdx-1]+' ':'')+lines[matchIdx]}";
if (combined.includes(oldMatch)) {
    combined = combined.replace(oldMatch, newMatch);
    console.log('✅ 윗줄 합치기 추가');
}

// C+CPM 규칙 추가
const oldCPM = "floorNote:'2층'}}for(let i=0";
const newCPM = "floorNote:'2층'}}if(/^C.+CPM$/.test(cleanStr)||/^C.+COM$/.test(cleanStr)){const suffixes=[];const rem=str.replace(new RegExp(patientName,'gi'),'').replace(/^C/i,'').replace(/CPM$|COM$/i,'');const parens=rem.match(/\\\\([^\\\\)]+\\\\)/g);if(parens)suffixes.push(...parens);(rem.match(/\\\\b[AB]\\\\b/g)||[]).forEach(g=>suffixes.push(GROUP_MAPPING[g]||g));return{found:true,name:'운동치료Ⅱ',remark:suffixes.join(''),floorMove:false,floorNote:''}}for(let i=0";
if (combined.includes(oldCPM) && !combined.includes('C.+CPM')) {
    combined = combined.replace(oldCPM, newCPM);
    console.log('✅ C+CPM 규칙 추가');
}

// 접미C 규칙 추가
const oldSuffixS = "floorNote:''}}return{found:false";
const newSuffixC = "floorNote:''}}if(/C$/.test(cleanStr)&&!/^C/.test(cleanStr)&&!/CPM$/.test(cleanStr)&&!/COM$/.test(cleanStr)&&cleanStr.length<=10){const suffixes=[];const rem=str.replace(new RegExp(patientName,'gi'),'').replace(/C$/i,'');const parens=rem.match(/\\\\([^\\\\)]+\\\\)/g);if(parens)suffixes.push(...parens);(rem.match(/\\\\b[AB]\\\\b/g)||[]).forEach(g=>suffixes.push(GROUP_MAPPING[g]||g));return{found:true,name:'운동치료Ⅱ',remark:suffixes.join(''),floorMove:false,floorNote:''}}return{found:false";
if (combined.includes(oldSuffixS) && !combined.includes('/C$/.test')) {
    combined = combined.replace(oldSuffixS, newSuffixC);
    console.log('✅ 접미C 규칙 추가');
}

// 제외 키워드 추가
const oldKeys = 'const keys=["추가","N","CA","D","C"]';
const newKeys = 'const keys=["추가","N","CA","D","C","통증","언어","로봇","전산화인지","호흡","수중","도수","RG2"]';
if (combined.includes(oldKeys)) {
    combined = combined.replace(oldKeys, newKeys);
    console.log('✅ 제외 키워드 추가');
}

// 저장
fs.writeFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', combined, 'utf8');
console.log('\n✅ 새 합본 파일 생성:', (combined.length / 1024).toFixed(1), 'KB');

// 검증
const verify = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', 'utf8');
console.log('\n=== 검증 ===');
console.log('전산화인지:', verify.includes("'전산화인지':'전산화 인지치료'"));
console.log('CRLF:', verify.includes('/[\\\\r\\\\n]/.test'));
console.log('윗줄 합치기:', verify.includes('matchIdx-1'));
console.log('C+CPM:', verify.includes('C.+CPM'));
console.log('접미C:', verify.includes('/C$/.test'));
