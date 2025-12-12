// MPTI - Assessment Data Configuration
// 신경계 물리치료 평가 데이터

// 진단명 (Diagnosis)
export const DIAGNOSIS_OPTIONS = [
  { value: 'stroke', label: '뇌졸중 (Stroke)' },
  { value: 'sci', label: '척수손상 (SCI)' },
  { value: 'parkinsons', label: '파킨슨병 (Parkinson\'s)' },
  { value: 'tbi', label: '외상성 뇌손상 (TBI)' },
  { value: 'ms', label: '다발성 경화증 (MS)' },
  { value: 'other', label: '기타 (Other)' }
];

// 환부 (Affected Side)
export const AFFECTED_SIDE_OPTIONS = [
  { value: 'rt', label: 'Rt. (우측)' },
  { value: 'lt', label: 'Lt. (좌측)' },
  { value: 'both', label: 'Both (양측)' },
  { value: 'none', label: 'None (해당없음)' }
];

// MAS 등급 (Modified Ashworth Scale)
export const MAS_GRADES = [
  { value: '0', label: 'G0 - 정상' },
  { value: '1', label: 'G1 - 약간 증가' },
  { value: '1+', label: 'G1+ - ROM 절반 이하 저항' },
  { value: '2', label: 'G2 - ROM 전체 저항' },
  { value: '3', label: 'G3 - 심한 증가' },
  { value: '4', label: 'G4 - 강직 (Rigid)' }
];

// MAS 평가 부위
export const MAS_MUSCLES = {
  upperExtremity: [
    { id: 'shoulder_flexor', label: 'Shoulder Flexor', kr: '어깨 굴곡근' },
    { id: 'shoulder_extensor', label: 'Shoulder Extensor', kr: '어깨 신전근' },
    { id: 'elbow_flexor', label: 'Elbow Flexor', kr: '팔꿈치 굴곡근' },
    { id: 'elbow_extensor', label: 'Elbow Extensor', kr: '팔꿈치 신전근' },
    { id: 'wrist_flexor', label: 'Wrist Flexor', kr: '손목 굴곡근' },
    { id: 'wrist_extensor', label: 'Wrist Extensor', kr: '손목 신전근' },
    { id: 'finger_flexor', label: 'Finger Flexor', kr: '손가락 굴곡근' }
  ],
  lowerExtremity: [
    { id: 'hip_flexor', label: 'Hip Flexor', kr: '고관절 굴곡근' },
    { id: 'hip_extensor', label: 'Hip Extensor', kr: '고관절 신전근' },
    { id: 'hip_adductor', label: 'Hip Adductor', kr: '고관절 내전근' },
    { id: 'knee_flexor', label: 'Knee Flexor', kr: '무릎 굴곡근' },
    { id: 'knee_extensor', label: 'Knee Extensor', kr: '무릎 신전근' },
    { id: 'ankle_plantar', label: 'Ankle Plantar Flexor', kr: '발목 저측굴곡근' },
    { id: 'ankle_dorsi', label: 'Ankle Dorsiflexor', kr: '발목 배측굴곡근' }
  ]
};

// MMT 등급 (Manual Muscle Testing)
export const MMT_GRADES = [
  { value: '0', label: 'Zero (0)', description: '근수축 없음' },
  { value: '1', label: 'Trace (1)', description: '근수축만 촉진' },
  { value: '2-', label: 'Poor- (2-)', description: '중력제거, 불완전 ROM' },
  { value: '2', label: 'Poor (2)', description: '중력제거, 완전 ROM' },
  { value: '2+', label: 'Poor+ (2+)', description: '중력제거+약간 저항' },
  { value: '3-', label: 'Fair- (3-)', description: '항중력, 불완전 ROM' },
  { value: '3', label: 'Fair (3)', description: '항중력, 완전 ROM' },
  { value: '3+', label: 'Fair+ (3+)', description: '항중력+약간 저항' },
  { value: '4', label: 'Good (4)', description: '중등도 저항' },
  { value: '5', label: 'Normal (5)', description: '정상' },
  { value: 'NT', label: 'NT', description: '평가 안함' }
];

// MMT 평가 근육 (전신)
export const MMT_MUSCLES = {
  neckTrunk: [
    { id: 'cervical_flex', label: 'Cervical Flexion', kr: '경추 굴곡' },
    { id: 'cervical_ext', label: 'Cervical Extension', kr: '경추 신전' },
    { id: 'trunk_flex', label: 'Trunk Flexion', kr: '체간 굴곡' },
    { id: 'trunk_ext', label: 'Trunk Extension', kr: '체간 신전' },
    { id: 'trunk_rot', label: 'Trunk Rotation', kr: '체간 회전' }
  ],
  upperExtremity: [
    { id: 'shoulder_flex', label: 'Shoulder Flexion', kr: '어깨 굴곡' },
    { id: 'shoulder_ext', label: 'Shoulder Extension', kr: '어깨 신전' },
    { id: 'shoulder_abd', label: 'Shoulder Abduction', kr: '어깨 외전' },
    { id: 'shoulder_add', label: 'Shoulder Adduction', kr: '어깨 내전' },
    { id: 'shoulder_er', label: 'Shoulder External Rotation', kr: '어깨 외회전' },
    { id: 'shoulder_ir', label: 'Shoulder Internal Rotation', kr: '어깨 내회전' },
    { id: 'elbow_flex', label: 'Elbow Flexion', kr: '팔꿈치 굴곡' },
    { id: 'elbow_ext', label: 'Elbow Extension', kr: '팔꿈치 신전' },
    { id: 'forearm_sup', label: 'Forearm Supination', kr: '전완 회외' },
    { id: 'forearm_pro', label: 'Forearm Pronation', kr: '전완 회내' },
    { id: 'wrist_flex', label: 'Wrist Flexion', kr: '손목 굴곡' },
    { id: 'wrist_ext', label: 'Wrist Extension', kr: '손목 신전' },
    { id: 'finger_flex', label: 'Finger Flexion', kr: '손가락 굴곡' },
    { id: 'finger_ext', label: 'Finger Extension', kr: '손가락 신전' },
    { id: 'thumb_opp', label: 'Thumb Opposition', kr: '엄지 대립' }
  ],
  lowerExtremity: [
    { id: 'hip_flex', label: 'Hip Flexion', kr: '고관절 굴곡' },
    { id: 'hip_ext', label: 'Hip Extension', kr: '고관절 신전' },
    { id: 'hip_abd', label: 'Hip Abduction', kr: '고관절 외전' },
    { id: 'hip_add', label: 'Hip Adduction', kr: '고관절 내전' },
    { id: 'hip_er', label: 'Hip External Rotation', kr: '고관절 외회전' },
    { id: 'hip_ir', label: 'Hip Internal Rotation', kr: '고관절 내회전' },
    { id: 'knee_flex', label: 'Knee Flexion', kr: '무릎 굴곡' },
    { id: 'knee_ext', label: 'Knee Extension', kr: '무릎 신전' },
    { id: 'ankle_dorsi', label: 'Ankle Dorsiflexion', kr: '발목 배측굴곡' },
    { id: 'ankle_plantar', label: 'Ankle Plantar Flexion', kr: '발목 저측굴곡' },
    { id: 'ankle_inv', label: 'Ankle Inversion', kr: '발목 내번' },
    { id: 'ankle_ev', label: 'Ankle Eversion', kr: '발목 외번' },
    { id: 'toe_flex', label: 'Toe Flexion', kr: '발가락 굴곡' },
    { id: 'toe_ext', label: 'Toe Extension', kr: '발가락 신전' }
  ]
};

// ROM 정상 범위 (Normal Range)
export const ROM_NORMAL_VALUES = {
  // Neck
  cervical_flex: 45,
  cervical_ext: 45,
  cervical_lat_flex: 45,
  cervical_rot: 60,
  // Trunk
  trunk_flex: 80,
  trunk_ext: 30,
  trunk_lat_flex: 35,
  trunk_rot: 45,
  // Shoulder
  shoulder_flex: 180,
  shoulder_ext: 60,
  shoulder_abd: 180,
  shoulder_add: 30,
  shoulder_er: 90,
  shoulder_ir: 70,
  // Elbow
  elbow_flex: 150,
  elbow_ext: 0,
  // Forearm
  forearm_sup: 85,
  forearm_pro: 80,
  // Wrist
  wrist_flex: 80,
  wrist_ext: 70,
  wrist_rad: 20,
  wrist_uln: 30,
  // Hip
  hip_flex: 120,
  hip_ext: 30,
  hip_abd: 45,
  hip_add: 30,
  hip_er: 45,
  hip_ir: 45,
  // Knee
  knee_flex: 135,
  knee_ext: 0,
  // Ankle
  ankle_dorsi: 20,
  ankle_plantar: 50,
  ankle_inv: 35,
  ankle_ev: 20
};

// ROM 평가 관절
export const ROM_JOINTS = {
  neckTrunk: [
    { id: 'cervical_flex', label: 'Cervical Flexion', kr: '경추 굴곡', normal: 45 },
    { id: 'cervical_ext', label: 'Cervical Extension', kr: '경추 신전', normal: 45 },
    { id: 'cervical_lat_flex', label: 'Cervical Lateral Flexion', kr: '경추 측방굴곡', normal: 45 },
    { id: 'cervical_rot', label: 'Cervical Rotation', kr: '경추 회전', normal: 60 },
    { id: 'trunk_flex', label: 'Trunk Flexion', kr: '체간 굴곡', normal: 80 },
    { id: 'trunk_ext', label: 'Trunk Extension', kr: '체간 신전', normal: 30 },
    { id: 'trunk_lat_flex', label: 'Trunk Lateral Flexion', kr: '체간 측방굴곡', normal: 35 },
    { id: 'trunk_rot', label: 'Trunk Rotation', kr: '체간 회전', normal: 45 }
  ],
  upperExtremity: [
    { id: 'shoulder_flex', label: 'Shoulder Flexion', kr: '어깨 굴곡', normal: 180 },
    { id: 'shoulder_ext', label: 'Shoulder Extension', kr: '어깨 신전', normal: 60 },
    { id: 'shoulder_abd', label: 'Shoulder Abduction', kr: '어깨 외전', normal: 180 },
    { id: 'shoulder_add', label: 'Shoulder Adduction', kr: '어깨 내전', normal: 30 },
    { id: 'shoulder_er', label: 'Shoulder External Rotation', kr: '어깨 외회전', normal: 90 },
    { id: 'shoulder_ir', label: 'Shoulder Internal Rotation', kr: '어깨 내회전', normal: 70 },
    { id: 'elbow_flex', label: 'Elbow Flexion', kr: '팔꿈치 굴곡', normal: 150 },
    { id: 'elbow_ext', label: 'Elbow Extension', kr: '팔꿈치 신전', normal: 0 },
    { id: 'forearm_sup', label: 'Forearm Supination', kr: '전완 회외', normal: 85 },
    { id: 'forearm_pro', label: 'Forearm Pronation', kr: '전완 회내', normal: 80 },
    { id: 'wrist_flex', label: 'Wrist Flexion', kr: '손목 굴곡', normal: 80 },
    { id: 'wrist_ext', label: 'Wrist Extension', kr: '손목 신전', normal: 70 },
    { id: 'wrist_rad', label: 'Wrist Radial Deviation', kr: '손목 요측편위', normal: 20 },
    { id: 'wrist_uln', label: 'Wrist Ulnar Deviation', kr: '손목 척측편위', normal: 30 }
  ],
  lowerExtremity: [
    { id: 'hip_flex', label: 'Hip Flexion', kr: '고관절 굴곡', normal: 120 },
    { id: 'hip_ext', label: 'Hip Extension', kr: '고관절 신전', normal: 30 },
    { id: 'hip_abd', label: 'Hip Abduction', kr: '고관절 외전', normal: 45 },
    { id: 'hip_add', label: 'Hip Adduction', kr: '고관절 내전', normal: 30 },
    { id: 'hip_er', label: 'Hip External Rotation', kr: '고관절 외회전', normal: 45 },
    { id: 'hip_ir', label: 'Hip Internal Rotation', kr: '고관절 내회전', normal: 45 },
    { id: 'knee_flex', label: 'Knee Flexion', kr: '무릎 굴곡', normal: 135 },
    { id: 'knee_ext', label: 'Knee Extension', kr: '무릎 신전', normal: 0 },
    { id: 'ankle_dorsi', label: 'Ankle Dorsiflexion', kr: '발목 배측굴곡', normal: 20 },
    { id: 'ankle_plantar', label: 'Ankle Plantar Flexion', kr: '발목 저측굴곡', normal: 50 },
    { id: 'ankle_inv', label: 'Ankle Inversion', kr: '발목 내번', normal: 35 },
    { id: 'ankle_ev', label: 'Ankle Eversion', kr: '발목 외번', normal: 20 }
  ]
};

// BBS (Berg Balance Scale) 14개 문항
export const BBS_ITEMS = [
  {
    id: 1,
    title: 'Sitting to Standing',
    kr: '앉은 자세에서 일어서기',
    description: '손을 사용하지 않고 일어서세요',
    options: [
      { score: 4, label: '손 사용 없이 안전하게 일어섬' },
      { score: 3, label: '손을 사용하여 혼자 일어섬' },
      { score: 2, label: '여러 번 시도 후 손을 사용하여 일어섬' },
      { score: 1, label: '최소한의 도움 필요' },
      { score: 0, label: '중등도-최대 도움 필요' }
    ]
  },
  {
    id: 2,
    title: 'Standing Unsupported',
    kr: '지지 없이 서기',
    description: '아무것도 잡지 않고 2분간 서 있으세요',
    options: [
      { score: 4, label: '안전하게 2분간 서 있음' },
      { score: 3, label: '감독 하에 2분간 서 있음' },
      { score: 2, label: '30초간 지지 없이 서 있음' },
      { score: 1, label: '여러 번 시도 후 30초간 서 있음' },
      { score: 0, label: '도움 없이 30초간 서 있지 못함' }
    ]
  },
  {
    id: 3,
    title: 'Sitting Unsupported',
    kr: '지지 없이 앉기',
    description: '등받이 없이 팔짱 끼고 2분간 앉아 있으세요',
    options: [
      { score: 4, label: '안전하게 2분간 앉아 있음' },
      { score: 3, label: '감독 하에 2분간 앉아 있음' },
      { score: 2, label: '30초간 앉아 있음' },
      { score: 1, label: '10초간 앉아 있음' },
      { score: 0, label: '도움 없이 10초간 앉아 있지 못함' }
    ]
  },
  {
    id: 4,
    title: 'Standing to Sitting',
    kr: '선 자세에서 앉기',
    description: '앉으세요',
    options: [
      { score: 4, label: '손을 최소한으로 사용하여 안전하게 앉음' },
      { score: 3, label: '손으로 앉는 것을 조절함' },
      { score: 2, label: '다리 뒤로 의자를 확인하며 앉음' },
      { score: 1, label: '혼자 앉지만 조절이 안 됨' },
      { score: 0, label: '앉는데 도움 필요' }
    ]
  },
  {
    id: 5,
    title: 'Transfers',
    kr: '이동하기',
    description: '팔걸이가 있는 의자에서 없는 의자로 이동하세요',
    options: [
      { score: 4, label: '손을 거의 사용하지 않고 안전하게 이동' },
      { score: 3, label: '손을 사용하여 안전하게 이동' },
      { score: 2, label: '구두 지시 또는 감독 필요' },
      { score: 1, label: '1명의 도움 필요' },
      { score: 0, label: '2명의 도움 또는 감독 필요' }
    ]
  },
  {
    id: 6,
    title: 'Standing with Eyes Closed',
    kr: '눈 감고 서기',
    description: '눈을 감고 10초간 서 있으세요',
    options: [
      { score: 4, label: '안전하게 10초간 서 있음' },
      { score: 3, label: '감독 하에 10초간 서 있음' },
      { score: 2, label: '3초간 서 있음' },
      { score: 1, label: '눈을 뜨고 있어야 3초간 서 있음' },
      { score: 0, label: '넘어지지 않도록 도움 필요' }
    ]
  },
  {
    id: 7,
    title: 'Standing with Feet Together',
    kr: '발 모으고 서기',
    description: '발을 모으고 1분간 서 있으세요',
    options: [
      { score: 4, label: '발을 모으고 1분간 안전하게 서 있음' },
      { score: 3, label: '감독 하에 1분간 서 있음' },
      { score: 2, label: '발을 모으고 30초간 서 있음' },
      { score: 1, label: '발을 모으는데 도움이 필요하나 15초간 유지' },
      { score: 0, label: '발을 모으는데 도움이 필요하고 15초간 유지 못함' }
    ]
  },
  {
    id: 8,
    title: 'Reaching Forward',
    kr: '팔 뻗기',
    description: '팔을 90도 올리고 앞으로 최대한 뻗으세요',
    options: [
      { score: 4, label: '25cm 이상 앞으로 뻗을 수 있음' },
      { score: 3, label: '12.5cm 이상 앞으로 뻗을 수 있음' },
      { score: 2, label: '5cm 이상 앞으로 뻗을 수 있음' },
      { score: 1, label: '앞으로 뻗지만 감독 필요' },
      { score: 0, label: '균형을 잃어 외부 지지 필요' }
    ]
  },
  {
    id: 9,
    title: 'Picking Up Object',
    kr: '바닥의 물건 집기',
    description: '발 앞에 놓인 신발/슬리퍼를 집으세요',
    options: [
      { score: 4, label: '안전하고 쉽게 집을 수 있음' },
      { score: 3, label: '감독 하에 집을 수 있음' },
      { score: 2, label: '집을 수 없으나 2.5-5cm 이내 접근' },
      { score: 1, label: '집을 수 없고 시도하는데 감독 필요' },
      { score: 0, label: '시도할 수 없거나 넘어지지 않도록 도움 필요' }
    ]
  },
  {
    id: 10,
    title: 'Turning to Look Behind',
    kr: '뒤 돌아보기',
    description: '왼쪽과 오른쪽 어깨 너머로 뒤를 돌아보세요',
    options: [
      { score: 4, label: '양쪽으로 뒤를 보며 체중이동이 잘 됨' },
      { score: 3, label: '한 쪽만 잘 되고 다른 쪽은 체중이동이 적음' },
      { score: 2, label: '옆으로만 돌아봄, 균형 유지' },
      { score: 1, label: '돌아볼 때 감독 필요' },
      { score: 0, label: '균형을 잃거나 넘어지지 않도록 도움 필요' }
    ]
  },
  {
    id: 11,
    title: 'Turning 360 Degrees',
    kr: '360도 회전하기',
    description: '제자리에서 한 바퀴 돌고 반대로 한 바퀴 도세요',
    options: [
      { score: 4, label: '양쪽으로 4초 이내에 안전하게 360도 회전' },
      { score: 3, label: '한 쪽으로만 4초 이내에 안전하게 360도 회전' },
      { score: 2, label: '안전하게 360도 회전하나 느림' },
      { score: 1, label: '가까운 감독 또는 구두 지시 필요' },
      { score: 0, label: '돌 때 도움 필요' }
    ]
  },
  {
    id: 12,
    title: 'Placing Alternate Foot on Step',
    kr: '스텝에 발 번갈아 올리기',
    description: '발을 번갈아 스텝 위에 올리세요 (각 4회)',
    options: [
      { score: 4, label: '20초 이내에 안전하게 8회 완수' },
      { score: 3, label: '20초 이상 걸려 8회 완수' },
      { score: 2, label: '감독 없이 4회 완수' },
      { score: 1, label: '최소한의 도움으로 2회 이상 완수' },
      { score: 0, label: '넘어지지 않도록 도움 필요/시도 불가' }
    ]
  },
  {
    id: 13,
    title: 'Standing with One Foot in Front',
    kr: '일렬로 서기 (Tandem)',
    description: '한 발을 다른 발 바로 앞에 두고 서세요',
    options: [
      { score: 4, label: '발을 일렬로 두고 30초간 유지' },
      { score: 3, label: '발을 앞에 두고 30초간 유지' },
      { score: 2, label: '작은 스텝으로 30초간 유지' },
      { score: 1, label: '스텝 유지에 도움이 필요하나 15초간 유지' },
      { score: 0, label: '스텝할 때 균형을 잃음' }
    ]
  },
  {
    id: 14,
    title: 'Standing on One Leg',
    kr: '한 발로 서기',
    description: '잡지 않고 한 발로 최대한 오래 서세요',
    options: [
      { score: 4, label: '10초 이상 한 발로 서 있음' },
      { score: 3, label: '5-10초간 한 발로 서 있음' },
      { score: 2, label: '3초 이상 한 발로 서 있음' },
      { score: 1, label: '한 발로 서려 하나 3초간 유지 못함' },
      { score: 0, label: '시도할 수 없거나 넘어지지 않도록 도움 필요' }
    ]
  }
];

// BBS 점수 해석
export const getBBSInterpretation = (score) => {
  if (score <= 20) {
    return {
      risk: 'high',
      label: 'High Fall Risk',
      kr: '높은 낙상 위험',
      description: '휠체어 사용 권장. 이동 시 반드시 보조 필요.',
      color: '#EF4444'
    };
  } else if (score <= 40) {
    return {
      risk: 'medium',
      label: 'Medium Fall Risk',
      kr: '중등도 낙상 위험',
      description: '보조기 보행 권장. 이동 시 감독 필요.',
      color: '#F59E0B'
    };
  } else {
    return {
      risk: 'low',
      label: 'Low Fall Risk',
      kr: '낮은 낙상 위험',
      description: '독립 보행 가능. 정기적 모니터링 권장.',
      color: '#10B981'
    };
  }
};

// VAS 이모티콘 맵핑
export const getVASEmoji = (score) => {
  if (score === 0) return '😊';
  if (score <= 2) return '🙂';
  if (score <= 4) return '😐';
  if (score <= 6) return '😟';
  if (score <= 8) return '😢';
  return '😭';
};

export const getVASDescription = (score) => {
  if (score === 0) return '통증 없음';
  if (score <= 2) return '약한 통증';
  if (score <= 4) return '중등도 통증';
  if (score <= 6) return '심한 통증';
  if (score <= 8) return '매우 심한 통증';
  return '극심한 통증';
};
