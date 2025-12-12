const fs = require('fs');

// 원본에서 복사
fs.copyFileSync('C:/Users/agape/Desktop/코딩/클코/원본/원본/첼TOP_합본_20251210.html', 'C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html');

let combined = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', 'utf8');
console.log('원본 복사 완료, 크기:', (combined.length / 1024).toFixed(1), 'KB');

// 1. 전산화인지 추가
if (!combined.includes("'전산화인지'")) {
    combined = combined.replace(
        "const TREATMENT_CODES={'ESWT'",
        "const TREATMENT_CODES={'전산화인지':'전산화 인지치료','ESWT'"
    );
    console.log('✅ 전산화인지 추가');
}

// 2. 줄바꿈 처리 수정 - CRLF를 공백으로 변환
// 원본: if(str.includes('\n')){...복잡한로직...}
// 수정: str=str.replace(/[\r\n]+/g,' ').trim()
const oldNewline = "if(str.includes('\\n')){const lines=str.split('\\n');const matchLine=lines.find(l=>l.replace(/\\s/g,'').includes(patientName.replace(/\\s/g,'')));if(matchLine)str=matchLine;else return null}";
const newNewline = "str=str.replace(/[\\r\\n]+/g,' ').trim()";

if (combined.includes(oldNewline)) {
    combined = combined.replace(oldNewline, newNewline);
    console.log('✅ CRLF 처리 수정');
} else {
    console.log('❌ 줄바꿈 로직 못찾음');
}

// 3. C+CPM/COM 규칙 추가
const oldCPM = "floorNote:'2층'}}for(let i=0";
const newCPM = "floorNote:'2층'}}if(/^C.+CPM$/.test(cleanStr)||/^C.+COM$/.test(cleanStr)){const suffixes=[];const rem=str.replace(new RegExp(patientName,'gi'),'').replace(/^C/i,'').replace(/CPM$|COM$/i,'');const parens=rem.match(/\\([^\\)]+\\)/g);if(parens)suffixes.push(...parens);(rem.match(/\\b[AB]\\b/g)||[]).forEach(g=>suffixes.push(GROUP_MAPPING[g]||g));return{found:true,name:'운동치료Ⅱ',remark:suffixes.join(''),floorMove:false,floorNote:''}}for(let i=0";

if (combined.includes(oldCPM) && !combined.includes('C.+CPM')) {
    combined = combined.replace(oldCPM, newCPM);
    console.log('✅ C+CPM/COM 규칙 추가');
}

// 4. 접미C 규칙 추가
const oldSuffix = "floorNote:''}}return{found:false";
const newSuffix = "floorNote:''}}if(/C$/.test(cleanStr)&&!/^C/.test(cleanStr)&&!/CPM$/.test(cleanStr)&&!/COM$/.test(cleanStr)&&cleanStr.length<=10){const suffixes=[];const rem=str.replace(new RegExp(patientName,'gi'),'').replace(/C$/i,'');const parens=rem.match(/\\([^\\)]+\\)/g);if(parens)suffixes.push(...parens);(rem.match(/\\b[AB]\\b/g)||[]).forEach(g=>suffixes.push(GROUP_MAPPING[g]||g));return{found:true,name:'운동치료Ⅱ',remark:suffixes.join(''),floorMove:false,floorNote:''}}return{found:false";

if (combined.includes(oldSuffix) && !combined.includes("/C$/.test")) {
    combined = combined.replace(oldSuffix, newSuffix);
    console.log('✅ 접미C 규칙 추가');
}

// 저장
fs.writeFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', combined, 'utf8');
console.log('\n✅ 저장 완료:', (combined.length / 1024).toFixed(1), 'KB');

// 검증
console.log('\n=== 검증 ===');
console.log('전산화인지:', combined.includes("'전산화인지':'전산화 인지치료'"));
console.log('CRLF:', combined.includes("[\\r\\n]+"));
console.log('C+CPM:', combined.includes('C.+CPM'));
console.log('접미C:', combined.includes('/C$/.test'));
