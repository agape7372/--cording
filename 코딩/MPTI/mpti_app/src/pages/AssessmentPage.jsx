import { useState, useEffect } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import {
  DIAGNOSIS_OPTIONS,
  AFFECTED_SIDE_OPTIONS,
  getVASEmoji,
  getVASDescription,
  MAS_GRADES,
  MAS_MUSCLES,
  MMT_GRADES,
  MMT_MUSCLES,
  ROM_JOINTS,
  BBS_ITEMS,
  getBBSInterpretation
} from '../data/assessmentData';
import { getEvidenceBasedRecommendation } from '../utils/pubmedSearch';
import { getAIRecommendation, setPerplexityAPIKey, hasPerplexityAPIKey } from '../utils/aiRecommendation';

// 사이드바 네비게이션 항목
const NAV_ITEMS = [
  { id: 'info', label: '기본 정보', icon: '📋' },
  { id: 'vas', label: 'VAS (통증)', icon: '🎯' },
  { id: 'mas', label: 'MAS (경직)', icon: '🔬' },
  { id: 'mmt', label: 'MMT (근력)', icon: '💪' },
  { id: 'rom', label: 'ROM (가동범위)', icon: '📐' },
  { id: 'bbs', label: 'BBS (균형)', icon: '⚖️' },
  { id: 'report', label: '결과 리포트', icon: '📊' }
];

const AssessmentPage = ({ patient, onSave, onBack }) => {
  const {
    patientInfo, updatePatientInfo,
    vasData, updateVAS,
    masData, updateMAS,
    mmtData, updateMMT,
    romData, updateROM,
    bbsData, updateBBS,
    calculateBBSTotal,
    resetAssessment
  } = useAssessment();

  const [activeSection, setActiveSection] = useState('info');
  const [activeTab, setActiveTab] = useState('upperExtremity');
  const [evidenceData, setEvidenceData] = useState(null);
  const [isLoadingEvidence, setIsLoadingEvidence] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showAffectedDropdown, setShowAffectedDropdown] = useState(false);
  const [showUnaffectedDropdown, setShowUnaffectedDropdown] = useState(false);

  // 환자 정보 로드
  useEffect(() => {
    if (patient) {
      updatePatientInfo('name', patient.name || '');
      updatePatientInfo('gender', patient.gender || '');
      updatePatientInfo('age', patient.age || '');
      updatePatientInfo('diagnosis', patient.diagnosis || '');
      updatePatientInfo('onsetDate', patient.onsetDate || '');
      updatePatientInfo('affectedSide', patient.affectedSide || '');
      updatePatientInfo('chiefComplaint', patient.chiefComplaint || '');
    }
  }, [patient]);

  const bbsTotal = calculateBBSTotal();
  const bbsInterpretation = getBBSInterpretation(bbsTotal);

  // 저장 및 뒤로가기
  const handleSave = () => {
    const assessmentData = {
      patientInfo,
      vasData,
      masData,
      mmtData,
      romData,
      bbsData,
      bbsTotal,
      savedAt: new Date().toISOString()
    };
    onSave(assessmentData);
  };

  // 섹션별 컨텐츠 렌더링
  const renderContent = () => {
    switch (activeSection) {
      case 'info':
        return renderPatientInfo();
      case 'vas':
        return renderVAS();
      case 'mas':
        return renderMAS();
      case 'mmt':
        return renderMMT();
      case 'rom':
        return renderROM();
      case 'bbs':
        return renderBBS();
      case 'report':
        return renderReport();
      default:
        return renderPatientInfo();
    }
  };

  // 환자 기본 정보
  const renderPatientInfo = () => (
    <div className="animate-fadeIn">
      <h2 style={{ marginBottom: '1.5rem' }}>📋 환자 기본 정보</h2>
      <div className="grid grid-2" style={{ gap: '1.25rem' }}>
        <div className="input-group">
          <label className="input-label">환자명 <span className="required">*</span></label>
          <input
            className="input"
            type="text"
            placeholder="예: PT-001"
            value={patientInfo.name}
            onChange={(e) => updatePatientInfo('name', e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label">성별</label>
          <div className="radio-group">
            {['남성', '여성'].map((g) => (
              <div className="radio-option" key={g}>
                <input
                  type="radio"
                  id={`gender-${g}`}
                  name="gender"
                  checked={patientInfo.gender === g}
                  onChange={() => updatePatientInfo('gender', g)}
                />
                <label htmlFor={`gender-${g}`}>{g}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">나이</label>
          <input
            className="input"
            type="number"
            placeholder="예: 65"
            value={patientInfo.age}
            onChange={(e) => updatePatientInfo('age', e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label">진단명 <span className="required">*</span></label>
          <select
            className="select"
            value={patientInfo.diagnosis}
            onChange={(e) => updatePatientInfo('diagnosis', e.target.value)}
          >
            <option value="">선택하세요</option>
            {DIAGNOSIS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">발병일</label>
          <input
            className="input"
            type="date"
            value={patientInfo.onsetDate}
            onChange={(e) => updatePatientInfo('onsetDate', e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label">환부</label>
          <div className="radio-group">
            {AFFECTED_SIDE_OPTIONS.map((opt) => (
              <div className="radio-option" key={opt.value}>
                <input
                  type="radio"
                  id={`side-${opt.value}`}
                  name="affectedSide"
                  checked={patientInfo.affectedSide === opt.value}
                  onChange={() => updatePatientInfo('affectedSide', opt.value)}
                />
                <label htmlFor={`side-${opt.value}`}>{opt.label}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="input-group" style={{ marginTop: '1.25rem' }}>
        <label className="input-label">주호소 (C.C)</label>
        <textarea
          className="textarea"
          rows={3}
          placeholder="환자의 주된 불편감이나 치료 목표..."
          value={patientInfo.chiefComplaint}
          onChange={(e) => updatePatientInfo('chiefComplaint', e.target.value)}
          style={{ resize: 'vertical' }}
        />
      </div>
    </div>
  );

  // VAS
  const renderVAS = () => (
    <div className="animate-fadeIn">
      <h2 style={{ marginBottom: '1.5rem' }}>🎯 VAS (Visual Analog Scale)</h2>
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="input-group">
          <label className="input-label">통증 부위</label>
          <input
            className="input"
            type="text"
            placeholder="예: 오른쪽 어깨, 허리"
            value={vasData.location}
            onChange={(e) => updateVAS('location', e.target.value)}
          />
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <label className="input-label" style={{ margin: 0 }}>통증 강도</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '2.5rem' }}>{getVASEmoji(vasData.score)}</span>
              <span style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: vasData.score <= 3 ? 'var(--success)' : vasData.score <= 6 ? 'var(--warning)' : 'var(--error)'
              }}>
                {vasData.score}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>/10</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={vasData.score}
            onChange={(e) => updateVAS('score', parseInt(e.target.value))}
            className="slider"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <span>0 (통증 없음)</span>
            <span style={{
              fontWeight: '500',
              color: vasData.score <= 3 ? 'var(--success)' : vasData.score <= 6 ? 'var(--warning)' : 'var(--error)'
            }}>
              {getVASDescription(vasData.score)}
            </span>
            <span>10 (극심)</span>
          </div>
        </div>
      </div>
    </div>
  );

  // MAS - 터치 친화적 버튼 그리드
  const renderMAS = () => {
    const tabs = [
      { id: 'upperExtremity', label: '상지', icon: '💪' },
      { id: 'lowerExtremity', label: '하지', icon: '🦵' }
    ];

    const setAllNormal = () => {
      MAS_MUSCLES[activeTab].forEach((m) => {
        updateMAS(activeTab, 'rt', m.id, '0');
        updateMAS(activeTab, 'lt', m.id, '0');
      });
    };

    // MAS 등급별 색상
    const getMASColor = (grade) => {
      const colors = {
        '0': '#10B981', '1': '#34D399', '1+': '#FBBF24',
        '2': '#F59E0B', '3': '#EF4444', '4': '#DC2626'
      };
      return colors[grade] || 'var(--text-muted)';
    };

    return (
      <div className="animate-fadeIn">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>🔬 MAS (Modified Ashworth Scale)</h2>
          <button className="btn btn-sm btn-secondary" onClick={setAllNormal}>✅ 모두 정상</button>
        </div>
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
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {MAS_MUSCLES[activeTab].map((muscle) => (
            <div key={muscle.id} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '0.75rem'
            }}>
              <div style={{ marginBottom: '0.75rem', fontWeight: '500' }}>
                {muscle.label} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({muscle.kr})</span>
              </div>
              {['rt', 'lt'].map((side) => {
                const currentValue = masData[activeTab]?.[side]?.[muscle.id];
                return (
                  <div key={side} style={{ marginBottom: side === 'rt' ? '0.5rem' : 0 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
                      {side === 'rt' ? 'RT' : 'LT'}
                    </div>
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                      {MAS_GRADES.map((g) => (
                        <button
                          key={g.value}
                          onClick={() => updateMAS(activeTab, side, muscle.id, g.value)}
                          style={{
                            minWidth: '40px',
                            height: '36px',
                            border: currentValue === g.value ? `2px solid ${getMASColor(g.value)}` : '1px solid var(--border)',
                            borderRadius: '8px',
                            background: currentValue === g.value ? `${getMASColor(g.value)}15` : 'var(--bg-secondary)',
                            color: currentValue === g.value ? getMASColor(g.value) : 'var(--text-secondary)',
                            fontWeight: currentValue === g.value ? '600' : '400',
                            fontSize: '0.8125rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {g.value}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // MMT - 컴팩트 테이블 형태 (영문 등급)
  const renderMMT = () => {
    const tabs = [
      { id: 'neckTrunk', label: '경추/체간', icon: '🧍' },
      { id: 'upperExtremity', label: '상지', icon: '💪' },
      { id: 'lowerExtremity', label: '하지', icon: '🦵' }
    ];

    // 환측/건측 판별
    const affectedSide = patientInfo.affectedSide;
    const isAffected = (side) => {
      if (affectedSide === 'both') return true;
      if (affectedSide === 'rt' && side === 'rt') return true;
      if (affectedSide === 'lt' && side === 'lt') return true;
      return false;
    };

    // 건측 일괄 설정
    const setUnaffectedGrade = (grade) => {
      if (activeTab === 'neckTrunk') return;
      const unaffectedSide = affectedSide === 'rt' ? 'lt' : affectedSide === 'lt' ? 'rt' : null;
      if (unaffectedSide) {
        MMT_MUSCLES[activeTab].forEach((m) => updateMMT(activeTab, unaffectedSide, m.id, grade));
      }
      setShowUnaffectedDropdown(false);
    };

    // 환측 일괄 설정
    const setAffectedGrade = (grade) => {
      if (activeTab === 'neckTrunk') return;
      if (affectedSide === 'both') {
        MMT_MUSCLES[activeTab].forEach((m) => {
          updateMMT(activeTab, 'rt', m.id, grade);
          updateMMT(activeTab, 'lt', m.id, grade);
        });
      } else if (affectedSide && affectedSide !== 'none') {
        MMT_MUSCLES[activeTab].forEach((m) => updateMMT(activeTab, affectedSide, m.id, grade));
      }
      setShowAffectedDropdown(false);
    };

    // MMT 등급 - 영문 표기 (P-, P, P+ 포함) + 상세 기준
    const mmtGrades = [
      { value: '0', label: 'Z', full: 'Zero', desc: '근수축 없음', detail: '시진/촉진 시 근수축 無', color: '#DC2626' },
      { value: '1', label: 'T', full: 'Trace', desc: '미세 수축', detail: '촉진 시 근수축 감지, 관절 움직임 無', color: '#EF4444' },
      { value: '2-', label: 'P-', full: 'Poor-', desc: '중력제거 불완전', detail: '중력제거 위치에서 부분 ROM', color: '#F97316' },
      { value: '2', label: 'P', full: 'Poor', desc: '중력제거 완전', detail: '중력제거 위치에서 완전 ROM', color: '#F59E0B' },
      { value: '2+', label: 'P+', full: 'Poor+', desc: '중력제거+약간저항', detail: '중력제거 ROM + 최소 저항', color: '#FBBF24' },
      { value: '3-', label: 'F-', full: 'Fair-', desc: '항중력 불완전', detail: '중력 저항, 부분 ROM (50% 이상)', color: '#FCD34D' },
      { value: '3', label: 'F', full: 'Fair', desc: '항중력 완전', detail: '중력 저항, 완전 ROM', color: '#A3E635' },
      { value: '3+', label: 'F+', full: 'Fair+', desc: '항중력+약간저항', detail: '중력 저항 ROM + 최소 저항', color: '#84CC16' },
      { value: '4', label: 'G', full: 'Good', desc: '중등도 저항', detail: '중력+중등도 저항, 완전 ROM', color: '#22C55E' },
      { value: '5', label: 'N', full: 'Normal', desc: '최대 저항', detail: '중력+최대 저항, 완전 ROM', color: '#10B981' },
      { value: 'NT', label: 'NT', full: 'Not Testable', desc: '검사불가', detail: '검사 불가능', color: '#94A3B8' }
    ];

    const getGradeInfo = (value) => mmtGrades.find(g => g.value === value) || { color: '#94A3B8', label: '-' };

    // 일괄 설정 드롭다운 컴포넌트
    const BatchDropdown = ({ show, onSelect, onClose, label, color }) => {
      if (!show) return null;
      return (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 10,
          padding: '0.5rem'
        }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', padding: '0 0.25rem' }}>
            {label} 일괄 설정할 등급 선택
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.25rem' }}>
            {mmtGrades.slice(0, -1).map((g) => (
              <button
                key={g.value}
                onClick={() => onSelect(g.value)}
                style={{
                  padding: '0.5rem 0.25rem',
                  border: `1px solid ${g.color}`,
                  borderRadius: '4px',
                  background: `${g.color}15`,
                  color: g.color,
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.125rem'
                }}
              >
                <span>{g.label}</span>
                <span style={{ fontSize: '0.5625rem', opacity: 0.8 }}>{g.value}</span>
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              marginTop: '0.5rem',
              padding: '0.375rem',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              background: 'var(--bg-secondary)',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            취소
          </button>
        </div>
      );
    };

    return (
      <div className="animate-fadeIn">
        <h2 style={{ marginBottom: '1rem' }}>💪 MMT</h2>

        <div className="tabs" style={{ marginBottom: '0.75rem' }}>
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

        {/* 일괄 설정 버튼 - 환측/건측 */}
        {activeTab !== 'neckTrunk' && affectedSide && affectedSide !== 'none' && (
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '0.75rem'
          }}>
            {/* 환측 일괄 */}
            <div style={{ position: 'relative', flex: 1 }}>
              <button
                onClick={() => {
                  setShowAffectedDropdown(!showAffectedDropdown);
                  setShowUnaffectedDropdown(false);
                }}
                style={{
                  width: '100%',
                  padding: '0.625rem 1rem',
                  border: '2px solid var(--error)',
                  borderRadius: 'var(--radius-sm)',
                  background: showAffectedDropdown ? 'var(--error-bg)' : 'white',
                  color: 'var(--error)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>환측 일괄</span>
                <span style={{ fontSize: '0.75rem' }}>{showAffectedDropdown ? '▲' : '▼'}</span>
              </button>
              <BatchDropdown
                show={showAffectedDropdown}
                onSelect={setAffectedGrade}
                onClose={() => setShowAffectedDropdown(false)}
                label="환측"
                color="var(--error)"
              />
            </div>

            {/* 건측 일괄 (양측이 아닌 경우만) */}
            {affectedSide !== 'both' && (
              <div style={{ position: 'relative', flex: 1 }}>
                <button
                  onClick={() => {
                    setShowUnaffectedDropdown(!showUnaffectedDropdown);
                    setShowAffectedDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.625rem 1rem',
                    border: '2px solid var(--success)',
                    borderRadius: 'var(--radius-sm)',
                    background: showUnaffectedDropdown ? 'var(--success-bg)' : 'white',
                    color: 'var(--success)',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>건측 일괄</span>
                  <span style={{ fontSize: '0.75rem' }}>{showUnaffectedDropdown ? '▲' : '▼'}</span>
                </button>
                <BatchDropdown
                  show={showUnaffectedDropdown}
                  onSelect={setUnaffectedGrade}
                  onClose={() => setShowUnaffectedDropdown(false)}
                  label="건측"
                  color="var(--success)"
                />
              </div>
            )}
          </div>
        )}

        {/* 테이블 형태 */}
        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 1 }}>
                <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: '500' }}>근육</th>
                {activeTab !== 'neckTrunk' && (
                  <>
                    <th style={{ padding: '0.5rem', width: '80px', textAlign: 'center' }}>
                      RT {affectedSide === 'rt' && <span style={{ color: 'var(--error)' }}>*</span>}
                    </th>
                    <th style={{ padding: '0.5rem', width: '80px', textAlign: 'center' }}>
                      LT {affectedSide === 'lt' && <span style={{ color: 'var(--error)' }}>*</span>}
                    </th>
                  </>
                )}
                {activeTab === 'neckTrunk' && (
                  <th style={{ padding: '0.5rem', width: '100px', textAlign: 'center' }}>등급</th>
                )}
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'neckTrunk' ? MMT_MUSCLES.neckTrunk : MMT_MUSCLES[activeTab]).map((muscle, idx) => (
                <tr key={muscle.id} style={{ borderBottom: '1px solid var(--border-light)', background: idx % 2 ? 'var(--surface)' : 'var(--bg-primary)' }}>
                  <td style={{ padding: '0.5rem' }}>
                    <div style={{ fontWeight: '500', fontSize: '0.8125rem' }}>{muscle.label}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{muscle.kr}</div>
                  </td>
                  {activeTab === 'neckTrunk' ? (
                    <td style={{ padding: '0.25rem' }}>
                      <select
                        value={mmtData.neckTrunk?.[muscle.id] || ''}
                        onChange={(e) => updateMMT('neckTrunk', null, muscle.id, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.375rem',
                          border: '1px solid var(--border)',
                          borderRadius: '4px',
                          fontSize: '0.8125rem',
                          background: mmtData.neckTrunk?.[muscle.id] ? `${getGradeInfo(mmtData.neckTrunk[muscle.id]).color}15` : 'white',
                          color: mmtData.neckTrunk?.[muscle.id] ? getGradeInfo(mmtData.neckTrunk[muscle.id]).color : 'inherit',
                          fontWeight: mmtData.neckTrunk?.[muscle.id] ? '600' : '400'
                        }}
                      >
                        <option value="">-</option>
                        {mmtGrades.map((g) => (
                          <option key={g.value} value={g.value}>{g.label} ({g.value})</option>
                        ))}
                      </select>
                    </td>
                  ) : (
                    ['rt', 'lt'].map((side) => {
                      const val = mmtData[activeTab]?.[side]?.[muscle.id];
                      const info = getGradeInfo(val);
                      return (
                        <td key={side} style={{ padding: '0.25rem' }}>
                          <select
                            value={val || ''}
                            onChange={(e) => updateMMT(activeTab, side, muscle.id, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.375rem',
                              border: isAffected(side) ? `2px solid ${info.color}` : '1px solid var(--border)',
                              borderRadius: '4px',
                              fontSize: '0.8125rem',
                              background: val ? `${info.color}15` : 'white',
                              color: val ? info.color : 'inherit',
                              fontWeight: val ? '600' : '400'
                            }}
                          >
                            <option value="">-</option>
                            {mmtGrades.map((g) => (
                              <option key={g.value} value={g.value}>{g.label}</option>
                            ))}
                          </select>
                        </td>
                      );
                    })
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 등급 기준 상세 설명 */}
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.6875rem'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.75rem' }}>MMT 등급 기준</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.375rem' }}>
            {mmtGrades.slice(0, -1).map((g) => (
              <div key={g.value} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem' }}>
                <span style={{
                  minWidth: '24px',
                  padding: '0.125rem 0.25rem',
                  background: `${g.color}20`,
                  color: g.color,
                  borderRadius: '3px',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {g.label}
                </span>
                <span style={{ color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                  {g.detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ROM - 드래그 슬라이더 + 입력 칸
  const renderROM = () => {
    const tabs = [
      { id: 'neckTrunk', label: '경추/체간', icon: '🧍' },
      { id: 'upperExtremity', label: '상지', icon: '💪' },
      { id: 'lowerExtremity', label: '하지', icon: '🦵' }
    ];

    const affectedSide = patientInfo.affectedSide;

    const setAllNormal = () => {
      if (activeTab === 'neckTrunk') {
        ROM_JOINTS.neckTrunk.forEach((j) => updateROM('neckTrunk', null, j.id, { rom: j.normal, pain: false }));
      } else {
        ROM_JOINTS[activeTab].forEach((j) => {
          updateROM(activeTab, 'rt', j.id, { rom: j.normal, pain: false });
          updateROM(activeTab, 'lt', j.id, { rom: j.normal, pain: false });
        });
      }
    };

    const setUnaffectedNormal = () => {
      if (activeTab === 'neckTrunk') return;
      const unaffectedSide = affectedSide === 'rt' ? 'lt' : affectedSide === 'lt' ? 'rt' : null;
      if (unaffectedSide) {
        ROM_JOINTS[activeTab].forEach((j) => updateROM(activeTab, unaffectedSide, j.id, { rom: j.normal, pain: false }));
      }
    };

    // ROM 상태 색상
    const getROMColor = (current, normal) => {
      if (!current) return 'var(--text-muted)';
      const ratio = parseInt(current) / parseInt(normal);
      if (ratio >= 0.9) return '#10B981';
      if (ratio >= 0.7) return '#22C55E';
      if (ratio >= 0.5) return '#F59E0B';
      return '#EF4444';
    };

    // 드래그 슬라이더 + 입력 칸 컴포넌트
    const ROMSlider = ({ value, normal, onChange, onPainToggle, pain }) => {
      const maxVal = Math.ceil(normal * 1.2 / 5) * 5; // 정상의 120%까지
      const currentVal = parseInt(value) || 0;
      const percentage = (currentVal / maxVal) * 100;

      // 입력 칸에서 값 변경
      const handleInputChange = (e) => {
        const newVal = e.target.value;
        if (newVal === '') {
          onChange('');
        } else {
          const numVal = parseInt(newVal);
          if (!isNaN(numVal) && numVal >= 0 && numVal <= 180) {
            onChange(numVal);
          }
        }
      };

      // 슬라이더 드래그
      const handleSliderChange = (e) => {
        const newVal = Math.round(parseInt(e.target.value) / 5) * 5; // 5도 단위로 스냅
        onChange(newVal);
      };

      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* 드래그 슬라이더 */}
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="range"
              min="0"
              max={maxVal}
              step="5"
              value={currentVal}
              onChange={handleSliderChange}
              style={{
                width: '100%',
                height: '24px',
                cursor: 'pointer',
                accentColor: getROMColor(currentVal, normal)
              }}
            />
            {/* 정상값 마커 */}
            <div style={{
              position: 'absolute',
              left: `${(normal / maxVal) * 100}%`,
              top: '-2px',
              transform: 'translateX(-50%)',
              width: '2px',
              height: '8px',
              background: 'var(--primary)',
              borderRadius: '1px',
              pointerEvents: 'none'
            }} />
            {/* 슬라이더 아래 눈금 표시 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.5625rem',
              color: 'var(--text-muted)',
              marginTop: '-4px',
              padding: '0 2px'
            }}>
              <span>0</span>
              <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{normal}</span>
              <span>{maxVal}</span>
            </div>
          </div>

          {/* 입력 칸 */}
          <input
            type="number"
            min="0"
            max="180"
            value={value || ''}
            onChange={handleInputChange}
            placeholder="-"
            style={{
              width: '50px',
              padding: '0.375rem',
              border: `2px solid ${value ? getROMColor(value, normal) : 'var(--border)'}`,
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: '600',
              textAlign: 'center',
              color: value ? getROMColor(value, normal) : 'var(--text-muted)',
              background: value ? `${getROMColor(value, normal)}10` : 'white'
            }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>°</span>

          {/* 통증 버튼 */}
          <button
            onClick={onPainToggle}
            style={{
              width: '28px',
              height: '28px',
              border: pain ? '2px solid var(--error)' : '1px solid var(--border)',
              borderRadius: '4px',
              background: pain ? 'var(--error-bg)' : 'white',
              color: pain ? 'var(--error)' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: pain ? '600' : '400',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="통증 유무"
          >
            P
          </button>
        </div>
      );
    };

    return (
      <div className="animate-fadeIn">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>📐 ROM</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {affectedSide && affectedSide !== 'both' && affectedSide !== 'none' && activeTab !== 'neckTrunk' && (
              <button className="btn btn-sm btn-ghost" onClick={setUnaffectedNormal}>건측 N</button>
            )}
            <button className="btn btn-sm btn-secondary" onClick={setAllNormal}>모두 N</button>
          </div>
        </div>

        <div className="tabs" style={{ marginBottom: '0.75rem' }}>
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

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          슬라이더 드래그 또는 직접 입력 | 파란 마커 = 정상값 | P = 통증
        </div>

        <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
          {activeTab === 'neckTrunk' ? (
            ROM_JOINTS.neckTrunk.map((joint, idx) => {
              const data = romData.neckTrunk?.[joint.id] || { rom: '', pain: false };
              return (
                <div key={joint.id} style={{
                  padding: '0.75rem',
                  background: idx % 2 ? 'var(--surface)' : 'var(--bg-primary)',
                  borderBottom: '1px solid var(--border-light)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{joint.label}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>N: {joint.normal}°</span>
                  </div>
                  <ROMSlider
                    value={data.rom}
                    normal={joint.normal}
                    pain={data.pain}
                    onChange={(v) => updateROM('neckTrunk', null, joint.id, { ...data, rom: v })}
                    onPainToggle={() => updateROM('neckTrunk', null, joint.id, { ...data, pain: !data.pain })}
                  />
                </div>
              );
            })
          ) : (
            ROM_JOINTS[activeTab].map((joint, idx) => (
              <div key={joint.id} style={{
                padding: '0.75rem',
                background: idx % 2 ? 'var(--surface)' : 'var(--bg-primary)',
                borderBottom: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{joint.label}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>N: {joint.normal}°</span>
                </div>
                {['rt', 'lt'].map((side) => {
                  const data = romData[activeTab]?.[side]?.[joint.id] || { rom: '', pain: false };
                  const isAff = (affectedSide === side) || (affectedSide === 'both');
                  return (
                    <div key={side} style={{ marginBottom: side === 'rt' ? '0.5rem' : 0 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: isAff ? 'var(--error)' : 'var(--text-secondary)',
                          width: '24px'
                        }}>
                          {side.toUpperCase()}
                        </span>
                        <div style={{ flex: 1 }}>
                          <ROMSlider
                            value={data.rom}
                            normal={joint.normal}
                            pain={data.pain}
                            onChange={(v) => updateROM(activeTab, side, joint.id, { ...data, rom: v })}
                            onPainToggle={() => updateROM(activeTab, side, joint.id, { ...data, pain: !data.pain })}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // BBS
  const renderBBS = () => {
    const completedCount = Object.keys(bbsData).length;

    return (
      <div className="animate-fadeIn">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>⚖️ BBS (Berg Balance Scale)</h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.5rem 1rem',
            background: `${bbsInterpretation.color}15`,
            borderRadius: 'var(--radius-md)'
          }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: bbsInterpretation.color }}>
              {bbsTotal}/56
            </span>
            <span className="badge" style={{ background: `${bbsInterpretation.color}20`, color: bbsInterpretation.color }}>
              {bbsInterpretation.kr}
            </span>
          </div>
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          완료: {completedCount}/14 문항
        </div>
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {BBS_ITEMS.map((item, idx) => {
            const selected = bbsData[item.id];
            const isCompleted = selected !== undefined;
            return (
              <div
                key={item.id}
                style={{
                  border: `1px solid ${isCompleted ? 'var(--success)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '0.75rem',
                  overflow: 'hidden',
                  background: isCompleted ? 'var(--success-bg)' : 'var(--surface)'
                }}
              >
                <div style={{
                  padding: '0.75rem 1rem',
                  background: isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isCompleted ? 'var(--success)' : 'var(--text-muted)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8125rem',
                    fontWeight: '600'
                  }}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', fontSize: '0.9375rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{item.kr}</div>
                  </div>
                  {isCompleted && (
                    <span className="badge badge-success">{selected}점</span>
                  )}
                </div>
                <div style={{ padding: '0.75rem 1rem' }}>
                  {item.options.map((opt) => (
                    <label
                      key={opt.score}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        marginBottom: '0.25rem',
                        background: selected === opt.score ? 'var(--primary-bg)' : 'transparent',
                        border: selected === opt.score ? '1px solid var(--primary)' : '1px solid transparent'
                      }}
                    >
                      <input
                        type="radio"
                        name={`bbs-${item.id}`}
                        checked={selected === opt.score}
                        onChange={() => updateBBS(item.id, opt.score)}
                        style={{ marginTop: '2px' }}
                      />
                      <span style={{ fontSize: '0.875rem' }}>
                        <strong style={{ color: selected === opt.score ? 'var(--primary)' : 'var(--text-primary)' }}>
                          {opt.score}점
                        </strong>
                        <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>{opt.label}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Report
  const renderReport = () => {
    const getDiagnosisLabel = () => {
      const found = DIAGNOSIS_OPTIONS.find(d => d.value === patientInfo.diagnosis);
      return found ? found.label : patientInfo.diagnosis;
    };

    // MMT 요약 생성
    const getMMTSummary = () => {
      const summaries = [];
      ['upperExtremity', 'lowerExtremity'].forEach(region => {
        ['rt', 'lt'].forEach(side => {
          const grades = Object.values(mmtData[region]?.[side] || {}).filter(Boolean);
          if (grades.length > 0) {
            const avgGrade = grades.reduce((a, b) => a + parseInt(b) || 0, 0) / grades.length;
            const regionLabel = region === 'upperExtremity' ? 'UE' : 'LE';
            summaries.push(`${side.toUpperCase()} ${regionLabel}: ${Math.round(avgGrade)}`);
          }
        });
      });
      return summaries.length > 0 ? summaries.join(', ') : 'N/A';
    };

    // 발병 후 경과 기간 계산
    const getOnsetDuration = () => {
      if (!patientInfo.onsetDate) return null;
      const onset = new Date(patientInfo.onsetDate);
      const now = new Date();
      const months = Math.floor((now - onset) / (1000 * 60 * 60 * 24 * 30));
      if (months < 1) return '1개월 미만';
      if (months < 12) return `${months}개월`;
      const years = Math.floor(months / 12);
      const remainMonths = months % 12;
      return remainMonths > 0 ? `${years}년 ${remainMonths}개월` : `${years}년`;
    };

    // STG/LTG 자동 생성
    const generateGoals = () => {
      const duration = getOnsetDuration();
      const diagnosis = patientInfo.diagnosis;
      const affectedSide = patientInfo.affectedSide;
      const sideLabel = affectedSide === 'rt' ? '우측' : affectedSide === 'lt' ? '좌측' : '양측';

      let stg = [];
      let ltg = [];

      // BBS 기반 목표
      if (bbsTotal <= 20) {
        stg.push('침상에서 앉은 자세 유지 5분 이상');
        stg.push('최소 보조 하 휠체어 이동');
        ltg.push('보조기기 사용 실내 이동 독립');
        ltg.push('BBS 30점 이상 도달');
      } else if (bbsTotal <= 40) {
        stg.push('독립적 기립-착석 수행');
        stg.push(`${sideLabel} 하지 지지 하 10초 이상 서기`);
        ltg.push('보조기 보행 20m 이상');
        ltg.push('BBS 45점 이상 도달 (낙상 저위험군)');
      } else {
        stg.push('독립 보행 거리 50m 이상');
        stg.push('계단 오르내리기 난간 사용');
        ltg.push('지역사회 독립 보행');
        ltg.push('일상생활동작 완전 독립');
      }

      // 진단별 추가 목표
      if (diagnosis === 'stroke') {
        stg.push(`${sideLabel} 상지 기능적 움직임 향상`);
        ltg.push('과제 지향적 상지 기능 회복');
      } else if (diagnosis === 'parkinsons') {
        stg.push('동결현상(freezing) 극복 전략 습득');
        ltg.push('LSVT-BIG 프로토콜 완료');
      } else if (diagnosis === 'sci') {
        stg.push('휠체어 자가 추진 능력 향상');
        ltg.push('잔존 기능 최대화 및 보상 전략 습득');
      }

      // VAS 기반 목표
      if (vasData.score >= 5) {
        stg.push(`통증 VAS ${vasData.score}점 → ${Math.max(0, vasData.score - 3)}점으로 감소`);
      }

      return { stg, ltg };
    };

    const goals = generateGoals();

    const generateSOAP = () => {
      let soap = `[S] Subjective\n`;
      soap += `• C.C: ${patientInfo.chiefComplaint || '특이사항 없음'}\n`;
      if (vasData.location && vasData.score > 0) {
        soap += `• Pain: ${vasData.location} VAS ${vasData.score}/10\n`;
      }

      soap += `\n[O] Objective\n`;
      soap += `• Dx: ${getDiagnosisLabel()}\n`;
      soap += `• Onset: ${patientInfo.onsetDate || 'N/A'} (${getOnsetDuration() || 'N/A'})\n`;
      soap += `• Affected: ${patientInfo.affectedSide === 'rt' ? 'Rt' : patientInfo.affectedSide === 'lt' ? 'Lt' : 'Both'}\n`;
      soap += `• BBS: ${bbsTotal}/56 (${bbsInterpretation.kr})\n`;
      soap += `• MMT: ${getMMTSummary()}\n`;

      soap += `\n[A] Assessment\n`;
      soap += `• ${getDiagnosisLabel()}으로 인한 기능저하\n`;
      soap += `• ${bbsInterpretation.description}\n`;
      if (bbsTotal <= 40) {
        soap += `• 낙상 고위험군으로 주의 필요\n`;
      }

      soap += `\n[P] Plan\n`;
      soap += `\n<STG (Short-Term Goals, 2-4주)>\n`;
      goals.stg.forEach((g, i) => {
        soap += `${i + 1}. ${g}\n`;
      });

      soap += `\n<LTG (Long-Term Goals, 8-12주)>\n`;
      goals.ltg.forEach((g, i) => {
        soap += `${i + 1}. ${g}\n`;
      });

      soap += `\n<Intervention>\n`;
      soap += `• 균형 훈련: ${bbsTotal <= 40 ? '정적 균형 → 동적 균형 순차적 진행' : '동적 균형 및 이중과제 훈련'}\n`;
      soap += `• 근력 강화: 점진적 저항 운동 (PRE)\n`;
      soap += `• 기능적 훈련: 과제 지향적 접근법 (Task-oriented approach)\n`;
      if (vasData.score >= 4) {
        soap += `• 통증 관리: 물리적 인자 치료, 연부조직 가동술\n`;
      }

      return soap;
    };

    const copyToClipboard = () => {
      navigator.clipboard.writeText(generateSOAP());
      alert('SOAP 노트가 복사되었습니다!');
    };

    // 평가 데이터 수집 함수
    const collectAssessmentData = () => {
      // MMT에서 약화된 근육 찾기
      const weaknesses = [];
      ['upperExtremity', 'lowerExtremity'].forEach(region => {
        ['rt', 'lt'].forEach(side => {
          Object.entries(mmtData[region]?.[side] || {}).forEach(([muscle, grade]) => {
            if (grade && parseInt(grade) < 4) {
              weaknesses.push(muscle);
            }
          });
        });
      });

      // ROM에서 제한된 관절 찾기
      const limitations = [];
      ['upperExtremity', 'lowerExtremity'].forEach(region => {
        ['rt', 'lt'].forEach(side => {
          Object.entries(romData[region]?.[side] || {}).forEach(([joint, data]) => {
            if (data.rom && data.pain) {
              limitations.push(joint);
            }
          });
        });
      });

      return {
        diagnosis: patientInfo.diagnosis,
        bbsTotal,
        affectedSide: patientInfo.affectedSide,
        onsetDate: patientInfo.onsetDate,
        vasScore: vasData.score,
        weaknesses,
        limitations
      };
    };

    // AI 기반 추천 가져오기
    const fetchAIRecommendation = async () => {
      setIsLoadingAI(true);
      try {
        const assessmentData = collectAssessmentData();
        const result = await getAIRecommendation(assessmentData);
        setAiRecommendation(result);
      } catch (error) {
        console.error('AI recommendation error:', error);
        setAiRecommendation({ error: 'AI 추천 생성 중 오류가 발생했습니다.' });
      }
      setIsLoadingAI(false);
    };

    // Perplexity API 키 저장
    const handleSaveApiKey = () => {
      if (apiKeyInput.trim()) {
        setPerplexityAPIKey(apiKeyInput.trim());
        setShowApiKeyInput(false);
        setApiKeyInput('');
        // 키 저장 후 AI 추천 다시 가져오기
        fetchAIRecommendation();
      }
    };

    // 근거 기반 추천 검색 (PubMed)
    const fetchEvidenceRecommendation = async () => {
      setIsLoadingEvidence(true);
      try {
        const assessmentData = collectAssessmentData();
        const result = await getEvidenceBasedRecommendation(assessmentData);
        setEvidenceData(result);
      } catch (error) {
        console.error('Evidence search error:', error);
        setEvidenceData({ error: '검색 중 오류가 발생했습니다.' });
      }
      setIsLoadingEvidence(false);
    };

    return (
      <div className="animate-fadeIn">
        <h2 style={{ marginBottom: '1.5rem' }}>📊 평가 결과 리포트</h2>

        {/* Summary Cards */}
        <div className="grid grid-4" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>VAS</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--error)' }}>{vasData.score}/10</div>
          </div>
          <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>BBS</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: bbsInterpretation.color }}>{bbsTotal}/56</div>
          </div>
          <div className="card" style={{ padding: '1rem', textAlign: 'center', gridColumn: 'span 2' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>낙상 위험도</div>
            <div className="badge" style={{ background: `${bbsInterpretation.color}20`, color: bbsInterpretation.color, fontSize: '1rem' }}>
              {bbsInterpretation.kr}
            </div>
          </div>
        </div>

        {/* SOAP Note */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>📝 SOAP Note</h3>
            <button className="btn btn-sm btn-primary" onClick={copyToClipboard}>📋 복사</button>
          </div>
          <pre style={{
            background: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {generateSOAP()}
          </pre>
        </div>

        {/* AI-Based Recommendation */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ margin: 0 }}>🤖 AI 치료 추천</h3>
              {hasPerplexityAPIKey() && (
                <span className="badge badge-success" style={{ fontSize: '0.6875rem' }}>Perplexity 연동</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                title="Perplexity API 키 설정"
              >
                설정
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={fetchAIRecommendation}
                disabled={isLoadingAI}
              >
                {isLoadingAI ? '분석 중...' : '🧠 AI 분석'}
              </button>
            </div>
          </div>

          {/* API Key Input */}
          {showApiKeyInput && (
            <div style={{
              padding: '1rem',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Perplexity API 키 (선택사항)
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                API 키를 입력하면 실시간 최신 연구 기반 추천을 받을 수 있습니다.
                <br />
                <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                  API 키 발급받기 →
                </a>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="password"
                  className="input"
                  placeholder="pplx-..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button className="btn btn-sm btn-primary" onClick={handleSaveApiKey}>
                  저장
                </button>
              </div>
            </div>
          )}

          {isLoadingAI && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🧠</div>
              <div>AI가 환자 상태를 분석하고 있습니다...</div>
              <div style={{ fontSize: '0.8125rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                근거 기반 치료 가이드라인을 종합하는 중
              </div>
            </div>
          )}

          {aiRecommendation && !isLoadingAI && (
            <div>
              {aiRecommendation.error ? (
                <div style={{ color: 'var(--error)', padding: '1rem' }}>{aiRecommendation.error}</div>
              ) : (
                <>
                  {/* AI Summary */}
                  <div style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, var(--primary-bg), #EDE9FE)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1rem',
                    borderLeft: '4px solid var(--primary)'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>💡</span> AI 분석 요약
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: '1.7', color: 'var(--text-primary)' }}>
                      {aiRecommendation.summary}
                    </p>
                  </div>

                  {/* Phase & Primary Interventions */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                      padding: '1rem',
                      background: 'var(--surface)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        치료 단계
                      </div>
                      <div style={{ fontWeight: '600', color: 'var(--primary)' }}>
                        {aiRecommendation.phase}
                      </div>
                    </div>
                    <div style={{
                      padding: '1rem',
                      background: 'var(--surface)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        신뢰도
                      </div>
                      <div style={{ fontWeight: '600', color: 'var(--success)' }}>
                        {aiRecommendation.aiConfidence === 'high' ? '높음' : '보통'} (근거기반)
                      </div>
                    </div>
                  </div>

                  {/* Recommended Interventions */}
                  <div style={{
                    padding: '1rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.75rem', fontSize: '0.9375rem' }}>
                      📋 권장 중재
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {aiRecommendation.primaryInterventions?.map((intervention, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '0.375rem 0.75rem',
                            background: 'var(--primary-bg)',
                            color: 'var(--primary)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8125rem',
                            fontWeight: '500'
                          }}
                        >
                          {intervention}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Balance Interventions */}
                  {aiRecommendation.balanceInterventions?.length > 0 && (
                    <div style={{
                      padding: '1rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.75rem', fontSize: '0.9375rem' }}>
                        ⚖️ 균형 훈련 (BBS 기반)
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {aiRecommendation.balanceInterventions?.map((intervention, idx) => (
                          <span
                            key={idx}
                            style={{
                              padding: '0.375rem 0.75rem',
                              background: '#ECFDF5',
                              color: '#059669',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.8125rem',
                              fontWeight: '500'
                            }}
                          >
                            {intervention}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Evidence */}
                  {aiRecommendation.evidence && (
                    <div style={{
                      padding: '0.75rem 1rem',
                      background: '#FEF3C7',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '1rem',
                      fontSize: '0.8125rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem'
                    }}>
                      <span>📖</span>
                      <span style={{ color: '#92400E' }}>{aiRecommendation.evidence}</span>
                    </div>
                  )}

                  {/* Precautions */}
                  {aiRecommendation.precautions?.length > 0 && (
                    <div style={{
                      padding: '0.75rem 1rem',
                      background: 'var(--error-bg)',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '1rem',
                      fontSize: '0.8125rem'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--error)' }}>
                        ⚠️ 주의사항
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
                        {aiRecommendation.precautions.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Additional Notes */}
                  {aiRecommendation.additionalNotes?.length > 0 && (
                    <div style={{
                      padding: '0.75rem 1rem',
                      background: 'var(--surface)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '1rem',
                      fontSize: '0.8125rem'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                        📝 추가 고려사항
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
                        {aiRecommendation.additionalNotes.map((note, idx) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Perplexity AI Insight */}
                  {aiRecommendation.perplexityInsight && (
                    <div style={{
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #EDE9FE, #FCE7F3)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1rem',
                      border: '1px solid #C4B5FD'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#7C3AED', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>🔮</span> Perplexity AI 인사이트
                      </div>
                      <pre style={{
                        whiteSpace: 'pre-wrap',
                        margin: 0,
                        fontFamily: 'inherit',
                        fontSize: '0.875rem',
                        lineHeight: '1.7',
                        color: 'var(--text-primary)'
                      }}>
                        {aiRecommendation.perplexityInsight}
                      </pre>
                    </div>
                  )}

                  {/* Source */}
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    textAlign: 'right'
                  }}>
                    출처: {aiRecommendation.source}
                  </div>
                </>
              )}
            </div>
          )}

          {!aiRecommendation && !isLoadingAI && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🤖</div>
              <div style={{ marginBottom: '0.5rem' }}>AI 기반 맞춤형 치료 추천을 받아보세요</div>
              <div style={{ fontSize: '0.8125rem' }}>
                진단명, BBS, 발병일 등을 분석하여 근거 기반 중재를 추천합니다
              </div>
              {!hasPerplexityAPIKey() && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--primary)' }}>
                  Perplexity API 키를 추가하면 최신 연구 기반 인사이트도 받을 수 있습니다
                </div>
              )}
            </div>
          )}
        </div>

        {/* Evidence-Based Recommendation (PubMed) */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>📚 PubMed 논문 검색</h3>
            <button
              className="btn btn-sm btn-secondary"
              onClick={fetchEvidenceRecommendation}
              disabled={isLoadingEvidence}
            >
              {isLoadingEvidence ? '검색 중...' : '🔍 논문 검색'}
            </button>
          </div>

          {isLoadingEvidence && (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
              <div>PubMed에서 관련 논문을 검색하고 있습니다...</div>
            </div>
          )}

          {evidenceData && !isLoadingEvidence && (
            <div>
              {evidenceData.error ? (
                <div style={{ color: 'var(--error)', padding: '1rem' }}>
                  {evidenceData.error}
                </div>
              ) : (
                <>
                  {/* 검색어 표시 */}
                  <div style={{
                    padding: '0.75rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1rem',
                    fontSize: '0.8125rem'
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>검색어: </span>
                    <span style={{ color: 'var(--primary)' }}>{evidenceData.query}</span>
                  </div>

                  {/* 추천 요약 */}
                  <div style={{
                    padding: '1rem',
                    background: 'var(--primary-bg)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1rem',
                    borderLeft: '4px solid var(--primary)'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                      💡 치료 권장사항
                    </div>
                    <pre style={{
                      whiteSpace: 'pre-wrap',
                      margin: 0,
                      fontFamily: 'inherit',
                      fontSize: '0.9375rem',
                      lineHeight: '1.7',
                      color: 'var(--text-primary)'
                    }}>
                      {evidenceData.summary}
                    </pre>
                  </div>

                  {/* 논문 목록 */}
                  {evidenceData.articles && evidenceData.articles.length > 0 && (
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '0.75rem', fontSize: '0.9375rem' }}>
                        📚 관련 논문 ({evidenceData.articles.length}건)
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {evidenceData.articles.map((article, idx) => (
                          <a
                            key={article.id}
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'block',
                              padding: '1rem',
                              background: 'var(--surface)',
                              border: '1px solid var(--border-light)',
                              borderRadius: 'var(--radius-sm)',
                              textDecoration: 'none',
                              color: 'inherit',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = 'var(--primary)';
                              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border-light)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <div style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.75rem'
                            }}>
                              <span style={{
                                width: '24px',
                                height: '24px',
                                background: 'var(--primary)',
                                color: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                flexShrink: 0
                              }}>
                                {idx + 1}
                              </span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontWeight: '500',
                                  fontSize: '0.9375rem',
                                  marginBottom: '0.25rem',
                                  color: 'var(--primary)',
                                  lineHeight: '1.4'
                                }}>
                                  {article.title}
                                </div>
                                <div style={{
                                  fontSize: '0.8125rem',
                                  color: 'var(--text-secondary)',
                                  marginBottom: '0.25rem'
                                }}>
                                  {article.authors}
                                </div>
                                <div style={{
                                  fontSize: '0.75rem',
                                  color: 'var(--text-muted)',
                                  display: 'flex',
                                  gap: '0.75rem'
                                }}>
                                  <span>{article.journal}</span>
                                  <span>•</span>
                                  <span>{article.year}</span>
                                </div>
                              </div>
                              <span style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>↗</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 면책 조항 */}
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'var(--warning-bg)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    <span>⚠️</span>
                    <span>{evidenceData.disclaimer}</span>
                  </div>
                </>
              )}
            </div>
          )}

          {!evidenceData && !isLoadingEvidence && (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'var(--text-muted)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📚</div>
              <div style={{ marginBottom: '0.5rem' }}>환자 상태에 맞는 근거 기반 치료 추천을 받아보세요</div>
              <div style={{ fontSize: '0.8125rem' }}>
                진단명과 평가 결과를 기반으로 PubMed에서 관련 논문을 검색합니다
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100
      }}>
        {/* Header */}
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onBack}
            style={{ marginBottom: '0.75rem', marginLeft: '-0.5rem' }}
          >
            ← 환자 목록
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="avatar">{patientInfo.name?.charAt(0) || 'P'}</div>
            <div>
              <div style={{ fontWeight: '600' }}>{patientInfo.name || '새 환자'}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {patientInfo.diagnosis ? DIAGNOSIS_OPTIONS.find(d => d.value === patientInfo.diagnosis)?.label.split(' ')[0] : '진단 미입력'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" style={{ flex: 1, padding: '0.75rem', overflowY: 'auto' }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Save Button */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-light)' }}>
          <button className="btn btn-primary w-full" onClick={handleSave}>
            💾 저장하기
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '240px', padding: '2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AssessmentPage;
