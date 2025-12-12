import { useAssessment } from '../context/AssessmentContext';
import { DIAGNOSIS_OPTIONS, AFFECTED_SIDE_OPTIONS, getVASEmoji, getVASDescription } from '../data/assessmentData';

const PatientInfoPage = () => {
  const {
    patientInfo,
    updatePatientInfo,
    vasData,
    updateVAS,
    setCurrentStep
  } = useAssessment();

  const handleNext = () => {
    // 필수 필드 검증
    if (!patientInfo.name || !patientInfo.diagnosis) {
      alert('환자명과 진단명은 필수입니다.');
      return;
    }
    setCurrentStep(1);
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>📋</span> 환자 기본 정보 (Subjective)
      </h2>

      {/* 기본 정보 섹션 */}
      <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
        <div className="input-group">
          <label>환자명 (익명 가능) *</label>
          <input
            type="text"
            placeholder="예: PT-001, 홍OO"
            value={patientInfo.name}
            onChange={(e) => updatePatientInfo('name', e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>성별</label>
          <div className="radio-group">
            {['남성', '여성'].map((gender) => (
              <div className="radio-option" key={gender}>
                <input
                  type="radio"
                  id={`gender-${gender}`}
                  name="gender"
                  checked={patientInfo.gender === gender}
                  onChange={() => updatePatientInfo('gender', gender)}
                />
                <label htmlFor={`gender-${gender}`}>{gender}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label>나이</label>
          <input
            type="number"
            placeholder="예: 65"
            value={patientInfo.age}
            onChange={(e) => updatePatientInfo('age', e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>진단명 (Diagnosis) *</label>
          <select
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
          <label>발병일 (Onset Date)</label>
          <input
            type="date"
            value={patientInfo.onsetDate}
            onChange={(e) => updatePatientInfo('onsetDate', e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>환부 (Affected Side)</label>
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

      <div className="input-group" style={{ marginBottom: '2rem' }}>
        <label>주호소 (Chief Complaint)</label>
        <textarea
          rows={3}
          placeholder="환자의 주된 불편감이나 치료 목표를 입력하세요..."
          value={patientInfo.chiefComplaint}
          onChange={(e) => updatePatientInfo('chiefComplaint', e.target.value)}
        />
      </div>

      {/* VAS 섹션 */}
      <div style={{
        background: '#F8FAFC',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🎯</span> VAS (Visual Analog Scale) - 통증 평가
        </h3>

        <div className="input-group">
          <label>통증 부위</label>
          <input
            type="text"
            placeholder="예: 오른쪽 어깨, 허리 등"
            value={vasData.location}
            onChange={(e) => updateVAS('location', e.target.value)}
          />
        </div>

        <div className="slider-container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem'
          }}>
            <label style={{ fontWeight: '500' }}>통증 강도</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.5rem'
            }}>
              <span style={{ fontSize: '2rem' }}>{getVASEmoji(vasData.score)}</span>
              <span style={{
                fontWeight: '700',
                fontSize: '1.5rem',
                color: vasData.score <= 3 ? '#10B981' : vasData.score <= 6 ? '#F59E0B' : '#EF4444'
              }}>
                {vasData.score}
              </span>
              <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>/ 10</span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="10"
            value={vasData.score}
            onChange={(e) => updateVAS('score', parseInt(e.target.value))}
            className="slider"
            style={{ width: '100%' }}
          />

          <div className="slider-labels">
            <span>0 (통증 없음)</span>
            <span style={{
              fontWeight: '500',
              color: vasData.score <= 3 ? '#10B981' : vasData.score <= 6 ? '#F59E0B' : '#EF4444'
            }}>
              {getVASDescription(vasData.score)}
            </span>
            <span>10 (극심한 통증)</span>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button className="btn btn-primary" onClick={handleNext}>
          다음 단계 (MAS 평가) →
        </button>
      </div>
    </div>
  );
};

export default PatientInfoPage;
