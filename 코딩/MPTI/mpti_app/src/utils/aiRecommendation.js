// AI 기반 치료 추천 (Perplexity API 연동)
// API 문서: https://docs.perplexity.ai/

/**
 * Perplexity AI를 통한 근거 기반 치료 추천
 * 무료 tier: 월 $0 (제한적), 유료: $20/월
 * 개인 사용자를 위해 API 키 없이도 기본 추천 제공
 */

// 진단별 기본 중재 데이터베이스
const INTERVENTION_DATABASE = {
  stroke: {
    acute: {
      phase: '급성기 (0-2주)',
      interventions: [
        '조기 가동화 (Early mobilization)',
        '침상 내 ROM 운동',
        '자세 변환 및 정렬',
        '호흡 운동',
        '욕창 예방'
      ],
      precautions: ['혈압 모니터링', '낙상 주의', '환측 보호']
    },
    subacute: {
      phase: '아급성기 (2주-3개월)',
      interventions: [
        '과제 지향적 훈련 (Task-oriented training)',
        '체중 지지 훈련',
        'NDT/Bobath 접근법',
        'CIMT (구속유도운동치료)',
        '보행 훈련 시작'
      ],
      evidence: 'Cochrane Review 2020: 과제지향적 훈련이 기능 회복에 효과적'
    },
    chronic: {
      phase: '만성기 (3개월 이후)',
      interventions: [
        '집중 재활 프로그램',
        '지역사회 기반 운동',
        '로봇 보조 훈련',
        '가상현실(VR) 훈련',
        '이중과제 훈련'
      ],
      evidence: 'APTA CPG 2016: 고강도 과제특이적 훈련 권고'
    }
  },
  parkinsons: {
    general: {
      phase: '파킨슨병 물리치료',
      interventions: [
        'LSVT-BIG (큰 동작 훈련)',
        '리듬 청각 자극 (RAS) 보행 훈련',
        '이중과제 훈련',
        '균형 훈련 (외부 교란 포함)',
        '유연성 및 자세 훈련'
      ],
      evidence: 'European PT Guidelines 2014: LSVT-BIG Level A 권고'
    },
    freezing: {
      phase: '동결현상 관리',
      interventions: [
        '시각적 단서 (Visual cueing)',
        '청각적 단서 (Auditory cueing)',
        '주의 전략 (Attentional strategies)',
        '목표 기반 보행 훈련'
      ]
    }
  },
  sci: {
    general: {
      phase: '척수손상 재활',
      interventions: [
        '잔존 근력 강화',
        '호흡 기능 훈련',
        '휠체어 기술 훈련',
        '이동 및 이송 훈련',
        '기립 훈련 (Standing frame)'
      ],
      evidence: 'PVA CPG: 기능적 목표 기반 재활 권고'
    },
    incomplete: {
      phase: '불완전 손상',
      interventions: [
        '체중지지 트레드밀 훈련 (BWSTT)',
        '로봇 보조 보행 훈련',
        '전기자극 치료 (FES)',
        '과제 특이적 훈련'
      ]
    }
  },
  tbi: {
    general: {
      phase: '외상성 뇌손상 재활',
      interventions: [
        '조기 가동화',
        '자세 조절 훈련',
        '균형 및 협응 훈련',
        '인지-운동 이중과제',
        '피로 관리'
      ],
      evidence: 'INCOG Guidelines: 다학제 접근 권고'
    }
  },
  ms: {
    general: {
      phase: '다발성 경화증 재활',
      interventions: [
        '유산소 운동 (저-중강도)',
        '저항 운동',
        '균형 훈련',
        '피로 관리 전략',
        '냉각 전략 (Cooling)'
      ],
      evidence: 'AAN Guidelines: 규칙적 운동이 피로 감소에 효과적'
    }
  }
};

// BBS 점수별 권장 중재
const BBS_INTERVENTIONS = {
  high_risk: { // 0-20
    category: '고위험 (0-20점)',
    focus: '안전 및 기본 이동',
    interventions: [
      '침상 이동 훈련',
      '앉기 균형 훈련',
      '이송 훈련 (Transfer)',
      '휠체어 이동',
      '낙상 예방 교육'
    ]
  },
  moderate_risk: { // 21-40
    category: '중등도 위험 (21-40점)',
    focus: '균형 향상 및 보행 준비',
    interventions: [
      '정적 균형 훈련',
      '동적 균형 훈련',
      '체중 이동 훈련',
      '보조기 보행 훈련',
      '계단 훈련 (보조)'
    ]
  },
  low_risk: { // 41-56
    category: '저위험 (41-56점)',
    focus: '기능적 독립성',
    interventions: [
      '고급 균형 훈련',
      '이중과제 훈련',
      '독립 보행 훈련',
      '지역사회 이동 훈련',
      '운동 프로그램 교육'
    ]
  }
};

/**
 * 환자 상태 기반 AI 추천 생성
 * @param {Object} assessmentData - 평가 데이터
 * @returns {Promise<Object>} AI 추천 결과
 */
export const getAIRecommendation = async (assessmentData) => {
  const { diagnosis, bbsTotal, affectedSide, onsetDate, vasScore, weaknesses, limitations } = assessmentData;

  // 발병 후 경과 기간 계산
  let phase = 'chronic';
  if (onsetDate) {
    const months = Math.floor((new Date() - new Date(onsetDate)) / (1000 * 60 * 60 * 24 * 30));
    if (months < 0.5) phase = 'acute';
    else if (months < 3) phase = 'subacute';
  }

  // BBS 기반 위험도 분류
  let bbsCategory = 'low_risk';
  if (bbsTotal <= 20) bbsCategory = 'high_risk';
  else if (bbsTotal <= 40) bbsCategory = 'moderate_risk';

  // 진단별 중재 가져오기
  const diagnosisData = INTERVENTION_DATABASE[diagnosis] || INTERVENTION_DATABASE.stroke;
  const phaseData = diagnosisData[phase] || diagnosisData.general || diagnosisData.subacute;
  const bbsData = BBS_INTERVENTIONS[bbsCategory];

  // AI 스타일 추천 생성
  const recommendation = {
    summary: generateAISummary(diagnosis, bbsTotal, phase, affectedSide),
    phase: phaseData?.phase || '일반',
    primaryInterventions: phaseData?.interventions || [],
    balanceInterventions: bbsData.interventions,
    evidence: phaseData?.evidence || diagnosisData.general?.evidence || null,
    precautions: phaseData?.precautions || [],
    additionalNotes: generateAdditionalNotes(vasScore, weaknesses, limitations),
    aiConfidence: 'high',
    source: 'MPTI AI Engine (Evidence-based Guidelines Integration)'
  };

  // Perplexity API 호출 시도 (API 키가 있는 경우)
  const apiKey = localStorage.getItem('perplexity_api_key');
  if (apiKey) {
    try {
      const perplexityResult = await callPerplexityAPI(apiKey, assessmentData);
      if (perplexityResult) {
        recommendation.perplexityInsight = perplexityResult;
        recommendation.source = 'Perplexity AI + MPTI Guidelines';
      }
    } catch (error) {
      console.log('Perplexity API not available, using built-in recommendations');
    }
  }

  return recommendation;
};

/**
 * AI 스타일 요약 생성
 */
const generateAISummary = (diagnosis, bbsTotal, phase, affectedSide) => {
  const diagnosisNames = {
    stroke: '뇌졸중',
    parkinsons: '파킨슨병',
    sci: '척수손상',
    tbi: '외상성 뇌손상',
    ms: '다발성 경화증'
  };

  const phaseNames = {
    acute: '급성기',
    subacute: '아급성기',
    chronic: '만성기'
  };

  const sideNames = {
    rt: '우측',
    lt: '좌측',
    both: '양측'
  };

  let summary = `${diagnosisNames[diagnosis] || diagnosis} ${phaseNames[phase]} 환자로, `;

  if (bbsTotal <= 20) {
    summary += `BBS ${bbsTotal}점으로 높은 낙상 위험을 보이고 있습니다. 안전한 환경에서 기본적인 이동 훈련과 균형 훈련을 우선적으로 시행해야 합니다.`;
  } else if (bbsTotal <= 40) {
    summary += `BBS ${bbsTotal}점으로 중등도 낙상 위험이 있습니다. 보조기를 활용한 보행 훈련과 함께 균형 능력 향상에 초점을 맞춘 중재가 권장됩니다.`;
  } else {
    summary += `BBS ${bbsTotal}점으로 독립 보행이 가능한 수준입니다. 기능적 활동과 지역사회 참여를 위한 고급 훈련이 적합합니다.`;
  }

  if (affectedSide && affectedSide !== 'none') {
    summary += ` ${sideNames[affectedSide]} 마비 측의 기능 회복을 위한 집중적인 훈련이 필요합니다.`;
  }

  return summary;
};

/**
 * 추가 노트 생성
 */
const generateAdditionalNotes = (vasScore, weaknesses, limitations) => {
  const notes = [];

  if (vasScore >= 5) {
    notes.push(`통증 관리 우선: VAS ${vasScore}/10로 중재 전 통증 조절 필요`);
  }

  if (weaknesses && weaknesses.length > 0) {
    notes.push(`근력 약화 부위 집중 강화 필요: ${weaknesses.slice(0, 3).join(', ')}`);
  }

  if (limitations && limitations.length > 0) {
    notes.push(`ROM 제한 개선 필요: 관절가동술 및 스트레칭 병행`);
  }

  return notes;
};

/**
 * Perplexity API 호출
 */
const callPerplexityAPI = async (apiKey, assessmentData) => {
  const prompt = `신경계 물리치료 전문가로서 다음 환자에게 근거 기반 치료 추천을 해주세요:
진단: ${assessmentData.diagnosis}
BBS 점수: ${assessmentData.bbsTotal}/56
환측: ${assessmentData.affectedSide}
발병일: ${assessmentData.onsetDate}

최신 임상 가이드라인과 연구 결과를 기반으로 구체적인 중재 방법을 추천해주세요.`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        {
          role: 'system',
          content: 'You are a neurological physical therapy expert. Provide evidence-based treatment recommendations in Korean.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    throw new Error('Perplexity API error');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || null;
};

/**
 * API 키 저장
 */
export const setPerplexityAPIKey = (apiKey) => {
  localStorage.setItem('perplexity_api_key', apiKey);
};

/**
 * API 키 확인
 */
export const hasPerplexityAPIKey = () => {
  return !!localStorage.getItem('perplexity_api_key');
};
