/**
 * 알고PT Pro - 주니어 치료사를 위한 AI 임상 파트너
 * JavaScript Application Logic
 */

// ============================================
// State Management
// ============================================
const state = {
    // Patient Info
    age: 50,
    gender: null,

    // Chief Complaints
    selectedComplaints: new Set(),

    // Pain Assessment
    painLocations: new Map(),
    currentVasPart: null,
    currentVasValue: 0,

    // MAS
    masSide: 'R',
    masValues: {},

    // MMT
    mmtSide: 'R',
    mmtValues: {},

    // ROM
    romSide: 'R',
    currentRomMovement: '어깨 굴곡',
    romValues: {},
    romWnl: {},

    // Current screen
    currentScreen: 'home'
};

// ============================================
// Constants - 한글화
// ============================================
const CHIEF_COMPLAINTS = [
    '보행 장애', '균형 저하', '경직', '근력 약화',
    '통증', '저림/감각이상', '어지러움', '떨림', '협응 문제',
    'ADL 어려움', '이동 어려움', '침상 이동 어려움',
    '어깨 통증', '허리 통증', '목 통증', '무릎 통증',
    '관절 강직', '부종', '피로감', 'ROM 제한'
];

const CONDITIONS = [
    '뇌졸중 - 편마비', '파킨슨병', '척수 손상',
    '외상성 뇌손상', '다발성 경화증', '뇌성마비',
    '길랭-바레 증후군', '말초신경병증'
];

const MAS_GRADES = ['G0', 'G1', 'G1+', 'G2', 'G3', 'G4'];

const MAS_MUSCLES = [
    { name: '팔꿈치 굴곡근', short: 'E.Flx' },
    { name: '팔꿈치 신전근', short: 'E.Ext' },
    { name: '손목 굴곡근', short: 'W.Flx' },
    { name: '손목 신전근', short: 'W.Ext' },
    { name: '손가락 굴곡근', short: 'F.Flx' },
    { name: '고관절 내전근', short: 'H.Add' },
    { name: '무릎 굴곡근', short: 'K.Flx' },
    { name: '무릎 신전근', short: 'K.Ext' },
    { name: '발목 저측굴곡근', short: 'A.PF' }
];

const MMT_GRADES = ['0', 'T', 'P-', 'P', 'P+', 'F-', 'F', 'F+', 'G-', 'G', 'G+', 'N'];

const MMT_MUSCLES = [
    { name: '어깨 굴곡', short: 'Sh.Flx' },
    { name: '어깨 신전', short: 'Sh.Ext' },
    { name: '어깨 외전', short: 'Sh.Abd' },
    { name: '팔꿈치 굴곡', short: 'E.Flx' },
    { name: '팔꿈치 신전', short: 'E.Ext' },
    { name: '손목 굴곡', short: 'W.Flx' },
    { name: '손목 신전', short: 'W.Ext' },
    { name: '고관절 굴곡', short: 'H.Flx' },
    { name: '고관절 신전', short: 'H.Ext' },
    { name: '무릎 굴곡', short: 'K.Flx' },
    { name: '무릎 신전', short: 'K.Ext' },
    { name: '발목 배측굴곡', short: 'A.DF' },
    { name: '발목 저측굴곡', short: 'A.PF' }
];

const ROM_MOVEMENTS = [
    { name: '어깨 굴곡', min: 0, max: 180, joint: 'shoulder', type: 'flexion', short: '어깨굴곡' },
    { name: '어깨 신전', min: 0, max: 60, joint: 'shoulder', type: 'extension', short: '어깨신전' },
    { name: '어깨 외전', min: 0, max: 180, joint: 'shoulder', type: 'abduction', short: '어깨외전' },
    { name: '팔꿈치 굴곡', min: 0, max: 150, joint: 'elbow', type: 'flexion', short: '팔꿈치굴곡' },
    { name: '팔꿈치 신전', min: 0, max: 0, joint: 'elbow', type: 'extension', short: '팔꿈치신전' },
    { name: '손목 굴곡', min: 0, max: 80, joint: 'wrist', type: 'flexion', short: '손목굴곡' },
    { name: '손목 신전', min: 0, max: 70, joint: 'wrist', type: 'extension', short: '손목신전' },
    { name: '고관절 굴곡', min: 0, max: 120, joint: 'hip', type: 'flexion', short: '고관절굴곡' },
    { name: '고관절 신전', min: 0, max: 30, joint: 'hip', type: 'extension', short: '고관절신전' },
    { name: '무릎 굴곡', min: 0, max: 135, joint: 'knee', type: 'flexion', short: '무릎굴곡' },
    { name: '무릎 신전', min: 0, max: 0, joint: 'knee', type: 'extension', short: '무릎신전' },
    { name: '발목 배측굴곡', min: 0, max: 20, joint: 'ankle', type: 'dorsiflexion', short: '발목DF' },
    { name: '발목 저측굴곡', min: 0, max: 50, joint: 'ankle', type: 'plantarflexion', short: '발목PF' }
];

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Show splash screen
    setTimeout(() => {
        document.getElementById('splash').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
    }, 2200);

    // Initialize UI components
    initChiefComplaints();
    initConditionChips();
    initBodyMap();
    initMasTab();
    initMmtTab();
    initRomTab();
}

// ============================================
// Navigation
// ============================================
function navigateTo(screen) {
    // Update state
    state.currentScreen = screen;

    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    // Show target screen
    document.getElementById(`screen-${screen}`).classList.add('active');

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`.nav-item[onclick="navigateTo('${screen}')"]`)?.classList.add('active');

    // Update header title
    const titles = {
        home: '알고PT Pro',
        subjective: '주관적 평가',
        objective: '객관적 평가',
        cdss: 'AI 임상 지원'
    };
    document.getElementById('header-title').textContent = titles[screen] || '알고PT Pro';
}

// ============================================
// Patient Information
// ============================================
function changeAge(delta) {
    state.age = Math.max(0, Math.min(120, state.age + delta));
    document.getElementById('age-value').textContent = `${state.age}세`;
}

function setGender(gender) {
    state.gender = gender;
    document.getElementById('gender-m').classList.toggle('active', gender === 'M');
    document.getElementById('gender-f').classList.toggle('active', gender === 'F');
}

// ============================================
// Chief Complaints
// ============================================
function initChiefComplaints() {
    const container = document.getElementById('cc-chips');
    container.innerHTML = CHIEF_COMPLAINTS.map(complaint =>
        `<button class="chip" onclick="toggleComplaint('${complaint}')">${complaint}</button>`
    ).join('');
}

function toggleComplaint(complaint) {
    if (state.selectedComplaints.has(complaint)) {
        state.selectedComplaints.delete(complaint);
    } else {
        state.selectedComplaints.add(complaint);
    }

    // Update UI
    const chips = document.querySelectorAll('#cc-chips .chip');
    chips.forEach(chip => {
        chip.classList.toggle('selected', state.selectedComplaints.has(chip.textContent));
    });

    // Update selected count
    const selectedInfo = document.getElementById('cc-selected');
    const count = state.selectedComplaints.size;
    if (count > 0) {
        selectedInfo.classList.remove('hidden');
        document.getElementById('cc-count').textContent = count;
    } else {
        selectedInfo.classList.add('hidden');
    }
}

// ============================================
// Body Map & Pain Assessment
// ============================================
function initBodyMap() {
    document.querySelectorAll('.body-part').forEach(part => {
        part.addEventListener('click', () => {
            const partName = part.getAttribute('data-part');
            openVasModal(partName);
        });
    });
}

function openVasModal(partName) {
    state.currentVasPart = partName;
    state.currentVasValue = state.painLocations.get(partName) || 0;

    document.getElementById('vas-part-name').textContent = partName;
    document.getElementById('vas-range').value = state.currentVasValue;
    updateVasValue(state.currentVasValue);

    document.getElementById('vas-modal').classList.remove('hidden');
}

function updateVasValue(value) {
    state.currentVasValue = parseInt(value);
    const vasValue = document.getElementById('vas-value');
    vasValue.textContent = value;

    // Update color based on pain level
    let color;
    if (value <= 3) {
        color = `hsl(${120 - value * 20}, 70%, 45%)`; // Green to yellow-green
    } else if (value <= 6) {
        color = `hsl(${60 - (value - 3) * 20}, 80%, 50%)`; // Yellow to orange
    } else {
        color = `hsl(${0 - (value - 7) * 5}, 80%, 50%)`; // Orange to red
    }
    vasValue.style.color = color;

    // Update arc
    const progress = document.getElementById('vas-arc-progress');
    const offset = 283 - (value / 10 * 283);
    progress.style.strokeDashoffset = offset;

    // Update thumb
    const thumb = document.getElementById('vas-thumb');
    const angle = (value / 10) * 180 - 90;
    const rad = angle * Math.PI / 180;
    const cx = 110 + 90 * Math.cos(rad);
    const cy = 100 - 90 * Math.sin(rad);
    thumb.setAttribute('cx', cx);
    thumb.setAttribute('cy', cy);
    thumb.setAttribute('stroke', color);

    // Update slider thumb color
    const slider = document.getElementById('vas-range');
    slider.style.setProperty('--thumb-color', color);
}

function saveVasPain() {
    if (state.currentVasValue > 0) {
        state.painLocations.set(state.currentVasPart, state.currentVasValue);
    } else {
        state.painLocations.delete(state.currentVasPart);
    }

    updatePainList();
    updateBodyMapColors();
    closeVasModal();
}

function removeVasPain() {
    state.painLocations.delete(state.currentVasPart);
    updatePainList();
    updateBodyMapColors();
    closeVasModal();
}

function closeVasModal() {
    document.getElementById('vas-modal').classList.add('hidden');
}

// Close modal when clicking outside
document.getElementById('vas-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'vas-modal') {
        closeVasModal();
    }
});

function updatePainList() {
    const container = document.getElementById('pain-locations');

    if (state.painLocations.size === 0) {
        container.innerHTML = '<p class="empty-hint">신체를 탭하여 추가</p>';
        return;
    }

    let html = '';
    state.painLocations.forEach((value, part) => {
        const level = value <= 3 ? 'low' : value <= 6 ? 'medium' : 'high';
        html += `
            <div class="pain-item">
                <div class="pain-bar ${level}"></div>
                <div class="pain-item-info">
                    <strong>${part}</strong>
                    <small class="${level}">VAS: ${value}/10</small>
                </div>
                <button class="pain-remove" onclick="removePainItem('${part}')">×</button>
            </div>
        `;
    });
    container.innerHTML = html;
}

function removePainItem(part) {
    state.painLocations.delete(part);
    updatePainList();
    updateBodyMapColors();
}

function updateBodyMapColors() {
    document.querySelectorAll('.body-part').forEach(part => {
        const partName = part.getAttribute('data-part');
        const value = state.painLocations.get(partName);

        part.classList.remove('pain-low', 'pain-medium', 'pain-high');

        if (value) {
            if (value <= 3) part.classList.add('pain-low');
            else if (value <= 6) part.classList.add('pain-medium');
            else part.classList.add('pain-high');
        }
    });
}

// ============================================
// Objective Screen - Tab Switching
// ============================================
function switchObjectiveTab(tab) {
    document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    document.querySelector(`.tab[onclick="switchObjectiveTab('${tab}')"]`).classList.add('active');
    document.getElementById(`tab-${tab}`).classList.add('active');
}

// ============================================
// MAS Tab
// ============================================
function initMasTab() {
    renderMasList();
}

function setMasSide(side) {
    state.masSide = side;
    document.getElementById('mas-side-r').classList.toggle('active', side === 'R');
    document.getElementById('mas-side-l').classList.toggle('active', side === 'L');
    renderMasList();
}

function renderMasList() {
    const container = document.getElementById('mas-list');
    const side = state.masSide;
    const sideLabel = side === 'R' ? '우' : '좌';

    container.innerHTML = MAS_MUSCLES.map(muscle => {
        const key = `${side}.${muscle.short}`;
        const currentValue = state.masValues[key];

        return `
            <div class="assessment-item">
                <div class="assessment-item-header">
                    <strong>${sideLabel}. ${muscle.name}</strong>
                    <span>${currentValue || '-'}</span>
                </div>
                <div class="grade-buttons">
                    ${MAS_GRADES.map(grade => `
                        <button class="grade-btn ${currentValue === grade ? 'selected' : ''}"
                                onclick="setMasGrade('${key}', '${grade}')">${grade}</button>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function setMasGrade(key, grade) {
    state.masValues[key] = grade;
    renderMasList();
}

// ============================================
// MMT Tab
// ============================================
function initMmtTab() {
    renderMmtList();
}

function setMmtSide(side) {
    state.mmtSide = side;
    document.getElementById('mmt-side-r').classList.toggle('active', side === 'R');
    document.getElementById('mmt-side-l').classList.toggle('active', side === 'L');
    renderMmtList();
}

function renderMmtList() {
    const container = document.getElementById('mmt-list');
    const side = state.mmtSide;
    const sideLabel = side === 'R' ? '우' : '좌';

    container.innerHTML = MMT_MUSCLES.map(muscle => {
        const key = `${side}.${muscle.short}`;
        const currentValue = state.mmtValues[key];

        return `
            <div class="assessment-item">
                <div class="assessment-item-header">
                    <strong>${sideLabel}. ${muscle.name}</strong>
                    <span>${currentValue || '-'}</span>
                </div>
                <div class="grade-buttons">
                    ${MMT_GRADES.map(grade => `
                        <button class="grade-btn ${currentValue === grade ? 'selected' : ''}"
                                onclick="setMmtGrade('${key}', '${grade}')">${grade}</button>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function setMmtGrade(key, grade) {
    state.mmtValues[key] = grade;
    renderMmtList();
}

function setAllMmtNormal() {
    const side = state.mmtSide;
    MMT_MUSCLES.forEach(muscle => {
        const key = `${side}.${muscle.short}`;
        state.mmtValues[key] = 'N';
    });
    renderMmtList();
    showToast('모든 근육이 정상(N)으로 설정되었습니다');
}

function clearAllMmt() {
    const side = state.mmtSide;
    MMT_MUSCLES.forEach(muscle => {
        const key = `${side}.${muscle.short}`;
        delete state.mmtValues[key];
    });
    renderMmtList();
}

// ============================================
// ROM Tab
// ============================================
function initRomTab() {
    renderRomMovementChips();
    selectRomMovement(ROM_MOVEMENTS[0]);
}

function setRomSide(side) {
    state.romSide = side;
    document.getElementById('rom-side-r').classList.toggle('active', side === 'R');
    document.getElementById('rom-side-l').classList.toggle('active', side === 'L');
    renderRomMovementChips();
    updateRomCard();
}

function renderRomMovementChips() {
    const container = document.getElementById('rom-movement-list');
    const side = state.romSide;

    container.innerHTML = ROM_MOVEMENTS.map(mov => {
        const key = `${side}.${mov.name}`;
        const isActive = state.currentRomMovement === mov.name;
        const isWnl = state.romWnl[key];

        return `
            <button class="movement-chip ${isActive ? 'active' : ''} ${isWnl ? 'wnl' : ''}"
                    onclick="selectRomMovement(ROM_MOVEMENTS.find(m => m.name === '${mov.name}'))">
                ${mov.short}
            </button>
        `;
    }).join('');
}

function selectRomMovement(movement) {
    state.currentRomMovement = movement.name;
    renderRomMovementChips();
    updateRomCard();
}

function updateRomCard() {
    const movement = ROM_MOVEMENTS.find(m => m.name === state.currentRomMovement);
    const side = state.romSide;
    const sideLabel = side === 'R' ? '우측' : '좌측';
    const key = `${side}.${movement.name}`;

    document.getElementById('rom-movement-title').textContent = `${sideLabel} ${movement.name}`;
    document.getElementById('rom-normal-range').textContent = `정상범위: ${movement.min}° - ${movement.max}°`;

    // Update WNL button
    const wnlBtn = document.getElementById('rom-wnl-btn');
    const isWnl = state.romWnl[key];
    wnlBtn.classList.toggle('active', isWnl);
    wnlBtn.querySelector('.wnl-check').textContent = isWnl ? '✓' : '○';

    // Update slider
    const slider = document.getElementById('rom-slider');
    slider.max = movement.max || 180;
    slider.value = state.romValues[key] || 0;

    // Update display
    updateRomAngle(slider.value);

    // Show/hide slider container based on WNL
    document.getElementById('rom-slider-container').style.display = isWnl ? 'none' : 'block';
}

function toggleRomWnl() {
    const movement = ROM_MOVEMENTS.find(m => m.name === state.currentRomMovement);
    const side = state.romSide;
    const key = `${side}.${movement.name}`;

    state.romWnl[key] = !state.romWnl[key];

    if (state.romWnl[key]) {
        state.romValues[key] = movement.max;
    }

    renderRomMovementChips();
    updateRomCard();
}

function setAllRomWnl() {
    const side = state.romSide;
    ROM_MOVEMENTS.forEach(mov => {
        const key = `${side}.${mov.name}`;
        state.romWnl[key] = true;
        state.romValues[key] = mov.max;
    });
    renderRomMovementChips();
    updateRomCard();
    showToast('모든 ROM이 정상범위로 설정되었습니다');
}

function updateRomAngle(value) {
    const angle = parseInt(value);
    const movement = ROM_MOVEMENTS.find(m => m.name === state.currentRomMovement);
    const side = state.romSide;
    const key = `${side}.${movement.name}`;

    state.romValues[key] = angle;

    // Update angle display
    document.getElementById('angle-value').textContent = `${angle}°`;

    // Update dial progress
    const max = movement.max || 180;
    const progress = (angle / max) * 377;
    document.getElementById('dial-progress').style.strokeDashoffset = 377 - progress;

    // Update dial thumb position
    const thumbAngle = (angle / max) * 360 - 90;
    const thumbRad = thumbAngle * Math.PI / 180;
    const thumbX = 75 + 60 * Math.cos(thumbRad);
    const thumbY = 75 + 60 * Math.sin(thumbRad);
    document.getElementById('dial-thumb').setAttribute('cx', thumbX);
    document.getElementById('dial-thumb').setAttribute('cy', thumbY);

    // Update mannequin animation
    updateMannequin(movement, angle);
}

function updateMannequin(movement, angle) {
    const rightArmGroup = document.getElementById('right-arm-group');
    const rightForearm = document.getElementById('right-forearm');

    if (!rightArmGroup) return;

    // Reset transforms
    rightArmGroup.setAttribute('transform', '');
    if (rightForearm) rightForearm.setAttribute('transform', '');

    // Apply rotation based on movement type
    if (movement.joint === 'shoulder') {
        if (movement.type === 'flexion') {
            // Shoulder flexion - rotate arm upward
            rightArmGroup.setAttribute('transform', `rotate(${-angle} 65 70)`);
        } else if (movement.type === 'extension') {
            // Shoulder extension - rotate arm backward
            rightArmGroup.setAttribute('transform', `rotate(${angle} 65 70)`);
        } else if (movement.type === 'abduction') {
            // Shoulder abduction - rotate arm outward
            rightArmGroup.setAttribute('transform', `rotate(${-angle * 0.5} 65 70)`);
        }
    } else if (movement.joint === 'elbow') {
        if (movement.type === 'flexion' && rightForearm) {
            // Elbow flexion - rotate forearm
            rightForearm.setAttribute('transform', `rotate(${-angle} 58 110)`);
        }
    }
}

// ============================================
// CDSS Screen
// ============================================
function initConditionChips() {
    const container = document.getElementById('condition-chips');
    container.innerHTML = CONDITIONS.map(condition =>
        `<button class="chip" onclick="searchCondition('${condition}')">${condition}</button>`
    ).join('');
}

function searchInterventions() {
    const conditions = Array.from(state.selectedComplaints).join(', ') || '현재 환자 상태';
    searchCondition(conditions);
}

function searchCondition(condition) {
    // Show loading
    document.getElementById('cdss-loading').classList.remove('hidden');
    document.getElementById('cdss-result').classList.add('hidden');
    document.getElementById('soap-note').classList.add('hidden');

    // Simulate API call
    setTimeout(() => {
        document.getElementById('cdss-loading').classList.add('hidden');
        document.getElementById('cdss-result').classList.remove('hidden');

        document.getElementById('result-content').innerHTML = `
<strong>질환: ${condition}</strong>

<strong>1. 근거 기반 중재법 (Grade A-B)</strong>
• 과제 지향적 훈련: 고강도, 반복적 과제 연습 (근거: 강함)
• 강제유도 운동치료 (CIMT): 상지 편마비 환자에게 권장
• 체중 지지 트레드밀 훈련: 보행 재활에 권장
• 신경발달치료 (NDT/Bobath): 운동조절 및 자세 정렬

<strong>2. 권장 평가 도구</strong>
• 버그 균형 척도 (BBS): 낙상 위험 평가
• 기능적 독립성 측정 (FIM): ADL 평가
• 수정 애쉬워스 척도 (MAS): 경직 등급
• 10m 보행 검사: 보행 속도 평가

<strong>3. 치료 빈도 가이드라인</strong>
• 급성기: 1-2회/일, 주 5-7일
• 아급성기: 1회/일, 주 5일
• 만성기: 주 2-3회, 유지 치료

<strong>4. 주요 주의사항</strong>
• 활동 중 활력징후 모니터링
• 기립성 저혈압 평가
• 수동 ROM 시 관절 보호
• 감각 장애 환자 피부 상태 확인

<strong>참고문헌:</strong>
- 뇌졸중 재활 임상 가이드라인 (2023)
- Cochrane Systematic Review: 물리치료 중재
`;
    }, 2000);
}

function generateSoapNote() {
    document.getElementById('soap-note').classList.remove('hidden');

    // Generate SOAP note based on collected data
    const complaints = Array.from(state.selectedComplaints).join(', ') || '기록 없음';
    const genderStr = state.gender === 'M' ? '남' : state.gender === 'F' ? '여' : '미기록';
    const painStr = state.painLocations.size > 0
        ? Array.from(state.painLocations).map(([part, vas]) => `${part} VAS ${vas}/10`).join(', ')
        : '통증 호소 없음';

    // Get MAS values
    let masStr = '미평가';
    const masEntries = Object.entries(state.masValues);
    if (masEntries.length > 0) {
        masStr = masEntries.map(([key, val]) => `${key}: ${val}`).join(', ');
    }

    // Get MMT values
    let mmtStr = '미평가';
    const mmtEntries = Object.entries(state.mmtValues);
    if (mmtEntries.length > 0) {
        mmtStr = mmtEntries.map(([key, val]) => `${key}: ${val}`).join(', ');
    }

    // Get ROM values
    let romStr = '미평가';
    const romEntries = Object.entries(state.romValues).filter(([key]) => !state.romWnl[key]);
    const wnlEntries = Object.entries(state.romWnl).filter(([_, val]) => val);
    if (romEntries.length > 0 || wnlEntries.length > 0) {
        const parts = [];
        if (romEntries.length > 0) {
            parts.push(romEntries.map(([key, val]) => `${key}: ${val}°`).join(', '));
        }
        if (wnlEntries.length > 0) {
            parts.push(`정상범위: ${wnlEntries.map(([key]) => key).join(', ')}`);
        }
        romStr = parts.join('; ');
    }

    document.getElementById('soap-content').textContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      SOAP NOTE - 물리치료
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[S] 주관적 소견 (Subjective):
   • 환자정보: ${state.age}세 / ${genderStr}
   • 주호소 (C.C): ${complaints}
   • 통증: ${painStr}
   • 환자 보고: 기능적 이동에 어려움 호소

[O] 객관적 소견 (Objective):
   • MAS (경직): ${masStr}
   • MMT (근력): ${mmtStr}
   • ROM (관절가동범위): ${romStr}
   • 균형: 평가 예정
   • 보행: 평가 예정

[A] 사정 (Assessment):
   • 주관적 호소 및 객관적 소견에 기반하여
     기능적 제한 확인됨
   • 포괄적 재활 프로그램 권장
   • 균형 검사를 통한 낙상 위험 판정 필요

[P] 계획 (Plan):
   • 과제 지향적 기능 훈련
   • 근력 약화 부위 강화 운동
   • ROM 제한 관절 가동 운동
   • 균형 훈련 점진적 진행
   • 환자/보호자 교육
   • 치료 빈도: 주 3-5회, 45-60분/회

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
알고PT Pro에서 생성됨
`;

    // Scroll to SOAP note
    document.getElementById('soap-note').scrollIntoView({ behavior: 'smooth' });
}

function copySoapNote() {
    const content = document.getElementById('soap-content').textContent;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(content).then(() => {
            showToast('✓ 클립보드에 복사됨! EMR에 붙여넣기 하세요.');
        }).catch(() => {
            fallbackCopy(content);
        });
    } else {
        fallbackCopy(content);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showToast('✓ 클립보드에 복사됨! EMR에 붙여넣기 하세요.');
    } catch (e) {
        showToast('복사 실패. 직접 선택하여 복사해주세요.');
    }
    document.body.removeChild(textarea);
}

// ============================================
// Toast Notification
// ============================================
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2500);
}

// ============================================
// Service Worker Registration (PWA)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}
