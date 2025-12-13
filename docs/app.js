/**
 * 알고PT Pro - AI Clinical Partner for Therapists
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
    currentRomMovement: 'Shoulder Flexion',
    romValues: {},
    romWnl: {},

    // Current screen
    currentScreen: 'home'
};

// ============================================
// Constants
// ============================================
const CHIEF_COMPLAINTS = [
    'Gait disturbance', 'Balance deficit', 'Spasticity', 'Weakness',
    'Pain', 'Numbness', 'Dizziness', 'Tremor', 'Coordination problem',
    'ADL difficulty', 'Transfer difficulty', 'Bed mobility issue',
    'Shoulder pain', 'Back pain', 'Neck pain', 'Knee pain',
    'Stiffness', 'Swelling', 'Fatigue', 'ROM limitation'
];

const CONDITIONS = [
    'Stroke - Hemiplegia', 'Parkinson\'s Disease', 'Spinal Cord Injury',
    'Traumatic Brain Injury', 'Multiple Sclerosis', 'Cerebral Palsy',
    'Guillain-Barré Syndrome', 'Peripheral Neuropathy'
];

const MAS_GRADES = ['G0', 'G1', 'G1+', 'G2', 'G3', 'G4'];

const MAS_MUSCLES = [
    { name: 'Elbow Flexors', short: 'E.Flx' },
    { name: 'Elbow Extensors', short: 'E.Ext' },
    { name: 'Wrist Flexors', short: 'W.Flx' },
    { name: 'Wrist Extensors', short: 'W.Ext' },
    { name: 'Finger Flexors', short: 'F.Flx' },
    { name: 'Hip Adductors', short: 'H.Add' },
    { name: 'Knee Flexors', short: 'K.Flx' },
    { name: 'Knee Extensors', short: 'K.Ext' },
    { name: 'Ankle Plantar Flexors', short: 'A.PF' }
];

const MMT_GRADES = ['0', 'T', 'P-', 'P', 'P+', 'F-', 'F', 'F+', 'G-', 'G', 'G+', 'N'];

const MMT_MUSCLES = [
    { name: 'Shoulder Flexion', short: 'Sh.Flx' },
    { name: 'Shoulder Extension', short: 'Sh.Ext' },
    { name: 'Shoulder Abduction', short: 'Sh.Abd' },
    { name: 'Elbow Flexion', short: 'E.Flx' },
    { name: 'Elbow Extension', short: 'E.Ext' },
    { name: 'Wrist Flexion', short: 'W.Flx' },
    { name: 'Wrist Extension', short: 'W.Ext' },
    { name: 'Hip Flexion', short: 'H.Flx' },
    { name: 'Hip Extension', short: 'H.Ext' },
    { name: 'Knee Flexion', short: 'K.Flx' },
    { name: 'Knee Extension', short: 'K.Ext' },
    { name: 'Ankle Dorsiflexion', short: 'A.DF' },
    { name: 'Ankle Plantar Flexion', short: 'A.PF' }
];

const ROM_MOVEMENTS = [
    { name: 'Shoulder Flexion', min: 0, max: 180, joint: 'shoulder', type: 'flexion' },
    { name: 'Shoulder Extension', min: 0, max: 60, joint: 'shoulder', type: 'extension' },
    { name: 'Shoulder Abduction', min: 0, max: 180, joint: 'shoulder', type: 'abduction' },
    { name: 'Elbow Flexion', min: 0, max: 150, joint: 'elbow', type: 'flexion' },
    { name: 'Elbow Extension', min: 0, max: 0, joint: 'elbow', type: 'extension' },
    { name: 'Wrist Flexion', min: 0, max: 80, joint: 'wrist', type: 'flexion' },
    { name: 'Wrist Extension', min: 0, max: 70, joint: 'wrist', type: 'extension' },
    { name: 'Hip Flexion', min: 0, max: 120, joint: 'hip', type: 'flexion' },
    { name: 'Hip Extension', min: 0, max: 30, joint: 'hip', type: 'extension' },
    { name: 'Knee Flexion', min: 0, max: 135, joint: 'knee', type: 'flexion' },
    { name: 'Knee Extension', min: 0, max: 0, joint: 'knee', type: 'extension' },
    { name: 'Ankle Dorsiflexion', min: 0, max: 20, joint: 'ankle', type: 'dorsiflexion' },
    { name: 'Ankle Plantar Flexion', min: 0, max: 50, joint: 'ankle', type: 'plantarflexion' }
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
        subjective: 'Subjective',
        objective: 'Objective',
        cdss: 'AI Clinical Support'
    };
    document.getElementById('header-title').textContent = titles[screen] || '알고PT Pro';
}

// ============================================
// Patient Information
// ============================================
function changeAge(delta) {
    state.age = Math.max(0, Math.min(120, state.age + delta));
    document.getElementById('age-value').textContent = `${state.age} yrs`;
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
        container.innerHTML = '<p class="empty-hint">Tap on body to add</p>';
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

    container.innerHTML = MAS_MUSCLES.map(muscle => {
        const key = `${side}.${muscle.short}`;
        const currentValue = state.masValues[key];

        return `
            <div class="assessment-item">
                <div class="assessment-item-header">
                    <strong>${side}. ${muscle.name}</strong>
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

    container.innerHTML = MMT_MUSCLES.map(muscle => {
        const key = `${side}.${muscle.short}`;
        const currentValue = state.mmtValues[key];

        return `
            <div class="assessment-item">
                <div class="assessment-item-header">
                    <strong>${side}. ${muscle.name}</strong>
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
    showToast('All muscles set to Normal');
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
                ${mov.name.replace('Shoulder ', 'Sh.').replace('Elbow ', 'E.').replace('Wrist ', 'W.')
                    .replace('Hip ', 'H.').replace('Knee ', 'K.').replace('Ankle ', 'A.')
                    .replace('Flexion', 'Flx').replace('Extension', 'Ext').replace('Abduction', 'Abd')
                    .replace('Dorsiflexion', 'DF').replace('Plantar Flexion', 'PF')}
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
    const key = `${side}.${movement.name}`;

    document.getElementById('rom-movement-title').textContent = `${side}. ${movement.name}`;
    document.getElementById('rom-normal-range').textContent = `Normal: ${movement.min}° - ${movement.max}°`;

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
    showToast('All ROM set to WNL');
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
    const conditions = Array.from(state.selectedComplaints).join(', ') || 'Current patient condition';
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
<strong>Condition: ${condition}</strong>

<strong>1. Evidence-Based Interventions (Grade A-B)</strong>
• Task-oriented training: High-intensity, repetitive task practice (Evidence: Strong)
• Constraint-induced movement therapy (CIMT): For upper extremity hemiparesis
• Body weight-supported treadmill training: Recommended for gait rehabilitation
• Neurodevelopmental treatment (NDT/Bobath): For motor control and postural alignment

<strong>2. Recommended Assessment Tools</strong>
• Berg Balance Scale (BBS): Fall risk assessment
• Functional Independence Measure (FIM): ADL evaluation
• Modified Ashworth Scale (MAS): Spasticity grading
• 10-Meter Walk Test: Gait velocity assessment

<strong>3. Treatment Frequency Guidelines</strong>
• Acute phase: 1-2 sessions/day, 5-7 days/week
• Subacute phase: 1 session/day, 5 days/week
• Chronic phase: 2-3 sessions/week, maintenance

<strong>4. Key Precautions</strong>
• Monitor vital signs during activity
• Assess for orthostatic hypotension
• Joint protection during passive ROM
• Skin integrity checks for sensory impairment

<strong>References:</strong>
- Clinical Practice Guidelines for Stroke Rehabilitation (2023)
- Cochrane Systematic Review: Physical Therapy Interventions
`;
    }, 2000);
}

function generateSoapNote() {
    document.getElementById('soap-note').classList.remove('hidden');

    // Generate SOAP note based on collected data
    const complaints = Array.from(state.selectedComplaints).join(', ') || 'Not specified';
    const painStr = state.painLocations.size > 0
        ? Array.from(state.painLocations).map(([part, vas]) => `${part} VAS ${vas}/10`).join(', ')
        : 'None reported';

    // Get MAS values
    let masStr = 'Not assessed';
    const masEntries = Object.entries(state.masValues);
    if (masEntries.length > 0) {
        masStr = masEntries.map(([key, val]) => `${key}: ${val}`).join(', ');
    }

    // Get MMT values
    let mmtStr = 'Not assessed';
    const mmtEntries = Object.entries(state.mmtValues);
    if (mmtEntries.length > 0) {
        mmtStr = mmtEntries.map(([key, val]) => `${key}: ${val}`).join(', ');
    }

    // Get ROM values
    let romStr = 'Not assessed';
    const romEntries = Object.entries(state.romValues).filter(([key]) => !state.romWnl[key]);
    const wnlEntries = Object.entries(state.romWnl).filter(([_, val]) => val);
    if (romEntries.length > 0 || wnlEntries.length > 0) {
        const parts = [];
        if (romEntries.length > 0) {
            parts.push(romEntries.map(([key, val]) => `${key}: ${val}°`).join(', '));
        }
        if (wnlEntries.length > 0) {
            parts.push(`WNL: ${wnlEntries.map(([key]) => key).join(', ')}`);
        }
        romStr = parts.join('; ');
    }

    document.getElementById('soap-content').textContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      SOAP NOTE - Physical Therapy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[S] Subjective:
   • Patient: ${state.age}y/${state.gender || 'N/A'}
   • C.C: ${complaints}
   • Pain: ${painStr}
   • Pt. reports difficulty with functional mobility

[O] Objective:
   • MAS: ${masStr}
   • MMT: ${mmtStr}
   • ROM: ${romStr}
   • Balance: Assessment pending
   • Gait: Assessment pending

[A] Assessment:
   • Functional limitations identified based on
     subjective complaints and objective findings
   • Recommend comprehensive rehabilitation program
   • Fall risk to be determined with balance testing

[P] Plan:
   • Task-oriented functional training
   • Strengthening exercises for identified weakness
   • ROM exercises for limited joints
   • Balance training progression
   • Patient/caregiver education
   • Frequency: 3-5x/week, 45-60 min sessions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated by 알고PT Pro
`;

    // Scroll to SOAP note
    document.getElementById('soap-note').scrollIntoView({ behavior: 'smooth' });
}

function copySoapNote() {
    const content = document.getElementById('soap-content').textContent;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(content).then(() => {
            showToast('✓ Copied to clipboard! Paste in EMR.');
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
        showToast('✓ Copied to clipboard! Paste in EMR.');
    } catch (e) {
        showToast('Failed to copy. Please select manually.');
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
