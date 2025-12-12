const fs = require('fs');
let content = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/src/morning.html', 'utf8');

// RG 규칙 다음, for 루프 전에 C+CPM/COM 규칙 추가
// 찾을 패턴: "return{found:true,name:'로봇보행치료'..." 다음의 "for(let i=0"
const insertPoint = "floorNote:'2층'}}for(let i=0";
const newRule = `floorNote:'2층'}}if(/^C.+CPM$/.test(cleanStr)||/^C.+COM$/.test(cleanStr)){const suffixes=[];const rem=str.replace(new RegExp(patientName,'gi'),'').replace(/^C/i,'').replace(/CPM$|COM$/i,'');const parens=rem.match(/\\([^\\)]+\\)/g);if(parens)suffixes.push(...parens);(rem.match(/\\b[AB]\\b/g)||[]).forEach(g=>suffixes.push(GROUP_MAPPING[g]||g));return{found:true,name:'운동치료Ⅱ',remark:suffixes.join(''),floorMove:false,floorNote:''}}for(let i=0`;

if (content.includes(insertPoint)) {
    content = content.replace(insertPoint, newRule);
    fs.writeFileSync('C:/Users/agape/Desktop/코딩/클코/원본/src/morning.html', content);
    console.log('✅ morning.html 수정 완료');
    console.log('추가된 규칙: [접두]C...[접미]CPM/COM → 운동치료Ⅱ');
} else {
    console.log('❌ 삽입 지점을 찾을 수 없음');
    console.log('insertPoint 포함 여부:', content.includes("floorNote:'2층'}}"));
}
