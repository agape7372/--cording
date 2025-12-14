import { useState } from 'react';
import ClinicalStopwatch from '../tools/ClinicalStopwatch';
import ProMetronome from '../tools/ProMetronome';
import CadenceCalculator from '../tools/CadenceCalculator';
import DualTaskGenerator from '../tools/DualTaskGenerator';

const QuickToolsPage = ({ onBack }) => {
  const [activeTool, setActiveTool] = useState(null);

  const tools = [
    { id: 'stopwatch', name: '보행 검사', icon: '⏱️', desc: '10MWT / TUG', color: '#2563EB' },
    { id: 'metronome', name: '메트로놈', icon: '🎵', desc: '청각적 큐', color: '#8B5CF6' },
    { id: 'cadence', name: '보행수', icon: '👣', desc: 'Cadence SPM', color: '#10B981' },
    { id: 'dualtask', name: '이중 과제', icon: '🧠', desc: 'Dual Task', color: '#F59E0B' },
    { id: 'goniometer', name: '고니오미터', icon: '📐', desc: 'ROM 측정', color: '#EC4899', disabled: true },
    { id: 'level', name: '수평계', icon: '⚖️', desc: '자세 분석', color: '#06B6D4', disabled: true },
    { id: 'tremor', name: '손떨림', icon: '✋', desc: '진전 분석', color: '#EF4444', disabled: true },
    { id: 'decibel', name: '데시벨', icon: '🔊', desc: '음량 측정', color: '#84CC16', disabled: true },
    { id: 'trigger', name: '트리거포인트', icon: '📍', desc: '통증점 기록', color: '#F97316', disabled: true },
  ];

  const renderTool = () => {
    switch (activeTool) {
      case 'stopwatch':
        return <ClinicalStopwatch onClose={() => setActiveTool(null)} />;
      case 'metronome':
        return <ProMetronome onClose={() => setActiveTool(null)} />;
      case 'cadence':
        return <CadenceCalculator onClose={() => setActiveTool(null)} />;
      case 'dualtask':
        return <DualTaskGenerator onClose={() => setActiveTool(null)} />;
      default:
        return null;
    }
  };

  if (activeTool) {
    return renderTool();
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-light)',
        zIndex: 100
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          height: '64px',
          gap: '1rem'
        }}>
          <button
            onClick={onBack}
            className="btn btn-ghost btn-icon"
            style={{ fontSize: '1.25rem' }}
          >
            ←
          </button>
          <div>
            <h1 style={{ fontSize: '1.25rem', margin: 0 }}>빠른 도구</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Quick Clinical Tools
            </p>
          </div>
        </div>
      </header>

      {/* Tools Grid */}
      <div className="container" style={{ padding: '1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => !tool.disabled && setActiveTool(tool.id)}
              disabled={tool.disabled}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '1.25rem 0.75rem',
                background: tool.disabled ? 'var(--bg-secondary)' : 'var(--surface)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                cursor: tool.disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: tool.disabled ? 'none' : 'var(--shadow-sm)',
                opacity: tool.disabled ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!tool.disabled) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                background: `${tool.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                {tool.icon}
              </div>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                {tool.name}
              </span>
              <span style={{
                fontSize: '0.6875rem',
                color: 'var(--text-muted)'
              }}>
                {tool.desc}
              </span>
              {tool.disabled && (
                <span style={{
                  fontSize: '0.625rem',
                  color: 'var(--text-muted)',
                  background: 'var(--bg-secondary)',
                  padding: '0.125rem 0.375rem',
                  borderRadius: 'var(--radius-full)'
                }}>
                  준비중
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Info */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'var(--primary-bg)',
          borderRadius: 'var(--radius-md)',
          maxWidth: '500px',
          margin: '2rem auto 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span>💡</span>
            <span style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--primary)' }}>
              PNF 정량적 평가
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            환자에게 구체적인 수치로 피드백하세요.<br/>
            "지난주 0.8m/s → 오늘 1.1m/s, 정상 범위 도달!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickToolsPage;
