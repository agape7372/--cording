/**
 * 알고PT Pro - 주니어 치료사를 위한 AI 임상 파트너
 * JavaScript Application Logic
 */

// ============================================
// Storage Keys
// ============================================
const STORAGE_KEYS = {
    PATIENTS: 'algopt_patients',
    MEASUREMENTS: 'algopt_measurements',
    CURRENT_PATIENT: 'algopt_current_patient'
};

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
    currentJoint: 'shoulder',
    currentRomMovement: '어깨 굴곡',
    romValues: {},
    romWnl: {},

    // BBS
    bbsValues: {},

    // Current screen
    currentScreen: 'home',

    // Current patient
    currentPatient: null
};

// Patient form state
let patientFormState = {
    editMode: false,
    editId: null,
    gender: null
};

// ============================================
// Constants - 한글화
// ============================================
const CC_CATEGORIES = [
    {
        id: 'function',
        name: '기능장애',
        icon: '🚶',
        items: ['보행 장애', '균형 저하', 'ADL 어려움', '이동 어려움', '침상 이동 어려움']
    },
    {
        id: 'neuro',
        name: '신경증상',
        icon: '🧠',
        items: ['경직', '저림/감각이상', '어지러움', '떨림', '협응 문제']
    },
    {
        id: 'musculo',
        name: '근골격',
        icon: '💪',
        items: ['근력 약화', '관절 강직', 'ROM 제한', '부종']
    },
    {
        id: 'pain',
        name: '통증',
        icon: '⚡',
        items: ['어깨 통증', '허리 통증', '목 통증', '무릎 통증', '전신 통증']
    },
    {
        id: 'general',
        name: '전신증상',
        icon: '😓',
        items: ['피로감', '수면장애', '식욕저하']
    }
];

const CONDITIONS = [
    '뇌졸중 - 편마비', '파킨슨병', '척수 손상',
    '외상성 뇌손상', '다발성 경화증', '뇌성마비',
    '길랭-바레 증후군', '말초신경병증'
];

const MAS_GRADES = [
    { value: 'G0', label: '0', desc: '정상', detail: '근긴장도 증가 없음', color: '#10B981' },
    { value: 'G1', label: '1', desc: 'ROM 끝 catch', detail: 'ROM 끝에서 걸림(catch) 또는 최소 저항', color: '#34D399' },
    { value: 'G1+', label: '1+', desc: 'Catch+저항', detail: 'Catch 후 ROM ½ 미만에서 약간의 저항', color: '#FBBF24' },
    { value: 'G2', label: '2', desc: 'ROM 전반 저항', detail: 'ROM 대부분에서 긴장도↑, 수동운동 가능', color: '#F59E0B' },
    { value: 'G3', label: '3', desc: '수동운동 곤란', detail: '현저한 긴장도 증가, 수동운동 어려움', color: '#EF4444' },
    { value: 'G4', label: '4', desc: '강직(Rigid)', detail: '굴곡/신전 고정, 수동운동 불가', color: '#DC2626' }
];

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
    { name: '팔꿈치 신전', min: -15, max: 0, joint: 'elbow', type: 'extension', short: '팔꿈치신전' },
    { name: '손목 굴곡', min: 0, max: 80, joint: 'wrist', type: 'flexion', short: '손목굴곡' },
    { name: '손목 신전', min: 0, max: 70, joint: 'wrist', type: 'extension', short: '손목신전' },
    { name: '고관절 굴곡', min: 0, max: 120, joint: 'hip', type: 'flexion', short: '고관절굴곡' },
    { name: '고관절 신전', min: 0, max: 20, joint: 'hip', type: 'extension', short: '고관절신전' },
    { name: '무릎 굴곡', min: 0, max: 135, joint: 'knee', type: 'flexion', short: '무릎굴곡' },
    { name: '무릎 신전', min: -10, max: 0, joint: 'knee', type: 'extension', short: '무릎신전' },
    { name: '발목 배측굴곡', min: 0, max: 20, joint: 'ankle', type: 'dorsiflexion', short: '발목DF' },
    { name: '발목 저측굴곡', min: 0, max: 50, joint: 'ankle', type: 'plantarflexion', short: '발목PF' }
];

// BBS (Berg Balance Scale) - 14 items, 0-4 points each, total 56 points
// Reference: Berg et al. 1992, K-BBS (한글판) Jung et al. 2006
const BBS_ITEMS = [
    { id: 1, name: '앉은자세에서 일어서기', short: '앉→서기', category: 'dynamic',
      desc: ['중등도 이상 도움 필요', '최소 도움으로 기립', '손 사용 여러 번 시도 후 기립', '손 사용하여 독립적 기립', '손 사용 없이 독립적 기립'] },
    { id: 2, name: '지지 없이 서있기', short: '서기유지', category: 'standing',
      desc: ['도움 없이 10초 불가', '여러 번 시도로 10초', '30초 유지', '감독하에 2분', '안전하게 2분'] },
    { id: 3, name: '등받이 없이 앉아있기', short: '앉기유지', category: 'sitting',
      desc: ['도움 없이 10초 불가', '10초 유지', '30초 유지', '감독하에 2분', '안전하게 2분'] },
    { id: 4, name: '선자세에서 앉기', short: '서→앉기', category: 'dynamic',
      desc: ['앉는데 도움 필요', '조절 안 되는 하강', '다리 뒤로 의자 확인 후 하강', '손으로 조절하며 하강', '손 최소 사용으로 안전 착석'] },
    { id: 5, name: '이동하기', short: '이동', category: 'dynamic',
      desc: ['2인 도움/감독 필요', '1인 도움 필요', '언어적 지시/감독 필요', '손 확실히 사용하여 안전 이동', '손 약간 사용하여 안전 이동'] },
    { id: 6, name: '눈 감고 서있기', short: '눈감고서기', category: 'standing',
      desc: ['넘어지지 않게 도움 필요', '3초 못 버팀, 안전 유지', '3초 유지', '감독하에 10초', '안전하게 10초'] },
    { id: 7, name: '두 발 모으고 서있기', short: '발모아서기', category: 'standing',
      desc: ['자세 잡는데 도움, 15초 불가', '자세 도움 필요, 15초 유지', '독립적 자세, 30초 불가', '독립적 자세, 감독하에 1분', '독립적으로 1분'] },
    { id: 8, name: '팔 뻗어 앞으로 내밀기', short: '팔뻗기', category: 'standing',
      desc: ['균형 잃음/외부 지지 필요', '앞으로 뻗지만 감독 필요', '5cm 앞으로 뻗기', '12cm 앞으로 뻗기', '자신있게 25cm 앞으로 뻗기'] },
    { id: 9, name: '바닥에서 물건 집어올리기', short: '물건줍기', category: 'dynamic',
      desc: ['시도 불가/넘어지지 않게 도움', '시도하나 감독 필요', '물건 2-5cm 앞, 독립적 균형', '감독하에 물건 집기', '쉽고 안전하게 물건 집기'] },
    { id: 10, name: '뒤돌아보기 (좌/우)', short: '뒤돌아보기', category: 'standing',
      desc: ['균형 유지/넘어지지 않게 도움', '돌아볼 때 감독 필요', '옆으로만 돌림, 균형 유지', '한쪽만 잘됨, 체중이동 적음', '양쪽 뒤돌아보기, 체중이동 좋음'] },
    { id: 11, name: '360도 회전', short: '360회전', category: 'dynamic',
      desc: ['돌 때 도움 필요', '가까운 감독/언어 지시 필요', '360도 안전하나 느림', '한쪽만 4초 이내 안전', '양쪽 4초 이내 안전'] },
    { id: 12, name: '발 교대로 스툴에 올리기', short: '발올리기', category: 'dynamic',
      desc: ['넘어지지 않게 도움/시도 불가', '최소 도움으로 2회 이상', '감독하에 4회', '독립적 8회, 20초 초과', '독립적 8회, 20초 이내'] },
    { id: 13, name: '일렬로 서기 (탠덤)', short: '탠덤서기', category: 'standing',
      desc: ['발 디딜 때 균형 잃음', '도움 필요, 15초 유지', '작은 발걸음, 30초 유지', '독립적 발 앞에, 30초', '독립적 탠덤, 30초'] },
    { id: 14, name: '한 발로 서기', short: '한발서기', category: 'standing',
      desc: ['시도 불가/넘어지지 않게 도움', '시도하나 3초 불가, 독립 유지', '3초 이상', '5-10초', '10초 이상'] }
];

// BBS score interpretation
const BBS_INTERPRETATION = [
    { min: 0, max: 20, level: 'high', label: '휠체어 의존', color: '#DC2626', fallRisk: '높음' },
    { min: 21, max: 40, level: 'medium', label: '보조기구 보행', color: '#F59E0B', fallRisk: '중등도' },
    { min: 41, max: 56, level: 'low', label: '독립적', color: '#10B981', fallRisk: '낮음' }
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
    initBbsTab();

    // Initialize patient management
    initSamplePatients();
    renderPatientList();
    loadCurrentPatientFromStorage();
    initPatientFormListeners();
}

// Initialize sample patients on first run
function initSamplePatients() {
    const patients = getPatients();
    if (patients.length === 0) {
        const samplePatients = [
            {
                id: Date.now().toString() + '1',
                name: '김철수',
                gender: 'male',
                age: 65,
                diagnosis: '뇌졸중 (Lt. hemiplegia)',
                memo: '좌측 편마비, 보행 훈련 중',
                status: 'progress',
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now().toString() + '2',
                name: '박영희',
                gender: 'female',
                age: 72,
                diagnosis: '파킨슨병',
                memo: '균형 훈련 필요',
                status: 'complete',
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now().toString() + '3',
                name: '이민수',
                gender: 'male',
                age: 45,
                diagnosis: '요추 추간판 탈출증 (L4-5)',
                memo: '통증 관리 및 코어 강화',
                status: 'progress',
                createdAt: new Date().toISOString()
            }
        ];
        savePatients(samplePatients);
    }
}

// Load current patient from storage on startup
function loadCurrentPatientFromStorage() {
    const currentPatientId = localStorage.getItem(STORAGE_KEYS.CURRENT_PATIENT);
    if (currentPatientId) {
        const patients = getPatients();
        const patient = patients.find(p => p.id === currentPatientId);
        if (patient) {
            state.currentPatient = patient;
            updateCurrentPatientDisplay();
        }
    }
}

// Update current patient display in header/home
function updateCurrentPatientDisplay() {
    const patient = state.currentPatient;
    const patientInfoEl = document.getElementById('current-patient-info');

    if (patientInfoEl) {
        if (patient) {
            patientInfoEl.innerHTML = `
                <div class="current-patient-badge">
                    <span class="patient-icon">👤</span>
                    <span class="patient-name">${patient.name}</span>
                    <span class="patient-detail">${patient.gender === 'male' ? '남' : '여'} / ${patient.age}세</span>
                </div>
            `;
            patientInfoEl.style.display = 'flex';
        } else {
            patientInfoEl.innerHTML = '';
            patientInfoEl.style.display = 'none';
        }
    }
}

// Initialize patient form event listeners
function initPatientFormListeners() {
    // Diagnosis select - show custom input when "기타" selected
    const diagnosisSelect = document.getElementById('patient-diagnosis');
    const customDiagnosis = document.getElementById('custom-diagnosis');

    if (diagnosisSelect && customDiagnosis) {
        diagnosisSelect.addEventListener('change', function() {
            if (this.value === 'other') {
                customDiagnosis.style.display = 'block';
                customDiagnosis.querySelector('input').required = true;
            } else {
                customDiagnosis.style.display = 'none';
                customDiagnosis.querySelector('input').required = false;
            }
        });
    }

    // Memo character counter
    const memoTextarea = document.getElementById('patient-memo');
    const charCount = document.querySelector('.char-count');

    if (memoTextarea && charCount) {
        memoTextarea.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = `${count}/200`;
            if (count > 180) {
                charCount.style.color = '#ef4444';
            } else {
                charCount.style.color = '#94a3b8';
            }
        });
    }

    // Search input for patient filtering
    const searchInput = document.querySelector('.patient-search input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterPatients(this.value);
        });
    }
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
        patients: '환자 관리',
        subjective: 'S: 주관적 평가',
        objective: 'O: 객관적 평가',
        assessment: 'A: 평가',
        plan: 'P: 치료 계획',
        cdss: 'AI 임상 지원'
    };
    document.getElementById('header-title').textContent = titles[screen] || '알고PT Pro';

    // Update patient banners on Assessment/Plan screens
    if (screen === 'assessment' || screen === 'plan') {
        updatePatientBanner(screen);
    }

    // Trigger AI analysis when entering Assessment screen
    if (screen === 'assessment') {
        runAIAnalysis();
    }

    // Initialize Plan screen with treatments
    if (screen === 'plan') {
        initPlanScreen();
    }
}

// Update patient banner on Assessment/Plan screens
function updatePatientBanner(screen) {
    const bannerId = screen === 'assessment' ? 'assessment-patient-banner' : 'plan-patient-banner';
    const banner = document.getElementById(bannerId);
    if (!banner) return;

    if (state.currentPatient) {
        const p = state.currentPatient;
        banner.innerHTML = `
            <div class="patient-banner-info">
                <span class="patient-banner-icon">👤</span>
                <div>
                    <div class="patient-banner-name">${p.name}</div>
                    <div class="patient-banner-meta">${p.gender === 'male' ? '남' : '여'}/${p.age}세 · ${p.diagnosis || ''}</div>
                </div>
            </div>
        `;
        banner.style.cursor = 'pointer';
        banner.onclick = () => navigateTo('home');
    } else {
        banner.innerHTML = `
            <div class="patient-banner-info">
                <span class="patient-banner-icon">👤</span>
                <span class="patient-banner-name">HOME에서 환자를 선택해주세요</span>
            </div>
        `;
        banner.style.cursor = 'pointer';
        banner.onclick = () => navigateTo('home');
    }
}

// ============================================
// Dashboard Functions
// ============================================
function loadPatient(patientId) {
    const patients = getPatients();
    const patient = patients.find(p => p.id === patientId);

    if (patient) {
        state.currentPatient = patient;
        localStorage.setItem(STORAGE_KEYS.CURRENT_PATIENT, patientId);

        // 환자 정보를 state에 반영
        state.age = patient.age || 50;
        state.gender = patient.gender;

        showToast(`${patient.name} 환자 선택됨`);
        navigateTo('subjective');
    } else {
        showToast('환자를 찾을 수 없습니다');
    }
}

function showHistory() {
    const modal = document.getElementById('history-modal');
    const patientInfo = document.getElementById('history-patient-info');
    const content = document.getElementById('history-content');

    if (state.currentPatient) {
        patientInfo.innerHTML = `
            <div class="history-patient-name">${state.currentPatient.name}</div>
            <div class="history-patient-meta">${state.currentPatient.gender || ''}/${state.currentPatient.age || ''}세 · ${state.currentPatient.diagnosis || ''}</div>
        `;
        renderHistoryContent('measurements');
    } else {
        patientInfo.innerHTML = `
            <div class="history-patient-name">환자 미선택</div>
            <div class="history-patient-meta">환자를 먼저 선택해주세요</div>
        `;
    }

    modal.classList.remove('hidden');
}

function closeHistory() {
    document.getElementById('history-modal').classList.add('hidden');
}

function setHistoryTab(tab) {
    document.querySelectorAll('.history-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    renderHistoryContent(tab);
}

function renderHistoryContent(tab) {
    const content = document.getElementById('history-content');
    const measurements = getMeasurements();
    const patientMeasurements = state.currentPatient
        ? measurements.filter(m => m.patientId === state.currentPatient.id)
        : [];

    if (patientMeasurements.length === 0) {
        content.innerHTML = `
            <div class="history-empty">
                <span class="history-empty-icon">📋</span>
                <p>기록이 없습니다</p>
                <p class="history-empty-sub">도구를 사용하면 자동으로 기록됩니다</p>
            </div>
        `;
        return;
    }

    const sortedMeasurements = patientMeasurements.sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    );

    content.innerHTML = sortedMeasurements.map(m => `
        <div class="history-item">
            <div class="history-item-header">
                <span class="history-item-type">${m.type}</span>
                <span class="history-item-date">${formatDate(m.timestamp)}</span>
            </div>
            <div class="history-item-value">${m.value}</div>
            ${m.detail ? `<div class="history-item-detail">${m.detail}</div>` : ''}
        </div>
    `).join('');
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
}

function showSettings() {
    const modal = document.getElementById('settings-modal');
    const patientCount = document.getElementById('settings-patient-count');
    const patients = getPatients();
    patientCount.textContent = `${patients.length}명`;
    modal.classList.remove('hidden');
}

function closeSettings() {
    document.getElementById('settings-modal').classList.add('hidden');
}

// ============================================
// Patient Management - LocalStorage
// ============================================
function getPatients() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

function savePatients(patients) {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
}

function getMeasurements() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

function saveMeasurement(type, value, detail = '') {
    if (!state.currentPatient) return;

    const measurements = getMeasurements();
    measurements.push({
        id: Date.now().toString(),
        patientId: state.currentPatient.id,
        type,
        value,
        detail,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(measurements));
}

// ============================================
// Patient Modal Functions
// ============================================
let selectedPatientId = null;

function openAddPatientModal() {
    patientFormState = { editMode: false, editId: null, gender: null };

    document.getElementById('patient-modal-title').textContent = '새 환자 등록';
    document.getElementById('patient-save-btn').textContent = '등록';
    document.getElementById('patient-form').reset();
    document.getElementById('patient-edit-id').value = '';
    document.getElementById('memo-char-count').textContent = '0';
    document.getElementById('patient-diagnosis-custom').classList.add('hidden');

    document.querySelectorAll('.gender-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById('patient-modal').classList.remove('hidden');
}

function closePatientModal() {
    document.getElementById('patient-modal').classList.add('hidden');
}

function selectGender(gender) {
    patientFormState.gender = gender;
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.gender === gender);
    });
}

function savePatient(event) {
    event.preventDefault();

    const name = document.getElementById('patient-name-input').value.trim();
    const age = parseInt(document.getElementById('patient-age-input').value) || null;
    const diagnosisSelect = document.getElementById('patient-diagnosis-select').value;
    const diagnosisCustom = document.getElementById('patient-diagnosis-custom').value.trim();
    const diagnosis = diagnosisSelect === 'Other' ? diagnosisCustom : diagnosisSelect;
    const memo = document.getElementById('patient-memo-input').value.trim();

    if (!name) {
        showToast('이름을 입력해주세요');
        return;
    }

    const patients = getPatients();

    if (patientFormState.editMode && patientFormState.editId) {
        // 수정 모드
        const index = patients.findIndex(p => p.id === patientFormState.editId);
        if (index !== -1) {
            patients[index] = {
                ...patients[index],
                name,
                gender: patientFormState.gender,
                age,
                diagnosis,
                memo,
                updatedAt: new Date().toISOString()
            };
            showToast('환자 정보가 수정되었습니다');
        }
    } else {
        // 새 환자 추가
        const newPatient = {
            id: Date.now().toString(),
            name,
            gender: patientFormState.gender,
            age,
            diagnosis,
            memo,
            status: 'progress',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        patients.unshift(newPatient);
        showToast('새 환자가 등록되었습니다');
    }

    savePatients(patients);
    closePatientModal();
    renderPatientList();
}

function editPatient(patientId) {
    const patients = getPatients();
    const patient = patients.find(p => p.id === patientId);

    if (!patient) {
        showToast('환자를 찾을 수 없습니다');
        return;
    }

    patientFormState = {
        editMode: true,
        editId: patientId,
        gender: patient.gender
    };

    document.getElementById('patient-modal-title').textContent = '환자 정보 수정';
    document.getElementById('patient-save-btn').textContent = '저장';
    document.getElementById('patient-name-input').value = patient.name || '';
    document.getElementById('patient-age-input').value = patient.age || '';
    document.getElementById('patient-memo-input').value = patient.memo || '';
    document.getElementById('memo-char-count').textContent = (patient.memo || '').length;

    // 진단명 설정
    const selectEl = document.getElementById('patient-diagnosis-select');
    const customEl = document.getElementById('patient-diagnosis-custom');
    const optionExists = Array.from(selectEl.options).some(opt => opt.value === patient.diagnosis);

    if (optionExists) {
        selectEl.value = patient.diagnosis || '';
        customEl.classList.add('hidden');
    } else if (patient.diagnosis) {
        selectEl.value = 'Other';
        customEl.value = patient.diagnosis;
        customEl.classList.remove('hidden');
    }

    // 성별 설정
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.gender === patient.gender);
    });

    document.getElementById('patient-modal').classList.remove('hidden');
}

function deletePatient(patientId) {
    if (!confirm('이 환자를 삭제하시겠습니까?\n관련된 모든 기록도 함께 삭제됩니다.')) {
        return;
    }

    let patients = getPatients();
    patients = patients.filter(p => p.id !== patientId);
    savePatients(patients);

    // 관련 측정 기록도 삭제
    let measurements = getMeasurements();
    measurements = measurements.filter(m => m.patientId !== patientId);
    localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(measurements));

    // 현재 환자였다면 초기화
    if (state.currentPatient && state.currentPatient.id === patientId) {
        state.currentPatient = null;
        localStorage.removeItem(STORAGE_KEYS.CURRENT_PATIENT);
    }

    showToast('환자가 삭제되었습니다');
    renderPatientList();
}

function renderPatientList() {
    const container = document.getElementById('recent-patients');
    const countEl = document.getElementById('recent-count');
    const patients = getPatients();

    countEl.textContent = patients.length;

    if (patients.length === 0) {
        container.innerHTML = `
            <div class="patient-list-empty">
                <div class="patient-list-empty-icon">👤</div>
                <p>등록된 환자가 없습니다</p>
            </div>
        `;
        return;
    }

    container.innerHTML = patients.slice(0, 10).map(patient => `
        <div class="patient-card" data-patient-id="${patient.id}">
            <div class="patient-info">
                <div class="patient-name">${patient.name}</div>
                <div class="patient-meta">${patient.gender === 'male' ? '남' : patient.gender === 'female' ? '여' : ''}${patient.age ? '/' + patient.age + '세' : ''} ${patient.diagnosis ? '· ' + patient.diagnosis : ''}</div>
            </div>
            <div class="patient-status">
                <span class="status-badge ${patient.status || 'progress'}">${patient.status === 'complete' ? '완료' : '작성중'}</span>
            </div>
        </div>
    `).join('');

    // 이벤트 위임으로 클릭 처리
    container.querySelectorAll('.patient-card').forEach(card => {
        card.addEventListener('click', function(e) {
            const patientId = this.dataset.patientId;
            if (patientId) {
                loadPatient(patientId);
            }
        });
    });
}

function showPatientActions(patientId) {
    const actions = [
        { label: '정보 수정', action: () => editPatient(patientId) },
        { label: '기록 보기', action: () => {
            const patients = getPatients();
            state.currentPatient = patients.find(p => p.id === patientId);
            showHistory();
        }},
        { label: '삭제', action: () => deletePatient(patientId), danger: true }
    ];

    // 간단한 액션 시트 표시 (confirm 대신 커스텀 UI 사용 가능)
    const selected = confirm('환자 메뉴\n\n1. 정보 수정 - 확인\n2. 삭제 - 취소 후 다시 클릭');
    if (selected) {
        editPatient(patientId);
    }
}

// ============================================
// Settings Functions
// ============================================
function exportData() {
    const data = {
        patients: getPatients(),
        measurements: getMeasurements(),
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `algopt-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('데이터가 저장되었습니다');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);

            if (!data.patients || !Array.isArray(data.patients)) {
                throw new Error('잘못된 파일 형식');
            }

            if (!confirm(`${data.patients.length}명의 환자 데이터를 가져오시겠습니까?\n기존 데이터와 병합됩니다.`)) {
                return;
            }

            // 기존 데이터와 병합 (ID 중복 방지)
            const existingPatients = getPatients();
            const existingIds = new Set(existingPatients.map(p => p.id));
            const newPatients = data.patients.filter(p => !existingIds.has(p.id));

            savePatients([...newPatients, ...existingPatients]);

            if (data.measurements) {
                const existingMeasurements = getMeasurements();
                const existingMIds = new Set(existingMeasurements.map(m => m.id));
                const newMeasurements = data.measurements.filter(m => !existingMIds.has(m.id));
                localStorage.setItem(STORAGE_KEYS.MEASUREMENTS,
                    JSON.stringify([...newMeasurements, ...existingMeasurements]));
            }

            renderPatientList();
            showToast(`${newPatients.length}명의 환자 데이터를 가져왔습니다`);
        } catch (err) {
            showToast('파일을 읽을 수 없습니다');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function confirmClearData() {
    if (!confirm('정말 모든 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
        return;
    }

    if (!confirm('마지막 확인입니다.\n모든 환자 데이터와 측정 기록이 삭제됩니다.')) {
        return;
    }

    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.MEASUREMENTS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PATIENT);
    state.currentPatient = null;

    renderPatientList();
    closeSettings();
    showToast('모든 데이터가 삭제되었습니다');
}

function filterPatients(query) {
    const cards = document.querySelectorAll('.patient-card');
    const q = query.toLowerCase().trim();

    cards.forEach(card => {
        const name = card.querySelector('.patient-name').textContent.toLowerCase();
        const meta = card.querySelector('.patient-meta').textContent.toLowerCase();
        const visible = !q || name.includes(q) || meta.includes(q);
        card.style.display = visible ? 'flex' : 'none';
    });
}

// ============================================
// Patient Information
// ============================================
function updateAge(value) {
    const age = parseInt(value) || 0;
    state.age = Math.max(1, Math.min(120, age));
    document.getElementById('age-input').value = state.age;
}

function setGender(gender) {
    state.gender = gender;
    document.getElementById('gender-m').classList.toggle('active', gender === 'M');
    document.getElementById('gender-f').classList.toggle('active', gender === 'F');
}

// ============================================
// Chief Complaints (카테고리별)
// ============================================
function initChiefComplaints() {
    const container = document.getElementById('cc-categories');

    container.innerHTML = CC_CATEGORIES.map(cat => `
        <div class="category-section" data-cat="${cat.id}">
            <button class="category-header" onclick="toggleCategory('${cat.id}')">
                <span><span class="cat-icon">${cat.icon}</span>${cat.name}</span>
                <span class="cat-count" id="cat-count-${cat.id}"></span>
                <span class="arrow">▼</span>
            </button>
            <div class="category-chips">
                ${cat.items.map(item =>
                    `<button class="chip" onclick="toggleComplaint('${item}')">${item}</button>`
                ).join('')}
            </div>
        </div>
    `).join('');
}

function toggleCategory(catId) {
    const section = document.querySelector(`.category-section[data-cat="${catId}"]`);
    section.classList.toggle('open');
}

function toggleComplaint(complaint) {
    if (state.selectedComplaints.has(complaint)) {
        state.selectedComplaints.delete(complaint);
    } else {
        state.selectedComplaints.add(complaint);
    }
    updateComplaintUI();
}

function updateComplaintUI() {
    // Update chip styles
    document.querySelectorAll('#cc-categories .chip').forEach(chip => {
        chip.classList.toggle('selected', state.selectedComplaints.has(chip.textContent));
    });

    // Update category counts
    CC_CATEGORIES.forEach(cat => {
        const count = cat.items.filter(item => state.selectedComplaints.has(item)).length;
        const countEl = document.getElementById(`cat-count-${cat.id}`);
        countEl.textContent = count > 0 ? count : '';
    });

}

// ============================================
// Body Map & Pain Assessment (Image-based Marker System)
// ============================================
let markerIdCounter = 0;
let touchStartData = null; // 터치 시작 정보 저장

function initBodyMap() {
    const container = document.getElementById('body-chart-container');
    if (!container) return;

    // Click event for desktop
    container.addEventListener('click', handleBodyChartClick);

    // Touch events - 스크롤과 탭 구분
    container.addEventListener('touchstart', handleBodyChartTouchStart, { passive: true });
    container.addEventListener('touchend', handleBodyChartTouch);
}

function handleBodyChartTouchStart(e) {
    const touch = e.touches[0];
    touchStartData = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
    };
}

function handleBodyChartClick(e) {
    // Ignore clicks on existing markers
    if (e.target.closest('.pain-marker')) return;

    const container = document.getElementById('body-chart-container');
    const rect = container.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    addPainMarker(x, y);
}

function handleBodyChartTouch(e) {
    // Ignore touches on existing markers
    if (e.target.closest('.pain-marker')) return;

    // 터치 시작 정보가 없으면 무시
    if (!touchStartData) return;

    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStartData.x);
    const deltaY = Math.abs(touch.clientY - touchStartData.y);
    const duration = Date.now() - touchStartData.time;

    // 스크롤 감지: 이동 거리 > 15px 또는 터치 시간 > 300ms면 스크롤로 판단
    if (deltaX > 15 || deltaY > 15 || duration > 300) {
        touchStartData = null;
        return; // 스크롤이므로 마커 추가 안함
    }

    e.preventDefault();
    const container = document.getElementById('body-chart-container');
    const rect = container.getBoundingClientRect();

    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;

    addPainMarker(x, y);
    touchStartData = null;
}

function addPainMarker(x, y) {
    const markerId = `marker-${++markerIdCounter}`;

    // Store marker data with position
    state.painLocations.set(markerId, { x, y, vas: 5 });
    state.currentVasPart = markerId;
    state.currentVasValue = 5;

    // Render marker and open VAS modal
    renderPainMarkers();
    openVasModal(markerId);
}

function renderPainMarkers() {
    const markersContainer = document.getElementById('pain-markers');
    if (!markersContainer) return;

    let html = '';
    state.painLocations.forEach((data, markerId) => {
        const level = data.vas <= 3 ? 'low' : data.vas <= 6 ? 'medium' : 'high';
        html += `
            <div class="pain-marker ${level}"
                 id="${markerId}"
                 style="left: ${data.x}%; top: ${data.y}%;"
                 onclick="editMarker('${markerId}')">
                <div class="pain-marker-dot"></div>
                <span class="pain-marker-label">${data.vas}</span>
            </div>
        `;
    });
    markersContainer.innerHTML = html;

    updatePainList();
}

function editMarker(markerId) {
    const data = state.painLocations.get(markerId);
    if (!data) return;

    state.currentVasPart = markerId;
    state.currentVasValue = data.vas;
    openVasModal(markerId);
}

function openVasModal(markerId) {
    const data = state.painLocations.get(markerId);
    state.currentVasPart = markerId;
    state.currentVasValue = data ? data.vas : 5;

    document.getElementById('vas-part-name').textContent = `통증 마커 #${markerId.split('-')[1]}`;
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
    const markerId = state.currentVasPart;
    const data = state.painLocations.get(markerId);

    if (data && state.currentVasValue > 0) {
        data.vas = state.currentVasValue;
        state.painLocations.set(markerId, data);
    } else if (state.currentVasValue === 0) {
        state.painLocations.delete(markerId);
    }

    renderPainMarkers();
    closeVasModal();
}

function removeVasPain() {
    state.painLocations.delete(state.currentVasPart);
    renderPainMarkers();
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

function clearAllMarkers() {
    state.painLocations.clear();
    markerIdCounter = 0;
    renderPainMarkers();
    showToast('모든 마커가 초기화되었습니다');
}

function updatePainList() {
    const container = document.getElementById('pain-locations');
    const countBadge = document.getElementById('pain-count');

    // Update count badge
    if (countBadge) {
        countBadge.textContent = state.painLocations.size;
        countBadge.style.display = state.painLocations.size > 0 ? 'inline' : 'none';
    }

    if (state.painLocations.size === 0) {
        container.innerHTML = '<p class="empty-hint">이미지를 탭하여 마커 추가</p>';
        return;
    }

    let html = '';
    state.painLocations.forEach((data, markerId) => {
        const level = data.vas <= 3 ? 'low' : data.vas <= 6 ? 'medium' : 'high';
        const markerNum = markerId.split('-')[1];
        html += `
            <div class="pain-item" onclick="editMarker('${markerId}')">
                <div class="pain-bar ${level}"></div>
                <div class="pain-item-info">
                    <strong>마커 #${markerNum}</strong>
                    <small class="${level}">VAS: ${data.vas}/10</small>
                </div>
                <button class="pain-remove" onclick="event.stopPropagation(); removePainItem('${markerId}')">×</button>
            </div>
        `;
    });
    container.innerHTML = html;
}

function removePainItem(markerId) {
    state.painLocations.delete(markerId);
    renderPainMarkers();
}

function updateBodyMapColors() {
    // Legacy function - no longer needed for image-based markers
    renderPainMarkers();
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

function renderMasList() {
    const container = document.getElementById('mas-list');

    container.innerHTML = MAS_MUSCLES.map(muscle => {
        const keyR = `R.${muscle.short}`;
        const keyL = `L.${muscle.short}`;
        const valueR = state.masValues[keyR];
        const valueL = state.masValues[keyL];

        const getGradeColor = (val) => {
            const grade = MAS_GRADES.find(g => g.value === val);
            return grade ? grade.color : '#9CA3AF';
        };

        return `
            <div class="assessment-item">
                <div class="assessment-item-header">
                    <strong>${muscle.name}</strong>
                </div>
                <div class="bilateral-row mas">
                    <div class="side-group mas">
                        <span class="side-label">Rt.</span>
                        <div class="grade-buttons mas-grid">
                            ${MAS_GRADES.map(grade => `
                                <button class="grade-btn-mas ${valueR === grade.value ? 'selected' : ''}"
                                        style="${valueR === grade.value ? `background:${grade.color};color:white;border-color:${grade.color};` : ''}"
                                        onclick="setMasGrade('${keyR}', '${grade.value}')">${grade.label}</button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="side-group mas">
                        <span class="side-label">Lt.</span>
                        <div class="grade-buttons mas-grid">
                            ${MAS_GRADES.map(grade => `
                                <button class="grade-btn-mas ${valueL === grade.value ? 'selected' : ''}"
                                        style="${valueL === grade.value ? `background:${grade.color};color:white;border-color:${grade.color};` : ''}"
                                        onclick="setMasGrade('${keyL}', '${grade.value}')">${grade.label}</button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function setMasGrade(key, grade) {
    state.masValues[key] = grade;
    renderMasList();
}

function setAllMasNormal() {
    MAS_MUSCLES.forEach(muscle => {
        state.masValues[`R.${muscle.short}`] = 'G0';
        state.masValues[`L.${muscle.short}`] = 'G0';
    });
    renderMasList();
    showToast('모든 근육이 정상(G0)으로 설정되었습니다');
}

function clearAllMas() {
    MAS_MUSCLES.forEach(muscle => {
        delete state.masValues[`R.${muscle.short}`];
        delete state.masValues[`L.${muscle.short}`];
    });
    renderMasList();
    showToast('MAS 평가가 초기화되었습니다');
}

// ============================================
// MMT Tab
// ============================================
const MMT_GRADE_INFO = {
    '0': { desc: 'Zero', detail: '근수축 없음 (시진/촉진 불가)', level: 0 },
    'T': { desc: 'Trace', detail: '촉진 시 수축 감지, 관절움직임 없음', level: 1 },
    'P-': { desc: 'Poor-', detail: '중력제거 상태에서 부분 ROM', level: 2 },
    'P': { desc: 'Poor', detail: '중력제거 상태에서 완전 ROM', level: 3 },
    'P+': { desc: 'Poor+', detail: '중력제거 + 약간의 저항', level: 4 },
    'F-': { desc: 'Fair-', detail: '중력 저항하여 부분 ROM', level: 5 },
    'F': { desc: 'Fair', detail: '중력 저항하여 완전 ROM', level: 6 },
    'F+': { desc: 'Fair+', detail: '중력 + 약간의 저항', level: 7 },
    'G-': { desc: 'Good-', detail: '중력 + 중등도 저항에서 부분 ROM', level: 8 },
    'G': { desc: 'Good', detail: '중력 + 중등도 저항에서 완전 ROM', level: 9 },
    'G+': { desc: 'Good+', detail: '중력 + 중등도 이상 저항', level: 10 },
    'N': { desc: 'Normal', detail: '중력 + 최대 저항에서 완전 ROM', level: 11 }
};

function initMmtTab() {
    renderMmtList();
}

function renderMmtList() {
    const container = document.getElementById('mmt-list');

    const getColor = (val) => {
        if (!val) return '#9CA3AF';
        const level = MMT_GRADE_INFO[val]?.level || 0;
        if (level >= 9) return '#10B981';
        if (level >= 6) return '#34D399';
        if (level >= 3) return '#FBBF24';
        return '#EF4444';
    };

    container.innerHTML = MMT_MUSCLES.map(muscle => {
        const keyR = `R.${muscle.short}`;
        const keyL = `L.${muscle.short}`;
        const valueR = state.mmtValues[keyR];
        const valueL = state.mmtValues[keyL];

        return `
            <div class="assessment-item">
                <div class="assessment-item-header">
                    <strong>${muscle.name}</strong>
                </div>
                <div class="bilateral-row mmt">
                    <div class="side-group mmt">
                        <span class="side-label">Rt.</span>
                        <div class="grade-buttons mmt-grid">
                            ${MMT_GRADES.map(g => `
                                <button class="grade-btn-mmt ${valueR === g ? 'selected' : ''}"
                                        style="${valueR === g ? `background:${getColor(g)};color:white;border-color:${getColor(g)};` : ''}"
                                        onclick="setMmtGrade('${keyR}', '${g}')">${g}</button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="side-group mmt">
                        <span class="side-label">Lt.</span>
                        <div class="grade-buttons mmt-grid">
                            ${MMT_GRADES.map(g => `
                                <button class="grade-btn-mmt ${valueL === g ? 'selected' : ''}"
                                        style="${valueL === g ? `background:${getColor(g)};color:white;border-color:${getColor(g)};` : ''}"
                                        onclick="setMmtGrade('${keyL}', '${g}')">${g}</button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function setMmtGrade(key, grade) {
    if (grade) {
        state.mmtValues[key] = grade;
    } else {
        delete state.mmtValues[key];
    }
    renderMmtList();
}

function setAllMmtNormal() {
    MMT_MUSCLES.forEach(muscle => {
        state.mmtValues[`R.${muscle.short}`] = 'N';
        state.mmtValues[`L.${muscle.short}`] = 'N';
    });
    renderMmtList();
    showToast('모든 근육이 정상(N)으로 설정되었습니다');
}

function clearAllMmt() {
    MMT_MUSCLES.forEach(muscle => {
        delete state.mmtValues[`R.${muscle.short}`];
        delete state.mmtValues[`L.${muscle.short}`];
    });
    renderMmtList();
    showToast('MMT 평가가 초기화되었습니다');
}

// ============================================
// ROM Tab
// ============================================
function initRomTab() {
    renderRomMovements();
    const firstMov = ROM_MOVEMENTS.filter(m => m.joint === state.currentJoint)[0];
    if (firstMov) selectRomMovement(firstMov);

    // Initialize circular dial interaction
    initDialInteraction();
}

// Circular dial touch/drag interaction
function initDialInteraction() {
    const dialSvg = document.querySelector('.dial-svg');
    if (!dialSvg) return;

    let isDragging = false;

    const getAngleFromEvent = (e) => {
        const rect = dialSvg.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let clientX, clientY;
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const dx = clientX - centerX;
        const dy = clientY - centerY;
        let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;

        if (angle < 0) angle += 360;
        if (angle > 360) angle -= 360;

        return angle;
    };

    const updateFromDial = (e) => {
        const movement = ROM_MOVEMENTS.find(m => m.name === state.currentRomMovement);
        if (!movement) return;

        const min = movement.min;
        const max = movement.max;
        const range = max - min;
        let angle = getAngleFromEvent(e);

        // Convert angle to ROM value (0-360 -> min-max)
        let value = (angle / 360) * range + min;

        // Snap to 5-degree increments
        value = Math.round(value / 5) * 5;
        value = Math.max(min, Math.min(max, value));

        // Update slider and ROM
        document.getElementById('rom-slider').value = value;
        updateRomAngle(value);
    };

    // Mouse events
    dialSvg.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateFromDial(e);
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            updateFromDial(e);
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch events
    dialSvg.addEventListener('touchstart', (e) => {
        isDragging = true;
        updateFromDial(e);
        e.preventDefault();
    }, { passive: false });

    dialSvg.addEventListener('touchmove', (e) => {
        if (isDragging) {
            updateFromDial(e);
            e.preventDefault();
        }
    }, { passive: false });

    dialSvg.addEventListener('touchend', () => {
        isDragging = false;
    });
}

function setRomSide(side) {
    state.romSide = side;
    document.getElementById('rom-side-r').classList.toggle('active', side === 'R');
    document.getElementById('rom-side-l').classList.toggle('active', side === 'L');
    renderRomMovements();
    updateRomCard();
}

function selectRomJoint(joint) {
    state.currentJoint = joint;
    const movements = ROM_MOVEMENTS.filter(m => m.joint === joint);
    if (movements.length > 0) {
        state.currentRomMovement = movements[0].name;
    }
    renderRomMovements();
    updateRomCard();
}

function renderRomMovements() {
    const container = document.getElementById('rom-movement-list');
    const movements = ROM_MOVEMENTS.filter(m => m.joint === state.currentJoint);

    container.innerHTML = movements.map(mov => {
        const keyR = `R.${mov.name}`;
        const keyL = `L.${mov.name}`;
        const isActive = state.currentRomMovement === mov.name;

        const isWnlR = state.romWnl[keyR];
        const isWnlL = state.romWnl[keyL];
        const valueR = state.romValues[keyR];
        const valueL = state.romValues[keyL];

        const displayR = isWnlR ? 'Full' : (valueR ? `${valueR}°` : '-');
        const displayL = isWnlL ? 'Full' : (valueL ? `${valueL}°` : '-');

        return `
            <div class="movement-item bilateral ${isActive ? 'active' : ''}"
                 onclick="selectRomMovement(ROM_MOVEMENTS.find(m => m.name === '${mov.name}'))">
                <span class="mov-name">${mov.short}</span>
                <div class="mov-values">
                    <span class="mov-val ${isWnlR ? 'wnl' : ''} ${state.romSide === 'R' ? 'current' : ''}">Rt. ${displayR}</span>
                    <span class="mov-val ${isWnlL ? 'wnl' : ''} ${state.romSide === 'L' ? 'current' : ''}">Lt. ${displayL}</span>
                </div>
            </div>
        `;
    }).join('');
}

function selectRomMovement(movement) {
    state.currentRomMovement = movement.name;
    renderRomMovements();
    updateRomCard();
}

function updateRomCard() {
    const movement = ROM_MOVEMENTS.find(m => m.name === state.currentRomMovement);
    const side = state.romSide;
    const sideLabel = side === 'R' ? 'Rt.' : 'Lt.';
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
    slider.min = movement.min;
    slider.max = movement.max;
    slider.value = state.romValues[key] ?? movement.min;

    // Update display
    updateRomAngle(slider.value);
}

function toggleRomWnl() {
    const movement = ROM_MOVEMENTS.find(m => m.name === state.currentRomMovement);
    const side = state.romSide;
    const key = `${side}.${movement.name}`;

    state.romWnl[key] = !state.romWnl[key];

    if (state.romWnl[key]) {
        state.romValues[key] = movement.max;
    }

    renderRomMovements();
    updateRomCard();
}

function setAllRomWnl() {
    const side = state.romSide;
    // 현재 선택된 관절의 모든 동작만 WNL로 설정
    ROM_MOVEMENTS.filter(m => m.joint === state.currentJoint).forEach(mov => {
        const key = `${side}.${mov.name}`;
        state.romWnl[key] = true;
        state.romValues[key] = mov.max;
    });
    renderRomMovements();
    updateRomCard();
    showToast('해당 관절 ROM 전체 Full 설정');
}

function updateRomAngle(value) {
    const angle = Math.round(parseInt(value) / 5) * 5; // 5도 단위로 스냅
    const movement = ROM_MOVEMENTS.find(m => m.name === state.currentRomMovement);
    const side = state.romSide;
    const key = `${side}.${movement.name}`;

    state.romValues[key] = angle;

    // Auto-toggle WNL when reaching max value
    const min = movement.min;
    const max = movement.max;
    if (angle >= max) {
        state.romWnl[key] = true;
        // Update WNL button UI
        const wnlBtn = document.getElementById('rom-wnl-btn');
        wnlBtn.classList.add('active');
        wnlBtn.querySelector('.wnl-check').textContent = '✓';
    } else if (state.romWnl[key]) {
        state.romWnl[key] = false;
        // Update WNL button UI
        const wnlBtn = document.getElementById('rom-wnl-btn');
        wnlBtn.classList.remove('active');
        wnlBtn.querySelector('.wnl-check').textContent = '○';
    }

    renderRomMovements();

    // Update angle display
    document.getElementById('angle-value').textContent = `${angle}°`;
    const range = max - min;
    const normalizedValue = angle - min;
    const progress = range > 0 ? (normalizedValue / range) * 377 : 0;
    document.getElementById('dial-progress').style.strokeDashoffset = 377 - progress;

    // Update dial thumb position
    const thumbAngle = range > 0 ? (normalizedValue / range) * 360 - 90 : -90;
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
// BBS Tab (Berg Balance Scale)
// ============================================
function initBbsTab() {
    renderBbsList();
}

function renderBbsList() {
    const container = document.getElementById('bbs-list');
    if (!container) return;

    const scoreColors = ['#DC2626', '#F59E0B', '#EAB308', '#10B981', '#06B6D4'];

    container.innerHTML = BBS_ITEMS.map(item => {
        const value = state.bbsValues[item.id];
        const hasValue = value !== undefined;

        return `
            <div class="bbs-item">
                <div class="bbs-item-header">
                    <span class="bbs-num">${item.id}</span>
                    <strong>${item.name}</strong>
                    ${hasValue ? `<span class="bbs-score-badge" style="background:${scoreColors[value]}">${value}점</span>` : ''}
                </div>
                <div class="bbs-buttons">
                    ${[0, 1, 2, 3, 4].map(score => `
                        <button class="bbs-btn ${value === score ? 'selected' : ''}"
                                style="${value === score ? `background:${scoreColors[score]};border-color:${scoreColors[score]};color:white;` : ''}"
                                onclick="setBbsScore(${item.id}, ${score})">
                            ${score}
                        </button>
                    `).join('')}
                </div>
                <div class="bbs-desc-list">
                    ${item.desc.map((desc, idx) => `
                        <div class="bbs-desc-row ${value === idx ? 'active' : ''}"
                             style="${value === idx ? `color:${scoreColors[idx]};` : ''}">
                            <span class="bbs-desc-num">${idx}:</span>
                            <span>${desc}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    updateBbsTotal();
}

function getScoreColor(score) {
    const colors = ['#DC2626', '#F59E0B', '#FBBF24', '#34D399', '#10B981'];
    return colors[score];
}

function setBbsScore(itemId, score) {
    state.bbsValues[itemId] = score;
    renderBbsList();
}

function updateBbsTotal() {
    const totalEl = document.getElementById('bbs-total');
    const interpretEl = document.getElementById('bbs-interpret');
    if (!totalEl) return;

    const values = Object.values(state.bbsValues);
    const total = values.reduce((sum, v) => sum + v, 0);
    const count = values.length;

    totalEl.textContent = `${total}/56`;

    // Find interpretation
    const interp = BBS_INTERPRETATION.find(i => total >= i.min && total <= i.max);
    if (interp && interpretEl) {
        interpretEl.innerHTML = `
            <span class="bbs-level" style="background:${interp.color}">${interp.label}</span>
            <span class="bbs-fall-risk">낙상위험: ${interp.fallRisk}</span>
            <span class="bbs-count">(${count}/14 항목)</span>
        `;
    }
}

function clearAllBbs() {
    state.bbsValues = {};
    renderBbsList();
    showToast('BBS 평가가 초기화되었습니다');
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
<div class="ai-disclaimer">
    ⚠️ <strong>AI 생성 권고</strong> - 임상적 판단의 보조 자료로만 활용하세요. 최종 결정은 담당 임상의의 책임입니다.
</div>

<strong>질환: ${condition}</strong>

<div class="evidence-section">
    <div class="evidence-header">
        <strong>1. 근거 기반 중재법</strong>
        <span class="evidence-badge grade-a">Level A-B</span>
    </div>
    <div class="evidence-item">
        <span class="intervention">과제 지향적 훈련</span>
        <span class="evidence-level level-a">A</span>
        <p>고강도, 반복적 과제 연습</p>
        <cite>출처: Stroke Rehab Guidelines (2023) | Cochrane Review</cite>
    </div>
    <div class="evidence-item">
        <span class="intervention">강제유도 운동치료 (CIMT)</span>
        <span class="evidence-level level-a">A</span>
        <p>상지 편마비 환자에게 권장</p>
        <cite>출처: APTA CPG (2022) | RCT 메타분석</cite>
    </div>
    <div class="evidence-item">
        <span class="intervention">체중 지지 트레드밀 훈련</span>
        <span class="evidence-level level-b">B</span>
        <p>보행 재활에 권장</p>
        <cite>출처: KSNR Guidelines (2023)</cite>
    </div>
    <div class="evidence-item">
        <span class="intervention">신경발달치료 (NDT/Bobath)</span>
        <span class="evidence-level level-c">C</span>
        <p>운동조절 및 자세 정렬</p>
        <cite>출처: Expert Consensus (2021)</cite>
    </div>
</div>

<div class="evidence-section">
    <strong>2. 권장 평가 도구</strong>
    <div class="tool-grid">
        <div class="tool-item">
            <span class="tool-name">BBS</span>
            <span class="tool-desc">균형/낙상위험</span>
        </div>
        <div class="tool-item">
            <span class="tool-name">FIM</span>
            <span class="tool-desc">ADL 독립성</span>
        </div>
        <div class="tool-item">
            <span class="tool-name">MAS</span>
            <span class="tool-desc">경직 평가</span>
        </div>
        <div class="tool-item">
            <span class="tool-name">10mWT</span>
            <span class="tool-desc">보행 속도</span>
        </div>
    </div>
</div>

<div class="evidence-section">
    <strong>3. 치료 빈도 가이드라인</strong>
    <table class="freq-table">
        <tr><th>단계</th><th>빈도</th><th>근거</th></tr>
        <tr><td>급성기</td><td>1-2회/일, 주 5-7일</td><td>Level A</td></tr>
        <tr><td>아급성기</td><td>1회/일, 주 5일</td><td>Level B</td></tr>
        <tr><td>만성기</td><td>주 2-3회</td><td>Level C</td></tr>
    </table>
</div>

<div class="evidence-section warning">
    <strong>4. 주의사항</strong>
    <ul>
        <li>활동 중 활력징후 모니터링</li>
        <li>기립성 저혈압 평가</li>
        <li>수동 ROM 시 관절 보호</li>
        <li>감각 장애 환자 피부 상태 확인</li>
    </ul>
</div>

<div class="references">
    <strong>📚 참고문헌</strong>
    <ol>
        <li>대한뇌신경재활학회. 뇌졸중 재활 임상 가이드라인 4판. 2023.</li>
        <li>Cochrane Database Syst Rev. Physical therapy interventions. 2023.</li>
        <li>APTA. Clinical Practice Guideline for Stroke Rehabilitation. 2022.</li>
    </ol>
    <p class="ref-note">근거수준: A=강한근거(RCT) B=중등도(대조연구) C=전문가합의</p>
</div>
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
⚠️ AI 초안 - 최종 임상적 판단 및
   책임은 담당 치료사에게 있습니다.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
알고PT Pro | ${new Date().toLocaleDateString('ko-KR')}
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
        navigator.serviceWorker.register('sw.js').catch(() => {});
    });
}

// ============================================
// Clinical Tools - Web Audio API Context
// ============================================
let audioContext = null;

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    return audioContext;
}

// Generate click sound using Web Audio API
function playClick(frequency = 1000, duration = 0.05) {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
}

// ============================================
// Clinical Stopwatch (10MWT / TUG) - 최적화 버전
// ============================================
const stopwatchState = {
    mode: '10mwt', // '10mwt' or 'tug'
    running: false,
    startTime: 0,
    elapsed: 0,
    laps: [],
    intervalId: null
};

// DOM 캐싱
let swElements = null;
function getSwElements() {
    if (!swElements) {
        swElements = {
            modal: document.getElementById('stopwatch-modal'),
            time: document.getElementById('stopwatch-time'),
            result: document.getElementById('stopwatch-result'),
            gaitSpeed: document.getElementById('gait-speed'),
            interpretation: document.getElementById('speed-interpretation'),
            start: document.getElementById('sw-start'),
            stop: document.getElementById('sw-stop'),
            lap: document.getElementById('sw-lap'),
            mode10mwt: document.getElementById('mode-10mwt'),
            modeTug: document.getElementById('mode-tug'),
            info10mwt: document.getElementById('info-10mwt'),
            infoTug: document.getElementById('info-tug'),
            tugLaps: document.getElementById('tug-laps'),
            lapElements: [1, 2, 3, 4].map(i => document.getElementById(`tug-lap${i}`))
        };
    }
    return swElements;
}

function openStopwatch() {
    const el = getSwElements();
    el.modal.classList.remove('hidden');
    resetStopwatch();
    getAudioContext(); // 오디오 컨텍스트 미리 활성화
}

function closeStopwatch() {
    stopStopwatch();
    getSwElements().modal.classList.add('hidden');
}

function setStopwatchMode(mode) {
    const el = getSwElements();
    stopwatchState.mode = mode;

    el.mode10mwt.classList.toggle('active', mode === '10mwt');
    el.modeTug.classList.toggle('active', mode === 'tug');
    el.info10mwt.classList.toggle('hidden', mode !== '10mwt');
    el.infoTug.classList.toggle('hidden', mode !== 'tug');
    el.tugLaps.classList.toggle('hidden', mode !== 'tug');
    el.lap.classList.toggle('hidden', mode !== 'tug');
    resetStopwatch();
}

function startStopwatch() {
    if (stopwatchState.running) return;

    playClick(880, 0.1);
    stopwatchState.running = true;
    stopwatchState.startTime = performance.now() - stopwatchState.elapsed;
    stopwatchState.laps = [];

    const el = getSwElements();
    el.start.classList.add('hidden');
    el.stop.classList.remove('hidden');
    if (stopwatchState.mode === 'tug') {
        el.lap.classList.remove('hidden');
    }
    el.result.classList.add('hidden');

    stopwatchState.intervalId = setInterval(updateStopwatchDisplay, 16); // 60fps로 변경
}

function stopStopwatch() {
    if (!stopwatchState.running) return;

    playClick(440, 0.1);
    stopwatchState.running = false;
    stopwatchState.elapsed = performance.now() - stopwatchState.startTime;

    if (stopwatchState.intervalId) {
        clearInterval(stopwatchState.intervalId);
        stopwatchState.intervalId = null;
    }

    const el = getSwElements();
    el.start.classList.remove('hidden');
    el.stop.classList.add('hidden');

    // 결과 계산 및 표시
    showStopwatchResult();
}

function showStopwatchResult() {
    const el = getSwElements();
    const seconds = stopwatchState.elapsed / 1000;

    if (stopwatchState.mode === '10mwt') {
        const speed = 10 / seconds;
        el.gaitSpeed.textContent = speed.toFixed(2);

        // 해석
        let interpretation, interpClass;
        if (speed >= 1.2) {
            interpretation = '정상 범위 (≥1.2 m/s)';
            interpClass = 'good';
        } else if (speed >= 0.8) {
            interpretation = '지역사회 보행 가능 (0.8-1.2 m/s)';
            interpClass = 'moderate';
        } else if (speed >= 0.4) {
            interpretation = '가정내 보행 수준 (0.4-0.8 m/s)';
            interpClass = 'warning';
        } else {
            interpretation = '보행 보조 필요 (<0.4 m/s)';
            interpClass = 'poor';
        }
        el.interpretation.textContent = interpretation;
        el.interpretation.className = 'result-interpretation ' + interpClass;
        el.result.classList.remove('hidden');
    } else if (stopwatchState.mode === 'tug') {
        // TUG 결과 해석 (CDC STEADI, Shumway-Cook 2000 근거)
        el.gaitSpeed.textContent = seconds.toFixed(2);

        let interpretation, interpClass;
        if (seconds < 10) {
            interpretation = '정상 - 독립적 이동 (<10초)';
            interpClass = 'good';
        } else if (seconds < 12) {
            interpretation = '정상 범위 (10-12초)';
            interpClass = 'moderate';
        } else if (seconds < 13.5) {
            interpretation = '낙상 위험 경계 (≥12초, CDC)';
            interpClass = 'warning';
        } else if (seconds < 20) {
            interpretation = '낙상 고위험 (≥13.5초)';
            interpClass = 'poor';
        } else {
            interpretation = '심각한 이동 제한 (≥20초)';
            interpClass = 'poor';
        }
        el.interpretation.textContent = interpretation;
        el.interpretation.className = 'result-interpretation ' + interpClass;

        // TUG 결과 표시 영역 업데이트
        const resultUnit = el.result.querySelector('.result-unit');
        if (resultUnit) resultUnit.textContent = '초';
        const resultLabel = el.result.querySelector('.result-label');
        if (resultLabel) resultLabel.textContent = 'TUG 시간';

        el.result.classList.remove('hidden');
    }
}

function lapStopwatch() {
    if (!stopwatchState.running || stopwatchState.mode !== 'tug') return;

    playClick(660, 0.05);
    const lapTime = performance.now() - stopwatchState.startTime;
    const lapIndex = stopwatchState.laps.length;

    if (lapIndex < 4) {
        stopwatchState.laps.push(lapTime);
        const el = getSwElements();
        const lapElement = el.lapElements[lapIndex];
        if (lapElement) {
            const prevTime = lapIndex > 0 ? stopwatchState.laps[lapIndex - 1] : 0;
            const segmentTime = (lapTime - prevTime) / 1000;
            lapElement.textContent = segmentTime.toFixed(2) + 's';
        }

        if (lapIndex === 3) {
            stopStopwatch();
        }
    }
}

function resetStopwatch() {
    if (stopwatchState.intervalId) {
        clearInterval(stopwatchState.intervalId);
        stopwatchState.intervalId = null;
    }
    stopwatchState.running = false;
    stopwatchState.elapsed = 0;
    stopwatchState.laps = [];

    const el = getSwElements();
    el.time.textContent = '00:00.00';
    el.result.classList.add('hidden');
    el.start.classList.remove('hidden');
    el.stop.classList.add('hidden');

    // TUG 랩 초기화
    el.lapElements.forEach(lapEl => {
        if (lapEl) lapEl.textContent = '--:--';
    });

    // 결과 단위 초기화
    const resultUnit = el.result.querySelector('.result-unit');
    if (resultUnit) resultUnit.textContent = 'm/s';
    const resultLabel = el.result.querySelector('.result-label');
    if (resultLabel) resultLabel.textContent = '보행 속도';
}

function updateStopwatchDisplay() {
    const elapsed = performance.now() - stopwatchState.startTime;
    const totalSeconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((elapsed % 1000) / 10);

    getSwElements().time.textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
}

// ============================================
// Pro Metronome - 최적화 버전
// ============================================
const metronomeState = {
    bpm: 60,
    running: false,
    intervalId: null,
    visualCue: true,
    soundCue: true,
    tapTimes: [],
    beatCount: 0,
    sessionStartTime: null
};

// DOM 캐싱
let metroElements = null;
function getMetroElements() {
    if (!metroElements) {
        metroElements = {
            modal: document.getElementById('metronome-modal'),
            bpmValue: document.getElementById('bpm-value'),
            bpmSlider: document.getElementById('bpm-slider'),
            playBtn: document.getElementById('metro-play'),
            visualBeat: document.getElementById('visual-beat'),
            beatCounter: document.getElementById('beat-counter'),
            sessionTime: document.getElementById('session-time'),
            presetBtns: document.querySelectorAll('.preset-btn')
        };
    }
    return metroElements;
}

function openMetronome() {
    const el = getMetroElements();
    el.modal.classList.remove('hidden');
    getAudioContext();
    updateMetronomeDisplay();
}

function closeMetronome() {
    stopMetronome();
    getMetroElements().modal.classList.add('hidden');
}

function setBpm(value) {
    const el = getMetroElements();
    metronomeState.bpm = Math.max(20, Math.min(240, parseInt(value) || 60));
    el.bpmValue.textContent = metronomeState.bpm;
    el.bpmSlider.value = metronomeState.bpm;

    // 프리셋 업데이트
    el.presetBtns.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.textContent) === metronomeState.bpm);
    });

    // 실행 중이면 재시작
    if (metronomeState.running) {
        if (metronomeState.intervalId) {
            clearInterval(metronomeState.intervalId);
        }
        const interval = 60000 / metronomeState.bpm;
        metronomeState.intervalId = setInterval(tick, interval);
    }
}

function adjustBpm(delta) {
    setBpm(metronomeState.bpm + delta);
}

function toggleMetronome() {
    if (metronomeState.running) {
        stopMetronome();
    } else {
        startMetronome();
    }
}

function startMetronome() {
    if (metronomeState.running) return;

    metronomeState.running = true;
    metronomeState.beatCount = 0;
    metronomeState.sessionStartTime = performance.now();

    const el = getMetroElements();
    el.playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> 정지';
    el.playBtn.classList.add('playing');

    const interval = 60000 / metronomeState.bpm;
    tick();
    metronomeState.intervalId = setInterval(tick, interval);

    // 세션 시간 업데이트 타이머
    metronomeState.sessionTimerId = setInterval(updateSessionTime, 1000);
}

function stopMetronome() {
    metronomeState.running = false;

    if (metronomeState.intervalId) {
        clearInterval(metronomeState.intervalId);
        metronomeState.intervalId = null;
    }
    if (metronomeState.sessionTimerId) {
        clearInterval(metronomeState.sessionTimerId);
        metronomeState.sessionTimerId = null;
    }

    const el = getMetroElements();
    el.playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> 재생';
    el.playBtn.classList.remove('playing');
    el.visualBeat.classList.remove('active');
}

function tick() {
    metronomeState.beatCount++;

    // 사운드 큐
    if (metronomeState.soundCue) {
        playClick(1000, 0.03);
    }

    // 시각적 큐
    if (metronomeState.visualCue) {
        const el = getMetroElements();
        el.visualBeat.classList.add('active');
        setTimeout(() => el.visualBeat.classList.remove('active'), 100);
    }

    updateMetronomeDisplay();
}

function updateMetronomeDisplay() {
    const el = getMetroElements();
    if (el.beatCounter) {
        el.beatCounter.textContent = metronomeState.beatCount;
    }
}

function updateSessionTime() {
    if (!metronomeState.sessionStartTime) return;

    const el = getMetroElements();
    if (el.sessionTime) {
        const elapsed = Math.floor((performance.now() - metronomeState.sessionStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        el.sessionTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

function tapTempo() {
    const now = performance.now();
    metronomeState.tapTimes.push(now);

    // 3초 이상 경과하면 초기화
    if (metronomeState.tapTimes.length >= 2) {
        const lastInterval = now - metronomeState.tapTimes[metronomeState.tapTimes.length - 2];
        if (lastInterval > 3000) {
            metronomeState.tapTimes = [now];
        }
    }

    // 최근 5개 탭만 유지
    if (metronomeState.tapTimes.length > 5) {
        metronomeState.tapTimes.shift();
    }

    // BPM 계산
    if (metronomeState.tapTimes.length >= 2) {
        let totalInterval = 0;
        for (let i = 1; i < metronomeState.tapTimes.length; i++) {
            totalInterval += metronomeState.tapTimes[i] - metronomeState.tapTimes[i - 1];
        }
        const avgInterval = totalInterval / (metronomeState.tapTimes.length - 1);
        const bpm = Math.round(60000 / avgInterval);
        setBpm(bpm);
    }

    playClick(800, 0.02);
}

function toggleVisualCue(enabled) {
    metronomeState.visualCue = enabled;
}

function toggleSoundCue(enabled) {
    metronomeState.soundCue = enabled;
}

// ============================================
// Cadence Calculator (SPM) - 최적화 버전
// ============================================
const cadenceState = {
    tapTimes: [],
    startTime: null,
    stepCount: 0,
    updateInterval: null,
    currentSpm: 0
};

// DOM 캐싱
let cadenceElements = null;
function getCadenceElements() {
    if (!cadenceElements) {
        cadenceElements = {
            modal: document.getElementById('cadence-modal'),
            spm: document.getElementById('cadence-spm'),
            stepCount: document.getElementById('step-count'),
            elapsedTime: document.getElementById('elapsed-time'),
            tapArea: document.getElementById('cadence-tap'),
            interpretation: document.getElementById('cadence-interpretation'),
            avgSpm: document.getElementById('avg-spm')
        };
    }
    return cadenceElements;
}

function openCadenceCalc() {
    const el = getCadenceElements();
    el.modal.classList.remove('hidden');
    resetCadence();
    getAudioContext();
}

function closeCadenceCalc() {
    if (cadenceState.updateInterval) {
        clearInterval(cadenceState.updateInterval);
        cadenceState.updateInterval = null;
    }
    getCadenceElements().modal.classList.add('hidden');
}

function tapCadence(event) {
    event.preventDefault();

    const now = performance.now();

    // 첫 탭이면 타이머 시작
    if (cadenceState.startTime === null) {
        cadenceState.startTime = now;
        cadenceState.updateInterval = setInterval(updateCadenceDisplay, 100);
    }

    cadenceState.tapTimes.push(now);
    cadenceState.stepCount++;

    // 최근 10개 탭만 유지
    if (cadenceState.tapTimes.length > 10) {
        cadenceState.tapTimes.shift();
    }

    // 시각적 피드백
    const el = getCadenceElements();
    el.tapArea.classList.add('tapped');
    setTimeout(() => el.tapArea.classList.remove('tapped'), 100);

    playClick(600, 0.02);
    updateCadenceDisplay();
}

function updateCadenceDisplay() {
    const el = getCadenceElements();

    // 걸음 수 업데이트
    el.stepCount.textContent = cadenceState.stepCount;

    // 경과 시간 업데이트
    if (cadenceState.startTime !== null) {
        const elapsed = (performance.now() - cadenceState.startTime) / 1000;
        const minutes = Math.floor(elapsed / 60);
        const seconds = Math.floor(elapsed % 60);
        el.elapsedTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // 평균 SPM 계산 (총 걸음수 / 총 시간)
        if (elapsed > 0 && cadenceState.stepCount >= 2) {
            const avgSpm = Math.round((cadenceState.stepCount / elapsed) * 60);
            if (el.avgSpm) {
                el.avgSpm.textContent = avgSpm;
            }
        }
    }

    // 실시간 SPM 계산 (최근 탭 기반 이동평균)
    if (cadenceState.tapTimes.length >= 2) {
        let totalInterval = 0;
        const recentTaps = cadenceState.tapTimes.slice(-6);

        for (let i = 1; i < recentTaps.length; i++) {
            totalInterval += recentTaps[i] - recentTaps[i - 1];
        }

        const avgInterval = totalInterval / (recentTaps.length - 1);
        cadenceState.currentSpm = Math.min(200, Math.round(60000 / avgInterval));

        el.spm.textContent = cadenceState.currentSpm;

        // 해석 업데이트
        updateCadenceInterpretation(cadenceState.currentSpm);
    }
}

function updateCadenceInterpretation(spm) {
    // CADENCE-Adults Study, NHANES 2005-2006 근거
    const el = getCadenceElements();
    if (!el.interpretation) return;

    let interpretation, interpClass;

    if (spm >= 100) {
        interpretation = '정상 보행 (≥100 SPM)';
        interpClass = 'good';
    } else if (spm >= 80) {
        interpretation = '느린 보행 / 노인 정상 (80-100 SPM)';
        interpClass = 'moderate';
    } else if (spm >= 60) {
        interpretation = '보행 주의 필요 (60-80 SPM)';
        interpClass = 'warning';
    } else if (spm > 0) {
        interpretation = '심각한 보행 제한 (<60 SPM)';
        interpClass = 'poor';
    } else {
        interpretation = '탭하여 측정 시작';
        interpClass = '';
    }

    el.interpretation.textContent = interpretation;
    el.interpretation.className = 'result-interpretation ' + interpClass;
}

function resetCadence() {
    if (cadenceState.updateInterval) {
        clearInterval(cadenceState.updateInterval);
        cadenceState.updateInterval = null;
    }
    cadenceState.tapTimes = [];
    cadenceState.startTime = null;
    cadenceState.stepCount = 0;
    cadenceState.currentSpm = 0;

    const el = getCadenceElements();
    el.spm.textContent = '0';
    el.stepCount.textContent = '0';
    el.elapsedTime.textContent = '0:00';
    if (el.avgSpm) el.avgSpm.textContent = '0';
    if (el.interpretation) {
        el.interpretation.textContent = '탭하여 측정 시작';
        el.interpretation.className = 'result-interpretation';
    }
}

// ============================================
// Dual Task Generator - 전면 업그레이드 버전
// ============================================
const dualTaskState = {
    mode: 'math', // 'math', 'word', 'color'
    running: false,
    paused: false,
    interval: 5,
    intervalId: null,
    currentNumber: 100,
    speechSynthesis: window.speechSynthesis,
    taskCount: 0,
    sessionStartTime: null,
    difficulty: 'normal', // 'easy', 'normal', 'hard'
    mathType: 'subtract', // 'subtract', 'add', 'mixed'
    countdownId: null,
    remainingTime: 0,
    usedPrompts: new Set() // 중복 방지용
};

// 확장된 단어 카테고리
const WORD_CATEGORIES = {
    animals: ['강아지', '고양이', '호랑이', '사자', '코끼리', '기린', '원숭이', '토끼', '곰', '여우', '늑대', '독수리', '참새', '비둘기', '까치', '돼지', '소', '말', '양', '닭'],
    fruits: ['사과', '배', '포도', '수박', '참외', '딸기', '바나나', '오렌지', '귤', '복숭아', '자두', '살구', '체리', '망고', '키위', '파인애플', '블루베리', '레몬'],
    countries: ['한국', '일본', '중국', '미국', '영국', '프랑스', '독일', '이탈리아', '스페인', '호주', '캐나다', '브라질', '인도', '러시아', '멕시코'],
    foods: ['김치', '불고기', '비빔밥', '라면', '떡볶이', '삼겹살', '된장찌개', '냉면', '김밥', '만두', '갈비', '삼계탕', '순두부', '잡채'],
    jobs: ['의사', '선생님', '경찰관', '소방관', '요리사', '운전사', '간호사', '약사', '변호사', '회계사', '기자', '배우', '가수', '화가', '작가'],
    bodyParts: ['머리', '눈', '코', '입', '귀', '팔', '다리', '손', '발', '어깨', '무릎', '허리', '목', '손가락', '발가락'],
    cities: ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '제주', '수원', '창원', '고양', '성남', '청주', '전주', '포항']
};

// 카테고리 이름 매핑
const CATEGORY_NAMES = {
    animals: '동물', fruits: '과일', countries: '나라', foods: '음식',
    jobs: '직업', bodyParts: '신체부위', cities: '도시'
};

// 난이도별 색상 (스트룹 효과)
const COLORS_EASY = [
    { name: '빨강', color: '#EF4444' },
    { name: '파랑', color: '#3B82F6' },
    { name: '노랑', color: '#EAB308' },
    { name: '초록', color: '#22C55E' }
];

const COLORS_NORMAL = [
    ...COLORS_EASY,
    { name: '보라', color: '#8B5CF6' },
    { name: '주황', color: '#F97316' },
    { name: '분홍', color: '#EC4899' },
    { name: '하늘', color: '#06B6D4' }
];

const COLORS_HARD = [
    ...COLORS_NORMAL,
    { name: '남색', color: '#4F46E5' },
    { name: '연두', color: '#84CC16' }
];

// 초성 리스트 (어려움 모드용)
const CHOSUNG = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// 난이도별 카테고리
const CATEGORIES_EASY = ['animals', 'fruits'];
const CATEGORIES_NORMAL = ['animals', 'fruits', 'foods', 'bodyParts'];
const CATEGORIES_HARD = ['animals', 'fruits', 'countries', 'foods', 'jobs', 'bodyParts', 'cities'];

// 난이도별 수학 문제 설정
const MATH_SETTINGS = {
    easy: { start: 50, subtract: 3, add: 2 },
    normal: { start: 100, subtract: 7, add: 6 },
    hard: { start: 150, subtract: 13, add: 9 }
};

// DOM 캐싱
let dtElements = null;
function getDtElements() {
    if (!dtElements) {
        dtElements = {
            modal: document.getElementById('dualtask-modal'),
            prompt: document.getElementById('task-prompt'),
            playBtn: document.getElementById('dt-play'),
            nextBtn: document.getElementById('dt-next'),
            mathBtn: document.getElementById('dt-math'),
            wordBtn: document.getElementById('dt-word'),
            colorBtn: document.getElementById('dt-color'),
            intervalValue: document.getElementById('interval-value'),
            ttsEnabled: document.getElementById('tts-enabled'),
            difficultyBtns: document.querySelectorAll('.difficulty-btn'),
            progress: document.getElementById('dt-countdown'),
            resultSummary: document.getElementById('dt-result-summary'),
            guide: document.getElementById('dt-guide')
        };
    }
    return dtElements;
}

// 모드별 가이드 텍스트 (컴팩트)
const MODE_GUIDES = {
    math: {
        easy: '50에서 -3씩 빼기',
        normal: '100에서 -7씩 빼기',
        hard: '150에서 -13 (덧셈 혼합)'
    },
    word: {
        easy: '동물/과일 이름 말하기',
        normal: '다양한 카테고리 단어',
        hard: '초성 제한 단어 말하기'
    },
    color: {
        easy: '4색 중 글자색 말하기',
        normal: '8색 중 글자색 말하기',
        hard: '10색 + 크기 변화 + 배경'
    }
};

function setDtState(state) {
    const el = getDtElements();
    el.modal.dataset.state = state;
}

function openDualTask() {
    const el = getDtElements();
    el.modal.classList.remove('hidden');
    setDtState('idle');
    resetDualTaskStats();
    updateGuideText();
    el.prompt.textContent = '준비';
    el.prompt.style.color = '';
    el.prompt.style.background = '';
    getAudioContext();
}

function closeDualTask() {
    stopDualTask();
    getDtElements().modal.classList.add('hidden');
}

function setDualTaskMode(mode) {
    if (dualTaskState.running) return; // 실행 중에는 변경 불가

    const el = getDtElements();
    dualTaskState.mode = mode;

    el.mathBtn.classList.toggle('active', mode === 'math');
    el.wordBtn.classList.toggle('active', mode === 'word');
    el.colorBtn.classList.toggle('active', mode === 'color');

    updateGuideText();
    resetDualTaskStats();
    el.prompt.textContent = '준비';
    el.prompt.style.color = '';
    el.prompt.style.background = '';
}

function setDualTaskDifficulty(difficulty) {
    if (dualTaskState.running) return; // 실행 중에는 변경 불가

    dualTaskState.difficulty = difficulty;
    const el = getDtElements();

    el.difficultyBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
    });

    updateGuideText();
    resetDualTaskStats();
}

function updateGuideText() {
    const el = getDtElements();
    if (el.guide) {
        const modeGuide = MODE_GUIDES[dualTaskState.mode];
        const diffGuide = modeGuide ? modeGuide[dualTaskState.difficulty] : '';
        el.guide.textContent = diffGuide || '';
    }
}

function resetDualTaskStats() {
    const settings = MATH_SETTINGS[dualTaskState.difficulty] || MATH_SETTINGS.normal;
    dualTaskState.currentNumber = settings.start;
    dualTaskState.taskCount = 0;
    dualTaskState.sessionStartTime = null;
    dualTaskState.usedPrompts.clear();
    dualTaskState.mathType = 'subtract';
    dualTaskState.remainingTime = 0;

    const el = getDtElements();
    if (el.progress) el.progress.innerHTML = '';
}

function adjustInterval(delta) {
    dualTaskState.interval = Math.max(2, Math.min(15, dualTaskState.interval + delta));
    getDtElements().intervalValue.textContent = dualTaskState.interval;
}

function toggleDualTask() {
    if (dualTaskState.running) {
        stopDualTask();
        showResultSummary();
    } else {
        startDualTask();
    }
}

function startDualTask() {
    dualTaskState.running = true;
    dualTaskState.sessionStartTime = performance.now();
    dualTaskState.usedPrompts.clear();
    dualTaskState.taskCount = 0;

    const settings = MATH_SETTINGS[dualTaskState.difficulty] || MATH_SETTINGS.normal;
    dualTaskState.currentNumber = settings.start;
    dualTaskState.remainingTime = dualTaskState.interval;

    const el = getDtElements();
    setDtState('running');
    el.playBtn.textContent = '종료';
    el.playBtn.classList.add('running');
    if (el.nextBtn) el.nextBtn.classList.remove('hidden');
    if (el.progress) el.progress.innerHTML = '<div class="dt-progress-bar" style="width: 100%"></div>';

    hideResultSummary();
    generateTask();
    dualTaskState.intervalId = setInterval(generateTask, dualTaskState.interval * 1000);
    dualTaskState.countdownId = setInterval(updateCountdown, 100);
}

function stopDualTask() {
    dualTaskState.running = false;

    if (dualTaskState.intervalId) {
        clearInterval(dualTaskState.intervalId);
        dualTaskState.intervalId = null;
    }
    if (dualTaskState.countdownId) {
        clearInterval(dualTaskState.countdownId);
        dualTaskState.countdownId = null;
    }

    const el = getDtElements();
    setDtState('idle');
    el.playBtn.textContent = '시작하기';
    el.playBtn.classList.remove('running');
    if (el.nextBtn) el.nextBtn.classList.add('hidden');
    if (el.progress) el.progress.innerHTML = '';
    el.prompt.textContent = '준비';
    el.prompt.style.color = '';
    el.prompt.style.background = '';

    // TTS 취소
    if (dualTaskState.speechSynthesis) {
        dualTaskState.speechSynthesis.cancel();
    }
}

function showResultSummary() {
    if (dualTaskState.taskCount === 0) return;

    const el = getDtElements();
    if (!el.resultSummary) return;

    const sessionSeconds = dualTaskState.sessionStartTime
        ? Math.floor((performance.now() - dualTaskState.sessionStartTime) / 1000)
        : 0;
    const avgTime = sessionSeconds > 0 ? (sessionSeconds / dualTaskState.taskCount).toFixed(1) : 0;
    const tasksPerMin = sessionSeconds > 0 ? ((dualTaskState.taskCount / sessionSeconds) * 60).toFixed(1) : 0;

    // 수행 평가
    const { rating, feedback, tip } = evaluatePerformance(dualTaskState.taskCount, avgTime, sessionSeconds);

    el.resultSummary.innerHTML = `
        <h4>📊 세션 결과</h4>
        <div class="result-stats">
            <div class="result-stat">
                <span class="result-stat-value">${dualTaskState.taskCount}</span>
                <span class="result-stat-label">문제 수</span>
            </div>
            <div class="result-stat">
                <span class="result-stat-value">${Math.floor(sessionSeconds / 60)}:${(sessionSeconds % 60).toString().padStart(2, '0')}</span>
                <span class="result-stat-label">시간</span>
            </div>
            <div class="result-stat">
                <span class="result-stat-value">${tasksPerMin}</span>
                <span class="result-stat-label">분당</span>
            </div>
        </div>
        <div class="result-feedback">
            <div class="feedback-rating">${rating}</div>
            <div class="feedback-text">${feedback}</div>
            <div class="feedback-tip">💡 ${tip}</div>
        </div>
    `;
    el.resultSummary.classList.remove('hidden');
    setDtState('idle'); // idle 상태로 복귀 (setup 영역 표시)
}

function evaluatePerformance(taskCount, avgTime, totalSeconds) {
    const difficulty = dualTaskState.difficulty;
    const mode = dualTaskState.mode;

    // 기본 평가 기준 (난이도별 조정)
    const diffMultiplier = difficulty === 'easy' ? 1.2 : difficulty === 'hard' ? 0.8 : 1;
    const adjustedAvg = avgTime / diffMultiplier;

    let rating, feedback, tip;

    if (totalSeconds < 30) {
        rating = '⏱️';
        feedback = '더 오래 연습해보세요';
        tip = '최소 1분 이상 연습을 권장합니다';
    } else if (adjustedAvg <= 4) {
        rating = '🌟 우수';
        feedback = '빠르고 정확한 수행입니다';
        tip = difficulty !== 'hard' ? '난이도를 높여보세요' : '꾸준히 유지하세요';
    } else if (adjustedAvg <= 6) {
        rating = '✅ 양호';
        feedback = '적절한 속도로 수행했습니다';
        tip = '반복 연습으로 속도를 높여보세요';
    } else if (adjustedAvg <= 8) {
        rating = '📈 보통';
        feedback = '조금 더 연습이 필요합니다';
        tip = difficulty !== 'easy' ? '난이도를 낮춰 연습해보세요' : '집중력을 높여보세요';
    } else {
        rating = '🔄 연습 필요';
        feedback = '천천히 시작하세요';
        tip = '간격을 늘리고 쉬운 난이도로 시작하세요';
    }

    // 모드별 추가 팁
    if (mode === 'word' && difficulty === 'hard') {
        tip = '초성 연상 훈련은 인지 유연성에 도움됩니다';
    } else if (mode === 'color') {
        tip = '스트룹 효과 극복은 전두엽 기능 향상에 효과적';
    }

    return { rating, feedback, tip };
}

function hideResultSummary() {
    const el = getDtElements();
    if (el.resultSummary) {
        el.resultSummary.classList.add('hidden');
    }
}

function updateCountdown() {
    dualTaskState.remainingTime -= 0.1;
    if (dualTaskState.remainingTime < 0) {
        dualTaskState.remainingTime = dualTaskState.interval;
    }
    const el = getDtElements();
    if (el.progress) {
        const bar = el.progress.querySelector('.dt-progress-bar');
        if (bar) {
            const percent = (dualTaskState.remainingTime / dualTaskState.interval) * 100;
            bar.style.width = `${percent}%`;
        }
    }
}

function nextTask() {
    if (!dualTaskState.running) return; // 실행 중일 때만 작동
    dualTaskState.remainingTime = dualTaskState.interval;
    generateTask();
}

function generateTask() {
    const el = getDtElements();
    const settings = MATH_SETTINGS[dualTaskState.difficulty] || MATH_SETTINGS.normal;

    dualTaskState.taskCount++;
    dualTaskState.remainingTime = dualTaskState.interval;

    let prompt = '';
    let speechText = '';

    // 프롬프트 애니메이션
    el.prompt.classList.remove('prompt-animate');
    void el.prompt.offsetWidth; // reflow 트리거
    el.prompt.classList.add('prompt-animate');

    switch (dualTaskState.mode) {
        case 'math':
            // 난이도에 따라 더하기/빼기 혼합
            const useMixed = dualTaskState.difficulty === 'hard' && Math.random() > 0.5;

            if (useMixed || dualTaskState.currentNumber <= 0) {
                // 더하기로 전환
                if (dualTaskState.currentNumber <= 0) dualTaskState.currentNumber = 10;
                const addNum = settings.add;
                prompt = `${dualTaskState.currentNumber} + ${addNum} = ?`;
                speechText = `${dualTaskState.currentNumber} 더하기 ${addNum}은?`;
                dualTaskState.currentNumber += addNum;
                if (dualTaskState.currentNumber > settings.start) {
                    dualTaskState.currentNumber = settings.start;
                }
            } else {
                // 빼기
                prompt = `${dualTaskState.currentNumber} - ${settings.subtract} = ?`;
                speechText = `${dualTaskState.currentNumber} 빼기 ${settings.subtract}은?`;
                dualTaskState.currentNumber -= settings.subtract;
            }
            el.prompt.style.color = '';
            el.prompt.style.fontSize = '2.5rem';
            break;

        case 'word':
            // 난이도별 카테고리 선택
            const catList = dualTaskState.difficulty === 'easy' ? CATEGORIES_EASY
                          : dualTaskState.difficulty === 'normal' ? CATEGORIES_NORMAL
                          : CATEGORIES_HARD;
            let category, categoryName;
            let attempts = 0;

            do {
                category = catList[Math.floor(Math.random() * catList.length)];
                categoryName = CATEGORY_NAMES[category];
                attempts++;
            } while (dualTaskState.usedPrompts.has(category) && attempts < catList.length);

            dualTaskState.usedPrompts.add(category);
            if (dualTaskState.usedPrompts.size >= catList.length) {
                dualTaskState.usedPrompts.clear();
            }

            // 어려움 모드: 초성 제한 추가
            if (dualTaskState.difficulty === 'hard') {
                const chosung = CHOSUNG[Math.floor(Math.random() * CHOSUNG.length)];
                prompt = `${chosung}으로 시작하는\n"${categoryName}"`;
                speechText = `${chosung}으로 시작하는 ${categoryName} 이름을 말하세요`;
            } else {
                prompt = `"${categoryName}"`;
                speechText = `${categoryName} 이름을 말하세요`;
            }
            el.prompt.style.color = '';
            el.prompt.style.fontSize = dualTaskState.difficulty === 'hard' ? '1.6rem' : '2rem';
            el.prompt.style.background = '';
            break;

        case 'color':
            // 난이도별 색상 선택
            const colorList = dualTaskState.difficulty === 'easy' ? COLORS_EASY
                            : dualTaskState.difficulty === 'normal' ? COLORS_NORMAL
                            : COLORS_HARD;
            const colorInfo = colorList[Math.floor(Math.random() * colorList.length)];
            let displayColor;
            do {
                displayColor = colorList[Math.floor(Math.random() * colorList.length)];
            } while (displayColor.name === colorInfo.name);

            // 난이도에 따라 글자 크기 변화
            const fontSizes = dualTaskState.difficulty === 'hard'
                ? ['1.8rem', '2.2rem', '2.8rem', '1.4rem']
                : ['2.2rem'];
            const fontSize = fontSizes[Math.floor(Math.random() * fontSizes.length)];

            prompt = colorInfo.name;
            speechText = `이 글자의 색깔을 말하세요`;
            el.prompt.style.color = displayColor.color;
            el.prompt.style.fontSize = fontSize;

            // 어려움 모드: 배경색 추가로 혼란 가중
            if (dualTaskState.difficulty === 'hard') {
                const bgColors = ['rgba(239,68,68,0.15)', 'rgba(59,130,246,0.15)', 'rgba(234,179,8,0.15)', 'rgba(34,197,94,0.15)'];
                el.prompt.style.background = bgColors[Math.floor(Math.random() * bgColors.length)];
                el.prompt.style.padding = '8px 16px';
                el.prompt.style.borderRadius = '8px';
            } else {
                el.prompt.style.background = '';
            }
            break;
    }

    el.prompt.textContent = prompt;

    // TTS
    if (el.ttsEnabled && el.ttsEnabled.checked && dualTaskState.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = 'ko-KR';
        utterance.rate = 0.9;
        dualTaskState.speechSynthesis.cancel();
        dualTaskState.speechSynthesis.speak(utterance);
    }

    playClick(500, 0.03);
}

// ============================================
// Sensor-based Tools (센서 기반 분석 도구)
// ============================================

// --- 공통 센서 권한 처리 ---
let orientationPermissionGranted = false;
let motionPermissionGranted = false;

async function requestOrientationPermission() {
    // iOS 13+ 권한 요청
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === 'granted') {
                orientationPermissionGranted = true;
                initGoniometer();
            } else {
                alert('센서 권한이 거부되었습니다. 설정에서 권한을 허용해주세요.');
            }
        } catch (e) {
            console.error('Permission request failed:', e);
            alert('센서 권한 요청 중 오류가 발생했습니다.');
        }
    } else {
        // Android 또는 권한 불필요 환경
        orientationPermissionGranted = true;
        initGoniometer();
    }
}

async function requestMotionPermission() {
    // iOS 13+ 권한 요청
    if (typeof DeviceMotionEvent !== 'undefined' &&
        typeof DeviceMotionEvent.requestPermission === 'function') {
        try {
            const permission = await DeviceMotionEvent.requestPermission();
            if (permission === 'granted') {
                motionPermissionGranted = true;
                initTremor();
            } else {
                alert('센서 권한이 거부되었습니다. 설정에서 권한을 허용해주세요.');
            }
        } catch (e) {
            console.error('Permission request failed:', e);
            alert('센서 권한 요청 중 오류가 발생했습니다.');
        }
    } else {
        motionPermissionGranted = true;
        initTremor();
    }
}

async function requestMicPermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        initDecibel(stream);
    } catch (e) {
        console.error('Microphone permission denied:', e);
        alert('마이크 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
    }
}

// ============================================
// 1. Digital Goniometer (디지털 각도계/수평계)
// ROM 기준: AAOS (American Academy of Orthopedic Surgeons)
// ============================================

const gonioState = {
    mode: 'incline', // 'incline' 또는 'angle'
    zeroOffset: { alpha: 0, beta: 0, gamma: 0 },
    isHeld: false,
    heldValue: 0,
    currentAngles: { x: 0, y: 0, z: 0 },
    // 고정 방식 설정
    holdSettings: {
        tap: true,      // 화면 탭
        auto: false,    // 자동 고정
        voice: false    // 음성 명령
    },
    // 자동 고정용
    autoHoldTimer: null,
    stableStartTime: null,
    lastAngle: null,
    // 음성 인식
    voiceRecognition: null
};

// AAOS 기준 정상 ROM (단위: 도)
const ROM_STANDARDS = {
    'shoulder-flex': 180,
    'shoulder-abd': 180,
    'elbow-flex': 150,
    'hip-flex': 120,
    'knee-flex': 135,
    'ankle-df': 20,
    'ankle-pf': 50
};

function openGoniometer() {
    document.getElementById('goniometer-modal').classList.remove('hidden');

    // 권한 이미 있으면 바로 초기화
    if (orientationPermissionGranted) {
        initGoniometer();
    } else {
        // iOS가 아닌 경우 권한 요청 없이 시도
        if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
            initGoniometer();
        }
    }
}

function closeGoniometer() {
    document.getElementById('goniometer-modal').classList.add('hidden');
    window.removeEventListener('deviceorientation', handleOrientation);
    cleanupGonioHoldMethods();
}

function initGoniometer() {
    document.getElementById('gonio-permission').classList.add('hidden');
    document.getElementById('gonio-display').classList.remove('hidden');

    // 설정 불러오기
    loadGonioSettings();

    // 고정 방식 초기화
    setupGonioHoldMethods();

    window.addEventListener('deviceorientation', handleOrientation);
}

// 설정 저장/불러오기
function loadGonioSettings() {
    const saved = localStorage.getItem('gonioHoldSettings');
    if (saved) {
        gonioState.holdSettings = JSON.parse(saved);
    }

    // UI 체크박스 업데이트
    document.getElementById('hold-tap').checked = gonioState.holdSettings.tap;
    document.getElementById('hold-auto').checked = gonioState.holdSettings.auto;
    document.getElementById('hold-voice').checked = gonioState.holdSettings.voice;

    updateHoldStatus();
}

function saveGonioSettings() {
    gonioState.holdSettings = {
        tap: document.getElementById('hold-tap').checked,
        auto: document.getElementById('hold-auto').checked,
        voice: document.getElementById('hold-voice').checked
    };

    localStorage.setItem('gonioHoldSettings', JSON.stringify(gonioState.holdSettings));

    // 고정 방식 재설정
    cleanupGonioHoldMethods();
    setupGonioHoldMethods();
    updateHoldStatus();
}

function updateHoldStatus() {
    const statusEl = document.getElementById('hold-status');
    if (!statusEl) return;

    const active = [];
    if (gonioState.holdSettings.tap) active.push('탭');
    if (gonioState.holdSettings.auto) active.push('자동');
    if (gonioState.holdSettings.voice) active.push('음성');

    statusEl.textContent = active.length ? `활성: ${active.join(', ')}` : '버튼만 사용';
}

// 고정 방식 설정
function setupGonioHoldMethods() {
    // A: 화면 탭
    if (gonioState.holdSettings.tap) {
        const tapArea = document.getElementById('gonio-tap-area');
        if (tapArea) {
            tapArea.addEventListener('click', handleGonioTap);
            tapArea.style.cursor = 'pointer';
        }
    }

    // D: 자동 고정 (3초 안정)
    if (gonioState.holdSettings.auto) {
        gonioState.stableStartTime = null;
        gonioState.lastAngle = null;
    }

    // E: 음성 명령
    if (gonioState.holdSettings.voice) {
        setupVoiceRecognition();
    }
}

function cleanupGonioHoldMethods() {
    // 탭 이벤트 제거
    const tapArea = document.getElementById('gonio-tap-area');
    if (tapArea) {
        tapArea.removeEventListener('click', handleGonioTap);
        tapArea.style.cursor = '';
    }

    // 자동 고정 타이머 제거
    if (gonioState.autoHoldTimer) {
        clearTimeout(gonioState.autoHoldTimer);
        gonioState.autoHoldTimer = null;
    }

    // 음성 인식 중지
    if (gonioState.voiceRecognition) {
        gonioState.voiceRecognition.stop();
        gonioState.voiceRecognition = null;
    }
}

// A: 화면 탭 핸들러
function handleGonioTap(e) {
    // 버튼 클릭은 제외
    if (e.target.closest('.gonio-btn') || e.target.closest('.gonio-hold-settings')) return;
    toggleGonioHold();
}

// D: 자동 고정 체크 (handleOrientation에서 호출)
function checkAutoHold(currentAngle) {
    if (!gonioState.holdSettings.auto || gonioState.isHeld) return;

    const threshold = 0.5; // 0.5도 이내 변화면 안정으로 판단
    const holdTime = 3000; // 3초

    if (gonioState.lastAngle !== null) {
        const diff = Math.abs(currentAngle - gonioState.lastAngle);

        if (diff < threshold) {
            // 안정 상태
            if (!gonioState.stableStartTime) {
                gonioState.stableStartTime = Date.now();
            } else if (Date.now() - gonioState.stableStartTime >= holdTime) {
                // 3초 동안 안정 → 자동 고정
                toggleGonioHold();
                playClick(1000, 0.1); // 알림음
                gonioState.stableStartTime = null;
            }
        } else {
            // 움직임 감지 → 타이머 리셋
            gonioState.stableStartTime = null;
        }
    }

    gonioState.lastAngle = currentAngle;
}

// E: 음성 인식 설정
function setupVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    gonioState.voiceRecognition = new SpeechRecognition();
    gonioState.voiceRecognition.continuous = true;
    gonioState.voiceRecognition.interimResults = false;
    gonioState.voiceRecognition.lang = 'ko-KR';

    gonioState.voiceRecognition.onresult = (event) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript.toLowerCase().trim();

        if (text.includes('고정') || text.includes('홀드') || text.includes('hold') || text.includes('잠금')) {
            toggleGonioHold();
            playClick(1000, 0.1);
        }
    };

    gonioState.voiceRecognition.onerror = () => {};

    gonioState.voiceRecognition.onend = () => {
        // 계속 듣기
        if (gonioState.holdSettings.voice && document.getElementById('goniometer-modal') &&
            !document.getElementById('goniometer-modal').classList.contains('hidden')) {
            try {
                gonioState.voiceRecognition.start();
            } catch (e) {}
        }
    };

    try {
        gonioState.voiceRecognition.start();
    } catch (e) {}
}

function handleOrientation(event) {
    if (gonioState.isHeld) return;

    let alpha = event.alpha || 0; // z축 회전 (나침반)
    let beta = event.beta || 0;   // x축 기울기 (앞뒤)
    let gamma = event.gamma || 0; // y축 기울기 (좌우)

    // 영점 보정
    beta -= gonioState.zeroOffset.beta;
    gamma -= gonioState.zeroOffset.gamma;

    gonioState.currentAngles = { x: gamma, y: beta, z: alpha };

    let displayValue;
    if (gonioState.mode === 'incline') {
        // 수평계: 좌우 기울기 (gamma)
        displayValue = gamma;
    } else {
        // 각도계: 앞뒤 기울기 (beta)
        displayValue = beta;
    }

    updateGonioDisplay(displayValue);

    // 자동 고정 체크
    checkAutoHold(displayValue);
}

function updateGonioDisplay(angle) {
    const valueEl = document.getElementById('gonio-value');
    const needleEl = document.getElementById('gonio-needle');
    const xEl = document.getElementById('gonio-x');
    const yEl = document.getElementById('gonio-y');
    const levelEl = document.getElementById('gonio-level');
    const levelTextEl = document.getElementById('gonio-level-text');

    const absAngle = Math.abs(angle);

    // 값 표시
    valueEl.textContent = absAngle.toFixed(1);

    // 바늘 회전
    if (needleEl) {
        needleEl.style.transform = `rotate(${angle}deg)`;
    }

    // 축별 정보
    if (xEl) xEl.textContent = `${gonioState.currentAngles.x.toFixed(1)}°`;
    if (yEl) yEl.textContent = `${gonioState.currentAngles.y.toFixed(1)}°`;

    // 수평/각도 피드백
    if (levelEl && levelTextEl) {
        if (gonioState.mode === 'incline') {
            // 수평계 모드: 0°에 가까우면 수평 표시
            if (absAngle < 2) {
                levelEl.classList.add('level');
                levelTextEl.classList.add('level');
                levelTextEl.textContent = '✓ 수평';
            } else if (absAngle < 5) {
                levelEl.classList.remove('level');
                levelTextEl.classList.remove('level');
                levelTextEl.textContent = '거의 수평';
            } else if (angle > 0) {
                levelEl.classList.remove('level');
                levelTextEl.classList.remove('level');
                levelTextEl.textContent = '→ 오른쪽 기울임';
            } else {
                levelEl.classList.remove('level');
                levelTextEl.classList.remove('level');
                levelTextEl.textContent = '← 왼쪽 기울임';
            }
        } else {
            // 각도계 모드
            levelEl.classList.remove('level');
            levelTextEl.classList.remove('level');
            if (absAngle < 5) {
                levelTextEl.textContent = '시작 위치';
            } else if (absAngle < 45) {
                levelTextEl.textContent = '경도 굴곡';
            } else if (absAngle < 90) {
                levelTextEl.textContent = '중등도 굴곡';
            } else {
                levelTextEl.textContent = '고도 굴곡';
            }
        }
    }

    // ROM 비교 업데이트
    updateRomComparison();
}

function setGonioMode(mode) {
    gonioState.mode = mode;

    document.querySelectorAll('.gonio-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.mode === mode);
    });

    const romSection = document.getElementById('gonio-rom-section');
    const phoneAnim = document.querySelector('.phone-body-mini');
    const guideText = document.getElementById('guide-text');

    if (mode === 'angle') {
        romSection.classList.remove('hidden');
        if (phoneAnim) phoneAnim.classList.add('tilt-forward');
        if (guideText) guideText.textContent = '관절에 대고 앞뒤로';
    } else {
        romSection.classList.add('hidden');
        if (phoneAnim) phoneAnim.classList.remove('tilt-forward');
        if (guideText) guideText.textContent = '좌우로 기울이세요';
    }

    // 자동 고정 타이머 리셋
    gonioState.stableStartTime = null;
    gonioState.lastAngle = null;
}

function zeroGoniometer() {
    gonioState.zeroOffset = {
        alpha: gonioState.currentAngles.z + gonioState.zeroOffset.alpha,
        beta: gonioState.currentAngles.y + gonioState.zeroOffset.beta,
        gamma: gonioState.currentAngles.x + gonioState.zeroOffset.gamma
    };
    playClick(800, 0.05);
}

function toggleGonioHold() {
    gonioState.isHeld = !gonioState.isHeld;
    const btn = document.getElementById('gonio-hold-btn');
    const indicator = document.getElementById('gonio-hold-indicator');

    if (gonioState.isHeld) {
        btn.textContent = '▶ 재개';
        btn.classList.add('active');
        gonioState.heldValue = parseFloat(document.getElementById('gonio-value').textContent);
        if (indicator) indicator.classList.remove('hidden');

        // 자동 고정 타이머 리셋
        gonioState.stableStartTime = null;
    } else {
        btn.textContent = '⏸ 고정';
        btn.classList.remove('active');
        if (indicator) indicator.classList.add('hidden');

        // 자동 고정 타이머 리셋
        gonioState.stableStartTime = null;
        gonioState.lastAngle = null;
    }
    playClick(600, 0.05);
}

function updateRomComparison() {
    const jointSelect = document.getElementById('gonio-joint');
    const resultDiv = document.getElementById('rom-result');
    const fillEl = document.getElementById('rom-fill');
    const percentEl = document.getElementById('rom-percent');

    if (!jointSelect.value) {
        resultDiv.classList.add('hidden');
        return;
    }

    const standard = ROM_STANDARDS[jointSelect.value];
    const current = Math.abs(parseFloat(document.getElementById('gonio-value').textContent));
    const percent = Math.min(100, (current / standard) * 100);

    resultDiv.classList.remove('hidden');
    fillEl.style.width = `${percent}%`;
    percentEl.textContent = `${percent.toFixed(0)}%`;

    // 색상 표시
    if (percent >= 90) {
        fillEl.style.background = 'var(--success-color)';
    } else if (percent >= 70) {
        fillEl.style.background = 'var(--primary-blue)';
    } else {
        fillEl.style.background = 'var(--warning-color)';
    }
}

// ============================================
// 2. Tremor Analyzer (손떨림 분석)
// 참고 문헌: PMC3475963, PMC3656631
// - 파킨슨 떨림: 4-6 Hz (안정시)
// - 본태성 떨림: 5-8 Hz (자세/동작시)
// - 생리적 떨림: 8-12 Hz
// ============================================

const tremorState = {
    isRunning: false,
    data: [],
    startTime: 0,
    canvas: null,
    ctx: null,
    animationId: null,
    sampleRate: 60, // Hz
    analysisWindow: 5 // seconds
};

function openTremor() {
    document.getElementById('tremor-modal').classList.remove('hidden');

    if (motionPermissionGranted) {
        initTremor();
    } else if (typeof DeviceMotionEvent.requestPermission !== 'function') {
        initTremor();
    }
}

function closeTremor() {
    document.getElementById('tremor-modal').classList.add('hidden');
    stopTremorAnalysis();
}

function initTremor() {
    document.getElementById('tremor-permission').classList.add('hidden');
    document.getElementById('tremor-display').classList.remove('hidden');

    tremorState.canvas = document.getElementById('tremor-canvas');
    tremorState.ctx = tremorState.canvas.getContext('2d');

    // 캔버스 크기 조정
    const rect = tremorState.canvas.parentElement.getBoundingClientRect();
    tremorState.canvas.width = rect.width || 320;
    tremorState.canvas.height = 150;

    drawTremorGraph();
}

function toggleTremorAnalysis() {
    if (tremorState.isRunning) {
        stopTremorAnalysis();
    } else {
        startTremorAnalysis();
    }
}

function startTremorAnalysis() {
    tremorState.isRunning = true;
    tremorState.data = [];
    tremorState.startTime = performance.now();

    const btn = document.getElementById('tremor-start-btn');
    btn.textContent = '⏹ 측정 중지';
    btn.classList.add('running');

    window.addEventListener('devicemotion', handleMotion);
    tremorState.animationId = requestAnimationFrame(updateTremorGraph);
}

function stopTremorAnalysis() {
    tremorState.isRunning = false;

    const btn = document.getElementById('tremor-start-btn');
    btn.textContent = '▶ 측정 시작';
    btn.classList.remove('running');

    window.removeEventListener('devicemotion', handleMotion);
    if (tremorState.animationId) {
        cancelAnimationFrame(tremorState.animationId);
    }

    // 최종 분석
    if (tremorState.data.length > 30) {
        analyzeTremor();
    }
}

function handleMotion(event) {
    if (!tremorState.isRunning) return;

    const acc = event.accelerationIncludingGravity || event.acceleration;
    if (!acc) return;

    const magnitude = Math.sqrt(
        (acc.x || 0) ** 2 +
        (acc.y || 0) ** 2 +
        (acc.z || 0) ** 2
    ) - 9.8; // 중력 보정

    const timestamp = performance.now() - tremorState.startTime;

    tremorState.data.push({
        time: timestamp,
        value: magnitude
    });

    // 최근 데이터만 유지 (메모리 관리)
    const maxSamples = tremorState.sampleRate * tremorState.analysisWindow;
    if (tremorState.data.length > maxSamples) {
        tremorState.data.shift();
    }
}

function updateTremorGraph() {
    if (!tremorState.isRunning) return;

    drawTremorGraph();
    analyzeTremor();

    tremorState.animationId = requestAnimationFrame(updateTremorGraph);
}

function drawTremorGraph() {
    const ctx = tremorState.ctx;
    const canvas = tremorState.canvas;
    const data = tremorState.data;

    // 배경
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 그리드
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = (canvas.height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    if (data.length < 2) return;

    // 데이터 그리기
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const xScale = canvas.width / (tremorState.analysisWindow * 1000);
    const yCenter = canvas.height / 2;
    const yScale = canvas.height / 10;

    data.forEach((point, i) => {
        const x = point.time * xScale;
        const y = yCenter - (point.value * yScale);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();
}

function analyzeTremor() {
    const data = tremorState.data;
    if (data.length < 30) return;

    // 간단한 주파수 분석 (영교차 방식)
    let crossings = 0;
    const values = data.map(d => d.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;

    for (let i = 1; i < values.length; i++) {
        if ((values[i-1] - mean) * (values[i] - mean) < 0) {
            crossings++;
        }
    }

    const duration = (data[data.length - 1].time - data[0].time) / 1000;
    const frequency = (crossings / 2) / duration;

    // 강도 계산 (RMS)
    const rms = Math.sqrt(values.reduce((sum, v) => sum + v * v, 0) / values.length);

    // 결과 표시
    document.getElementById('tremor-freq').textContent = frequency.toFixed(1);

    let intensityText, tremorType;
    if (rms < 0.3) {
        intensityText = '미약';
    } else if (rms < 0.8) {
        intensityText = '경도';
    } else if (rms < 1.5) {
        intensityText = '중등도';
    } else {
        intensityText = '심함';
    }
    document.getElementById('tremor-intensity').textContent = intensityText;

    // 유형 추정 (주파수 기반)
    if (frequency >= 4 && frequency <= 6) {
        tremorType = '파킨슨 의심';
    } else if (frequency > 6 && frequency <= 8) {
        tremorType = '본태성 의심';
    } else if (frequency > 8 && frequency <= 12) {
        tremorType = '생리적';
    } else if (frequency < 4) {
        tremorType = '저주파';
    } else {
        tremorType = '고주파';
    }
    document.getElementById('tremor-type').textContent = tremorType;
}

function resetTremorData() {
    tremorState.data = [];
    document.getElementById('tremor-freq').textContent = '--';
    document.getElementById('tremor-intensity').textContent = '--';
    document.getElementById('tremor-type').textContent = '--';
    drawTremorGraph();
}

// ============================================
// 3. Decibel Meter (음성 데시벨 측정)
// LSVT LOUD 기준: 목표 65-70dB 이상
// 참고: PMC3316992, ASHA LSVT 가이드라인
// ============================================

const decibelState = {
    isRunning: false,
    audioContext: null,
    analyser: null,
    microphone: null,
    targetDb: 70,
    dataArray: null,
    animationId: null,
    history: [],
    successCount: 0,
    totalCount: 0
};

function openDecibel() {
    document.getElementById('decibel-modal').classList.remove('hidden');
}

function closeDecibel() {
    document.getElementById('decibel-modal').classList.add('hidden');
    stopDecibelMeter();
}

function initDecibel(stream) {
    document.getElementById('decibel-permission').classList.add('hidden');
    document.getElementById('decibel-display').classList.remove('hidden');

    decibelState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    decibelState.analyser = decibelState.audioContext.createAnalyser();
    decibelState.analyser.fftSize = 2048;
    decibelState.analyser.smoothingTimeConstant = 0.3;

    decibelState.microphone = decibelState.audioContext.createMediaStreamSource(stream);
    decibelState.microphone.connect(decibelState.analyser);

    decibelState.dataArray = new Uint8Array(decibelState.analyser.frequencyBinCount);

    updateTargetIndicator();
}

function toggleDecibelMeter() {
    if (decibelState.isRunning) {
        stopDecibelMeter();
    } else {
        startDecibelMeter();
    }
}

function startDecibelMeter() {
    if (!decibelState.audioContext) return;

    decibelState.isRunning = true;
    decibelState.history = [];
    decibelState.successCount = 0;
    decibelState.totalCount = 0;

    const btn = document.getElementById('decibel-start-btn');
    btn.textContent = '⏹ 측정 중지';
    btn.classList.add('running');

    document.getElementById('decibel-stats').classList.remove('hidden');

    if (decibelState.audioContext.state === 'suspended') {
        decibelState.audioContext.resume();
    }

    updateDecibelMeter();
}

function stopDecibelMeter() {
    decibelState.isRunning = false;

    const btn = document.getElementById('decibel-start-btn');
    btn.textContent = '▶ 측정 시작';
    btn.classList.remove('running');

    if (decibelState.animationId) {
        cancelAnimationFrame(decibelState.animationId);
    }
}

function updateDecibelMeter() {
    if (!decibelState.isRunning) return;

    decibelState.analyser.getByteFrequencyData(decibelState.dataArray);

    // RMS 계산
    let sum = 0;
    for (let i = 0; i < decibelState.dataArray.length; i++) {
        sum += decibelState.dataArray[i] ** 2;
    }
    const rms = Math.sqrt(sum / decibelState.dataArray.length);

    // dB 변환 (근사값, 보정 필요)
    // 실제 SPL dB는 교정된 마이크 필요, 이는 상대적 측정
    const db = Math.max(0, Math.min(120, 20 * Math.log10(rms + 1) * 2));

    // 표시 업데이트
    updateDecibelDisplay(db);

    // 통계
    decibelState.history.push(db);
    decibelState.totalCount++;
    if (db >= decibelState.targetDb) {
        decibelState.successCount++;
    }

    // 최근 100개만 유지
    if (decibelState.history.length > 100) {
        decibelState.history.shift();
    }

    updateDecibelStats();

    decibelState.animationId = requestAnimationFrame(updateDecibelMeter);
}

function updateDecibelDisplay(db) {
    const valueEl = document.getElementById('decibel-value');
    const barEl = document.getElementById('decibel-bar');
    const visualEl = document.getElementById('decibel-visual');
    const feedbackEl = document.getElementById('decibel-feedback');

    valueEl.textContent = Math.round(db);
    barEl.style.height = `${(db / 120) * 100}%`;

    // 목표 달성 여부에 따른 색상
    const isSuccess = db >= decibelState.targetDb;

    if (isSuccess) {
        barEl.style.background = 'linear-gradient(to top, #22c55e, #16a34a)';
        visualEl.classList.add('success');
        visualEl.classList.remove('fail');
        feedbackEl.textContent = '좋아요! 유지하세요!';
        feedbackEl.style.color = '#16a34a';
    } else {
        barEl.style.background = 'linear-gradient(to top, #ef4444, #dc2626)';
        visualEl.classList.add('fail');
        visualEl.classList.remove('success');
        feedbackEl.textContent = '더 크게 말해보세요!';
        feedbackEl.style.color = '#dc2626';
    }
}

function updateDecibelStats() {
    const history = decibelState.history;
    if (history.length === 0) return;

    const max = Math.max(...history);
    const avg = history.reduce((a, b) => a + b, 0) / history.length;
    const successRate = (decibelState.successCount / decibelState.totalCount) * 100;

    document.getElementById('db-max').textContent = `${Math.round(max)} dB`;
    document.getElementById('db-avg').textContent = `${Math.round(avg)} dB`;
    document.getElementById('db-success').textContent = `${Math.round(successRate)}%`;
}

function adjustTargetDb(delta) {
    decibelState.targetDb = Math.max(40, Math.min(100, decibelState.targetDb + delta));
    document.getElementById('target-db-value').textContent = decibelState.targetDb;
    updateTargetIndicator();
}

function updateTargetIndicator() {
    const targetEl = document.getElementById('decibel-target');
    if (targetEl) {
        targetEl.style.bottom = `${(decibelState.targetDb / 120) * 100}%`;
    }
}

function resetDecibelData() {
    decibelState.history = [];
    decibelState.successCount = 0;
    decibelState.totalCount = 0;

    document.getElementById('decibel-value').textContent = '0';
    document.getElementById('decibel-bar').style.height = '0%';
    document.getElementById('decibel-feedback').textContent = '대기 중';
    document.getElementById('decibel-feedback').style.color = '';
    document.getElementById('db-max').textContent = '0 dB';
    document.getElementById('db-avg').textContent = '0 dB';
    document.getElementById('db-success').textContent = '0%';
}

// =====================================================
// Trigger Point Map (TrP 지도)
// Reference: Travell & Simons' Myofascial Pain and Dysfunction
// =====================================================

let trpZoomLevel = 1;

// TrP 데이터베이스 (Travell & Simons 기준)
const TRP_DATA = {
    neck: {
        title: '목 (Neck)',
        muscles: [
            {
                name: '상부 승모근',
                nameEn: 'Upper Trapezius',
                location: '어깨 위쪽, 목 옆면',
                referral: '측두부 → 눈썹 위 → 턱 방향으로 방사',
                pattern: {
                    trpX: { x: 70, y: 30 },  // TrP 위치
                    referralPath: 'M70,30 Q60,20 50,15 L30,10'  // 방사통 경로
                }
            },
            {
                name: '흉쇄유돌근',
                nameEn: 'Sternocleidomastoid (SCM)',
                location: '귀 뒤 유양돌기 ~ 흉골/쇄골',
                referral: '이마, 눈 주위, 귀 안쪽, 때로 어지러움 동반',
                pattern: {
                    trpX: { x: 60, y: 45 },
                    referralPath: 'M60,45 Q50,30 45,15'
                }
            },
            {
                name: '견갑거근',
                nameEn: 'Levator Scapulae',
                location: '목 뒤쪽, 견갑골 상각 위',
                referral: '목-어깨 연결부, 견갑골 내측연을 따라 방사',
                pattern: {
                    trpX: { x: 75, y: 50 },
                    referralPath: 'M75,50 L80,65 L85,85'
                }
            }
        ]
    },
    shoulder: {
        title: '어깨 (Shoulder)',
        muscles: [
            {
                name: '상부 승모근',
                nameEn: 'Upper Trapezius',
                location: '어깨 위쪽 근육 융기부',
                referral: '목 뒤쪽 → 측두부 → 눈썹/턱까지 방사',
                pattern: {
                    trpX: { x: 50, y: 25 },
                    referralPath: 'M50,25 Q40,15 30,10'
                }
            },
            {
                name: '극상근',
                nameEn: 'Supraspinatus',
                location: '견갑골 극상와 (어깨뼈 위쪽)',
                referral: '어깨 외측 삼각근 부위, 팔꿈치 외측까지',
                pattern: {
                    trpX: { x: 55, y: 40 },
                    referralPath: 'M55,40 L60,55 L65,75'
                }
            },
            {
                name: '극하근',
                nameEn: 'Infraspinatus',
                location: '견갑골 극하와 (어깨뼈 아래쪽)',
                referral: '어깨 전면, 상완 전외측, 손목까지 방사 가능',
                pattern: {
                    trpX: { x: 60, y: 55 },
                    referralPath: 'M60,55 L55,45 L50,60 L45,80'
                }
            }
        ]
    },
    lowback: {
        title: '허리 (Low Back)',
        muscles: [
            {
                name: '요방형근',
                nameEn: 'Quadratus Lumborum (QL)',
                location: '12번 늑골 ~ 장골능 사이, 척추 옆',
                referral: '천장관절(SI joint) → 둔부 → 대퇴 외측, 서혜부까지',
                pattern: {
                    trpX: { x: 65, y: 50 },
                    referralPath: 'M65,50 L70,65 L75,85'
                }
            },
            {
                name: '이상근',
                nameEn: 'Piriformis',
                location: '천골 ~ 대전자 사이 (깊은 둔부)',
                referral: '둔부 전체, 대퇴 후면 (좌골신경통 유사)',
                pattern: {
                    trpX: { x: 55, y: 70 },
                    referralPath: 'M55,70 L50,85 L45,100'
                }
            },
            {
                name: '중둔근',
                nameEn: 'Gluteus Medius',
                location: '장골능 아래, 둔부 외측',
                referral: '천장관절, 둔부 후면, 대퇴 외측',
                pattern: {
                    trpX: { x: 70, y: 65 },
                    referralPath: 'M70,65 L65,55 L75,80'
                }
            }
        ]
    },
    calf: {
        title: '종아리 (Calf)',
        muscles: [
            {
                name: '비복근',
                nameEn: 'Gastrocnemius',
                location: '종아리 뒤쪽 상부 (내측두/외측두)',
                referral: '슬와부(무릎 뒤) → 종아리 → 발바닥 안쪽',
                pattern: {
                    trpX: { x: 50, y: 30 },
                    referralPath: 'M50,30 L50,50 L45,80'
                }
            },
            {
                name: '가자미근',
                nameEn: 'Soleus',
                location: '비복근 아래, 종아리 깊은 층',
                referral: '아킬레스건 → 발뒤꿈치 (뒤꿈치 통증의 주요 원인)',
                pattern: {
                    trpX: { x: 55, y: 55 },
                    referralPath: 'M55,55 L55,75 L50,95'
                }
            }
        ]
    }
};

function openTriggerPointMap() {
    document.getElementById('trp-modal').classList.remove('hidden');
    trpZoomLevel = 1;
    updateTrpZoom();
}

function closeTrpMap() {
    document.getElementById('trp-modal').classList.add('hidden');
}

function zoomTrpMap(factor) {
    trpZoomLevel = Math.max(0.5, Math.min(3, trpZoomLevel * factor));
    updateTrpZoom();
}

function resetTrpZoom() {
    trpZoomLevel = 1;
    updateTrpZoom();
}

function updateTrpZoom() {
    const svg = document.getElementById('trp-body-svg');
    if (svg) {
        svg.style.transform = `scale(${trpZoomLevel})`;
    }
}

function showTrpDetail(region) {
    const data = TRP_DATA[region];
    if (!data) return;

    document.getElementById('trp-detail-title').textContent = data.title;

    let html = '';
    data.muscles.forEach((muscle, idx) => {
        html += `
            <div class="trp-muscle-card">
                <div class="trp-muscle-name">
                    ${muscle.name}
                    <span class="muscle-en">${muscle.nameEn}</span>
                </div>
                <div class="trp-pattern-img">
                    <svg viewBox="0 0 120 120" class="trp-pattern-svg">
                        <!-- 근육 개략도 -->
                        <ellipse cx="60" cy="60" rx="40" ry="50" fill="#fce7f3" stroke="#f472b6" stroke-width="1"/>
                        
                        <!-- 방사통 영역 -->
                        <path d="${muscle.pattern.referralPath}" 
                              fill="none" 
                              stroke="rgba(239,68,68,0.6)" 
                              stroke-width="12" 
                              stroke-linecap="round"
                              stroke-dasharray="2,4"/>
                        
                        <!-- TrP 위치 (X 표시) -->
                        <g transform="translate(${muscle.pattern.trpX.x}, ${muscle.pattern.trpX.y})">
                            <line x1="-6" y1="-6" x2="6" y2="6" stroke="#dc2626" stroke-width="3"/>
                            <line x1="6" y1="-6" x2="-6" y2="6" stroke="#dc2626" stroke-width="3"/>
                        </g>
                    </svg>
                </div>
                <div class="trp-location">
                    <span class="trp-location-icon">✕</span>
                    <span><strong>TrP 위치:</strong> ${muscle.location}</span>
                </div>
                <div class="trp-referral">
                    <span>→</span>
                    <span><strong>방사통:</strong> ${muscle.referral}</span>
                </div>
            </div>
        `;
    });

    document.getElementById('trp-detail-body').innerHTML = html;
    document.getElementById('trp-detail-popup').classList.remove('hidden');
}

function closeTrpDetail() {
    document.getElementById('trp-detail-popup').classList.add('hidden');
}

// 터치 줌/팬 지원
(function initTrpTouchHandlers() {
    let initialDistance = 0;
    let initialZoom = 1;

    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('trp-body-container');
        if (!container) return;

        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                initialDistance = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                );
                initialZoom = trpZoomLevel;
            }
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                const currentDistance = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                );
                const scale = currentDistance / initialDistance;
                trpZoomLevel = Math.max(0.5, Math.min(3, initialZoom * scale));
                updateTrpZoom();
            }
        }, { passive: true });
    });
})();

// =====================================================
// AAC Communication Board (의사소통 보드)
// For patients with aphasia/dysarthria
// =====================================================

const AAC_DATA = {
    basic: [
        { icon: '🚽', label: '화장실', speech: '화장실에 가고 싶어요' },
        { icon: '💧', label: '물', speech: '물을 주세요' },
        { icon: '🍚', label: '밥', speech: '배가 고파요' },
        { icon: '🥵', label: '더워요', speech: '더워요. 시원하게 해주세요' },
        { icon: '🥶', label: '추워요', speech: '추워요. 따뜻하게 해주세요' },
        { icon: '😴', label: '피곤해요', speech: '피곤해요. 쉬고 싶어요' },
        { icon: '👍', label: '네', speech: '네, 좋아요' },
        { icon: '👎', label: '아니오', speech: '아니요, 싫어요' },
        { icon: '🆘', label: '도와주세요', speech: '도와주세요' }
    ],
    pain: [
        { icon: '😣', label: '아파요', speech: '아파요' },
        { icon: '🤕', label: '머리', speech: '머리가 아파요' },
        { icon: '💔', label: '가슴', speech: '가슴이 아파요' },
        { icon: '🫃', label: '배', speech: '배가 아파요' },
        { icon: '🦵', label: '다리', speech: '다리가 아파요' },
        { icon: '💪', label: '팔', speech: '팔이 아파요' },
        { icon: '🔥', label: '따끔거려요', speech: '따끔거리고 화끈거려요' },
        { icon: '⚡', label: '저려요', speech: '저리고 찌릿해요' },
        { icon: '😵‍💫', label: '어지러워요', speech: '어지러워요' }
    ],
    emotion: [
        { icon: '😊', label: '좋아요', speech: '기분이 좋아요' },
        { icon: '😢', label: '슬퍼요', speech: '슬프고 우울해요' },
        { icon: '😰', label: '불안해요', speech: '불안하고 걱정돼요' },
        { icon: '😤', label: '화나요', speech: '화가 나요' },
        { icon: '😨', label: '무서워요', speech: '무섭고 두려워요' },
        { icon: '🥺', label: '보고싶어요', speech: '가족이 보고 싶어요' },
        { icon: '😔', label: '외로워요', speech: '외롭고 심심해요' },
        { icon: '🙏', label: '감사해요', speech: '감사합니다' },
        { icon: '😌', label: '괜찮아요', speech: '괜찮아요, 걱정 마세요' }
    ],
    action: [
        { icon: '🛏️', label: '눕고 싶어요', speech: '눕고 싶어요' },
        { icon: '🪑', label: '앉고 싶어요', speech: '앉고 싶어요' },
        { icon: '🚶', label: '걷고 싶어요', speech: '걷고 싶어요' },
        { icon: '📺', label: 'TV', speech: 'TV를 켜주세요' },
        { icon: '💡', label: '불', speech: '불을 꺼주세요' },
        { icon: '📞', label: '전화', speech: '전화하고 싶어요' },
        { icon: '👨‍⚕️', label: '의사', speech: '의사 선생님을 불러주세요' },
        { icon: '👩‍⚕️', label: '간호사', speech: '간호사를 불러주세요' },
        { icon: '⏰', label: '시간', speech: '지금 몇 시예요?' }
    ]
};

let aacState = {
    currentCategory: 'basic',
    currentText: '',
    speechRate: 0.9
};

function openAACBoard() {
    document.getElementById('aac-modal').classList.remove('hidden');
    setAACCategory('basic');
}

function closeAACBoard() {
    document.getElementById('aac-modal').classList.add('hidden');
    // Stop any ongoing speech
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

function setAACCategory(category) {
    aacState.currentCategory = category;
    
    // Update category buttons
    document.querySelectorAll('.aac-cat-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes(getCategoryKorean(category))) {
            btn.classList.add('active');
        }
    });
    
    renderAACBoard();
}

function getCategoryKorean(cat) {
    const map = { basic: '기본', pain: '통증', emotion: '감정', action: '요청' };
    return map[cat] || cat;
}

function renderAACBoard() {
    const board = document.getElementById('aac-board');
    const items = AAC_DATA[aacState.currentCategory] || [];
    
    board.innerHTML = items.map((item, idx) => `
        <div class="aac-item" onclick="selectAACItem(${idx})" id="aac-item-${idx}">
            <span class="aac-icon">${item.icon}</span>
            <span class="aac-label">${item.label}</span>
        </div>
    `).join('');
}

function selectAACItem(idx) {
    const items = AAC_DATA[aacState.currentCategory];
    if (!items || !items[idx]) return;
    
    const item = items[idx];
    aacState.currentText = item.speech;
    
    // Update output display
    document.getElementById('aac-output-text').textContent = item.speech;
    
    // Visual feedback
    const el = document.getElementById(`aac-item-${idx}`);
    if (el) {
        el.classList.add('speaking');
        setTimeout(() => el.classList.remove('speaking'), 500);
    }
    
    // Speak immediately
    speakText(item.speech);
}

function speakAACOutput() {
    if (aacState.currentText) {
        speakText(aacState.currentText);
    }
}

function speakText(text) {
    if (!window.speechSynthesis) {
        showToast('이 기기에서 음성 합성을 지원하지 않습니다');
        return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = aacState.speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to use Korean voice if available
    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find(v => v.lang.includes('ko'));
    if (koreanVoice) {
        utterance.voice = koreanVoice;
    }
    
    window.speechSynthesis.speak(utterance);
}

function updateAACRate(value) {
    aacState.speechRate = parseFloat(value);
}

// Load voices when available
if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded
    };
}

// =====================================================
// Visual Neglect Test (편측 무시 검사)
// Based on Star Cancellation Test (Wilson, Cockburn & Halligan, 1987)
// Reference: Halligan et al. cutoff: ≤51/54 indicates USN
// =====================================================

let neglectState = {
    totalStars: 54,
    timeLimit: 120,
    stars: [],
    found: { left: 0, right: 0 },
    total: { left: 0, right: 0 },
    timer: null,
    timeRemaining: 120,
    isRunning: false
};

function openNeglectTest() {
    document.getElementById('neglect-modal').classList.remove('hidden');
    resetNeglectTest();
}

function closeNeglectTest() {
    document.getElementById('neglect-modal').classList.add('hidden');
    stopNeglectTimer();
}

// Current neglect mode: 'bisection' or 'star'
let currentNeglectMode = 'bisection';

// Bisection test state
let bisectionState = {
    trials: [],
    currentTrial: 0,
    totalTrials: 5,
    lineLength: 'full',
    isRunning: false
};

function setNeglectMode(mode) {
    currentNeglectMode = mode;

    // Update tabs
    document.querySelectorAll('.neglect-tab').forEach(tab => {
        tab.classList.toggle('active', tab.textContent.includes(mode === 'bisection' ? '선 이등분' : '별 찾기'));
    });

    // Show/hide intro sections
    document.getElementById('neglect-intro-bisection').classList.toggle('hidden', mode !== 'bisection');
    document.getElementById('neglect-intro-star').classList.toggle('hidden', mode !== 'star');

    // Hide test areas and results
    document.getElementById('bisection-test-area').classList.add('hidden');
    document.getElementById('neglect-test-area').classList.add('hidden');
    document.getElementById('neglect-result').classList.add('hidden');
}

function resetNeglectTest() {
    stopNeglectTimer();

    // Reset to intro based on current mode
    setNeglectMode(currentNeglectMode);

    neglectState.found = { left: 0, right: 0 };
    neglectState.stars = [];
    neglectState.isRunning = false;

    bisectionState.trials = [];
    bisectionState.currentTrial = 0;
    bisectionState.isRunning = false;
}

function restartNeglectTest() {
    resetNeglectTest();
}

function startNeglectTest() {
    const starCount = parseInt(document.getElementById('neglect-star-count').value);
    const timeLimit = parseInt(document.getElementById('neglect-time-limit').value);

    neglectState.totalStars = starCount;
    neglectState.timeLimit = timeLimit;
    neglectState.timeRemaining = timeLimit;
    neglectState.found = { left: 0, right: 0 };
    neglectState.total = { left: 0, right: 0 };
    neglectState.stars = [];
    neglectState.isRunning = true;

    document.getElementById('neglect-intro-star').classList.add('hidden');
    document.getElementById('neglect-test-area').classList.remove('hidden');
    document.getElementById('neglect-result').classList.add('hidden');
    
    document.getElementById('neglect-total').textContent = starCount;
    document.getElementById('neglect-found').textContent = '0';
    
    generateNeglectStars();
    
    if (timeLimit > 0) {
        updateTimerDisplay();
        neglectState.timer = setInterval(updateNeglectTimer, 1000);
    } else {
        document.getElementById('neglect-timer').textContent = '--:--';
    }
}

function generateNeglectStars() {
    const field = document.getElementById('neglect-field');
    field.innerHTML = '';
    
    const rect = field.getBoundingClientRect();
    const width = rect.width || 300;
    const height = rect.height || 300;
    
    const padding = 30;
    const starSize = 28;
    const distractorCount = Math.floor(neglectState.totalStars * 0.4);
    
    const leftCount = Math.floor(neglectState.totalStars / 2);
    const rightCount = neglectState.totalStars - leftCount;
    
    neglectState.total.left = leftCount;
    neglectState.total.right = rightCount;
    
    for (let i = 0; i < leftCount; i++) {
        createStar(field, 
            padding + Math.random() * (width / 2 - padding * 2 - starSize),
            padding + Math.random() * (height - padding * 2 - starSize),
            'left', i);
    }
    
    for (let i = 0; i < rightCount; i++) {
        createStar(field,
            width / 2 + padding + Math.random() * (width / 2 - padding * 2 - starSize),
            padding + Math.random() * (height - padding * 2 - starSize),
            'right', leftCount + i);
    }
    
    const distractors = ['A', 'B', 'C', 'D', 'E', 'ㄱ', 'ㄴ', 'ㄷ', '○', '△', '□'];
    for (let i = 0; i < distractorCount; i++) {
        const distractor = document.createElement('div');
        distractor.className = 'neglect-distractor';
        distractor.textContent = distractors[Math.floor(Math.random() * distractors.length)];
        distractor.style.left = (padding + Math.random() * (width - padding * 2 - 20)) + 'px';
        distractor.style.top = (padding + Math.random() * (height - padding * 2 - 20)) + 'px';
        field.appendChild(distractor);
    }
}

function createStar(field, x, y, side, index) {
    const star = document.createElement('div');
    star.className = 'neglect-star';
    star.textContent = '⭐';
    star.style.left = x + 'px';
    star.style.top = y + 'px';
    star.dataset.side = side;
    star.dataset.index = index;
    
    star.addEventListener('click', function() { onStarTap(star, side); });
    star.addEventListener('touchstart', function(e) {
        e.preventDefault();
        onStarTap(star, side);
    }, { passive: false });
    
    field.appendChild(star);
    neglectState.stars.push({ side: side, found: false });
}

function onStarTap(star, side) {
    if (star.classList.contains('found') || !neglectState.isRunning) return;
    
    star.classList.add('found');
    neglectState.found[side]++;
    
    const totalFound = neglectState.found.left + neglectState.found.right;
    document.getElementById('neglect-found').textContent = totalFound;
    
    if (totalFound >= neglectState.totalStars) {
        endNeglectTest();
    }
    
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

function updateNeglectTimer() {
    neglectState.timeRemaining--;
    updateTimerDisplay();
    
    if (neglectState.timeRemaining <= 0) {
        endNeglectTest();
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(neglectState.timeRemaining / 60);
    const seconds = neglectState.timeRemaining % 60;
    const secStr = seconds < 10 ? '0' + seconds : '' + seconds;
    const display = minutes + ':' + secStr;
    
    const timerEl = document.getElementById('neglect-timer');
    timerEl.textContent = display;
    
    timerEl.classList.remove('warning', 'danger');
    if (neglectState.timeRemaining <= 10) {
        timerEl.classList.add('danger');
    } else if (neglectState.timeRemaining <= 30) {
        timerEl.classList.add('warning');
    }
}

function stopNeglectTimer() {
    if (neglectState.timer) {
        clearInterval(neglectState.timer);
        neglectState.timer = null;
    }
}

function endNeglectTest() {
    stopNeglectTimer();
    neglectState.isRunning = false;
    
    const leftPercent = neglectState.total.left > 0 
        ? Math.round((neglectState.found.left / neglectState.total.left) * 100) 
        : 0;
    const rightPercent = neglectState.total.right > 0 
        ? Math.round((neglectState.found.right / neglectState.total.right) * 100) 
        : 0;
    
    const totalFound = neglectState.found.left + neglectState.found.right;
    const totalStars = neglectState.totalStars;
    const omissions = totalStars - totalFound;
    const asymmetry = leftPercent - rightPercent;
    
    document.getElementById('result-left').textContent = leftPercent + '%';
    document.getElementById('result-right').textContent = rightPercent + '%';
    document.getElementById('left-fill').style.width = leftPercent + '%';
    document.getElementById('right-fill').style.width = rightPercent + '%';
    
    const leftOmit = neglectState.total.left - neglectState.found.left;
    const rightOmit = neglectState.total.right - neglectState.found.right;
    const asymText = asymmetry > 0 ? '(우측 저하)' : asymmetry < 0 ? '(좌측 저하)' : '';
    
    document.getElementById('neglect-summary').innerHTML = 
        '<div><strong>찾은 별:</strong> ' + totalFound + ' / ' + totalStars + '</div>' +
        '<div><strong>누락:</strong> ' + omissions + '개 (좌 ' + leftOmit + ', 우 ' + rightOmit + ')</div>' +
        '<div><strong>좌우 차이:</strong> ' + Math.abs(asymmetry) + '%p ' + asymText + '</div>';
    
    const totalPercent = (totalFound / totalStars) * 100;
    const interpretEl = document.getElementById('neglect-interpretation');
    
    if (totalPercent >= 95 && Math.abs(asymmetry) < 20) {
        interpretEl.className = 'neglect-interpretation normal';
        interpretEl.innerHTML = '✅ <strong>정상 범위</strong><br>편측 무시 가능성 낮음';
    } else if (leftPercent < 80 && rightPercent >= 90) {
        interpretEl.className = 'neglect-interpretation abnormal';
        interpretEl.innerHTML = '⚠️ <strong>좌측 무시 의심</strong><br>우뇌 병변 가능성 - 정밀 평가 권장';
    } else if (rightPercent < 80 && leftPercent >= 90) {
        interpretEl.className = 'neglect-interpretation abnormal';
        interpretEl.innerHTML = '⚠️ <strong>우측 무시 의심</strong><br>좌뇌 병변 가능성 - 정밀 평가 권장';
    } else if (Math.abs(asymmetry) >= 20) {
        interpretEl.className = 'neglect-interpretation suspect';
        interpretEl.innerHTML = '🔍 <strong>비대칭 패턴</strong><br>편측 무시 선별 필요 - 추가 평가 권장';
    } else {
        interpretEl.className = 'neglect-interpretation suspect';
        interpretEl.innerHTML = '🔍 <strong>주의력/집중력 저하</strong><br>전반적 인지 평가 권장';
    }
    
    document.getElementById('neglect-test-area').classList.add('hidden');
    document.getElementById('neglect-result').classList.remove('hidden');
}

// ============================================
// LINE BISECTION TEST
// ============================================

function startBisectionTest() {
    bisectionState.totalTrials = parseInt(document.getElementById('bisection-trials').value);
    bisectionState.lineLength = document.getElementById('bisection-length').value;
    bisectionState.trials = [];
    bisectionState.currentTrial = 0;
    bisectionState.isRunning = true;

    // Hide intro, show test area
    document.getElementById('neglect-intro-bisection').classList.add('hidden');
    document.getElementById('bisection-test-area').classList.remove('hidden');

    document.getElementById('bisection-total').textContent = bisectionState.totalTrials;

    setupBisectionTrial();
}

function setupBisectionTrial() {
    bisectionState.currentTrial++;
    document.getElementById('bisection-current').textContent = bisectionState.currentTrial;

    const field = document.getElementById('bisection-field');
    const line = document.getElementById('bisection-line');
    const marker = document.getElementById('bisection-marker');

    // Reset marker
    marker.classList.add('hidden');
    marker.classList.remove('correct');

    // Set line length
    if (bisectionState.lineLength === 'short') {
        line.classList.add('short');
    } else {
        line.classList.remove('short');
    }

    // Random vertical offset to prevent memorization
    const randomOffset = (Math.random() - 0.5) * 60;
    line.style.top = 'calc(50% + ' + randomOffset + 'px)';

    // Add touch/click handler
    field.onclick = handleBisectionTap;
    field.ontouchstart = function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        handleBisectionTapAt(touch.clientX, touch.clientY);
    };
}

function handleBisectionTap(e) {
    handleBisectionTapAt(e.clientX, e.clientY);
}

function handleBisectionTapAt(clientX, clientY) {
    if (!bisectionState.isRunning) return;

    const field = document.getElementById('bisection-field');
    const line = document.getElementById('bisection-line');
    const marker = document.getElementById('bisection-marker');

    const fieldRect = field.getBoundingClientRect();
    const lineRect = line.getBoundingClientRect();

    // Calculate tap position relative to field
    const tapX = clientX - fieldRect.left;
    const tapY = clientY - fieldRect.top;

    // Calculate line properties
    const lineLeft = lineRect.left - fieldRect.left;
    const lineRight = lineRect.right - fieldRect.left;
    const lineCenter = (lineLeft + lineRight) / 2;
    const lineLength = lineRight - lineLeft;
    const lineY = lineRect.top - fieldRect.top + lineRect.height / 2;

    // Show marker at tap position (constrained to line)
    const constrainedX = Math.max(lineLeft, Math.min(lineRight, tapX));
    marker.style.left = constrainedX + 'px';
    marker.style.top = lineY + 'px';
    marker.classList.remove('hidden');

    // Calculate deviation from center (in percentage of half line length)
    // Positive = right of center, Negative = left of center
    const deviation = ((constrainedX - lineCenter) / (lineLength / 2)) * 100;
    const deviationMm = deviation * 0.5; // Approximate mm based on typical line length

    // Store trial result
    bisectionState.trials.push({
        trial: bisectionState.currentTrial,
        deviation: deviation,
        deviationMm: deviationMm,
        tapX: constrainedX,
        lineCenter: lineCenter
    });

    // Visual feedback
    if (Math.abs(deviation) < 5) {
        marker.classList.add('correct');
    }

    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }

    // Disable further taps
    field.onclick = null;
    field.ontouchstart = null;

    // Wait and proceed
    setTimeout(function() {
        if (bisectionState.currentTrial < bisectionState.totalTrials) {
            setupBisectionTrial();
        } else {
            endBisectionTest();
        }
    }, 800);
}

function endBisectionTest() {
    bisectionState.isRunning = false;

    const trials = bisectionState.trials;
    const avgDeviation = trials.reduce(function(sum, t) { return sum + t.deviation; }, 0) / trials.length;
    const leftDeviations = trials.filter(function(t) { return t.deviation < -5; }).length;
    const rightDeviations = trials.filter(function(t) { return t.deviation > 5; }).length;

    // Calculate left/right performance for consistency with star test display
    const leftPercent = Math.round(100 - Math.abs(Math.min(0, avgDeviation)));
    const rightPercent = Math.round(100 - Math.abs(Math.max(0, avgDeviation)));

    // Update result display
    document.getElementById('result-left').textContent = leftPercent + '%';
    document.getElementById('result-right').textContent = rightPercent + '%';
    document.getElementById('left-fill').style.width = leftPercent + '%';
    document.getElementById('right-fill').style.width = rightPercent + '%';

    // Build summary
    const direction = avgDeviation > 0 ? '우측' : avgDeviation < 0 ? '좌측' : '중앙';
    let summaryHtml = '<div><strong>평균 편차:</strong> ' + Math.abs(avgDeviation).toFixed(1) + '% ' + (avgDeviation !== 0 ? '(' + direction + ')' : '') + '</div>';
    summaryHtml += '<div><strong>시행 결과:</strong> 좌측편향 ' + leftDeviations + '회, 우측편향 ' + rightDeviations + '회</div>';
    summaryHtml += '<div class="bisection-result-detail">';
    summaryHtml += '<strong>시행별 편차:</strong><div class="bisection-trial-list">';

    for (var i = 0; i < trials.length; i++) {
        var t = trials[i];
        var dir = t.deviation > 5 ? 'right' : t.deviation < -5 ? 'left' : 'center';
        var dirText = t.deviation > 5 ? '우' : t.deviation < -5 ? '좌' : '중앙';
        summaryHtml += '<div class="bisection-trial-item"><span>시행 ' + t.trial + '</span>';
        summaryHtml += '<span class="deviation ' + dir + '">' + (t.deviation > 0 ? '+' : '') + t.deviation.toFixed(1) + '% (' + dirText + ')</span></div>';
    }

    summaryHtml += '</div></div>';
    summaryHtml += '<div class="bisection-avg"><div class="bisection-avg-value">' + (avgDeviation > 0 ? '+' : '') + avgDeviation.toFixed(1) + '%</div>';
    summaryHtml += '<div class="bisection-avg-label">평균 편차 (' + direction + ' 편향)</div></div>';

    document.getElementById('neglect-summary').innerHTML = summaryHtml;

    // Interpretation based on Schenkenberg et al. criteria
    const interpretEl = document.getElementById('neglect-interpretation');

    if (Math.abs(avgDeviation) < 5) {
        interpretEl.className = 'neglect-interpretation normal';
        interpretEl.innerHTML = '✅ <strong>정상 범위</strong><br>선 이등분 수행 양호';
    } else if (avgDeviation < -15) {
        interpretEl.className = 'neglect-interpretation abnormal';
        interpretEl.innerHTML = '⚠️ <strong>좌측 무시 의심</strong><br>우뇌 병변 가능성 - 정밀 평가 권장';
    } else if (avgDeviation > 15) {
        interpretEl.className = 'neglect-interpretation abnormal';
        interpretEl.innerHTML = '⚠️ <strong>우측 무시 의심</strong><br>좌뇌 병변 가능성 - 정밀 평가 권장';
    } else if (avgDeviation < -5) {
        interpretEl.className = 'neglect-interpretation suspect';
        interpretEl.innerHTML = '🔍 <strong>경미한 좌측 편향</strong><br>추가 평가 고려';
    } else {
        interpretEl.className = 'neglect-interpretation suspect';
        interpretEl.innerHTML = '🔍 <strong>경미한 우측 편향</strong><br>추가 평가 고려';
    }

    // Show result
    document.getElementById('bisection-test-area').classList.add('hidden');
    document.getElementById('neglect-result').classList.remove('hidden');
}

// ============================================
// AI-Driven Assessment & Plan Functions
// ============================================

// State for AI selections
const aiState = {
    selectedProblems: [],
    selectedSTGs: [],
    selectedLTGs: [],
    treatmentCart: [],
    selectedHEPs: [],
    selectedEducation: [],
    selectedPrecautions: [],
    schedule: { freq: '3x', dur: '4w' }
};

// Mock AI Analysis Data
const mockAIData = {
    problems: [
        { id: 'balance', icon: '⚖️', iconClass: 'balance', title: '낙상 위험군 (중등도)', detail: 'BBS 42점 - 균형 능력 저하', severity: 'moderate', category: 'balance' },
        { id: 'gait', icon: '🚶', iconClass: 'gait', title: '보행 장애', detail: '보조도구 필요, 10m 보행 시 20초 소요', severity: 'moderate', category: 'gait' },
        { id: 'strength', icon: '💪', iconClass: 'strength', title: '하지 근력 약화', detail: 'MMT 3+/5 (고관절 굴곡근)', severity: 'moderate', category: 'strength' },
        { id: 'rom', icon: '🔄', iconClass: 'rom', title: 'ROM 제한', detail: '어깨 굴곡 95° (정상 180°)', severity: 'high', category: 'rom' }
    ],
    stgs: [
        { id: 'stg1', text: '2주 내: 보조도구 없이 실내 10m 독립 보행', tags: ['보행', '2주'] },
        { id: 'stg2', text: '2주 내: BBS 점수 46점 이상 달성', tags: ['균형', '2주'] },
        { id: 'stg3', text: '3주 내: 하지 근력 MMT 4/5 달성', tags: ['근력', '3주'] },
        { id: 'stg4', text: '2주 내: VAS 3/10 이하로 통증 감소', tags: ['통증', '2주'] }
    ],
    ltgs: [
        { id: 'ltg1', text: '6주 내: 독립 보행으로 지역사회 활동 복귀', tags: ['보행', '6주'] },
        { id: 'ltg2', text: '8주 내: 낙상 없이 계단 오르내리기 독립 수행', tags: ['균형', '8주'] },
        { id: 'ltg3', text: '6주 내: 일상생활 활동 독립 수행', tags: ['ADL', '6주'] }
    ],
    treatments: {
        balance: [
            { id: 't1', name: '한발 서기 훈련', category: '균형', icon: '⚖️', iconClass: 'balance', sets: '3', reps: '10초' },
            { id: 't2', name: '앉았다 일어서기', category: '균형/근력', icon: '🪑', iconClass: 'balance', sets: '3', reps: '10회' }
        ],
        gait: [
            { id: 't3', name: '트레드밀 보행 훈련', category: '보행', icon: '🚶', iconClass: 'gait', sets: '1', reps: '10분' },
            { id: 't4', name: '장애물 보행 훈련', category: '보행', icon: '🏃', iconClass: 'gait', sets: '3', reps: '10m' }
        ],
        strength: [
            { id: 't5', name: 'SLR 운동', category: '근력', icon: '💪', iconClass: 'strength', sets: '3', reps: '10회' },
            { id: 't6', name: '브릿지 운동', category: '근력', icon: '🏋️', iconClass: 'strength', sets: '3', reps: '10회' }
        ],
        rom: [
            { id: 't7', name: '어깨 수동 ROM', category: 'ROM', icon: '🔄', iconClass: 'manual', sets: '3', reps: '10회' },
            { id: 't8', name: '스트레칭', category: 'ROM', icon: '🧘', iconClass: 'manual', sets: '3', reps: '30초' }
        ],
        general: [
            { id: 't9', name: 'Hot pack', category: '물리적 인자', icon: '🔥', iconClass: 'modality', sets: '1', reps: '15분' },
            { id: 't10', name: 'TENS', category: '물리적 인자', icon: '⚡', iconClass: 'modality', sets: '1', reps: '20분' }
        ]
    }
};

// Run AI Analysis when navigating to Assessment
function runAIAnalysis() {
    const loading = document.getElementById('ai-analysis-loading');
    const problemsSection = document.getElementById('ai-problems-section');
    const stgSection = document.getElementById('ai-stg-section');
    const ltgSection = document.getElementById('ai-ltg-section');
    const prognosisSection = document.getElementById('ai-prognosis-section');
    const resultSection = document.getElementById('assessment-result');

    // Reset state
    aiState.selectedProblems = [];
    aiState.selectedSTGs = [];
    aiState.selectedLTGs = [];

    // Show loading
    if (loading) loading.classList.remove('hidden');
    if (problemsSection) problemsSection.classList.add('hidden');
    if (stgSection) stgSection.classList.add('hidden');
    if (ltgSection) ltgSection.classList.add('hidden');
    if (prognosisSection) prognosisSection.classList.add('hidden');
    if (resultSection) resultSection.classList.add('hidden');

    // Simulate AI analysis delay
    setTimeout(() => {
        if (loading) loading.classList.add('hidden');
        renderAIProblems();
        renderAIGoals('stg');
        renderAIGoals('ltg');
        renderPrognosis();

        if (problemsSection) problemsSection.classList.remove('hidden');
        if (stgSection) stgSection.classList.remove('hidden');
        if (ltgSection) ltgSection.classList.remove('hidden');
        if (prognosisSection) prognosisSection.classList.remove('hidden');
        if (resultSection) resultSection.classList.remove('hidden');
    }, 1500);
}

// Render AI Problem Cards
function renderAIProblems() {
    const container = document.getElementById('ai-problem-cards');
    if (!container) return;

    container.innerHTML = mockAIData.problems.map(p => `
        <div class="ai-problem-card" data-id="${p.id}" data-category="${p.category}" onclick="toggleProblemCard(this)">
            <div class="problem-icon ${p.iconClass}">${p.icon}</div>
            <div class="problem-content">
                <div class="problem-title">${p.title}</div>
                <div class="problem-detail">${p.detail}</div>
            </div>
            <span class="problem-severity severity-${p.severity}">${p.severity === 'high' ? '심각' : p.severity === 'moderate' ? '중등도' : '경미'}</span>
        </div>
    `).join('');
}

// Toggle Problem Card Selection
function toggleProblemCard(card) {
    card.classList.toggle('selected');
    const id = card.dataset.id;
    const category = card.dataset.category;

    if (card.classList.contains('selected')) {
        const problem = mockAIData.problems.find(p => p.id === id);
        aiState.selectedProblems.push(problem);
    } else {
        aiState.selectedProblems = aiState.selectedProblems.filter(p => p.id !== id);
    }

    updateAssessmentSummary();
    updatePlanTreatments(); // Update Plan recommendations based on selected problems
}

// Render AI Goal Checkboxes
function renderAIGoals(type) {
    const container = document.getElementById(`ai-${type}-list`);
    if (!container) return;

    const goals = type === 'stg' ? mockAIData.stgs : mockAIData.ltgs;

    container.innerHTML = goals.map(g => `
        <div class="ai-goal-item" data-id="${g.id}" onclick="toggleGoalItem(this, '${type}')">
            <div class="goal-checkbox"></div>
            <div class="goal-content">
                <div class="goal-text">${g.text}</div>
                <div class="goal-meta-info">
                    ${g.tags.map(t => `<span class="goal-tag">${t}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle Goal Selection
function toggleGoalItem(item, type) {
    item.classList.toggle('selected');
    const id = item.dataset.id;
    const goals = type === 'stg' ? mockAIData.stgs : mockAIData.ltgs;
    const selectedList = type === 'stg' ? 'selectedSTGs' : 'selectedLTGs';

    if (item.classList.contains('selected')) {
        const goal = goals.find(g => g.id === id);
        aiState[selectedList].push(goal);
    } else {
        aiState[selectedList] = aiState[selectedList].filter(g => g.id !== id);
    }

    updateAssessmentSummary();
}

// Render Prognosis
function renderPrognosis() {
    const badge = document.getElementById('ai-prognosis-recommend');
    if (badge) badge.textContent = 'AI 추천: 양호';

    // Auto-select "good" prognosis
    setTimeout(() => {
        const goodBtn = document.querySelector('.prognosis-btn[data-value="good"]');
        if (goodBtn) {
            document.querySelectorAll('.prognosis-btn').forEach(b => b.classList.remove('active'));
            goodBtn.classList.add('active');
        }
    }, 100);
}

// Select Prognosis
function selectPrognosis(btn) {
    document.querySelectorAll('.prognosis-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateAssessmentSummary();
}

// Update Assessment Summary
function updateAssessmentSummary() {
    const summaryEl = document.getElementById('assessment-summary-content');
    const countEl = document.getElementById('selected-count');

    if (!summaryEl) return;

    const totalCount = aiState.selectedProblems.length + aiState.selectedSTGs.length + aiState.selectedLTGs.length;
    if (countEl) countEl.textContent = `${totalCount}개 선택`;

    if (totalCount === 0) {
        summaryEl.innerHTML = '<p class="summary-empty">위에서 항목을 선택해주세요</p>';
        return;
    }

    let html = '';

    if (aiState.selectedProblems.length > 0) {
        html += '<strong>【문제 목록】</strong><br>';
        aiState.selectedProblems.forEach((p, i) => {
            html += `${i + 1}. ${p.title}<br>`;
        });
        html += '<br>';
    }

    const prognosisBtn = document.querySelector('.prognosis-btn.active');
    const prognosisText = { excellent: '우수', good: '양호', fair: '보통', guarded: '주의', poor: '불량' };
    html += `<strong>【예후】</strong> ${prognosisBtn ? prognosisText[prognosisBtn.dataset.value] : '보통'}<br><br>`;

    if (aiState.selectedSTGs.length > 0) {
        html += '<strong>【단기 목표】</strong><br>';
        aiState.selectedSTGs.forEach((g, i) => {
            html += `${i + 1}. ${g.text}<br>`;
        });
        html += '<br>';
    }

    if (aiState.selectedLTGs.length > 0) {
        html += '<strong>【장기 목표】</strong><br>';
        aiState.selectedLTGs.forEach((g, i) => {
            html += `${i + 1}. ${g.text}<br>`;
        });
    }

    summaryEl.innerHTML = html;
}

// Copy Assessment Summary
function copyAssessmentSummary() {
    const summaryEl = document.getElementById('assessment-summary-content');
    if (!summaryEl) return;

    const text = summaryEl.innerText;

    if (text.includes('선택해주세요')) {
        showToast('선택된 항목이 없습니다');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        showToast('Assessment가 복사되었습니다');
    }).catch(() => showToast('복사 실패'));
}

// Show Custom Problem Input
function showCustomProblemInput() {
    const text = prompt('문제점을 입력하세요:');
    if (text && text.trim()) {
        const customProblem = {
            id: 'custom-' + Date.now(),
            icon: '📝',
            iconClass: 'pain',
            title: text.trim(),
            detail: '직접 입력',
            severity: 'moderate',
            category: 'custom'
        };
        mockAIData.problems.push(customProblem);
        renderAIProblems();
        showToast('문제점이 추가되었습니다');
    }
}

// Show Custom Goal Input
function showCustomGoalInput(type) {
    const text = prompt(`${type === 'stg' ? '단기' : '장기'} 목표를 입력하세요:`);
    if (text && text.trim()) {
        const customGoal = {
            id: `custom-${type}-` + Date.now(),
            text: text.trim(),
            tags: ['직접입력']
        };
        if (type === 'stg') {
            mockAIData.stgs.push(customGoal);
        } else {
            mockAIData.ltgs.push(customGoal);
        }
        renderAIGoals(type);
        showToast('목표가 추가되었습니다');
    }
}

// ============================================
// Plan Screen Functions - Shopping Cart Style
// ============================================

// Update Plan Treatments based on selected problems
function updatePlanTreatments() {
    const carousel = document.getElementById('treatment-carousel');
    if (!carousel) return;

    let treatments = [];

    // Add treatments based on selected problem categories
    aiState.selectedProblems.forEach(p => {
        if (mockAIData.treatments[p.category]) {
            treatments = treatments.concat(mockAIData.treatments[p.category]);
        }
    });

    // Always add general treatments
    treatments = treatments.concat(mockAIData.treatments.general);

    // Remove duplicates
    treatments = treatments.filter((t, i, arr) => arr.findIndex(x => x.id === t.id) === i);

    renderTreatmentCarousel(treatments);
}

// Render Treatment Carousel
function renderTreatmentCarousel(treatments) {
    const carousel = document.getElementById('treatment-carousel');
    if (!carousel) return;

    if (!treatments || treatments.length === 0) {
        // Default treatments if no problems selected
        treatments = [
            ...mockAIData.treatments.strength,
            ...mockAIData.treatments.balance,
            ...mockAIData.treatments.general
        ];
    }

    carousel.innerHTML = treatments.map(t => `
        <div class="treatment-card ${aiState.treatmentCart.find(x => x.id === t.id) ? 'in-cart' : ''}" data-id="${t.id}">
            <button class="add-to-cart-btn ${aiState.treatmentCart.find(x => x.id === t.id) ? 'added' : ''}" onclick="toggleTreatmentCart('${t.id}', event)">
                ${aiState.treatmentCart.find(x => x.id === t.id) ? '✓' : '+'}
            </button>
            <div class="treatment-icon ${t.iconClass}">${t.icon}</div>
            <div class="treatment-name">${t.name}</div>
            <div class="treatment-category">${t.category}</div>
        </div>
    `).join('');
}

// Toggle Treatment in Cart
function toggleTreatmentCart(id, event) {
    event.stopPropagation();

    const existingIndex = aiState.treatmentCart.findIndex(t => t.id === id);

    if (existingIndex >= 0) {
        aiState.treatmentCart.splice(existingIndex, 1);
    } else {
        // Find treatment from all categories
        let treatment = null;
        Object.values(mockAIData.treatments).forEach(arr => {
            const found = arr.find(t => t.id === id);
            if (found) treatment = { ...found };
        });
        if (treatment) {
            aiState.treatmentCart.push(treatment);
        }
    }

    renderTreatmentCart();
    updatePlanTreatments(); // Re-render carousel to update button states
    updatePlanSummary();
}

// Render Treatment Cart
function renderTreatmentCart() {
    const cart = document.getElementById('my-treatment-cart');
    const countEl = document.getElementById('cart-count');

    if (!cart) return;

    if (countEl) {
        countEl.textContent = `${aiState.treatmentCart.length}개`;
        countEl.classList.toggle('has-items', aiState.treatmentCart.length > 0);
    }

    if (aiState.treatmentCart.length === 0) {
        cart.innerHTML = `
            <div class="cart-empty">
                <span class="cart-empty-icon">📋</span>
                <p>위에서 치료를 담아주세요</p>
            </div>
        `;
        return;
    }

    cart.innerHTML = aiState.treatmentCart.map(t => `
        <div class="cart-item" data-id="${t.id}">
            <div class="cart-item-icon">${t.icon}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${t.name}</div>
                <div class="cart-item-params">
                    <input type="text" value="${t.sets}" placeholder="세트" onchange="updateCartItemParam('${t.id}', 'sets', this.value)">
                    <span>×</span>
                    <input type="text" value="${t.reps}" placeholder="횟수" onchange="updateCartItemParam('${t.id}', 'reps', this.value)">
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${t.id}')">✕</button>
        </div>
    `).join('');
}

// Update Cart Item Parameters
function updateCartItemParam(id, param, value) {
    const item = aiState.treatmentCart.find(t => t.id === id);
    if (item) {
        item[param] = value;
        updatePlanSummary();
    }
}

// Remove from Cart
function removeFromCart(id) {
    aiState.treatmentCart = aiState.treatmentCart.filter(t => t.id !== id);
    renderTreatmentCart();
    updatePlanTreatments();
    updatePlanSummary();
}

// Schedule Selection
function selectSchedule(btn, type) {
    const group = btn.closest('.schedule-options');
    if (group) {
        group.querySelectorAll('.schedule-chip').forEach(b => b.classList.remove('active'));
    }
    btn.classList.add('active');

    if (type === 'freq') {
        aiState.schedule.freq = btn.dataset.freq;
    } else {
        aiState.schedule.dur = btn.dataset.dur;
    }
    updatePlanSummary();
}

// Toggle HEP Chip
function toggleHepChip(btn) {
    btn.classList.toggle('active');
    const hep = btn.dataset.hep;

    if (btn.classList.contains('active')) {
        aiState.selectedHEPs.push(hep);
    } else {
        aiState.selectedHEPs = aiState.selectedHEPs.filter(h => h !== hep);
    }
    updatePlanSummary();
}

// Toggle Education
function toggleEducation(btn) {
    btn.classList.toggle('active');

    if (btn.classList.contains('active')) {
        aiState.selectedEducation.push(btn.textContent);
    } else {
        aiState.selectedEducation = aiState.selectedEducation.filter(e => e !== btn.textContent);
    }
    updatePlanSummary();
}

// Toggle Precaution
function togglePrecaution(btn) {
    btn.classList.toggle('active');

    if (btn.classList.contains('active')) {
        aiState.selectedPrecautions.push(btn.textContent);
    } else {
        aiState.selectedPrecautions = aiState.selectedPrecautions.filter(p => p !== btn.textContent);
    }
    updatePlanSummary();
}

// Update Plan Summary
function updatePlanSummary() {
    const summaryEl = document.getElementById('plan-summary-content');
    if (!summaryEl) return;

    if (aiState.treatmentCart.length === 0) {
        summaryEl.innerHTML = '<p class="summary-empty">치료를 담으면 자동 요약됩니다</p>';
        return;
    }

    const freqText = { '2x': '주 2회', '3x': '주 3회', '5x': '주 5회' };
    const durText = { '2w': '2주', '4w': '4주', '8w': '8주' };

    let html = `<strong>【치료 일정】</strong> ${freqText[aiState.schedule.freq]} × ${durText[aiState.schedule.dur]}<br><br>`;

    html += '<strong>【중재 계획】</strong><br>';
    aiState.treatmentCart.forEach((t, i) => {
        html += `${i + 1}. ${t.name} (${t.sets}×${t.reps})<br>`;
    });

    if (aiState.selectedHEPs.length > 0) {
        const hepNames = { stretching: '스트레칭', strengthening: '근력운동', walking: '보행연습', balance: '균형훈련', rom: 'ROM 운동', breathing: '호흡운동' };
        html += '<br><strong>【가정운동】</strong><br>';
        aiState.selectedHEPs.forEach(h => {
            html += `- ${hepNames[h] || h}<br>`;
        });
    }

    if (aiState.selectedEducation.length > 0) {
        html += `<br><strong>【환자 교육】</strong> ${aiState.selectedEducation.join(', ')}<br>`;
    }

    if (aiState.selectedPrecautions.length > 0) {
        html += `<br><strong>【주의사항】</strong> ${aiState.selectedPrecautions.join(', ')}<br>`;
    }

    summaryEl.innerHTML = html;
}

// Copy Plan Summary
function copyPlanSummary() {
    const summaryEl = document.getElementById('plan-summary-content');
    if (!summaryEl) return;

    const text = summaryEl.innerText;

    if (text.includes('자동 요약됩니다')) {
        showToast('선택된 치료가 없습니다');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        showToast('Plan이 복사되었습니다');
    }).catch(() => showToast('복사 실패'));
}

// Initialize Plan Screen
function initPlanScreen() {
    updatePlanTreatments();
    renderTreatmentCart();
}
