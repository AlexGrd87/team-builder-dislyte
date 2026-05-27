import { useState, useMemo } from 'react'
import { ESPERS, ELEMENTS, ROLES } from '../data/espers.js'
import { RELIC_SETS } from '../data/relics.js'
import EsperCard from '../components/EsperCard.jsx'
import { useIsMobile } from '../hooks/useMobile.js'

const TIER_ORDER = { SS: 0, S: 1, A: 2, B: 3, C: 4 }

export default function Espers() {
  const isMobile = useIsMobile()
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [filterEl, setFilterEl] = useState(null)
  const [filterRole, setFilterRole] = useState(null)
  const [filterTier, setFilterTier] = useState(null)
  const [sort, setSort] = useState('tier')

  const filtered = useMemo(() => {
    return ESPERS
      .filter(e => {
        if (search && !e.name.toLowerCase().includes(search.toLowerCase()) &&
            !e.divinity.toLowerCase().includes(search.toLowerCase())) return false
        if (filterEl && e.element !== filterEl) return false
        if (filterRole && e.role !== filterRole) return false
        if (filterTier && e.tier !== filterTier) return false
        return true
      })
      .sort((a, b) => {
        if (sort === 'tier') return (TIER_ORDER[a.tier] ?? 5) - (TIER_ORDER[b.tier] ?? 5)
        if (sort === 'name') return a.name.localeCompare(b.name)
        return 0
      })
  }, [search, filterEl, filterRole, filterTier, sort])

  const selectedEsper = selected ? ESPERS.find(e => e.id === selected) : null

  return (
    <div className="page" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="section-title" style={{ color: 'var(--purple)' }}>Base de Données Espers</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            {ESPERS.length} Espers documentés
          </p>
        </div>
        <div className="section-header-line" style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.3), transparent)' }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: (!isMobile && selectedEsper) ? '1fr 400px' : '1fr',
        gap: '28px',
        alignItems: 'start',
      }}>
        {/* Left: list */}
        <div>
          {/* Search & sort */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <input
                className="input"
                type="text"
                placeholder="🔍  Rechercher un Esper..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                padding: '10px 14px',
                cursor: 'pointer',
                outline: 'none',
              }}
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="tier">Trier par Tier</option>
              <option value="name">Trier par Nom</option>
            </select>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {Object.entries(ELEMENTS).map(([key, el]) => (
              <button
                key={key}
                className={`tag ${filterEl === key ? 'active' : ''}`}
                onClick={() => setFilterEl(filterEl === key ? null : key)}
              >
                {el.emoji} {el.label}
              </button>
            ))}
            <div style={{ width: '1px', background: 'var(--border)', margin: '0 4px' }} />
            {Object.entries(ROLES).map(([key, role]) => (
              <button
                key={key}
                className={`tag ${filterRole === key ? 'active' : ''}`}
                onClick={() => setFilterRole(filterRole === key ? null : key)}
              >
                {role.icon} {role.label}
              </button>
            ))}
            <div style={{ width: '1px', background: 'var(--border)', margin: '0 4px' }} />
            {['SS', 'S', 'A', 'B'].map(t => (
              <button
                key={t}
                className={`tag ${filterTier === t ? 'active' : ''}`}
                onClick={() => setFilterTier(filterTier === t ? null : t)}
              >
                {t}
              </button>
            ))}
            {(filterEl || filterRole || filterTier || search) && (
              <button className="tag" onClick={() => { setFilterEl(null); setFilterRole(null); setFilterTier(null); setSearch('') }}>
                ✕ Réinitialiser
              </button>
            )}
          </div>

          {/* Results count */}
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', fontFamily: 'var(--font-ui)' }}>
            {filtered.length} Esper{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${(!isMobile && selectedEsper) ? '140px' : '160px'}, 1fr))`,
            gap: '12px',
          }}>
            {filtered.map(esper => (
              <EsperCard
                key={esper.id}
                esper={esper}
                selected={selected === esper.id}
                compact={!!selectedEsper}
                onClick={() => setSelected(selected === esper.id ? null : esper.id)}
              />
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                Aucun Esper ne correspond aux filtres
              </div>
            )}
          </div>
        </div>

        {/* Right: detail — desktop inline, mobile bottom sheet */}
        {selectedEsper && !isMobile && (
          <div style={{ position: 'sticky', top: '80px' }}>
            <EsperDetailFull esper={selectedEsper} onClose={() => setSelected(null)} />
          </div>
        )}
      </div>

      {/* Mobile: bottom sheet overlay */}
      {selectedEsper && isMobile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 3000,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'flex-end',
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              width: '100%',
              maxHeight: '88vh',
              overflowY: 'auto',
              borderRadius: '20px 20px 0 0',
              background: '#0B0A1C',
              border: '1px solid rgba(255,45,135,0.2)',
              borderBottom: 'none',
              animation: 'fadeIn 200ms both',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.15)' }} />
            </div>
            <EsperDetailFull esper={selectedEsper} onClose={() => setSelected(null)} />
          </div>
        </div>
      )}
    </div>
  )
}

function EsperDetailFull({ esper, onClose }) {
  const el = ELEMENTS[esper.element]
  const role = ROLES[esper.role]
  const tierColors = { SS: '#FF2D87', S: '#FFD200', A: '#38BDF8', B: '#4ADE80', C: '#aaa' }
  const tierColor = tierColors[esper.tier]
  const build = esper.relicBuild
  const relicSet4 = RELIC_SETS.find(r => r.id === build.primary.set4)
  const relicSet2 = RELIC_SETS.find(r => r.id === build.primary.set2)

  const modeLabels = { story: '📖 Story', kronos: '👹 Kronos', apep: '🐍 Apep', fafnir: '🐉 Fafnir', pvp: '⚔️ PvP' }

  return (
    <div className="card animate-fade" style={{ padding: '0', overflow: 'hidden', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
      {/* Header image area */}
      <div style={{
        background: `linear-gradient(160deg, ${el.color}30 0%, rgba(10,10,30,0.8) 100%)`,
        padding: '28px',
        position: 'relative',
        borderBottom: '1px solid var(--border)',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text-secondary)',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >✕</button>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '18px',
            background: `linear-gradient(135deg, ${el.color}40, ${el.color}15)`,
            border: `2px solid ${el.color}60`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            flexShrink: 0,
            boxShadow: `0 0 30px ${el.color}30`,
          }}>
            {el.emoji}
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '1px', marginBottom: '4px' }}>
              {esper.name}
            </h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '10px' }}>
              {esper.divinity} · {'★'.repeat(esper.rarity)}
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span className={`badge badge-${esper.element}`}>{el.emoji} {el.label}</span>
              <span className={`badge badge-${esper.role}`}>{role?.icon} {role?.label}</span>
              <span className={`badge badge-${esper.tier}`}>Tier {esper.tier}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Description */}
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.7, marginBottom: '20px' }}>
          {esper.longDescription || esper.description}
        </p>

        {/* Captain */}
        {esper.captain && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'rgba(255,210,0,0.08)',
            border: '1px solid rgba(255,210,0,0.25)',
            marginBottom: '20px',
          }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-display)', color: 'var(--gold)', letterSpacing: '2px' }}>
              👑 BONUS CAPITAINE —
            </span>{' '}
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{esper.captain}</span>
          </div>
        )}

        {/* Performance par mode */}
        {esper.modes && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-display)', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '10px' }}>
              PERFORMANCE PAR MODE
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {Object.entries(esper.modes).map(([modeKey, rating]) => {
                const ratingColor = tierColors[rating] || '#aaa'
                return (
                  <div key={modeKey} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: `${ratingColor}10`,
                    border: `1px solid ${ratingColor}30`,
                    fontSize: '12px',
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>{modeLabels[modeKey]}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: ratingColor, fontSize: '12px' }}>
                      {rating}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="divider" />

        {/* Build */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-display)', color: 'var(--pink)', letterSpacing: '2px', marginBottom: '14px' }}>
            ⚙️ BUILD RECOMMANDÉ
          </div>

          {/* Sets */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
            {relicSet4 && (
              <div style={{
                padding: '12px',
                borderRadius: '10px',
                background: `${relicSet4.color}10`,
                border: `1px solid ${relicSet4.color}30`,
              }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>4 pièces</div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: relicSet4.color }}>{relicSet4.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{relicSet4.effect}</div>
              </div>
            )}
            {relicSet2 && (
              <div style={{
                padding: '12px',
                borderRadius: '10px',
                background: `${relicSet2.color}10`,
                border: `1px solid ${relicSet2.color}30`,
              }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>2 pièces</div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: relicSet2.color }}>{relicSet2.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{relicSet2.effect}</div>
              </div>
            )}
          </div>

          {/* Substats */}
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-display)', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '8px' }}>
            SUBSTATS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
            {build.substats.map((sub, i) => (
              <span key={i} style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: i === 0 ? 'rgba(255,208,74,0.12)' : 'rgba(255,255,255,0.04)',
                border: i === 0 ? '1px solid rgba(255,208,74,0.3)' : '1px solid var(--border)',
                fontSize: '11px',
                color: i === 0 ? 'var(--gold)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-ui)',
                fontWeight: i === 0 ? 700 : 400,
              }}>
                {i === 0 ? '★ ' : ''}{sub}
              </span>
            ))}
          </div>

          {build.notes && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(255,45,135,0.04)',
              border: '1px solid rgba(255,45,135,0.12)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}>
              💡 {build.notes}
            </div>
          )}
        </div>

        {/* Synergies */}
        {esper.synergies?.length > 0 && (
          <>
            <div className="divider" />
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-display)', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '10px' }}>
                🔗 SYNERGIES
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {esper.synergies.map(id => {
                  const syn = ESPERS.find(e => e.id === id)
                  if (!syn) return null
                  const synEl = ELEMENTS[syn.element]
                  return (
                    <div key={id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: `${synEl.color}10`,
                      border: `1px solid ${synEl.color}30`,
                      fontSize: '12px',
                      fontFamily: 'var(--font-ui)',
                      fontWeight: 600,
                      color: synEl.color,
                    }}>
                      {synEl.emoji} {syn.name}
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* Tips */}
        {esper.tips && (
          <>
            <div className="divider" />
            <div style={{
              padding: '14px 18px',
              borderRadius: '10px',
              background: 'rgba(139,92,246,0.06)',
              border: '1px solid rgba(139,92,246,0.2)',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--purple)', letterSpacing: '2px', marginBottom: '6px' }}>
                ⚡ CONSEIL PRO
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{esper.tips}</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
