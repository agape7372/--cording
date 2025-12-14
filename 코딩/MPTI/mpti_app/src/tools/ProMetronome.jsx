import { useState, useRef, useEffect, useCallback } from 'react';

const ProMetronome = ({ onClose }) => {
  const [bpm, setBpm] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visualCue, setVisualCue] = useState(true);
  const [audioCue, setAudioCue] = useState(true);
  const [beatCount, setBeatCount] = useState(0);
  const [flash, setFlash] = useState(false);
  const [tapTimes, setTapTimes] = useState([]);

  const audioContextRef = useRef(null);
  const nextNoteTimeRef = useRef(0);
  const timerIdRef = useRef(null);
  const isPlayingRef = useRef(false);

  // Web Audio API 초기화
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // 정밀한 클릭 사운드 생성
  const playClick = useCallback((time, isAccent = false) => {
    const ctx = audioContextRef.current;
    if (!ctx || !audioCue) return;

    // 오실레이터 생성 (날카로운 클릭음)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // 주파수 설정 (액센트는 더 높은 음)
    osc.frequency.value = isAccent ? 1000 : 800;
    osc.type = 'sine';

    // 엔벨로프 설정 (빠른 어택, 빠른 디케이)
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.5, time + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.start(time);
    osc.stop(time + 0.05);
  }, [audioCue]);

  // 스케줄러 (lookahead 방식으로 정확한 타이밍)
  const scheduler = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx || !isPlayingRef.current) return;

    const scheduleAheadTime = 0.1; // 100ms 미리 스케줄
    const lookahead = 25; // 25ms마다 체크

    while (nextNoteTimeRef.current < ctx.currentTime + scheduleAheadTime) {
      // 비트 재생
      playClick(nextNoteTimeRef.current, beatCount % 4 === 0);

      // 시각적 큐 (메인 스레드에서)
      const beatTime = nextNoteTimeRef.current - ctx.currentTime;
      if (visualCue && beatTime >= 0) {
        setTimeout(() => {
          setFlash(true);
          setBeatCount(prev => prev + 1);
          setTimeout(() => setFlash(false), 50);
        }, beatTime * 1000);
      }

      // 다음 비트 시간 계산
      const secondsPerBeat = 60.0 / bpm;
      nextNoteTimeRef.current += secondsPerBeat;
    }

    timerIdRef.current = setTimeout(scheduler, lookahead);
  }, [bpm, beatCount, playClick, visualCue]);

  // 시작
  const startMetronome = useCallback(() => {
    const ctx = initAudio();
    isPlayingRef.current = true;
    setIsPlaying(true);
    setBeatCount(0);

    nextNoteTimeRef.current = ctx.currentTime;
    scheduler();
  }, [initAudio, scheduler]);

  // 정지
  const stopMetronome = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setFlash(false);
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, []);

  // 토글
  const togglePlay = () => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  };

  // BPM 변경
  const changeBpm = (delta) => {
    setBpm(prev => Math.max(20, Math.min(240, prev + delta)));
  };

  // Tap Tempo
  const handleTapTempo = () => {
    const now = performance.now();
    const newTaps = [...tapTimes, now].filter(t => now - t < 3000); // 3초 내 탭만

    if (newTaps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      setBpm(Math.max(20, Math.min(240, calculatedBpm)));
    }

    setTapTimes(newTaps);
  };

  // 클린업
  useEffect(() => {
    return () => {
      stopMetronome();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopMetronome]);

  // BPM 변경 시 재시작
  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      setTimeout(() => startMetronome(), 50);
    }
  }, [bpm]);

  // 프리셋 BPM
  const presets = [
    { label: 'Slow', bpm: 40, desc: '느린 보행' },
    { label: 'Normal', bpm: 60, desc: '정상 보행' },
    { label: 'Fast', bpm: 90, desc: '빠른 보행' },
    { label: 'Quick', bpm: 120, desc: '달리기' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: flash && visualCue
        ? 'linear-gradient(180deg, #2563EB 0%, #1E40AF 100%)'
        : 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
      color: 'white',
      transition: 'background 0.05s ease'
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
            Pro Metronome
          </h1>
          <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: 0 }}>
            청각적 보행 훈련
          </p>
        </div>
        <div style={{ width: '40px' }} />
      </header>

      {/* BPM Display */}
      <div style={{
        textAlign: 'center',
        padding: '3rem 1.5rem 2rem'
      }}>
        <div style={{
          fontSize: '6rem',
          fontWeight: '200',
          lineHeight: '1',
          marginBottom: '0.5rem',
          fontFamily: "'SF Mono', monospace"
        }}>
          {bpm}
        </div>
        <div style={{ fontSize: '1.25rem', opacity: 0.7, letterSpacing: '0.2em' }}>
          BPM
        </div>
        {isPlaying && (
          <div style={{
            marginTop: '1rem',
            fontSize: '1rem',
            opacity: 0.5
          }}>
            Beat #{beatCount}
          </div>
        )}
      </div>

      {/* BPM Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '1rem 1.5rem'
      }}>
        <button
          onClick={() => changeBpm(-10)}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            border: 'none',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          -10
        </button>
        <button
          onClick={() => changeBpm(-1)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            border: 'none',
            background: 'rgba(255,255,255,0.15)',
            color: 'white',
            fontSize: '1.75rem',
            cursor: 'pointer'
          }}
        >
          −
        </button>
        <button
          onClick={() => changeBpm(1)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            border: 'none',
            background: 'rgba(255,255,255,0.15)',
            color: 'white',
            fontSize: '1.75rem',
            cursor: 'pointer'
          }}
        >
          +
        </button>
        <button
          onClick={() => changeBpm(10)}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            border: 'none',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          +10
        </button>
      </div>

      {/* Slider */}
      <div style={{ padding: '1rem 2rem' }}>
        <input
          type="range"
          min="20"
          max="240"
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value))}
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            background: `linear-gradient(to right, #2563EB ${((bpm - 20) / 220) * 100}%, rgba(255,255,255,0.2) 0%)`,
            appearance: 'none',
            outline: 'none',
            cursor: 'pointer'
          }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          opacity: 0.5,
          marginTop: '0.5rem'
        }}>
          <span>20</span>
          <span>120</span>
          <span>240</span>
        </div>
      </div>

      {/* Play Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '1.5rem'
      }}>
        <button
          onClick={togglePlay}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: 'none',
            background: isPlaying ? '#EF4444' : '#10B981',
            color: 'white',
            fontSize: '2.5rem',
            cursor: 'pointer',
            boxShadow: `0 0 40px ${isPlaying ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}`,
            transition: 'all 0.2s'
          }}
        >
          {isPlaying ? '⏹' : '▶'}
        </button>
      </div>

      {/* Tap Tempo */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <button
          onClick={handleTapTempo}
          style={{
            padding: '0.875rem 2rem',
            borderRadius: '12px',
            border: '2px solid rgba(255,255,255,0.2)',
            background: 'transparent',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          👆 Tap Tempo
        </button>
      </div>

      {/* Options */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        padding: '1rem 1.5rem'
      }}>
        <button
          onClick={() => setVisualCue(!visualCue)}
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            border: 'none',
            background: visualCue ? '#2563EB' : 'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          👁️ 시각 큐 {visualCue ? 'ON' : 'OFF'}
        </button>
        <button
          onClick={() => setAudioCue(!audioCue)}
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            border: 'none',
            background: audioCue ? '#2563EB' : 'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          🔊 청각 큐 {audioCue ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Presets */}
      <div style={{
        padding: '1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          fontSize: '0.75rem',
          opacity: 0.7,
          marginBottom: '0.75rem',
          textAlign: 'center'
        }}>
          프리셋
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.5rem'
        }}>
          {presets.map((preset) => (
            <button
              key={preset.bpm}
              onClick={() => setBpm(preset.bpm)}
              style={{
                padding: '0.75rem 0.5rem',
                borderRadius: '10px',
                border: bpm === preset.bpm ? '2px solid #2563EB' : '1px solid rgba(255,255,255,0.1)',
                background: bpm === preset.bpm ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.05)',
                color: 'white',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1rem', fontWeight: '600' }}>{preset.bpm}</div>
              <div style={{ fontSize: '0.625rem', opacity: 0.7, marginTop: '0.125rem' }}>
                {preset.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Clinical Info */}
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
            💡 임상 적용
          </div>
          <div style={{ fontSize: '0.8125rem', lineHeight: '1.6' }}>
            <strong>청각적 큐잉</strong>은 파킨슨병 환자의 보행 동결(Freezing of Gait)을
            개선하는데 효과적입니다. 환자의 선호 케이던스보다 10-15% 빠른 BPM으로
            시작하세요.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProMetronome;
