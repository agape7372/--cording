import { useState, useRef, useCallback, useEffect } from 'react';

const CadenceCalculator = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [currentSPM, setCurrentSPM] = useState(0);
  const [avgSPM, setAvgSPM] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [history, setHistory] = useState([]);
  const [recentTaps, setRecentTaps] = useState([]);

  const startTimeRef = useRef(null);
  const tapTimesRef = useRef([]);
  const timerRef = useRef(null);

  // 실시간 SPM 계산 (최근 5번의 탭 기준)
  const calculateRealtimeSPM = useCallback((taps) => {
    if (taps.length < 2) return 0;

    // 최근 5개의 탭만 사용
    const recentTapsArr = taps.slice(-6);
    if (recentTapsArr.length < 2) return 0;

    const intervals = [];
    for (let i = 1; i < recentTapsArr.length; i++) {
      intervals.push(recentTapsArr[i] - recentTapsArr[i - 1]);
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    return Math.round(60000 / avgInterval);
  }, []);

  // 평균 SPM 계산 (전체 시간 기준)
  const calculateAvgSPM = useCallback(() => {
    if (tapCount < 1 || elapsedTime < 1) return 0;
    return Math.round((tapCount / (elapsedTime / 1000)) * 60);
  }, [tapCount, elapsedTime]);

  // 세션 시작
  const startSession = () => {
    setIsActive(true);
    setTapCount(0);
    setCurrentSPM(0);
    setAvgSPM(0);
    setElapsedTime(0);
    setRecentTaps([]);
    startTimeRef.current = performance.now();
    tapTimesRef.current = [];

    // 타이머 시작
    timerRef.current = setInterval(() => {
      setElapsedTime(performance.now() - startTimeRef.current);
    }, 100);
  };

  // 세션 종료
  const stopSession = () => {
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // 결과 저장
    if (tapCount > 0 && avgSPM > 0) {
      const result = {
        spm: avgSPM,
        steps: tapCount,
        duration: elapsedTime / 1000,
        timestamp: new Date().toISOString()
      };
      setHistory(prev => [result, ...prev].slice(0, 10));
    }
  };

  // 탭 핸들러
  const handleTap = () => {
    if (!isActive) {
      startSession();
    }

    const now = performance.now();
    tapTimesRef.current.push(now);
    setTapCount(prev => prev + 1);

    // 실시간 SPM 업데이트
    const spm = calculateRealtimeSPM(tapTimesRef.current);
    setCurrentSPM(spm);

    // 최근 탭 표시 (애니메이션용)
    setRecentTaps(prev => [...prev, now].slice(-5));
  };

  // 평균 SPM 업데이트
  useEffect(() => {
    if (isActive) {
      setAvgSPM(calculateAvgSPM());
    }
  }, [elapsedTime, calculateAvgSPM, isActive]);

  // 클린업
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 시간 포맷
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // SPM 해석
  const interpretSPM = (spm) => {
    if (!spm || spm === 0) return null;
    if (spm >= 100 && spm <= 130) {
      return { text: '정상 범위', color: '#10B981', level: 'normal' };
    } else if (spm >= 80 && spm < 100) {
      return { text: '느린 보행', color: '#F59E0B', level: 'slow' };
    } else if (spm < 80) {
      return { text: '매우 느린 보행', color: '#EF4444', level: 'very-slow' };
    } else if (spm > 130) {
      return { text: '빠른 보행', color: '#3B82F6', level: 'fast' };
    }
    return null;
  };

  const interpretation = interpretSPM(avgSPM);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #064E3B 0%, #065F46 100%)',
      color: 'white'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            fontSize: '1.25rem',
            cursor: 'pointer'
          }}
        >
          ←
        </button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
            Cadence Calculator
          </h1>
          <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: 0 }}>
            보행수 측정 (SPM)
          </p>
        </div>
        <div style={{ width: '40px' }} />
      </header>

      {/* Main Display */}
      <div style={{
        textAlign: 'center',
        padding: '2rem 1.5rem'
      }}>
        {/* Realtime SPM */}
        <div style={{
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '0.875rem', opacity: 0.7, marginBottom: '0.5rem' }}>
            실시간 Cadence
          </div>
          <div style={{
            fontSize: '5rem',
            fontWeight: '200',
            lineHeight: '1',
            fontFamily: "'SF Mono', monospace"
          }}>
            {currentSPM || '—'}
          </div>
          <div style={{ fontSize: '1.25rem', opacity: 0.7 }}>
            SPM
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <div style={{ fontSize: '0.6875rem', opacity: 0.7 }}>평균 SPM</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{avgSPM || '—'}</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <div style={{ fontSize: '0.6875rem', opacity: 0.7 }}>걸음 수</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{tapCount}</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <div style={{ fontSize: '0.6875rem', opacity: 0.7 }}>시간</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{formatTime(elapsedTime)}</div>
          </div>
        </div>

        {/* Interpretation */}
        {interpretation && (
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1.25rem',
            background: `${interpretation.color}30`,
            borderRadius: '20px',
            color: interpretation.color,
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '2rem'
          }}>
            {interpretation.text}
          </div>
        )}

        {/* Visual Feedback - Step indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
          minHeight: '24px'
        }}>
          {recentTaps.map((tap, idx) => (
            <div
              key={tap}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#10B981',
                opacity: (idx + 1) / recentTaps.length,
                animation: 'pulse 0.5s ease-out'
              }}
            />
          ))}
        </div>
      </div>

      {/* Tap Button */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem 1.5rem',
        gap: '1rem'
      }}>
        <button
          onClick={handleTap}
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            border: '4px solid rgba(255,255,255,0.3)',
            background: isActive
              ? 'linear-gradient(145deg, #10B981, #059669)'
              : 'linear-gradient(145deg, #3B82F6, #2563EB)',
            color: 'white',
            fontSize: '3rem',
            cursor: 'pointer',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            transition: 'transform 0.1s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onTouchStart={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span>👣</span>
          <span style={{ fontSize: '0.875rem', fontWeight: '600', marginTop: '0.5rem' }}>
            {isActive ? 'TAP' : 'START'}
          </span>
        </button>

        {isActive && (
          <button
            onClick={stopSession}
            style={{
              padding: '0.875rem 2rem',
              borderRadius: '12px',
              border: '2px solid rgba(255,255,255,0.3)',
              background: 'transparent',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            ⏹ 측정 완료
          </button>
        )}
      </div>

      {/* Guide */}
      <div style={{
        padding: '1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '1rem'
        }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.5rem' }}>
            📋 측정 방법
          </div>
          <div style={{ fontSize: '0.8125rem', lineHeight: '1.6' }}>
            환자가 걸을 때마다 버튼을 탭하세요.<br/>
            최근 5번의 탭 간격을 평균 내어 실시간 SPM을 계산합니다.
          </div>
          <div style={{
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: '0.75rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem'
          }}>
            <div><span style={{ color: '#10B981' }}>●</span> 정상: 100-130 SPM</div>
            <div><span style={{ color: '#3B82F6' }}>●</span> 빠름: {'>'}130 SPM</div>
            <div><span style={{ color: '#F59E0B' }}>●</span> 느림: 80-100 SPM</div>
            <div><span style={{ color: '#EF4444' }}>●</span> 매우 느림: {'<'}80 SPM</div>
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.75rem' }}>
            최근 기록
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {history.slice(0, 5).map((record, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: interpretSPM(record.spm)?.color || 'white'
                  }}>
                    {record.spm}
                  </span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>SPM</span>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.75rem', opacity: 0.7 }}>
                  <div>{record.steps}걸음</div>
                  <div>{Math.round(record.duration)}초</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CadenceCalculator;
