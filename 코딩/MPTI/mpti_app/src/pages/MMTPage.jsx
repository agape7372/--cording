import { useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { MMT_GRADES, MMT_MUSCLES } from '../data/assessmentData';

const MMTPage = () => {
  const { mmtData, updateMMT, setCurrentStep, patientInfo } = useAssessment();
  const [activeTab, setActiveTab] = useState('neckTrunk');

  const tabs = [
    { id: 'neckTrunk', label: '경추/체간', icon: '🧍' },
    { id: 'upperExtremity', label: '상지 (Upper)', icon: '💪' },
    { id: 'lowerExtremity', label: '하지 (Lower)', icon: '🦵' }
  ];

  // 경추/체간은 좌우 구분 없음
  const renderNeckTrunkItem = (muscle) => {
    const value = mmtData.neckTrunk?.[muscle.id] || '';

    return (
      <div key={muscle.id} className="assessment-item">
        <div className="assessment-label">
          <span>{muscle.label}</span>
          <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>({muscle.kr})</span>
        </div>
        <select
          value={value}
          onChange={(e) => updateMMT('neckTrunk', null, muscle.id, e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '6px',
            border: '1px solid #E5E7EB',
            fontSize: '0.875rem'
          }}
        >
          <option value="">선택</option>
          {MMT_GRADES.map((grade) => (
            <option key={grade.value} value={grade.value}>
              {grade.label} - {grade.description}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // 상지/하지는 좌우 구분
  const renderExtremityItem = (muscle, region) => {
    const rtValue = mmtData[region]?.rt?.[muscle.id] || '';
    const ltValue = mmtData[region]?.lt?.[muscle.id] || '';

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
              onChange={(e) => updateMMT(region, 'rt', muscle.id, e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid #E5E7EB',
                fontSize: '0.75rem'
              }}
            >
              <option value="">선택</option>
              {MMT_GRADES.map((grade) => (
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
              onChange={(e) => updateMMT(region, 'lt', muscle.id, e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid #E5E7EB',
                fontSize: '0.75rem'
              }}
            >
              <option value="">선택</option>
              {MMT_GRADES.map((grade) => (
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

  // 모두 정상(5) 설정
  const setAllNormal = () => {
    if (activeTab === 'neckTrunk') {
      MMT_MUSCLES.neckTrunk.forEach((muscle) => {
        updateMMT('neckTrunk', null, muscle.id, '5');
      });
    } else {
      MMT_MUSCLES[activeTab].forEach((muscle) => {
        updateMMT(activeTab, 'rt', muscle.id, '5');
        updateMMT(activeTab, 'lt', muscle.id, '5');
      });
    }
  };

  // NT(평가 안함) 설정
  const setAllNT = () => {
    if (activeTab === 'neckTrunk') {
      MMT_MUSCLES.neckTrunk.forEach((muscle) => {
        updateMMT('neckTrunk', null, muscle.id, 'NT');
      });
    } else {
      MMT_MUSCLES[activeTab].forEach((muscle) => {
        updateMMT(activeTab, 'rt', muscle.id, 'NT');
        updateMMT(activeTab, 'lt', muscle.id, 'NT');
      });
    }
  };

  // 초기화
  const clearAll = () => {
    if (activeTab === 'neckTrunk') {
      MMT_MUSCLES.neckTrunk.forEach((muscle) => {
        updateMMT('neckTrunk', null, muscle.id, '');
      });
    } else {
      MMT_MUSCLES[activeTab].forEach((muscle) => {
        updateMMT(activeTab, 'rt', muscle.id, '');
        updateMMT(activeTab, 'lt', muscle.id, '');
      });
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>💪</span> MMT (Manual Muscle Testing) - 근력 평가
      </h2>
      <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
        각 근육의 근력을 평가합니다. 등급: Zero(0) ~ Normal(5)
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
          ✅ 모두 정상 (5)
        </button>
        <button
          className="btn btn-secondary"
          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
          onClick={setAllNT}
        >
          ⏭️ 모두 NT
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
        {activeTab === 'neckTrunk'
          ? MMT_MUSCLES.neckTrunk.map((muscle) => renderNeckTrunkItem(muscle))
          : MMT_MUSCLES[activeTab].map((muscle) => renderExtremityItem(muscle, activeTab))
        }
      </div>

      {/* MMT 등급 참고 */}
      <div style={{
        background: '#F0FDF4',
        borderRadius: '8px',
        padding: '1rem',
        marginTop: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: '#10B981' }}>
          📖 MMT 등급 참고
        </h4>
        <div style={{
          fontSize: '0.75rem',
          color: '#374151',
          lineHeight: '1.8',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.25rem'
        }}>
          <div><strong>0 (Zero):</strong> 근수축 없음</div>
          <div><strong>1 (Trace):</strong> 근수축만 촉진</div>
          <div><strong>2- (Poor-):</strong> 중력제거, 불완전 ROM</div>
          <div><strong>2 (Poor):</strong> 중력제거, 완전 ROM</div>
          <div><strong>2+ (Poor+):</strong> 중력제거 + 약간 저항</div>
          <div><strong>3- (Fair-):</strong> 항중력, 불완전 ROM</div>
          <div><strong>3 (Fair):</strong> 항중력, 완전 ROM</div>
          <div><strong>3+ (Fair+):</strong> 항중력 + 약간 저항</div>
          <div><strong>4 (Good):</strong> 중등도 저항</div>
          <div><strong>5 (Normal):</strong> 정상</div>
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
        <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
          ← 이전 (MAS 평가)
        </button>
        <button className="btn btn-primary" onClick={() => setCurrentStep(3)}>
          다음 단계 (ROM 평가) →
        </button>
      </div>
    </div>
  );
};

export default MMTPage;
