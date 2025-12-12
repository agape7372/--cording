const fs = require('fs');
let content = fs.readFileSync('C:/Users/agape/Desktop/코딩/클코/원본/src/morning.html', 'utf8');

// 줄바꿈 처리 로직 수정
// 기존: 이름이 포함된 줄만 가져옴
// 수정: 이름이 포함된 줄 + 그 윗줄까지 합쳐서 처리 (처방명이 윗줄에 있는 경우 대응)

const oldLogic = "if(str.includes('\\n')){const lines=str.split('\\n');const matchLine=lines.find(l=>l.replace(/\\s/g,'').includes(patientName.replace(/\\s/g,'')));if(matchLine)str=matchLine;else return null}";

const newLogic = "if(str.includes('\\n')){const lines=str.split('\\n');const matchIdx=lines.findIndex(l=>l.replace(/\\s/g,'').includes(patientName.replace(/\\s/g,'')));if(matchIdx===-1)return null;str=(matchIdx>0?lines[matchIdx-1]+' ':'')+lines[matchIdx]}";

if (content.includes(oldLogic)) {
    content = content.replace(oldLogic, newLogic);
    console.log('✅ 줄바꿈 처리 로직 수정 완료');
    fs.writeFileSync('C:/Users/agape/Desktop/코딩/클코/원본/src/morning.html', content);
} else {
    console.log('❌ 찾기 실패');
    // 디버깅
    const idx = content.indexOf("if(str.includes('\\n')");
    console.log('실제 내용:', content.substring(idx, idx + 220));
}
