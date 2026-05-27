import { ESPERS, ELEMENTS, ROLES } from '../data/espers.js'
import { MODES } from '../data/modes.js'
import { useIsMobile } from '../hooks/useMobile.js'

const STATS = [
  { value: ESPERS.length + '+', label: 'Espers documentés' },
  { value: '23', label: 'Sets de Relics' },
  { value: MODES.length + '', label: 'Modes de jeu' },
  { value: '100%', label: 'Guide F2P' },
]

const FEATURED_IDS = ['gaius', 'unas', 'clara', 'gabrielle', 'abigail']

export default function Home({ onNavigate }) {
  const isMobile = useIsMobile()
  const featured = FEATURED_IDS.map(id => ESPERS.find(e => e.id === id)).filter(Boolean)

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: isMobile ? '60vh' : '85vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Animated background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 60% at 20% 40%, rgba(139,92,246,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 60%, rgba(255,45,135,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 50% 80%, rgba(255,210,0,0.08) 0%, transparent 60%)
          `,
        }} />

        {/* Grid */}
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />

        {/* Floating orbs */}
        {[
          { size: 300, x: '10%', y: '20%', color: 'rgba(139,92,246,0.06)', delay: '0s' },
          { size: 200, x: '75%', y: '15%', color: 'rgba(255,45,135,0.06)', delay: '2s' },
          { size: 150, x: '60%', y: '65%', color: 'rgba(255,210,0,0.06)', delay: '1s' },
        ].map((orb, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color}, transparent)`,
            left: orb.x,
            top: orb.y,
            animation: `float 6s ease-in-out ${orb.delay} infinite`,
            pointerEvents: 'none',
          }} />
        ))}

        <div className="page" style={{ position: 'relative', zIndex: 1, paddingTop: isMobile ? '32px' : '60px', paddingBottom: isMobile ? '32px' : '60px' }}>
          <div style={{ maxWidth: '700px' }}>
            {/* Eyebrow */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '20px',
              background: 'rgba(255,45,135,0.08)',
              border: '1px solid rgba(255,45,135,0.2)',
              marginBottom: '28px',
              animation: 'fadeIn 500ms both',
            }}>
              <span style={{ fontSize: '10px', color: '#FF2D87', letterSpacing: '2px', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                GUIDE COMPLET — MAI 2026
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(42px, 7vw, 80px)',
              fontWeight: 900,
              letterSpacing: '-1px',
              lineHeight: 1,
              marginBottom: '12px',
              animation: 'fadeIn 600ms 100ms both',
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #fff 30%, #a0a0c0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>MAÎTRISE</span>
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #FF2D87 0%, #8B5CF6 60%, #FFD200 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>DISLYTE</span>
            </h1>

            <p style={{
              fontSize: 'clamp(14px, 3.5vw, 18px)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: isMobile ? '28px' : '40px',
              maxWidth: '540px',
              animation: 'fadeIn 600ms 200ms both',
            }}>
              Guide stratégique complet en français — Team Builder intelligent, tier list à jour,
              builds de relics optimisés et roadmap F2P pour dominer chaque mode.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', animation: 'fadeIn 600ms 300ms both', flexDirection: isMobile ? 'column' : 'row' }}>
              <button className="btn btn-primary" onClick={() => onNavigate('team')}>
                👥 Créer ma Team
              </button>
              <button className="btn btn-gold" onClick={() => onNavigate('tierlist')}>
                🏆 Voir la Tier List
              </button>
              <button className="btn btn-ghost" onClick={() => onNavigate('modes')}>
                🗺️ Guide des Modes
              </button>
            </div>
          </div>
        </div>

        {/* Right decoration — featured espers */}
        <div style={{
          position: 'absolute',
          right: '5%',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          animation: 'fadeInLeft 600ms 400ms both',
        }} className="hide-mobile">
          {featured.map((esper, i) => (
            <FeaturedEsperBadge key={esper.id} esper={esper} delay={`${400 + i * 80}ms`} />
          ))}
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────── */}
      <section style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(255,255,255,0.02)',
        padding: '32px 0',
      }}>
        <div className="page">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '24px' }}>
            {STATS.map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, var(--pink), var(--purple))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick access ──────────────────────────────────────────────── */}
      <section className="page" style={{ paddingTop: isMobile ? '40px' : '60px', paddingBottom: isMobile ? '40px' : '60px' }}>
        <div className="section-header">
          <h2 className="section-title" style={{ color: 'var(--pink)' }}>Accès Rapide</h2>
          <div className="section-header-line" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <QuickCard
            icon="👥"
            title="Team Builder"
            desc="Compose ton équipe idéale avec suggestions de relics automatiques et analyse de synergie en temps réel."
            color="var(--pink)"
            gradient="rgba(255,45,135,0.08)"
            page="team"
            onNavigate={onNavigate}
            label="Construire une team →"
            isMobile={isMobile}
          />
          <QuickCard
            icon="🏆"
            title="Tier List"
            desc="Classement complet de tous les Espers par mode — Kronos, Apep, Fafnir, PvP et farming."
            color="var(--gold)"
            gradient="rgba(255,210,0,0.08)"
            page="tierlist"
            onNavigate={onNavigate}
            label="Voir la tier list →"
            isMobile={isMobile}
          />
          <QuickCard
            icon="⚙️"
            title="Guide des Relics"
            desc="Tous les 23 sets expliqués, combos gagnants, stats principales par rôle et méthode d'upgrade."
            color="var(--purple)"
            gradient="rgba(139,92,246,0.08)"
            page="relics"
            onNavigate={onNavigate}
            label="Optimiser mes relics →"
            isMobile={isMobile}
          />
          <QuickCard
            icon="📖"
            title="Guide des Boss"
            desc="Mécaniques de Kronos, Apep, Fafnir et Yinglong — teams recommandées et stratégies détaillées."
            color="var(--inferno)"
            gradient="rgba(255,82,82,0.08)"
            page="modes"
            onNavigate={onNavigate}
            label="Lire le guide →"
            isMobile={isMobile}
          />
        </div>
      </section>

      {/* ── Progression roadmap ───────────────────────────────────────── */}
      <section style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid var(--border)' }}>
        <div className="page" style={{ paddingTop: isMobile ? '40px' : '60px', paddingBottom: isMobile ? '40px' : '60px' }}>
          <div className="section-header">
            <h2 className="section-title" style={{ color: 'var(--gold)' }}>Roadmap F2P</h2>
            <div className="section-header-line" style={{ background: 'linear-gradient(90deg, rgba(255,210,0,0.3), transparent)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              {
                phase: '🌱 EARLY', color: '#52ff8a', days: 'Chapitres 1–6',
                steps: [
                  'Terminer le Chapitre 6 → set De l\'En-bas',
                  'Équiper Mona avec Vol de Vie',
                  'Ne monter qu\'un seul DPS à la fois',
                  'Missions quotidiennes sans exception',
                ]
              },
              {
                phase: '🌿 MID', color: '#FFD200', days: 'Chapitres 7–12',
                steps: [
                  'Débloquer Kronos → Apep → Fafnir dans l\'ordre',
                  'Construire une team dédiée par boss',
                  'Investir dans un soigneur (Clara ou Sally)',
                  'Commencer la Guerre des Points',
                ]
              },
              {
                phase: '🌳 LATE', color: '#FF2D87', days: 'End-game',
                steps: [
                  'Optimiser les substats (VIT, Taux Crit, Dégâts Crit)',
                  'Résonance sur les Espers core',
                  'Boss niveau 17–20 pour les meilleures relics',
                  'Grimper le classement PvP',
                ]
              },
            ].map((phase) => (
              <div key={phase.phase} className="card" style={{ padding: '24px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '2px', color: phase.color, marginBottom: '4px' }}>
                  {phase.phase}
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {phase.days}
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {phase.steps.map((step, i) => (
                    <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)', alignItems: 'flex-start' }}>
                      <span style={{ color: phase.color, flexShrink: 0, marginTop: '2px' }}>▹</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Elements overview ─────────────────────────────────────────── */}
      <section className="page" style={{ paddingTop: isMobile ? '40px' : '60px', paddingBottom: isMobile ? '40px' : '80px' }}>
        <div className="section-header">
          <h2 className="section-title" style={{ color: 'var(--purple)' }}>Système Élémentaire</h2>
          <div className="section-header-line" style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.3), transparent)' }} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          {Object.entries(ELEMENTS).map(([key, el]) => (
            <div key={key} className="card" style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flex: '1 1 200px',
            }}>
              <span style={{ fontSize: '28px' }}>{el.emoji}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, color: el.color, fontSize: '15px' }}>
                  {el.label}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {el.strong === 'all' ? 'Fort contre : tous les éléments de base' : el.strong ? `Fort contre : ${ELEMENTS[el.strong]?.label}` : ''}
                  {el.weak ? ` · Faible contre : ${ELEMENTS[el.weak]?.label}` : ''}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '16px 20px', background: 'rgba(255,45,135,0.04)', borderColor: 'rgba(255,45,135,0.15)' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            ⚡ <strong style={{ color: 'var(--pink)' }}>Avantage élémentaire</strong> : +15% chance de Crit et +50% Elemental Boon sur l'attaquant.
            {' '}L'Ombre est fort contre les 3 éléments de base mais vulnérable au Scintillant.
          </p>
        </div>
      </section>
    </div>
  )
}

function FeaturedEsperBadge({ esper, delay }) {
  const el = ELEMENTS[esper.element]
  const tierColors = { SS: '#FF2D87', S: '#FFD200', A: '#38BDF8' }
  const tierColor = tierColors[esper.tier] || '#fff'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 16px',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(10px)',
      animation: `fadeIn 600ms ${delay} both`,
      minWidth: '200px',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: `linear-gradient(135deg, ${el.color}40, ${el.color}15)`,
        border: `1px solid ${el.color}50`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        flexShrink: 0,
      }}>
        {el.emoji}
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '14px' }}>{esper.name}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{esper.divinity}</div>
      </div>
      <div style={{
        marginLeft: 'auto',
        fontFamily: 'var(--font-display)',
        fontSize: '12px',
        fontWeight: 900,
        color: tierColor,
        textShadow: `0 0 10px ${tierColor}`,
      }}>
        {esper.tier}
      </div>
    </div>
  )
}

function QuickCard({ icon, title, desc, color, gradient, page, onNavigate, label, isMobile }) {
  return (
    <div className="card" style={{ padding: isMobile ? '20px' : '28px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => onNavigate(page)}
      onMouseEnter={e => {
        if (isMobile) return
        e.currentTarget.style.borderColor = color
        e.currentTarget.style.background = gradient
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3), 0 0 30px ${gradient}`
      }}
      onMouseLeave={e => {
        if (isMobile) return
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.background = 'var(--bg-card)'
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ fontSize: '36px', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '1px', marginBottom: '10px', color }}>
        {title}
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
        {desc}
      </p>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 700, color, letterSpacing: '0.5px' }}>
        {label}
      </div>
    </div>
  )
}
