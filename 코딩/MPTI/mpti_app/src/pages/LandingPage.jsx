const LandingPage = ({ onNavigate }) => {
  const features = [
    {
      icon: '📋',
      title: '스마트 평가',
      description: 'BBS, MMT, ROM, MAS, VAS 등 주요 평가도구를 한 곳에서 체계적으로 관리'
    },
    {
      icon: '🤖',
      title: 'SOAP 자동 생성',
      description: '평가 결과를 입력하면 AI가 SOAP 노트 초안을 자동으로 작성'
    },
    {
      icon: '📊',
      title: '환자 관리',
      description: '담당 환자의 평가 기록과 기능 변화를 한눈에 파악'
    },
    {
      icon: '⚡',
      title: '빠른 입력',
      description: '"모두 정상" 버튼으로 시간 단축, 터치 최적화 UI'
    }
  ];

  const stats = [
    { value: '5+', label: '평가 도구' },
    { value: '14', label: 'BBS 문항' },
    { value: '100%', label: '무료' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-light)',
        zIndex: 100
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              🧠
            </div>
            <span style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              MPTI
            </span>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => onNavigate('patients')}
          >
            시작하기
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        paddingTop: '120px',
        paddingBottom: '80px',
        background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--surface) 100%)'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'var(--primary-bg)',
            borderRadius: 'var(--radius-full)',
            marginBottom: '1.5rem'
          }}>
            <span style={{ fontSize: '0.875rem' }}>🎉</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: '500' }}>
              신경계 물리치료사를 위한 스마트 솔루션
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: '700',
            lineHeight: '1.2',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, var(--text-primary), var(--primary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            더 빠른 평가,<br />더 나은 치료
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.7'
          }}>
            뇌졸중, 척수손상, 파킨슨 환자 평가를 한 곳에서.<br />
            SOAP 노트 자동 생성으로 퇴근 시간을 앞당기세요.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('patients')}
              style={{ gap: '0.75rem' }}
            >
              <span>환자 관리 시작</span>
              <span>→</span>
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => {
                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
              }}
            >
              기능 살펴보기
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            marginTop: '4rem',
            flexWrap: 'wrap'
          }}>
            {stats.map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  lineHeight: '1'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.5rem'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '80px 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>강력한 기능</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
              신경계 물리치료에 최적화된 평가 도구
            </p>
          </div>

          <div className="grid grid-4" style={{ gap: '1.5rem' }}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="card"
                style={{
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'default'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'var(--primary-bg)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  margin: '0 auto 1rem'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Tools Preview */}
      <section style={{ padding: '80px 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>지원 평가 도구</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
              신경계 환자 평가에 필요한 모든 것
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {[
              { name: 'BBS', full: 'Berg Balance Scale', desc: '균형 능력 평가 (14문항)' },
              { name: 'MMT', full: 'Manual Muscle Testing', desc: '전신 근력 평가' },
              { name: 'ROM', full: 'Range of Motion', desc: '관절가동범위 측정' },
              { name: 'MAS', full: 'Modified Ashworth Scale', desc: '경직 평가 (G0~G4)' },
              { name: 'VAS', full: 'Visual Analog Scale', desc: '통증 강도 평가' }
            ].map((tool, index) => (
              <div
                key={index}
                style={{
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  border: '1px solid var(--border-light)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.5rem'
                }}>
                  <span className="badge badge-primary" style={{ fontWeight: '600' }}>
                    {tool.name}
                  </span>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  {tool.full}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {tool.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
        color: 'white'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>
            지금 바로 시작하세요
          </h2>
          <p style={{ opacity: 0.9, marginBottom: '2rem', fontSize: '1.125rem' }}>
            환자 평가와 차팅을 더 스마트하게
          </p>
          <button
            className="btn btn-lg"
            onClick={() => onNavigate('patients')}
            style={{
              background: 'white',
              color: 'var(--primary)',
              fontWeight: '600'
            }}
          >
            무료로 시작하기
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '2rem 0',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border-light)'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🧠</span>
            <span style={{ fontWeight: '600' }}>MPTI</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Medical Physical Therapy Insight
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            신경계 물리치료 평가 도우미 | v1.0
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
