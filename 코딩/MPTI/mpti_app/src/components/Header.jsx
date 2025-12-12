const Header = () => {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #0055FF, #0041CC)',
      color: 'white',
      padding: '1rem 2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'white',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            🧠
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>MPTI</h1>
            <p style={{ fontSize: '0.75rem', opacity: 0.9, margin: 0 }}>
              Medical Physical Therapy Insight
            </p>
          </div>
        </div>
        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
          신경계 물리치료 평가 도우미
        </div>
      </div>
    </header>
  );
};

export default Header;
