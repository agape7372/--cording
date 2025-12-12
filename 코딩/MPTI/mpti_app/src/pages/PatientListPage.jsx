import { useState } from 'react';
import { DIAGNOSIS_OPTIONS } from '../data/assessmentData';

const PatientListPage = ({ patients, onAddPatient, onSelectPatient, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDiagnosis, setFilterDiagnosis] = useState('');

  // 검색 및 필터링
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiagnosis = !filterDiagnosis || patient.diagnosis === filterDiagnosis;
    return matchesSearch && matchesDiagnosis;
  });

  const getDiagnosisLabel = (value) => {
    const found = DIAGNOSIS_OPTIONS.find(d => d.value === value);
    return found ? found.label.split(' ')[0] : value;
  };

  const getDiagnosisColor = (diagnosis) => {
    const colors = {
      stroke: '#EF4444',
      sci: '#F59E0B',
      parkinsons: '#8B5CF6',
      tbi: '#EC4899',
      ms: '#06B6D4',
      other: '#6B7280'
    };
    return colors[diagnosis] || colors.other;
  };

  const getAffectedSideLabel = (side) => {
    const labels = { rt: 'Rt.', lt: 'Lt.', both: 'Both', none: '-' };
    return labels[side] || side;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border-light)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => onNavigate('landing')}
              style={{ marginLeft: '-0.5rem' }}
            >
              ←
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem'
              }}>
                🧠
              </div>
              <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>환자 관리</span>
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={onAddPatient}
            style={{ gap: '0.5rem' }}
          >
            <span style={{ fontSize: '1.25rem' }}>+</span>
            <span>새 환자</span>
          </button>
        </div>
      </header>

      <main className="container" style={{ padding: '1.5rem' }}>
        {/* Search & Filter */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}>
                🔍
              </span>
              <input
                type="text"
                className="input"
                placeholder="환자 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>
          <select
            className="select"
            value={filterDiagnosis}
            onChange={(e) => setFilterDiagnosis(e.target.value)}
            style={{ width: 'auto', minWidth: '160px' }}
          >
            <option value="">전체 진단</option>
            {DIAGNOSIS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Patient Count */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            총 <strong style={{ color: 'var(--text-primary)' }}>{filteredPatients.length}</strong>명의 환자
          </span>
        </div>

        {/* Patient List */}
        {filteredPatients.length === 0 ? (
          <div className="card" style={{ padding: '4rem 2rem' }}>
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <div className="empty-state-title">
                {patients.length === 0 ? '등록된 환자가 없습니다' : '검색 결과가 없습니다'}
              </div>
              <div className="empty-state-description">
                {patients.length === 0
                  ? '상단의 "새 환자" 버튼을 눌러 첫 환자를 등록하세요'
                  : '다른 검색어를 입력해보세요'
                }
              </div>
              {patients.length === 0 && (
                <button
                  className="btn btn-primary"
                  onClick={onAddPatient}
                  style={{ marginTop: '1.5rem' }}
                >
                  + 새 환자 등록
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="card"
                onClick={() => onSelectPatient(patient)}
                style={{
                  padding: '1rem 1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Avatar */}
                  <div className="avatar" style={{
                    background: `linear-gradient(135deg, ${getDiagnosisColor(patient.diagnosis)}90, ${getDiagnosisColor(patient.diagnosis)})`
                  }}>
                    {patient.name.charAt(0)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: '600', fontSize: '1rem' }}>
                        {patient.name}
                      </span>
                      <span className="badge" style={{
                        background: `${getDiagnosisColor(patient.diagnosis)}15`,
                        color: getDiagnosisColor(patient.diagnosis)
                      }}>
                        {getDiagnosisLabel(patient.diagnosis)}
                      </span>
                      {patient.assessmentData?.bbsTotal !== undefined && (
                        <span className="badge" style={{
                          background: patient.assessmentData.bbsTotal <= 20 ? '#FEE2E2' :
                                     patient.assessmentData.bbsTotal <= 40 ? '#FEF3C7' : '#D1FAE5',
                          color: patient.assessmentData.bbsTotal <= 20 ? '#DC2626' :
                                 patient.assessmentData.bbsTotal <= 40 ? '#D97706' : '#059669',
                          fontSize: '0.75rem'
                        }}>
                          BBS {patient.assessmentData.bbsTotal}
                        </span>
                      )}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <span>{patient.gender} / {patient.age}세</span>
                      <span>환부: {getAffectedSideLabel(patient.affectedSide)}</span>
                      {patient.lastAssessment && (
                        <span>최근 평가: {formatDate(patient.lastAssessment)}</span>
                      )}
                    </div>
                    {patient.assessmentData && (
                      <div style={{
                        marginTop: '0.5rem',
                        fontSize: '0.8125rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap'
                      }}>
                        {patient.assessmentData.vasScore > 0 && (
                          <span>VAS: {patient.assessmentData.vasScore}/10</span>
                        )}
                        {patient.assessmentData.mmtSummary && (
                          <span>MMT: {patient.assessmentData.mmtSummary}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <div style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>
                    →
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientListPage;
