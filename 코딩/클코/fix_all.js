const fs = require('fs');
let content = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/src/morning.html', 'utf8');

// 줄바꿈 처리 로직 수정
// 실제 파일에서는 \\s 가 아닌 그냥 \s로 저장되어 있음
const old1 = "matchLine=lines.find(l=>l.replace(/\\s/g,'').includes(patientName.replace(/\\s/g,'')));if(matchLine)str=matchLine;else return null}";
const new1 = "matchIdx=lines.findIndex(l=>l.replace(/\\s/g,'').includes(patientName.replace(/\\s/g,'')));if(matchIdx===-1)return null;str=(matchIdx>0?lines[matchIdx-1]+' ':'')+lines[matchIdx]}";

if (content.includes(old1)) {
    content = content.replace(old1, new1);
    fs.writeFileSync('C:/Users/agape/Desktop/코딩/클코/원본/src/morning.html', content, 'utf8');
    console.log('✅ 줄바꿈 처리 로직 수정 완료');
} else {
    console.log('❌ 못찾음');
    // 디버깅
    const idx = content.indexOf('matchLine=lines');
    console.log('matchLine 위치:', idx);
    if (idx > -1) {
        console.log(content.substring(idx, idx + 150));
    }
}
