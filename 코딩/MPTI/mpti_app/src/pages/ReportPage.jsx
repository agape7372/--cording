import { useAssessment } from '../context/AssessmentContext';
import {
  DIAGNOSIS_OPTIONS,
  AFFECTED_SIDE_OPTIONS,
  getBBSInterpretation,
  getVASDescription,
  MAS_GRADES,
  MMT_GRADES,
  MAS_MUSCLES,
  MMT_MUSCLES,
  ROM_JOINTS
} from '../data/assessmentData';

const ReportPage = () => {
  const {
    patientInfo,
    vasData,
    masData,
    mmtData,
    romData,
    bbsData,
    calculateBBSTotal,
    setCurrentStep,
    resetAssessment
  } = useAssessment();

  const bbsTotal = calculateBBSTotal();
  const bbsInterpretation = getBBSInterpretation(bbsTotal);

  // 진단명 라벨 가져오기
  const getDiagnosisLabel = () => {
    const found = DIAGNOSIS_OPTIONS.find(d => d.value === patientInfo.diagnosis);
    return found ? found.label : patientInfo.diagnosis;
  };

  // 환부 라벨 가져오기
  const getAffectedSideLabel = () => {
    const found = AFFECTED_SIDE_OPTIONS.find(s => s.value === patientInfo.affectedSide);
    return found ? found.label : patientInfo.affectedSide;
  };

  // MAS에서 비정상(G1 이상) 찾기
  const getAbnormalMAS = () => {
    const abnormals = [];
    ['upperExtremity', 'lowerExtremity'].forEach(region => {
      ['rt', 'lt'].forEach(side => {
        const muscles = masData[region]?.[side] || {};
        Object.entries(muscles).forEach(([muscleId, grade]) => {
          if (grade && grade !== '0') {
            const muscleInfo = MAS_MUSCLES[region].find(m => m.id === muscleId);
            abnormals.push({
              muscle: muscleInfo?.kr || muscleId,
              side: side.toUpperCase(),
              grade: grade
            });
          }
        });
      });
    });
    return abnormals;
  };

  // MMT에서 약화된 근육(G4 이하) 찾기
  const getWeakenedMMT = () => {
    const weakened = [];
    // Neck/Trunk
    Object.entries(mmtData.neckTrunk || {}).forEach(([muscleId, grade]) => {
      if (grade && grade !== '5' && grade !== 'NT') {
        const muscleInfo = MMT_MUSCLES.neckTrunk.find(m => m.id === muscleId);
        weakened.push({
          muscle: muscleInfo?.kr || muscleId,
          side: '-',
          grade: grade
        });
      }
    });
    // Upper/Lower Extremity
    ['upperExtremity', 'lowerExtremity'].forEach(region => {
      ['rt', 'lt'].forEach(side => {
        const muscles = mmtData[region]?.[side] || {};
        Object.entries(muscles).forEach(([muscleId, grade]) => {
          if (grade && grade !== '5' && grade !== 'NT') {
            const muscleInfo = MMT_MUSCLES[region].find(m => m.id === muscleId);
            weakened.push({
              muscle: muscleInfo?.kr || muscleId,
              side: side.toUpperCase(),
              grade: grade
            });
          }
        });
      });
    });
    return weakened;
  };

  // ROM에서 제한된 관절 찾기
  const getLimitedROM = () => {
    const limited = [];
    // Neck/Trunk
    Object.entries(romData.neckTrunk || {}).forEach(([jointId, data]) => {
      if (data.rom) {
        const jointInfo = ROM_JOINTS.neckTrunk.find(j => j.id === jointId);
        if (jointInfo && Number(data.rom) < jointInfo.normal) {
          limited.push({
            joint: jointInfo.kr,
            side: '-',
            rom: data.rom,
            normal: jointInfo.normal,
            pain: data.pain
          });
        }
      }
    });
    // Upper/Lower Extremity
    ['upperExtremity', 'lowerExtremity'].forEach(region => {
      ['rt', 'lt'].forEach(side => {
        const joints = romData[region]?.[side] || {};
        Object.entries(joints).forEach(([jointId, data]) => {
          if (data.rom) {
            const jointInfo = ROM_JOINTS[region].find(j => j.id === jointId);
            if (jointInfo && Number(data.rom) < jointInfo.normal) {
              limited.push({
                joint: jointInfo.kr,
                side: side.toUpperCase(),
                rom: data.rom,
                normal: jointInfo.normal,
                pain: data.pain
              });
            }
          }
        });
      });
    });
    return limited;
  };

  const abnormalMAS = getAbnormalMAS();
  const weakenedMMT = getWeakenedMMT();
  const limitedROM = getLimitedROM();

  // SOAP 노트 생성
  const generateSOAPNote = () => {
    let soap = '';

    // Subjective
    soap += `[S] Subjective\n`;
    soap += `• C.C: ${patientInfo.chiefComplaint || '특이사항 없음'}\n`;
    if (vasData.location && vasData.score > 0) {
      soap += `• Pain: ${vasData.location} VAS ${vasData.score}/10 (${getVASDescription(vasData.score)})\n`;
    }
    soap += '\n';

    // Objective
    soap += `[O] Objective\n`;
    soap += `• Dx: ${getDiagnosisLabel()}\n`;
    soap += `• Onset: ${patientInfo.onsetDate || 'N/A'}\n`;
    soap += `• Affected Side: ${getAffectedSideLabel()}\n`;
    soap += `• BBS: ${bbsTotal}/56 (${bbsInterpretation.kr})\n`;

    if (abnormalMAS.length > 0) {
      soap += `• MAS 이상소견:\n`;
      abnormalMAS.forEach(item => {
        soap += `  - ${item.side}. ${item.muscle}: G${item.grade}\n`;
      });
    }

    if (weakenedMMT.length > 0) {
      soap += `• MMT 약화소견:\n`;
      weakenedMMT.slice(0, 5).forEach(item => {
        soap += `  - ${item.side !== '-' ? item.side + '. ' : ''}${item.muscle}: Grade ${item.grade}\n`;
      });
      if (weakenedMMT.length > 5) {
        soap += `  - ...외 ${weakenedMMT.length - 5}개 항목\n`;
      }
    }

    if (limitedROM.length > 0) {
      soap += `• ROM 제한소견:\n`;
      limitedROM.slice(0, 5).forEach(item => {
        soap += `  - ${item.side !== '-' ? item.side + '. ' : ''}${item.joint}: ${item.rom}° (정상 ${item.normal}°)${item.pain ? ' Pain(+)' : ''}\n`;
      });
      if (limitedROM.length > 5) {
        soap += `  - ...외 ${limitedROM.length - 5}개 항목\n`;
      }
    }
    soap += '\n';

    // Assessment
    soap += `[A] Assessment\n`;
    soap += `• ${getDiagnosisLabel()}으로 인한 `;
    if (patientInfo.affectedSide && patientInfo.affectedSide !== 'none') {
      soap += `${getAffectedSideLabel()} `;
    }
    soap += `기능저하 상태입니다.\n`;
    soap += `• 균형능력: ${bbsInterpretation.kr} - ${bbsInterpretation.description}\n`;
    if (abnormalMAS.length > 0) {
      soap += `• 경직: ${abnormalMAS.length}개 근육군에서 경직 확인됨\n`;
    }
    if (weakenedMMT.length > 0) {
      soap += `• 근력: ${weakenedMMT.length}개 근육군에서 약화 확인됨\n`;
    }
    soap += '\n';

    // Plan
    soap += `[P] Plan\n`;
    soap += `• 치료 목표: 기능적 독립성 향상 및 낙상 예방\n`;
    if (bbsTotal <= 40) {
      soap += `• 균형 훈련: 정적/동적 균형 훈련 필요\n`;
    }
    if (abnormalMAS.length > 0) {
      soap += `• 경직 관리: 스트레칭, 포지셔닝, 이완 요법\n`;
    }
    if (weakenedMMT.length > 0) {
      soap += `• 근력 강화: 점진적 저항 운동 프로그램\n`;
    }
    if (limitedROM.length > 0) {
      soap += `• ROM 운동: 관절 가동범위 유지/증진 운동\n`;
    }

    return soap;
  };

  // 클립보드에 복사
  const copyToClipboard = () => {
    const soapNote = generateSOAPNote();
    navigator.clipboard.writeText(soapNote);
    alert('SOAP 노트가 클립보드에 복사되었습니다!');
  };

  // 새 평가 시작
  const handleNewAssessment = () => {
    if (confirm('모든 데이터가 초기화됩니다. 새 평가를 시작하시겠습니까?')) {
      resetAssessment();
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>📊</span> MPTI 평가 결과 리포트
      </h2>

      {/* 환자 정보 요약 */}
      <div style={{
        background: 'linear-gradient(135deg, #0055FF, #0041CC)',
        borderRadius: '16px',
        padding: '1.5rem',
        color: 'white',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem' }}>환자</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{patientInfo.name || '미입력'}</div>
            <div style={{ opacity: 0.8, fontSize: '0.875rem', marginTop: '0.5rem' }}>
              {patientInfo.gender} / {patientInfo.age}세 / {getDiagnosisLabel()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem' }}>환부</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{getAffectedSideLabel()}</div>
          </div>
        </div>
      </div>

      {/* 주요 지표 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* VAS */}
        <div style={{
          background: '#FEF2F2',
          borderRadius: '12px',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#991B1B', marginBottom: '0.25rem' }}>VAS (통증)</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#EF4444' }}>
            {vasData.score}<span style={{ fontSize: '1rem' }}>/10</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{vasData.location || '-'}</div>
        </div>

        {/* BBS */}
        <div style={{
          background: `${bbsInterpretation.color}15`,
          borderRadius: '12px',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: bbsInterpretation.color, marginBottom: '0.25rem' }}>BBS (균형)</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: bbsInterpretation.color }}>
            {bbsTotal}<span style={{ fontSize: '1rem' }}>/56</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{bbsInterpretation.kr}</div>
        </div>

        {/* MAS 이상 */}
        <div style={{
          background: abnormalMAS.length > 0 ? '#FEF3C7' : '#F0FDF4',
          borderRadius: '12px',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: abnormalMAS.length > 0 ? '#92400E' : '#166534', marginBottom: '0.25rem' }}>MAS (경직)</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: abnormalMAS.length > 0 ? '#F59E0B' : '#10B981' }}>
            {abnormalMAS.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>이상 소견</div>
        </div>

        {/* MMT 약화 */}
        <div style={{
          background: weakenedMMT.length > 0 ? '#FEF3C7' : '#F0FDF4',
          borderRadius: '12px',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: weakenedMMT.length > 0 ? '#92400E' : '#166534', marginBottom: '0.25rem' }}>MMT (근력)</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: weakenedMMT.length > 0 ? '#F59E0B' : '#10B981' }}>
            {weakenedMMT.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>약화 소견</div>
        </div>
      </div>

      {/* SOAP 노트 */}
      <div style={{
        background: '#F9FAFB',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📝</span> SOAP Note (자동 생성)
          </h3>
          <button
            className="btn btn-primary"
            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            onClick={copyToClipboard}
          >
            📋 복사하기
          </button>
        </div>
        <pre style={{
          background: 'white',
          borderRadius: '8px',
          padding: '1rem',
          fontSize: '0.875rem',
          lineHeight: '1.8',
          whiteSpace: 'pre-wrap',
          fontFamily: 'Pretendard, monospace',
          border: '1px solid #E5E7EB',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {generateSOAPNote()}
        </pre>
      </div>

      {/* 상세 소견 (접기/펼치기) */}
      {(abnormalMAS.length > 0 || weakenedMMT.length > 0 || limitedROM.length > 0) && (
        <div style={{
          background: '#FFFBEB',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#92400E' }}>⚠️ 주의가 필요한 항목</h3>

          {abnormalMAS.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>경직 (MAS)</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {abnormalMAS.map((item, idx) => (
                  <span key={idx} style={{
                    background: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    border: '1px solid #FCD34D'
                  }}>
                    {item.side}. {item.muscle}: G{item.grade}
                  </span>
                ))}
              </div>
            </div>
          )}

          {weakenedMMT.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>근력 약화 (MMT)</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {weakenedMMT.slice(0, 10).map((item, idx) => (
                  <span key={idx} style={{
                    background: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    border: '1px solid #FCD34D'
                  }}>
                    {item.side !== '-' ? `${item.side}. ` : ''}{item.muscle}: {item.grade}
                  </span>
                ))}
                {weakenedMMT.length > 10 && (
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>...외 {weakenedMMT.length - 10}개</span>
                )}
              </div>
            </div>
          )}

          {limitedROM.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>관절가동범위 제한 (ROM)</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {limitedROM.slice(0, 10).map((item, idx) => (
                  <span key={idx} style={{
                    background: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    border: `1px solid ${item.pain ? '#EF4444' : '#FCD34D'}`
                  }}>
                    {item.side !== '-' ? `${item.side}. ` : ''}{item.joint}: {item.rom}°{item.pain && ' 🔴'}
                  </span>
                ))}
                {limitedROM.length > 10 && (
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>...외 {limitedROM.length - 10}개</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={() => setCurrentStep(4)}>
          ← 이전 (BBS 평가)
        </button>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => window.print()}
          >
            🖨️ 인쇄
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNewAssessment}
          >
            🆕 새 평가 시작
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
