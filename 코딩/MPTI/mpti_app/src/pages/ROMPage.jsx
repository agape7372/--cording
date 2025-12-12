import { useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { ROM_JOINTS, ROM_NORMAL_VALUES } from '../data/assessmentData';

const ROMPage = () => {
  const { romData, updateROM, setCurrentStep, patientInfo, setAllROMNormal } = useAssessment();
  const [activeTab, setActiveTab] = useState('neckTrunk');

  const tabs = [
    { id: 'neckTrunk', label: '경추/체간', icon: '🧍' },
    { id: 'upperExtremity', label: '상지 (Upper)', icon: '💪' },
    { id: 'lowerExtremity', label: '하지 (Lower)', icon: '🦵' }
  ];

  // 경추/체간은 좌우 구분 없음
  const renderNeckTrunkItem = (joint) => {
    const data = romData.neckTrunk?.[joint.id] || { rom: '', pain: false };

    return (
      <div key={joint.id} className="assessment-item">
        <div className="assessment-label">
          <span>{joint.label}</span>
          <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>({joint.kr})</span>
          <span style={{
            fontSize: '0.75rem',
            background: '#E0E7FF',
            color: '#4F46E5',
            padding: '0.125rem 0.5rem',
            borderRadius: '4px',
            marginLeft: '0.5rem'
          }}>
            정상: {joint.normal}°
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <input
              type="number"
              placeholder={`각도 (정상: ${joint.normal}°)`}
              value={data.rom}
              onChange={(e) => updateROM('neckTrunk', null, joint.id, { ...data, rom: e.target.value })}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid #E5E7EB'
              }}
            />
          </div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '6px',
            background: data.pain ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
            border: data.pain ? '1px solid #EF4444' : '1px solid #E5E7EB'
          }}>
            <input
              type="checkbox"
              checked={data.pain}
              onChange={(e) => updateROM('neckTrunk', null, joint.id, { ...data, pain: e.target.checked })}
            />
            <span style={{ color: data.pain ? '#EF4444' : '#6B7280', fontSize: '0.875rem' }}>
              Pain {data.pain && '(+)'}
            </span>
          </label>
          <button
            className="btn btn-secondary"
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}
            onClick={() => updateROM('neckTrunk', null, joint.id, { rom: joint.normal, pain: false })}
          >
            Normal
          </button>
        </div>
      </div>
    );
  };

  // 상지/하지는 좌우 구분
  const renderExtremityItem = (joint, region) => {
    const rtData = romData[region]?.rt?.[joint.id] || { rom: '', pain: false };
    const ltData = romData[region]?.lt?.[joint.id] || { rom: '', pain: false };

    const isAffectedRt = patientInfo.affectedSide === 'rt' || patientInfo.affectedSide === 'both';
    const isAffectedLt = patientInfo.affectedSide === 'lt' || patientInfo.affectedSide === 'both';

    return (
      <div key={joint.id} className="assessment-item">
        <div className="assessment-label" style={{ marginBottom: '0.75rem' }}>
          <span>{joint.label}</span>
          <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>({joint.kr})</span>
          <span style={{
            fontSize: '0.75rem',
            background: '#E0E7FF',
            color: '#4F46E5',
            padding: '0.125rem 0.5rem',
            borderRadius: '4px',
            marginLeft: '0.5rem'
          }}>
            정상: {joint.normal}°
          </span>
        </div>

        <div className="side-selector">
          {/* Right Side */}
          <div style={{
            background: isAffectedRt ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
            padding: '0.75rem',
            borderRadius: '8px',
            border: isAffectedRt ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid #E5E7EB'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <label style={{
                fontSize: '0.75rem',
                color: isAffectedRt ? '#EF4444' : '#6B7280',
                fontWeight: isAffectedRt ? '600' : '400'
              }}>
                Rt. {isAffectedRt && '(환부)'}
              </label>
              <button
                style={{
                  fontSize: '0.625rem',
                  padding: '0.25rem 0.5rem',
                  background: '#F3F4F6',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => updateROM(region, 'rt', joint.id, { rom: joint.normal, pain: false })}
              >
                N
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="°"
                value={rtData.rom}
                onChange={(e) => updateROM(region, 'rt', joint.id, { ...rtData, rom: e.target.value })}
                style={{
                  width: '60px',
                  padding: '0.375rem',
                  borderRadius: '4px',
                  border: '1px solid #E5E7EB',
                  fontSize: '0.875rem'
                }}
              />
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer',
                fontSize: '0.75rem',
                color: rtData.pain ? '#EF4444' : '#9CA3AF'
              }}>
                <input
                  type="checkbox"
                  checked={rtData.pain}
                  onChange={(e) => updateROM(region, 'rt', joint.id, { ...rtData, pain: e.target.checked })}
                  style={{ width: '14px', height: '14px' }}
                />
                Pain
              </label>
            </div>
          </div>

          {/* Left Side */}
          <div style={{
            background: isAffectedLt ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
            padding: '0.75rem',
            borderRadius: '8px',
            border: isAffectedLt ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid #E5E7EB'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <label style={{
                fontSize: '0.75rem',
                color: isAffectedLt ? '#EF4444' : '#6B7280',
                fontWeight: isAffectedLt ? '600' : '400'
              }}>
                Lt. {isAffectedLt && '(환부)'}
              </label>
              <button
                style={{
                  fontSize: '0.625rem',
                  padding: '0.25rem 0.5rem',
                  background: '#F3F4F6',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => updateROM(region, 'lt', joint.id, { rom: joint.normal, pain: false })}
              >
                N
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="°"
                value={ltData.rom}
                onChange={(e) => updateROM(region, 'lt', joint.id, { ...ltData, rom: e.target.value })}
                style={{
                  width: '60px',
                  padding: '0.375rem',
                  borderRadius: '4px',
                  border: '1px solid #E5E7EB',
                  fontSize: '0.875rem'
                }}
              />
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer',
                fontSize: '0.75rem',
                color: ltData.pain ? '#EF4444' : '#9CA3AF'
              }}>
                <input
                  type="checkbox"
                  checked={ltData.pain}
                  onChange={(e) => updateROM(region, 'lt', joint.id, { ...ltData, pain: e.target.checked })}
                  style={{ width: '14px', height: '14px' }}
                />
                Pain
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 해당 탭의 정상값 객체 생성
  const getNormalValuesForTab = () => {
    const joints = ROM_JOINTS[activeTab];
    return joints.reduce((acc, joint) => {
      acc[joint.id] = joint.normal;
      return acc;
    }, {});
  };

  // 모두 정상 설정
  const handleSetAllNormal = () => {
    const normalValues = getNormalValuesForTab();
    if (activeTab === 'neckTrunk') {
      ROM_JOINTS.neckTrunk.forEach((joint) => {
        updateROM('neckTrunk', null, joint.id, { rom: joint.normal, pain: false });
      });
    } else {
      ROM_JOINTS[activeTab].forEach((joint) => {
        updateROM(activeTab, 'rt', joint.id, { rom: joint.normal, pain: false });
        updateROM(activeTab, 'lt', joint.id, { rom: joint.normal, pain: false });
      });
    }
  };

  // 초기화
  const clearAll = () => {
    if (activeTab === 'neckTrunk') {
      ROM_JOINTS.neckTrunk.forEach((joint) => {
        updateROM('neckTrunk', null, joint.id, { rom: '', pain: false });
      });
    } else {
      ROM_JOINTS[activeTab].forEach((joint) => {
        updateROM(activeTab, 'rt', joint.id, { rom: '', pain: false });
        updateROM(activeTab, 'lt', joint.id, { rom: '', pain: false });
      });
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>📐</span> ROM (Range of Motion) - 관절가동범위 평가
      </h2>
      <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
        각 관절의 가동범위를 측정합니다. 각도(°)와 통증 여부를 기록하세요.
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
          onClick={handleSetAllNormal}
        >
          ✅ 모두 정상 (Normal)
        </button>
        <button
          className="btn btn-secondary"
          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
          onClick={clearAll}
        >
          🔄 초기화
        </button>
      </div>

      {/* 관절 리스트 */}
      <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
        {activeTab === 'neckTrunk'
          ? ROM_JOINTS.neckTrunk.map((joint) => renderNeckTrunkItem(joint))
          : ROM_JOINTS[activeTab].map((joint) => renderExtremityItem(joint, activeTab))
        }
      </div>

      {/* 네비게이션 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={() => setCurrentStep(2)}>
          ← 이전 (MMT 평가)
        </button>
        <button className="btn btn-primary" onClick={() => setCurrentStep(4)}>
          다음 단계 (BBS 평가) →
        </button>
      </div>
    </div>
  );
};

export default ROMPage;
