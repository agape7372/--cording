import { useAssessment } from '../context/AssessmentContext';
import { BBS_ITEMS, getBBSInterpretation } from '../data/assessmentData';

const BBSPage = () => {
  const { bbsData, updateBBS, calculateBBSTotal, setCurrentStep } = useAssessment();

  const totalScore = calculateBBSTotal();
  const interpretation = getBBSInterpretation(totalScore);
  const completedItems = Object.keys(bbsData).length;

  return (
    <div className="card">
      <h2 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>⚖️</span> BBS (Berg Balance Scale) - 균형 평가
      </h2>
      <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
        14개 문항을 평가합니다. 총점: 0~56점
      </p>

      {/* 실시간 점수 표시 */}
      <div style={{
        background: `linear-gradient(135deg, ${interpretation.color}20, ${interpretation.color}10)`,
        border: `1px solid ${interpretation.color}40`,
        borderRadius: '12px',
        padding: '1rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>현재 점수</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: interpretation.color }}>
            {totalScore} <span style={{ fontSize: '1rem', fontWeight: '400' }}>/ 56</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            background: `${interpretation.color}20`,
            color: interpretation.color,
            fontWeight: '600',
            fontSize: '0.875rem'
          }}>
            {interpretation.kr}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.5rem' }}>
            완료: {completedItems} / 14 문항
          </div>
        </div>
      </div>

      {/* BBS 문항 리스트 */}
      <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
        {BBS_ITEMS.map((item, index) => {
          const selectedScore = bbsData[item.id];
          const isCompleted = selectedScore !== undefined;

          return (
            <div
              key={item.id}
              style={{
                border: `1px solid ${isCompleted ? '#10B981' : '#E5E7EB'}`,
                borderRadius: '12px',
                marginBottom: '1rem',
                overflow: 'hidden',
                background: isCompleted ? 'rgba(16, 185, 129, 0.02)' : 'white'
              }}
            >
              {/* 문항 헤더 */}
              <div style={{
                background: isCompleted ? 'rgba(16, 185, 129, 0.1)' : '#F9FAFB',
                padding: '1rem',
                borderBottom: '1px solid #E5E7EB'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isCompleted ? '#10B981' : '#6B7280',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      {item.kr}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
                      {item.description}
                    </div>
                  </div>
                  {isCompleted && (
                    <div style={{
                      background: '#10B981',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {selectedScore}점
                    </div>
                  )}
                </div>
              </div>

              {/* 점수 옵션 */}
              <div style={{ padding: '1rem' }}>
                {item.options.map((option) => (
                  <label
                    key={option.score}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      marginBottom: '0.5rem',
                      background: selectedScore === option.score ? 'rgba(0, 85, 255, 0.08)' : 'transparent',
                      border: selectedScore === option.score ? '1px solid #0055FF' : '1px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="radio"
                      name={`bbs-${item.id}`}
                      checked={selectedScore === option.score}
                      onChange={() => updateBBS(item.id, option.score)}
                      style={{
                        width: '18px',
                        height: '18px',
                        marginTop: '2px',
                        accentColor: '#0055FF'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <span style={{
                        fontWeight: '600',
                        color: selectedScore === option.score ? '#0055FF' : '#374151',
                        marginRight: '0.5rem'
                      }}>
                        {option.score}점
                      </span>
                      <span style={{
                        fontSize: '0.875rem',
                        color: selectedScore === option.score ? '#4D8AFF' : '#6B7280'
                      }}>
                        {option.label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* BBS 해석 가이드 */}
      <div style={{
        background: '#FEF3C7',
        borderRadius: '8px',
        padding: '1rem',
        marginTop: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: '#92400E' }}>
          📖 BBS 점수 해석
        </h4>
        <div style={{ fontSize: '0.75rem', color: '#78350F', lineHeight: '1.8' }}>
          <div><strong style={{ color: '#EF4444' }}>0~20점:</strong> 높은 낙상 위험 (휠체어 사용 권장)</div>
          <div><strong style={{ color: '#F59E0B' }}>21~40점:</strong> 중등도 낙상 위험 (보조기 보행 권장)</div>
          <div><strong style={{ color: '#10B981' }}>41~56점:</strong> 낮은 낙상 위험 (독립 보행 가능)</div>
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
        <button className="btn btn-secondary" onClick={() => setCurrentStep(3)}>
          ← 이전 (ROM 평가)
        </button>
        <button
          className="btn btn-success"
          onClick={() => setCurrentStep(5)}
          style={{ background: '#10B981' }}
        >
          📊 결과 리포트 보기 →
        </button>
      </div>
    </div>
  );
};

export default BBSPage;
