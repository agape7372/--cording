// PubMed API를 이용한 논문 검색 (완전 무료)
// API 문서: https://www.ncbi.nlm.nih.gov/books/NBK25500/

const PUBMED_BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

/**
 * PubMed에서 논문 검색
 * @param {string} query - 검색어
 * @param {number} maxResults - 최대 결과 수 (기본 5)
 * @returns {Promise<Array>} 논문 목록
 */
export const searchPubMed = async (query, maxResults = 5) => {
  try {
    // 1단계: 검색하여 논문 ID 목록 가져오기
    const searchUrl = `${PUBMED_BASE_URL}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&retmode=json&sort=relevance`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    const ids = searchData.esearchresult?.idlist || [];

    if (ids.length === 0) {
      return [];
    }

    // 2단계: 논문 상세 정보 가져오기
    const detailUrl = `${PUBMED_BASE_URL}/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`;

    const detailResponse = await fetch(detailUrl);
    const detailData = await detailResponse.json();

    // 3단계: 결과 정리
    const articles = ids.map(id => {
      const article = detailData.result?.[id];
      if (!article) return null;

      return {
        id: id,
        title: article.title || 'No title',
        authors: article.authors?.map(a => a.name).slice(0, 3).join(', ') || 'Unknown',
        journal: article.source || 'Unknown journal',
        year: article.pubdate?.split(' ')[0] || 'N/A',
        link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`
      };
    }).filter(Boolean);

    return articles;

  } catch (error) {
    console.error('PubMed search error:', error);
    return [];
  }
};

/**
 * 환자 상태를 기반으로 검색어 생성
 * @param {Object} patientData - 환자 데이터
 * @returns {string} 검색어
 */
export const generateSearchQuery = (patientData) => {
  const { diagnosis, bbsScore, problems } = patientData;

  // 진단명 매핑
  const diagnosisMap = {
    stroke: 'stroke rehabilitation',
    sci: 'spinal cord injury rehabilitation',
    parkinsons: 'Parkinson disease physical therapy',
    tbi: 'traumatic brain injury rehabilitation',
    ms: 'multiple sclerosis physical therapy'
  };

  const diagnosisTerm = diagnosisMap[diagnosis] || 'neurological rehabilitation';

  // BBS 점수에 따른 키워드
  let balanceKeyword = '';
  if (bbsScore !== undefined) {
    if (bbsScore <= 20) {
      balanceKeyword = 'wheelchair mobility severe balance impairment';
    } else if (bbsScore <= 40) {
      balanceKeyword = 'balance training fall prevention';
    } else {
      balanceKeyword = 'gait training independent ambulation';
    }
  }

  // 문제점 키워드
  const problemKeywords = problems?.join(' ') || '';

  // 최종 검색어 조합
  const query = `${diagnosisTerm} ${balanceKeyword} ${problemKeywords} evidence-based intervention`.trim();

  return query;
};

/**
 * AI 추천을 위한 컨텍스트 생성 (논문 기반)
 * @param {Object} assessmentData - 평가 데이터
 * @returns {Promise<Object>} 추천 결과
 */
export const getEvidenceBasedRecommendation = async (assessmentData) => {
  const { diagnosis, bbsTotal, weaknesses, limitations } = assessmentData;

  // 문제점 추출
  const problems = [];
  if (bbsTotal <= 40) problems.push('balance deficit');
  if (weaknesses?.length > 0) problems.push('muscle weakness');
  if (limitations?.length > 0) problems.push('ROM limitation');

  // 검색어 생성
  const query = generateSearchQuery({
    diagnosis,
    bbsScore: bbsTotal,
    problems
  });

  // PubMed 검색
  const articles = await searchPubMed(query, 5);

  // 결과 반환
  return {
    query,
    articles,
    summary: generateRecommendationSummary(diagnosis, bbsTotal, articles),
    disclaimer: '이 정보는 참고용이며, 최종 임상적 판단은 담당 치료사에게 있습니다.'
  };
};

/**
 * 추천 요약 생성
 */
const generateRecommendationSummary = (diagnosis, bbsScore, articles) => {
  // 진단별 기본 권장사항
  const recommendations = {
    stroke: {
      acute: '급성기에는 침상 내 ROM 운동과 자세 변환에 집중합니다.',
      subacute: '아급성기에는 과제 지향적 훈련(Task-oriented training)과 점진적 보행 훈련을 권장합니다.',
      chronic: '만성기에는 기능적 독립성 향상을 위한 집중 재활과 지역사회 복귀 훈련을 권장합니다.'
    },
    parkinsons: {
      general: 'LSVT-BIG, 리듬 청각 자극(RAS)을 이용한 보행 훈련, 균형 훈련이 권장됩니다.'
    },
    sci: {
      general: '잔존 기능 강화, 보조기기 훈련, 휠체어 이동 훈련이 권장됩니다.'
    }
  };

  let summary = '';

  // BBS 점수 기반 권장
  if (bbsScore !== undefined) {
    if (bbsScore <= 20) {
      summary += '• BBS 점수가 20점 이하로 높은 낙상 위험군입니다. 휠체어 이동 훈련과 이동 보조가 우선입니다.\n';
    } else if (bbsScore <= 40) {
      summary += '• BBS 점수가 21-40점으로 중등도 낙상 위험군입니다. 보조기 보행과 균형 훈련을 권장합니다.\n';
    } else {
      summary += '• BBS 점수가 41점 이상으로 독립 보행이 가능합니다. 기능 향상과 지역사회 활동 훈련을 권장합니다.\n';
    }
  }

  // 진단별 권장
  if (diagnosis === 'stroke') {
    summary += '• ' + recommendations.stroke.subacute + '\n';
  } else if (diagnosis === 'parkinsons') {
    summary += '• ' + recommendations.parkinsons.general + '\n';
  } else if (diagnosis === 'sci') {
    summary += '• ' + recommendations.sci.general + '\n';
  }

  // 논문 기반 추가
  if (articles.length > 0) {
    summary += `\n📚 관련 연구 ${articles.length}건을 찾았습니다. 아래 논문들을 참고하세요.`;
  }

  return summary;
};
