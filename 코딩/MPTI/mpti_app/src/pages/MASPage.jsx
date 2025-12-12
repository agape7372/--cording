import { useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { MAS_GRADES, MAS_MUSCLES } from '../data/assessmentData';

const MASPage = () => {
  const { masData, updateMAS, setCurrentStep, patientInfo } = useAssessment();
  const [activeTab, setActiveTab] = useState('upperExtremity');

  const tabs = [
    { id: 'upperExtremity', label: '상지 (Upper)', icon: '💪' },
    { id: 'lowerExtremity', label: '하지 (Lower)', icon: '🦵' }
  ];

  const renderMuscleItem = (muscle, region) => {
    const rtValue = masData[region]?.rt?.[muscle.id] || '';
    const ltValue = masData[region]?.lt?.[muscle.id] || '';

    // 환부에 따른 강조 표시
    const isAffectedRt = patientInfo.affectedSide === 'rt' || patientInfo.affectedSide === 'both';
    const isAffectedLt = patientInfo.affectedSide === 'lt' || patientInfo.affectedSide === 'both';

    return (
      <div key={muscle.id} className="assessment-item">
        <div className="assessment-label">
          <span>{muscle.label}</span>
          <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>({muscle.kr})</span>
        </div>
        <div className="side-selector">
          <div style={{
            background: isAffectedRt ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
            padding: '0.5rem',
            borderRadius: '8px',
            border: isAffectedRt ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid transparent'
          }}>
            <label style={{
              fontSize: '0.75rem',
              color: isAffectedRt ? '#EF4444' : '#6B7280',
              fontWeight: isAffectedRt ? '600' : '400'
            }}>
              Rt. {isAffectedRt && '(환부)'}
            </label>
            <select
              value={rtValue}
              onChange={(e) => updateMAS(region, 'rt', muscle.id, e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid #E5E7EB'
              }}
            >
              <option value="">선택</option>
              {MAS_GRADES.map((grade) => (
                <option key={grade.value} value={grade.value}>
                  {grade.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{
            background: isAffectedLt ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
            padding: '0.5rem',
            borderRadius: '8px',
            border: isAffectedLt ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid transparent'
          }}>
            <label style={{
              fontSize: '0.75rem',
              color: isAffectedLt ? '#EF4444' : '#6B7280',
              fontWeight: isAffectedLt ? '600' : '400'
            }}>
              Lt. {isAffectedLt && '(환부)'}
            </label>
            <select
              value={ltValue}
              onChange={(e) => updateMAS(region, 'lt', muscle.id, e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid #E5E7EB'
              }}
            >
              <option value="">선택</option>
              {MAS_GRADES.map((grade) => (
                <option key={grade.value} value={grade.value}>
                  {grade.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  };

  // 모두 정상(G0) 설정
  const setAllNormal = () => {
    MAS_MUSCLES[activeTab].forEach((muscle) => {
      updateMAS(activeTab, 'rt', muscle.id, '0');
      updateMAS(activeTab, 'lt', muscle.id, '0');
    });
  };

  // 모든 값 초기화
  const clearAll = () => {
    MAS_MUSCLES[activeTab].forEach((muscle) => {
      updateMAS(activeTab, 'rt', muscle.id, '');
      updateMAS(activeTab, 'lt', muscle.id, '');
    });
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>🔬</span> MAS (Modified Ashworth Scale) - 경직 평가
      </h2>
      <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
        각 근육의 경직 정도를 평가합니다. 등급: G0(정상) ~ G4(강직)
      </p>

      {/* 탭 네비게이션 */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* 빠른 설정 버튼 */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem',
        flexWrap: 'wrap'
      }}>
        <button
          className="btn btn-secondary"
          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
          onClick={setAllNormal}
        >
          ✅ 모두 정상 (G0)
        </button>
        <button
          className="btn btn-secondary"
          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
          onClick={clearAll}
        >
          🔄 초기화
        </button>
      </div>

      {/* 근육 리스트 */}
      <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
        {MAS_MUSCLES[activeTab].map((muscle) => renderMuscleItem(muscle, activeTab))}
      </div>

      {/* MAS 등급 참고 */}
      <div style={{
        background: '#F0F9FF',
        borderRadius: '8px',
        padding: '1rem',
        marginTop: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: '#0055FF' }}>
          📖 MAS 등급 참고
        </h4>
        <div style={{ fontSize: '0.75rem', color: '#374151', lineHeight: '1.8' }}>
          <div><strong>G0:</strong> 근긴장도 증가 없음 (정상)</div>
          <div><strong>G1:</strong> ROM 끝에서 약간의 저항 (Catch & Release)</div>
          <div><strong>G1+:</strong> ROM 절반 이하에서 약간의 저항</div>
          <div><strong>G2:</strong> ROM 대부분에서 저항 증가, 움직임 가능</div>
          <div><strong>G3:</strong> 현저한 저항 증가, 수동 운동 어려움</div>
          <div><strong>G4:</strong> 강직 (Rigid), 굴곡/신전 불가</div>
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
        <button className="btn btn-secondary" onClick={() => setCurrentStep(0)}>
          ← 이전 (환자 정보)
        </button>
        <button className="btn btn-primary" onClick={() => setCurrentStep(2)}>
          다음 단계 (MMT 평가) →
        </button>
      </div>
    </div>
  );
};

export default MASPage;
