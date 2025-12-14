import { useState, useRef, useCallback, useEffect } from 'react';

const DualTaskGenerator = ({ onClose }) => {
  const [mode, setMode] = useState('math'); // 'math' | 'words' | 'colors'
  const [isRunning, setIsRunning] = useState(false);
  const [interval, setIntervalTime] = useState(5); // 초
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [mathNumber, setMathNumber] = useState(100); // Serial 7s 시작 숫자
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(0.9); // 말하기 속도
  const [showAnswer, setShowAnswer] = useState(false);
  const [history, setHistory] = useState([]);

  const timerRef = useRef(null);
  const speechRef = useRef(null);

  // 단어 데이터
  const wordCategories = {
    animals: ['호랑이', '사자', '코끼리', '기린', '원숭이', '펭귄', '독수리', '상어', '돌고래', '토끼', '사슴', '늑대', '여우', '곰', '판다'],
    fruits: ['사과', '바나나', '오렌지', '포도', '딸기', '수박', '참외', '복숭아', '배', '감', '키위', '망고', '파인애플', '체리', '블루베리'],
    colors: ['빨강', '파랑', '노랑', '초록', '보라', '주황', '분홍', '하양', '검정', '회색', '갈색', '남색'],
    cities: ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '수원', '제주', '춘천', '전주', '경주', '속초', '강릉', '목포']
  };

  // 색상 데이터 (시각적 표시용)
  const colorData = [
    { name: '빨강', hex: '#EF4444' },
    { name: '파랑', hex: '#3B82F6' },
    { name: '노랑', hex: '#FCD34D' },
    { name: '초록', hex: '#10B981' },
    { name: '보라', hex: '#8B5CF6' },
    { name: '주황', hex: '#F97316' },
    { name: '분홍', hex: '#EC4899' },
  ];

  // TTS 말하기
  const speak = useCallback((text) => {
    if (speechRef.current) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.volume = volume;
    utterance.rate = rate;
    utterance.pitch = 1;

    // 한국어 음성 찾기
    const voices = speechSynthesis.getVoices();
    const koreanVoice = voices.find(voice =>
      voice.lang.includes('ko') || voice.name.includes('Korean')
    );
    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [volume, rate]);

  // 수학 문제 생성 (Serial 7s)
  const generateMathQuestion = useCallback(() => {
    const answer = mathNumber - 7;
    const question = {
      type: 'math',
      display: `${mathNumber} - 7 = ?`,
      speak: `${mathNumber}에서 7을 빼면?`,
      answer: answer.toString()
    };
    setMathNumber(answer > 0 ? answer : 100); // 0 이하면 리셋
    return question;
  }, [mathNumber]);

  // 단어 문제 생성
  const generateWordQuestion = useCallback(() => {
    const categories = Object.keys(wordCategories);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const categoryKorean = {
      animals: '동물',
      fruits: '과일',
      colors: '색깔',
      cities: '도시'
    };

    return {
      type: 'words',
      display: `${categoryKorean[category]} 이름을 말해보세요`,
      speak: `${categoryKorean[category]} 이름을 하나 말해보세요`,
      answer: wordCategories[category][Math.floor(Math.random() * wordCategories[category].length)]
    };
  }, []);

  // 색상 문제 생성 (스트룹 효과)
  const generateColorQuestion = useCallback(() => {
    const textColor = colorData[Math.floor(Math.random() * colorData.length)];
    const displayColor = colorData[Math.floor(Math.random() * colorData.length)];

    return {
      type: 'colors',
      display: textColor.name,
      displayColor: displayColor.hex,
      speak: `글자의 색깔은 무엇입니까?`,
      answer: displayColor.name
    };
  }, []);

  // 문제 생성
  const generateQuestion = useCallback(() => {
    let question;
    switch (mode) {
      case 'math':
        question = generateMathQuestion();
        break;
      case 'words':
        question = generateWordQuestion();
        break;
      case 'colors':
        question = generateColorQuestion();
        break;
      default:
        question = generateMathQuestion();
    }

    setCurrentQuestion(question);
    setQuestionCount(prev => prev + 1);
    setShowAnswer(false);
    speak(question.speak);

    // 기록 저장
    setHistory(prev => [question, ...prev].slice(0, 20));
  }, [mode, generateMathQuestion, generateWordQuestion, generateColorQuestion, speak]);

  // 시작
  const startSession = () => {
    setIsRunning(true);
    setQuestionCount(0);
    setMathNumber(100);
    setHistory([]);
    generateQuestion();

    timerRef.current = setInterval(() => {
      generateQuestion();
    }, interval * 1000);
  };

  // 정지
  const stopSession = () => {
    setIsRunning(false);
    setCurrentQuestion(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    speechSynthesis.cancel();
  };

  // 다음 문제 (수동)
  const nextQuestion = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    generateQuestion();
    timerRef.current = setInterval(() => {
      generateQuestion();
    }, interval * 1000);
  };

  // 클린업
  useEffect(() => {
    // 음성 목록 로드
    speechSynthesis.getVoices();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      speechSynthesis.cancel();
    };
  }, []);

  // 모드 변경 시 리셋
  useEffect(() => {
    if (isRunning) {
      stopSession();
    }
    setMathNumber(100);
  }, [mode]);

  const modeConfig = {
    math: { icon: '🔢', name: '산수 (Serial 7s)', desc: '100에서 7씩 빼기' },
    words: { icon: '💬', name: '단어 생성', desc: '카테고리별 단어 말하기' },
    colors: { icon: '🎨', name: '색깔 (스트룹)', desc: '글자 색깔 말하기' }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #78350F 0%, #92400E 100%)',
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
            Dual Task Generator
          </h1>
          <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: 0 }}>
            인지-운동 이중 과제
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
          {Object.entries(modeConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              disabled={isRunning}
              style={{
                flex: 1,
                padding: '0.75rem 0.5rem',
                border: 'none',
                borderRadius: '10px',
                background: mode === key ? '#F59E0B' : 'transparent',
                color: 'white',
                fontWeight: '600',
                fontSize: '0.75rem',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: isRunning && mode !== key ? 0.5 : 1
              }}
            >
              <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{config.icon}</div>
              {config.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Question Display */}
      <div style={{
        textAlign: 'center',
        padding: '2rem 1.5rem',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {currentQuestion ? (
          <>
            {currentQuestion.type === 'colors' ? (
              <div style={{
                fontSize: '4rem',
                fontWeight: '700',
                color: currentQuestion.displayColor,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                {currentQuestion.display}
              </div>
            ) : (
              <div style={{
                fontSize: currentQuestion.type === 'math' ? '3rem' : '2rem',
                fontWeight: '600',
                lineHeight: '1.3'
              }}>
                {currentQuestion.display}
              </div>
            )}

            {showAnswer && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                background: 'rgba(16,185,129,0.2)',
                borderRadius: '12px',
                color: '#10B981',
                fontWeight: '600'
              }}>
                정답: {currentQuestion.answer}
              </div>
            )}

            <div style={{
              marginTop: '1.5rem',
              fontSize: '0.875rem',
              opacity: 0.7
            }}>
              문제 #{questionCount}
            </div>
          </>
        ) : (
          <div style={{ opacity: 0.7 }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</div>
            <div>시작 버튼을 눌러주세요</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem 1.5rem',
        gap: '1rem'
      }}>
        {!isRunning ? (
          <button
            onClick={startSession}
            style={{
              width: '100%',
              maxWidth: '300px',
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
        ) : (
          <>
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              width: '100%',
              maxWidth: '300px'
            }}>
              <button
                onClick={() => setShowAnswer(true)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                👁️ 정답
              </button>
              <button
                onClick={nextQuestion}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: '#F59E0B',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ⏭️ 다음
              </button>
            </div>
            <button
              onClick={stopSession}
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '1rem',
                background: '#EF4444',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ⏹ 정지
            </button>
          </>
        )}

        {/* Repeat current question */}
        {isRunning && currentQuestion && (
          <button
            onClick={() => speak(currentQuestion.speak)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            🔊 다시 듣기
          </button>
        )}
      </div>

      {/* Settings */}
      <div style={{
        padding: '1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '1rem'
        }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '1rem' }}>
            ⚙️ 설정
          </div>

          {/* Interval */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontSize: '0.875rem' }}>문제 간격</span>
              <span style={{ fontWeight: '600' }}>{interval}초</span>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              value={interval}
              onChange={(e) => setIntervalTime(parseInt(e.target.value))}
              disabled={isRunning}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: `linear-gradient(to right, #F59E0B ${((interval - 3) / 12) * 100}%, rgba(255,255,255,0.2) 0%)`,
                appearance: 'none',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                opacity: isRunning ? 0.5 : 1
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.625rem',
              opacity: 0.5,
              marginTop: '0.25rem'
            }}>
              <span>3초</span>
              <span>15초</span>
            </div>
          </div>

          {/* Speech Rate */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontSize: '0.875rem' }}>말하기 속도</span>
              <span style={{ fontWeight: '600' }}>{rate.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: `linear-gradient(to right, #F59E0B ${((rate - 0.5) / 1) * 100}%, rgba(255,255,255,0.2) 0%)`,
                appearance: 'none',
                cursor: 'pointer'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.625rem',
              opacity: 0.5,
              marginTop: '0.25rem'
            }}>
              <span>느리게</span>
              <span>빠르게</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Description */}
      <div style={{
        padding: '0 1.5rem 1.5rem'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '1rem'
        }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.5rem' }}>
            💡 {modeConfig[mode].name}
          </div>
          <div style={{ fontSize: '0.8125rem', lineHeight: '1.6' }}>
            {mode === 'math' && (
              <>
                <strong>Serial 7s Test</strong> - 100에서 시작하여 7씩 빼는 계산을 합니다.
                인지 기능 평가에 널리 사용되며, 보행과 함께 수행 시 이중 과제 비용(Dual-Task Cost)을 측정할 수 있습니다.
              </>
            )}
            {mode === 'words' && (
              <>
                <strong>Verbal Fluency</strong> - 주어진 카테고리에 맞는 단어를 말합니다.
                의미적 언어 유창성을 평가하며, 전두엽 기능과 관련됩니다.
              </>
            )}
            {mode === 'colors' && (
              <>
                <strong>Stroop Test</strong> - 글자의 색깔을 말합니다 (글자 내용 무시).
                선택적 주의력과 인지적 유연성을 평가합니다. 색깔 이름과 글자 색이 다를 때 더 어렵습니다.
              </>
            )}
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && !isRunning && (
        <div style={{
          padding: '0 1.5rem 1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.75rem', paddingTop: '1rem' }}>
            최근 문제 ({history.length}개)
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {history.slice(0, 10).map((q, idx) => (
              <div key={idx} style={{
                padding: '0.375rem 0.75rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                fontSize: '0.75rem'
              }}>
                {q.answer}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DualTaskGenerator;
