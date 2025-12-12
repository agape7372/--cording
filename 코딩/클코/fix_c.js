const fs = require('fs');
let content = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/src/morning.html', 'utf8');

// [접미]S 규칙 뒤에 [접미]C 규칙 추가
// 현재: ...S$/.test(cleanStr)&&!/^S/.test(cleanStr)...return{found:true,name:'운동치료Ⅱ'...
// 그 뒤에 return{found:false 가 있음

// 접미S 규칙의 끝 부분 찾기
const suffixSEnd = "floorNote:''}}return{found:false";

// 접미C 규칙 추가 (접미S 규칙과 return{found:false 사이에)
const suffixCRule = `floorNote:''}}if(/C$/.test(cleanStr)&&!/^C/.test(cleanStr)&&!/CPM$/.test(cleanStr)&&!/COM$/.test(cleanStr)&&cleanStr.length<=10){const suffixes=[];const rem=str.replace(new RegExp(patientName,'gi'),'').replace(/C$/i,'');const parens=rem.match(/\\([^\\)]+\\)/g);if(parens)suffixes.push(...parens);(rem.match(/\\b[AB]\\b/g)||[]).forEach(g=>suffixes.push(GROUP_MAPPING[g]||g));return{found:true,name:'운동치료Ⅱ',remark:suffixes.join(''),floorMove:false,floorNote:''}}return{found:false`;

if (content.includes(suffixSEnd)) {
    content = content.replace(suffixSEnd, suffixCRule);
    fs.writeFileSync('C:/Users/agape/Desktop/코딩/클코/원본/src/morning.html', content);
    console.log('✅ [접미]C → 운동치료Ⅱ 규칙 추가 완료');
} else {
    console.log('❌ 삽입 지점을 찾을 수 없음');
}
