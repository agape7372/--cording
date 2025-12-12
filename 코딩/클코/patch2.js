const fs = require('fs');
let content = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', 'utf8');

// 기존 analyzeCell 함수를 새 버전으로 교체
const oldAnalyzeCell = `function analyzeCell(cellStr,patientName){if(!cellStr)return null;let str=cellStr.toString();if(!str.replace(/\\\\s/g,'').includes(patientName.replace(/\\\\s/g,'')))return null;if(str.includes('\\\\n')){const lines=str.split('\\\\n');const matchLine=lines.find(l=>l.replace(/\\\\s/g,'').includes(patientName.replace(/\\\\s/g,'')));if(matchLine)str=matchLine;else return null}const cleanStr=str.replace(new RegExp(patientName,'gi'),'').trim().toUpperCase()`;

const newAnalyzeCell = `function analyzeCell(cellStr,patientName){if(!cellStr)return null;let str=cellStr.toString();const normalizedPatient=patientName.replace(/\\\\s/g,'');if(!str.replace(/\\\\s/g,'').includes(normalizedPatient))return null;if(/[\\\\r\\\\n]/.test(str)){const lines=str.split(/\\\\r?\\\\n|\\\\r/);const matchIdx=lines.findIndex(l=>l.replace(/\\\\s/g,'').includes(normalizedPatient));if(matchIdx===-1)return null;if(matchIdx>0&&lines[matchIdx-1].includes('전산화인지')){return{found:true,name:'전산화 인지치료',remark:'',floorMove:false,floorNote:''}}str=lines[matchIdx]}const cleanStr=str.replace(new RegExp(patientName,'gi'),'').trim().toUpperCase()`;

if (content.includes(oldAnalyzeCell)) {
    content = content.replace(oldAnalyzeCell, newAnalyzeCell);
    console.log('✅ analyzeCell 전산화인지 특별처리 추가');
} else {
    console.log('❌ 기존 analyzeCell 못찾음');
    // 대안: 부분 검색
    const idx = content.indexOf('function analyzeCell');
    if (idx > -1) {
        console.log('analyzeCell 위치:', idx);
        console.log('시작부분:', content.substring(idx, idx + 200));
    }
}

// C+CPM/COM 규칙 추가
const oldRG = `return{found:true,name:'로봇보행치료',remark:suffixes.join(''),floorMove:true,floorNote:'2층'}}for(let i=0`;
const newRG = `return{found:true,name:'로봇보행치료',remark:suffixes.join(''),floorMove:true,floorNote:'2층'}}if(/^C.+CPM$/.test(cleanStr)||/^C.+COM$/.test(cleanStr)){const suffixes=[];const rem=str.replace(new RegExp(patientName,'gi'),'').replace(/^C/i,'').replace(/CPM$|COM$/i,'');const parens=rem.match(/\\\\([^\\\\)]+\\\\)/g);if(parens)suffixes.push(...parens);(rem.match(/\\\\b[AB]\\\\b/g)||[]).forEach(g=>suffixes.push(GROUP_MAPPING[g]||g));return{found:true,name:'운동치료Ⅱ',remark:suffixes.join(''),floorMove:false,floorNote:''}}for(let i=0`;

if (content.includes(oldRG) && !content.includes('C.+CPM')) {
    content = content.replace(oldRG, newRG);
    console.log('✅ C+CPM/COM 규칙 추가');
}

// 접미C 규칙 추가 (접미S 뒤에)
const oldSuffixS = `return{found:true,name:'운동치료Ⅱ',remark:suffixes.join(''),floorMove:false,floorNote:''}}return{found:false`;
const newSuffixS = `return{found:true,name:'운동치료Ⅱ',remark:suffixes.join(''),floorMove:false,floorNote:''}}if(/C$/.test(cleanStr)&&!/^C/.test(cleanStr)&&!/CPM$/.test(cleanStr)&&!/COM$/.test(cleanStr)&&cleanStr.length<=10){const suffixes=[];const rem=str.replace(new RegExp(patientName,'gi'),'').replace(/C$/i,'');const parens=rem.match(/\\\\([^\\\\)]+\\\\)/g);if(parens)suffixes.push(...parens);(rem.match(/\\\\b[AB]\\\\b/g)||[]).forEach(g=>suffixes.push(GROUP_MAPPING[g]||g));return{found:true,name:'운동치료Ⅱ',remark:suffixes.join(''),floorMove:false,floorNote:''}}return{found:false`;

if (content.includes(oldSuffixS) && !content.includes('/C$/.test')) {
    content = content.replace(oldSuffixS, newSuffixS);
    console.log('✅ 접미C 규칙 추가');
}

fs.writeFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', content, 'utf8');
console.log('\n저장 완료:', content.length);

// 검증
const v = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/dist/첼TOP_합본_20251211.html', 'utf8');
console.log('\n=== 검증 ===');
console.log('전산화인지 특별처리:', v.includes("lines[matchIdx-1].includes('전산화인지')"));
console.log('C+CPM:', v.includes('C.+CPM'));
console.log('접미C:', v.includes('/C$/.test'));
