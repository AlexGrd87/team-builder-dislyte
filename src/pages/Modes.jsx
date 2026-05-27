import { useState } from 'react'
import { MODES } from '../data/modes.js'
import { ESPERS, ELEMENTS, ROLES } from '../data/espers.js'
import { useIsMobile } from '../hooks/useMobile.js'

export default function Modes({ onNavigate }) {
  const isMobile = useIsMobile()
  const [selected, setSelected] = useState('histoire')
  const mode = MODES.find(m => m.id === selected)

  return (
    <div className="page" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div className="section-header" style={{ marginBottom: '36px' }}>
        <div>
          <h1 className="section-title" style={{ color: 'var(--inferno, #ff5252)' }}>Guide des Modes</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Mécaniques · Stratégies · Teams recommandées
          </p>
        </div>
        <div className="section-header-line" style={{ background: 'linear-gradient(90deg, rgba(255,82,82,0.3), transparent)' }} />
      </div>

      {isMobile ? (
        /* ── Mobile : tabs horizontaux scrollables ── */
        <div>
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '12px',
            marginBottom: '20px',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}>
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setSelected(m.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: selected === m.id ? '1px solid rgba(255,45,135,0.4)' : '1px solid var(--border)',
                  background: selected === m.id ? 'rgba(255,45,135,0.12)' : 'var(--bg-card)',
                  color: selected === m.id ? 'var(--pink)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '12px',
                  fontWeight: selected === m.id ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 150ms',
                }}
              >
                <span>{m.icon}</span>
                {m.name.replace('Miracle Rituel : ', '').replace('Miracle Rituel: ', '')}
              </button>
            ))}
          </div>
          {mode && (
            <div className="animate-fade" key={mode.id}>
              <ModeDetail mode={mode} onNavigate={onNavigate} />
            </div>
          )}
        </div>
      ) : (
        /* ── Desktop : sidebar + contenu ── */
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setSelected(m.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: selected === m.id ? '1px solid rgba(255,45,135,0.3)' : '1px solid transparent',
                  background: selected === m.id ? 'rgba(255,45,135,0.06)' : 'transparent',
                  color: selected === m.id ? 'var(--pink)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: selected === m.id ? 700 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 150ms',
                }}
                onMouseEnter={e => {
                  if (selected !== m.id) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.color = 'var(--text-primary)'
                  }
                }}
                onMouseLeave={e => {
                  if (selected !== m.id) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--text-secondary)'
                  }
                }}
              >
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{m.icon}</span>
                <div>
                  <div style={{ lineHeight: 1.2 }}>{m.name.replace('Miracle Rituel : ', '')}</div>
                  <div style={{ fontSize: '10px', opacity: 0.6, marginTop: '2px' }}>{m.type}</div>
                </div>
              </button>
            ))}
          </div>
          {mode && (
            <div className="animate-fade" key={mode.id}>
              <ModeDetail mode={mode} onNavigate={onNavigate} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ModeDetail({ mode, onNavigate }) {
  const recommendedEspers = mode.recommendedEspers
    ? mode.recommendedEspers.map(id => ESPERS.find(e => e.id === id)).filter(Boolean)
    : []

  const typeColors = {
    'PvE': 'var(--pink)',
    'PvE Boss': 'var(--inferno)',
    'PvP': 'var(--purple)',
    'PvE Rogue': 'var(--wind)',
    'PvE Escalade': 'var(--gold)',
    'PvE Endurance': '#ff6040',
    'Mini-jeu': '#40c0ff',
    'PvE Auto': 'var(--shimmer)',
  }
  const typeColor = typeColors[mode.type] || 'var(--pink)'

  return (
    <div>
      {/* Header */}
      <div className="card" style={{ padding: '32px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
        {/* BG decoration */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          fontSize: '120px',
          opacity: 0.06,
          lineHeight: 1,
          userSelect: 'none',
        }}>{mode.icon}</div>

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '36px' }}>{mode.icon}</span>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 3vw, 24px)', letterSpacing: '1px' }}>
                {mode.name}
              </h2>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '20px',
                  background: `${typeColor}15`,
                  border: `1px solid ${typeColor}40`,
                  fontSize: '11px',
                  color: typeColor,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  letterSpacing: '1px',
                }}>{mode.type}</span>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border)',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-ui)',
                }}>Difficulté : {mode.difficulty}</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {mode.description}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        {/* Rewards */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--gold)', letterSpacing: '2px', marginBottom: '14px' }}>
            💎 RÉCOMPENSES
          </div>
          {mode.rewards.map((reward, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
              marginBottom: '8px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}>
              <span style={{ color: 'var(--gold)', flexShrink: 0 }}>▹</span>
              {reward}
            </div>
          ))}
        </div>

        {/* Team focus */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: typeColor, letterSpacing: '2px', marginBottom: '14px' }}>
            👥 COMPOSITION IDÉALE
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '12px' }}>
            {mode.teamFocus}
          </div>
          {mode.mechanics && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(255,82,82,0.06)',
              border: '1px solid rgba(255,82,82,0.2)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}>
              <strong style={{ color: '#ff8080', display: 'block', marginBottom: '4px' }}>⚠️ Mécaniques :</strong>
              {mode.mechanics}
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--pink)', letterSpacing: '2px', marginBottom: '16px' }}>
          💡 CONSEILS & STRATÉGIE
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {mode.tips.map((tip, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '14px',
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(255,45,135,0.03)',
              border: '1px solid rgba(255,45,135,0.08)',
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'rgba(255,45,135,0.1)',
                border: '1px solid rgba(255,45,135,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--pink)',
                flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended espers */}
      {recommendedEspers.length > 0 && (
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--purple)', letterSpacing: '2px', marginBottom: '16px' }}>
            🃏 ESPERS RECOMMANDÉS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
            {recommendedEspers.map(esper => {
              const el = ELEMENTS[esper.element]
              const role = ROLES[esper.role]
              const tierColors = { SS: '#FF2D87', S: '#FFD200', A: '#38BDF8', B: '#4ADE80' }
              return (
                <div key={esper.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: `${el.color}10`,
                  border: `1px solid ${el.color}30`,
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: `${el.color}20`,
                    border: `1px solid ${el.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}>
                    {el.emoji}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '13px', color: el.color }}>
                      {esper.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span>{role?.icon} {role?.label}</span>
                      <span style={{ color: tierColors[esper.tier], fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                        {esper.tier}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onNavigate('team')}
          >
            👥 Créer cette composition dans le Team Builder →
          </button>
        </div>
      )}
    </div>
  )
}
