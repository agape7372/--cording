import { useState, useRef, useEffect, useCallback } from 'react';

const ClinicalStopwatch = ({ onClose }) => {
  const [mode, setMode] = useState('10mwt'); // '10mwt' | 'tug'
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState([]); // TUG용 구간 기록
  const [history, setHistory] = useState([]);

  const startTimeRef = useRef(null);
  const rafRef = useRef(null);
  const pausedTimeRef = useRef(0);

  // 고정밀 타이머 (requestAnimationFrame + performance.now)
  const updateTimer = useCallback(() => {
    if (startTimeRef.current !== null) {
      const now = performance.now();
      setElapsedTime(pausedTimeRef.current + (now - startTimeRef.current));
      rafRef.current = requestAnimationFrame(updateTimer);
    }
  }, []);

  const startTimer = () => {
    if (!isRunning) {
      startTimeRef.current = performance.now();
      setIsRunning(true);
      rafRef.current = requestAnimationFrame(updateTimer);
    }
  };

  const pauseTimer = () => {
    if (isRunning) {
      pausedTimeRef.current = elapsedTime;
      startTimeRef.current = null;
      setIsRunning(false);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    }
  };

  const resetTimer = () => {
    pauseTimer();
    setElapsedTime(0);
    pausedTimeRef.current = 0;
    setLaps([]);
  };

  const recordLap = (label) => {
    if (isRunning) {
      setLaps(prev => [...prev, { label, time: elapsedTime }]);
    }
  };

  const saveResult = () => {
    if (elapsedTime > 0) {
      const result = {
        mode,
        time: elapsedTime,
        speed: mode === '10mwt' ? (10 / (elapsedTime / 1000)).toFixed(2) : null,
        laps: mode === 'tug' ? [...laps] : null,
        timestamp: new Date().toISOString()
      };
      setHistory(prev => [result, ...prev].slice(0, 10));
      resetTimer();
    }
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // 시간 포맷팅 (분:초.밀리초)
  const formatTime = (ms, showMs = true) => {
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor((ms % 1000) / 10);

    if (showMs) {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 보행 속도 계산 (10MWT)
  const calculateGaitSpeed = () => {
    if (elapsedTime === 0) return null;
    const speed = 10 / (elapsedTime / 1000);
    return speed.toFixed(2);
  };

  // 보행 속도 해석
  const interpretGaitSpeed = (speed) => {
    if (!speed) return null;
    const s = parseFloat(speed);
    if (s >= 1.2) return { text: '정상 (Community Ambulator)', color: '#10B981', level: 'normal' };
    if (s >= 0.8) return { text: '제한적 지역사회 보행', color: '#F59E0B', level: 'limited' };
    if (s >= 0.4) return { text: '가정 내 보행', color: '#EF4444', level: 'household' };
    return { text: '심각한 보행 장애', color: '#DC2626', level: 'severe' };
  };

  const gaitSpeed = calculateGaitSpeed();
  const interpretation = interpretGaitSpeed(gaitSpeed);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
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
            Clinical Stopwatch
          </h1>
          <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: 0 }}>
            고정밀 임상 타이머
          </p>
        </div>
        <div style={{ width: '40px' }} />
      </header>

      {/* Mode Selector */}
      <div style={{ padding: '1rem 1.5rem' }}>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.25rem',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px'
        }}>
          <button
            onClick={() => { setMode('10mwt'); resetTimer(); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              borderRadius: '10px',
              background: mode === '10mwt' ? '#2563EB' : 'transparent',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            10MWT
          </button>
          <button
            onClick={() => { setMode('tug'); resetTimer(); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              borderRadius: '10px',
              background: mode === 'tug' ? '#2563EB' : 'transparent',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            TUG
          </button>
        </div>
      </div>

      {/* Timer Display */}
      <div style={{
        textAlign: 'center',
        padding: '2rem 1.5rem',
      }}>
        <div style={{
          fontFamily: "'SF Mono', 'Roboto Mono', monospace",
          fontSize: '4rem',
          fontWeight: '300',
          letterSpacing: '-2px',
          marginBottom: '1rem'
        }}>
          {formatTime(elapsedTime)}
        </div>

        {/* 10MWT 결과 표시 */}
        {mode === '10mwt' && gaitSpeed && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>보행 속도</span>
              <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: interpretation?.color || 'white'
              }}>
                {gaitSpeed}
                <span style={{ fontSize: '1.5rem', fontWeight: '400', marginLeft: '0.25rem' }}>
                  m/s
                </span>
              </div>
            </div>
            {interpretation && (
              <div style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                background: `${interpretation.color}20`,
                borderRadius: '20px',
                color: interpretation.color,
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {interpretation.text}
              </div>
            )}
          </div>
        )}

        {/* TUG 구간 기록 */}
        {mode === 'tug' && laps.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.75rem' }}>
              구간 기록
            </div>
            {laps.map((lap, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: idx < laps.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
              }}>
                <span style={{ fontWeight: '500' }}>{lap.label}</span>
                <span style={{ fontFamily: 'monospace' }}>{formatTime(lap.time)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div style={{ padding: '1rem 1.5rem' }}>
        {mode === '10mwt' ? (
          /* 10MWT 컨트롤 */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!isRunning && elapsedTime === 0 ? (
              <button
                onClick={startTimer}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  background: '#10B981',
                  border: 'none',
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ▶  시작
              </button>
            ) : !isRunning && elapsedTime > 0 ? (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={startTimer}
                  style={{
                    flex: 1,
                    padding: '1.25rem',
                    background: '#10B981',
                    border: 'none',
                    borderRadius: '16px',
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ▶  재개
                </button>
                <button
                  onClick={saveResult}
                  style={{
                    flex: 1,
                    padding: '1.25rem',
                    background: '#2563EB',
                    border: 'none',
                    borderRadius: '16px',
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  💾  저장
                </button>
              </div>
            ) : (
              <button
                onClick={pauseTimer}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  background: '#EF4444',
                  border: 'none',
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ⏹  정지
              </button>
            )}
            {elapsedTime > 0 && (
              <button
                onClick={resetTimer}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                🔄  초기화
              </button>
            )}
          </div>
        ) : (
          /* TUG 컨트롤 */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!isRunning && elapsedTime === 0 ? (
              <button
                onClick={startTimer}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  background: '#10B981',
                  border: 'none',
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ▶  Start (일어서기)
              </button>
            ) : isRunning ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    onClick={() => recordLap('Turn')}
                    disabled={laps.some(l => l.label === 'Turn')}
                    style={{
                      padding: '1rem',
                      background: laps.some(l => l.label === 'Turn') ? 'rgba(255,255,255,0.1)' : '#F59E0B',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: laps.some(l => l.label === 'Turn') ? 'not-allowed' : 'pointer',
                      opacity: laps.some(l => l.label === 'Turn') ? 0.5 : 1
                    }}
                  >
                    🔄 Turn
                  </button>
                  <button
                    onClick={() => recordLap('Back')}
                    disabled={!laps.some(l => l.label === 'Turn') || laps.some(l => l.label === 'Back')}
                    style={{
                      padding: '1rem',
                      background: (!laps.some(l => l.label === 'Turn') || laps.some(l => l.label === 'Back')) ? 'rgba(255,255,255,0.1)' : '#8B5CF6',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: (!laps.some(l => l.label === 'Turn') || laps.some(l => l.label === 'Back')) ? 'not-allowed' : 'pointer',
                      opacity: (!laps.some(l => l.label === 'Turn') || laps.some(l => l.label === 'Back')) ? 0.5 : 1
                    }}
                  >
                    ↩️ Back
                  </button>
                </div>
                <button
                  onClick={() => { recordLap('Sit'); pauseTimer(); }}
                  style={{
                    width: '100%',
                    padding: '1.25rem',
                    background: '#EF4444',
                    border: 'none',
                    borderRadius: '16px',
                    color: 'white',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  🪑  Sit (완료)
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={saveResult}
                  style={{
                    flex: 1,
                    padding: '1.25rem',
                    background: '#2563EB',
                    border: 'none',
                    borderRadius: '16px',
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  💾  저장
                </button>
                <button
                  onClick={resetTimer}
                  style={{
                    flex: 1,
                    padding: '1.25rem',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '16px',
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  🔄  초기화
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* TUG 가이드 */}
      {mode === 'tug' && (
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.5rem' }}>
              TUG 검사 절차
            </div>
            <div style={{ fontSize: '0.8125rem', lineHeight: '1.6' }}>
              1. Start: 의자에서 일어남<br/>
              2. Turn: 3m 지점에서 회전<br/>
              3. Back: 돌아와서<br/>
              4. Sit: 다시 앉음
            </div>
            <div style={{
              marginTop: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.75rem'
            }}>
              <div style={{ color: '#10B981' }}>{'<'}10초: 정상</div>
              <div style={{ color: '#F59E0B' }}>10-20초: 낙상 위험</div>
              <div style={{ color: '#EF4444' }}>{'>'}20초: 높은 낙상 위험</div>
            </div>
          </div>
        </div>
      )}

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
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.125rem 0.5rem',
                    background: record.mode === '10mwt' ? '#2563EB' : '#8B5CF6',
                    borderRadius: '4px',
                    fontSize: '0.625rem',
                    fontWeight: '600',
                    marginRight: '0.5rem'
                  }}>
                    {record.mode.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    {formatTime(record.time)}
                  </span>
                </div>
                {record.speed && (
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: interpretGaitSpeed(record.speed)?.color
                  }}>
                    {record.speed} m/s
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalStopwatch;
