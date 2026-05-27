import { useState, useMemo } from 'react'
import { ESPERS, ELEMENTS, ROLES, TIERS } from '../data/espers.js'
import { RELIC_SETS } from '../data/relics.js'
import { analyzeTeam } from '../utils/teamAnalysis.js'
import EsperCard, { EsperAvatar } from '../components/EsperCard.jsx'
import { useTeams } from '../hooks/useTeams.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useIsMobile } from '../hooks/useMobile.js'

const TEAM_SIZE = 5
const PRESET_TEAMS = [
  {
    label: 'Kronos Meta',
    icon: '👹',
    ids: ['gaius', 'ahmed', 'unas', 'clara', 'gabrielle'],
    mode: 'Ritual Miracle : Kronos',
    desc: 'Combo légendaire pour boss. Ahmed réduit la DEF, Unas contrôle les PA, Gaius détruit.',
  },
  {
    label: 'Fafnir Spécial',
    icon: '🐉',
    ids: ['abigail', 'lu-yi', 'tang-yun', 'berenice', 'gabrielle'],
    mode: 'Ritual Miracle : Fafnir',
    desc: 'Trio multi-hits pour briser les shields. Bérénice accélère les ultimates.',
  },
  {
    label: 'PvP Dominance',
    icon: '⚔️',
    ids: ['raven', 'narmer', 'long-mian', 'unas', 'sienna'],
    mode: 'Guerre des Points',
    desc: 'VIT max + dissipation + immunité = contrôle total du PvP.',
  },
  {
    label: 'Farming Story',
    icon: '📖',
    ids: ['mona', 'gabrielle', 'clara', 'jiang-jiuli', 'long-mian'],
    mode: 'Histoire / Cube',
    desc: 'Zone DPS + survie garantie pour farmer l\'Histoire efficacement.',
  },
]

export default function TeamBuilder({ onOpenAuth }) {
  const isMobile = useIsMobile()
  const { user } = useAuth()
  const { teams, saveTeam, deleteTeam } = useTeams()
  const [slots, setSlots] = useState(Array(TEAM_SIZE).fill(null))
  const [captainIdx, setCaptainIdx] = useState(0)
  const [activeSlot, setActiveSlot] = useState(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filterEl, setFilterEl] = useState(null)
  const [filterRole, setFilterRole] = useState(null)
  const [filterTier, setFilterTier] = useState(null)
  const [detailSlot, setDetailSlot] = useState(null)
  const [saveModal, setSaveModal] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [teamMode, setTeamMode] = useState('')
  const [saving, setSaving] = useState(false)

  const analysis = useMemo(() => analyzeTeam(slots), [slots])

  const openPicker = (idx) => {
    setActiveSlot(idx)
    setPickerOpen(true)
    setSearch('')
  }

  const selectEsper = (esper) => {
    const newSlots = [...slots]
    const existingIdx = newSlots.findIndex(e => e?.id === esper.id)
    if (existingIdx !== -1 && existingIdx !== activeSlot) return
    newSlots[activeSlot] = esper
    setSlots(newSlots)
    setPickerOpen(false)
    setDetailSlot(activeSlot)
  }

  const removeEsper = (idx) => {
    const newSlots = [...slots]
    newSlots[idx] = null
    setSlots(newSlots)
    if (detailSlot === idx) setDetailSlot(null)
    if (captainIdx === idx) setCaptainIdx(0)
  }

  const loadPreset = (preset) => {
    const newSlots = preset.ids.map(id => ESPERS.find(e => e.id === id) || null)
    while (newSlots.length < TEAM_SIZE) newSlots.push(null)
    setSlots(newSlots)
    setCaptainIdx(0)
    setDetailSlot(0)
  }

  const clearTeam = () => {
    setSlots(Array(TEAM_SIZE).fill(null))
    setCaptainIdx(0)
    setDetailSlot(null)
  }

  const handleSaveTeam = async () => {
    if (!user) { onOpenAuth?.(); return }
    const filled = slots.filter(Boolean)
    if (filled.length === 0) return
    setSaving(true)
    await saveTeam({
      team_name: teamName || 'Mon équipe',
      mode: teamMode || '',
      esper_ids: slots.map(e => e?.id || null),
      captain_idx: captainIdx,
      notes: '',
    })
    setSaving(false)
    setSaveModal(false)
    setTeamName('')
    setTeamMode('')
  }

  const loadSavedTeam = (t) => {
    const newSlots = (t.esper_ids || []).map(id => id ? ESPERS.find(e => e.id === id) || null : null)
    while (newSlots.length < TEAM_SIZE) newSlots.push(null)
    setSlots(newSlots)
    setCaptainIdx(t.captain_idx ?? 0)
    setDetailSlot(0)
  }

  const filteredEspers = useMemo(() => {
    const used = slots.map(e => e?.id).filter(Boolean)
    return ESPERS.filter(e => {
      if (used.includes(e.id)) return false
      if (search && !e.name.toLowerCase().includes(search.toLowerCase()) &&
          !e.divinity.toLowerCase().includes(search.toLowerCase())) return false
      if (filterEl && e.element !== filterEl) return false
      if (filterRole && e.role !== filterRole) return false
      if (filterTier && e.tier !== filterTier) return false
      return true
    })
  }, [slots, search, filterEl, filterRole, filterTier])

  const detailEsper = detailSlot !== null ? slots[detailSlot] : null

  return (
    <div className="page" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '40px' }}>
        <div>
          <h1 className="section-title" style={{ color: 'var(--pink)' }}>Team Builder</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Compose ton équipe · Analyse de synergie · Suggestions de relics
          </p>
        </div>
        <div className="section-header-line" />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-sm"
            onClick={() => {
              if (!user) { onOpenAuth?.(); return }
              const filled = slots.filter(Boolean)
              if (filled.length > 0) setSaveModal(true)
            }}
            style={{
              background: slots.filter(Boolean).length > 0
                ? 'linear-gradient(135deg, #FF2D87, #8B5CF6)'
                : 'rgba(255,255,255,0.05)',
              border: 'none',
              color: slots.filter(Boolean).length > 0 ? '#fff' : 'var(--text-muted)',
              cursor: slots.filter(Boolean).length > 0 ? 'pointer' : 'default',
            }}
          >
            💾 Sauvegarder
          </button>
          <button className="btn btn-ghost btn-sm" onClick={clearTeam}>Réinitialiser</button>
        </div>
      </div>

      {/* Presets */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '12px', fontFamily: 'var(--font-display)', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '12px' }}>
          ÉQUIPES PRÉ-DÉFINIES
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {PRESET_TEAMS.map(preset => (
            <button
              key={preset.label}
              onClick={() => loadPreset(preset)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                fontWeight: 600,
                padding: '8px 16px',
                cursor: 'pointer',
                transition: 'all 150ms',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--pink)'
                e.currentTarget.style.color = 'var(--pink)'
                e.currentTarget.style.background = 'rgba(255,45,135,0.06)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-secondary)'
                e.currentTarget.style.background = 'var(--bg-card)'
              }}
            >
              <span>{preset.icon}</span>
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 380px',
        gap: '28px',
        alignItems: 'start',
      }}>
        <div>
          {/* Team slots */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
            gap: isMobile ? '8px' : '12px',
            marginBottom: '28px',
          }}>
            {slots.map((esper, idx) => (
              <TeamSlotCard
                key={idx}
                esper={esper}
                idx={idx}
                isCaptain={captainIdx === idx}
                isDetail={detailSlot === idx}
                onOpen={() => openPicker(idx)}
                onRemove={() => removeEsper(idx)}
                onSetCaptain={() => esper && setCaptainIdx(idx)}
                onDetail={() => setDetailSlot(detailSlot === idx ? null : idx)}
              />
            ))}
          </div>

          {/* Esper detail panel */}
          {detailEsper && (
            <EsperDetailPanel
              esper={detailEsper}
              isCaptain={detailSlot === captainIdx}
              analysis={analysis}
            />
          )}

          {!detailEsper && analysis && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
              Clique sur un Esper de l'équipe pour voir son build et ses suggestions de relics
            </div>
          )}

          {!analysis && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
              Clique sur un slot vide pour ajouter un Esper
            </div>
          )}
        </div>

        {/* Sidebar analysis */}
        <div style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {analysis ? (
            <TeamAnalysisPanel analysis={analysis} slots={slots} captainIdx={captainIdx} />
          ) : (
            <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>👥</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                AJOUTE DES ESPERS
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5 }}>
                L'analyse de synergie apparaîtra ici
              </p>
            </div>
          )}

          {/* Saved teams */}
          {user && teams.length > 0 && (
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--pink)', letterSpacing: '2px', marginBottom: '12px' }}>
                💾 MES ÉQUIPES SAUVEGARDÉES
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {teams.map(t => (
                  <div key={t.id} style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.team_name}
                      </div>
                      {t.mode && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.mode}</div>}
                      <div style={{ display: 'flex', gap: '3px', marginTop: '4px' }}>
                        {(t.esper_ids || []).filter(Boolean).slice(0, 5).map((id, i) => {
                          const e = ESPERS.find(x => x.id === id)
                          const el = e ? ELEMENTS[e.element] : null
                          return e ? (
                            <div key={i} title={e.name} style={{
                              width: '20px', height: '20px', borderRadius: '5px',
                              background: el ? `${el.color}30` : 'rgba(255,255,255,0.08)',
                              border: `1px solid ${el ? el.color + '50' : 'var(--border)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '10px',
                            }}>
                              {el?.emoji}
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                    <button
                      onClick={() => loadSavedTeam(t)}
                      title="Charger cette équipe"
                      style={{
                        background: 'rgba(255,45,135,0.08)', border: '1px solid rgba(255,45,135,0.2)',
                        borderRadius: '6px', color: 'var(--pink)', fontSize: '11px',
                        padding: '5px 8px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap',
                      }}
                    >
                      Charger
                    </button>
                    <button
                      onClick={() => deleteTeam(t.id)}
                      title="Supprimer"
                      style={{
                        background: 'rgba(255,82,82,0.06)', border: '1px solid rgba(255,82,82,0.2)',
                        borderRadius: '6px', color: 'rgba(255,82,82,0.7)', fontSize: '12px',
                        padding: '5px 6px', cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save team modal */}
      {saveModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 3000,
            background: 'rgba(6,5,15,0.85)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setSaveModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0B0A1C',
              border: '1px solid rgba(255,45,135,0.25)',
              borderRadius: '20px',
              padding: '32px',
              width: '400px',
              boxShadow: '0 0 60px rgba(255,45,135,0.12), 0 24px 60px rgba(0,0,0,0.6)',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '2px', color: 'var(--pink)', marginBottom: '20px' }}>
              💾 SAUVEGARDER L'ÉQUIPE
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
                  NOM DE L'ÉQUIPE
                </label>
                <input
                  className="input"
                  placeholder="Ex : Kronos Farm, PvP Domination..."
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') handleSaveTeam() }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
                  MODE (optionnel)
                </label>
                <input
                  className="input"
                  placeholder="Ex : Kronos, Point War, Histoire..."
                  value={teamMode}
                  onChange={e => setTeamMode(e.target.value)}
                />
              </div>
            </div>

            {/* Preview */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', justifyContent: 'center' }}>
              {slots.map((e, i) => {
                const el = e ? ELEMENTS[e.element] : null
                return (
                  <div key={i} style={{
                    width: '44px', height: '44px', borderRadius: '10px',
                    background: el ? `${el.color}20` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${el ? el.color + '40' : 'rgba(255,255,255,0.08)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px',
                  }}>
                    {e ? el?.emoji : <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '16px' }}>·</span>}
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setSaveModal(false)}
                style={{
                  flex: 1, padding: '12px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                  borderRadius: '10px', color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-ui)', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleSaveTeam}
                disabled={saving}
                style={{
                  flex: 2, padding: '12px',
                  background: 'linear-gradient(135deg, #FF2D87, #8B5CF6)',
                  border: 'none', borderRadius: '10px',
                  color: '#fff', fontFamily: 'var(--font-ui)', fontWeight: 700,
                  cursor: saving ? 'default' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Sauvegarde...' : '💾 Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Picker modal */}
      {pickerOpen && (
        <EsperPickerModal
          filteredEspers={filteredEspers}
          search={search}
          setSearch={setSearch}
          filterEl={filterEl}
          setFilterEl={setFilterEl}
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          filterTier={filterTier}
          setFilterTier={setFilterTier}
          onSelect={selectEsper}
          onClose={() => setPickerOpen(false)}
          slotIdx={activeSlot}
          isMobile={isMobile}
        />
      )}
    </div>
  )
}

function TeamSlotCard({ esper, idx, isCaptain, isDetail, onOpen, onRemove, onSetCaptain, onDetail }) {
  const el = esper ? ELEMENTS[esper.element] : null
  const tierColors = { SS: '#FF2D87', S: '#FFD200', A: '#38BDF8', B: '#4ADE80', C: '#aaa' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {/* Captain indicator */}
      <div style={{
        height: '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontSize: '9px',
        letterSpacing: '1.5px',
        color: isCaptain ? 'var(--gold)' : 'var(--text-muted)',
        fontWeight: 700,
        transition: 'all 200ms',
      }}>
        {isCaptain ? '🎖️ CAPITAINE' : `Slot ${idx + 1}`}
      </div>

      {/* Main card */}
      <div
        style={{
          borderRadius: '14px',
          border: isDetail
            ? '2px solid var(--pink)'
            : isCaptain
              ? '2px solid rgba(255,210,0,0.5)'
              : '1px solid var(--border)',
          background: esper
            ? el ? `linear-gradient(160deg, ${el.color}15 0%, rgba(255,255,255,0.03) 100%)` : 'var(--bg-card)'
            : 'var(--bg-card)',
          aspectRatio: '3/4',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 200ms',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: isCaptain ? '0 0 20px rgba(255,210,0,0.15)' : isDetail ? '0 0 20px rgba(255,45,135,0.2)' : 'none',
          minHeight: '120px',
        }}
        onClick={esper ? onDetail : onOpen}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px)'
          if (!esper) e.currentTarget.style.borderColor = 'rgba(255,45,135,0.4)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none'
          if (!esper) e.currentTarget.style.borderColor = 'var(--border)'
        }}
      >
        {esper ? (
          <>
            {/* Tier badge */}
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              fontWeight: 900,
              color: tierColors[esper.tier],
              textShadow: `0 0 8px ${tierColors[esper.tier]}`,
            }}>{esper.tier}</div>

            {/* Captain crown */}
            {isCaptain && (
              <div style={{ position: 'absolute', top: '6px', left: '8px', fontSize: '14px' }}>👑</div>
            )}

            {/* Avatar */}
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: `linear-gradient(135deg, ${el.color}40, ${el.color}15)`,
              border: `2px solid ${el.color}60`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              marginBottom: '10px',
              boxShadow: `0 0 20px ${el.color}30`,
            }}>
              {el.emoji}
            </div>

            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', fontWeight: 700, textAlign: 'center', marginBottom: '2px' }}>
              {esper.name}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>
              {ROLES[esper.role]?.label}
            </div>
          </>
        ) : (
          <>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px dashed rgba(255,45,135,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: 'rgba(255,45,135,0.4)',
              marginBottom: '8px',
            }}>+</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
              Ajouter
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      {esper && (
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={onSetCaptain}
            title="Définir comme capitaine"
            style={{
              flex: 1,
              background: isCaptain ? 'rgba(255,210,0,0.15)' : 'rgba(255,255,255,0.04)',
              border: isCaptain ? '1px solid rgba(255,210,0,0.4)' : '1px solid var(--border)',
              borderRadius: '6px',
              color: isCaptain ? 'var(--gold)' : 'var(--text-muted)',
              fontSize: '11px',
              padding: '5px',
              cursor: 'pointer',
              transition: 'all 150ms',
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
            }}
          >
            {isCaptain ? '👑' : '⭐'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
            title="Changer l'Esper"
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              color: 'var(--text-muted)',
              fontSize: '11px',
              padding: '5px',
              cursor: 'pointer',
              transition: 'all 150ms',
            }}
          >🔄</button>
          <button
            onClick={onRemove}
            title="Retirer"
            style={{
              flex: 1,
              background: 'rgba(255,82,82,0.06)',
              border: '1px solid rgba(255,82,82,0.2)',
              borderRadius: '6px',
              color: 'rgba(255,82,82,0.7)',
              fontSize: '11px',
              padding: '5px',
              cursor: 'pointer',
              transition: 'all 150ms',
            }}
          >✕</button>
        </div>
      )}
    </div>
  )
}

function EsperDetailPanel({ esper, isCaptain, analysis }) {
  const el = ELEMENTS[esper.element]
  const role = ROLES[esper.role]
  const build = esper.relicBuild
  const relicSet = RELIC_SETS.find(r => r.id === build.primary.set4)
  const relicSet2 = RELIC_SETS.find(r => r.id === build.primary.set2)

  const synergiesInTeam = analysis?.synergies.filter(s =>
    s.label.toLowerCase().includes(esper.name.toLowerCase())
  ) || []

  return (
    <div className="card animate-fade" style={{ padding: '28px', marginBottom: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', alignItems: 'flex-start' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '18px',
          background: `linear-gradient(135deg, ${el.color}40, ${el.color}15)`,
          border: `2px solid ${el.color}60`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '38px',
          flexShrink: 0,
          boxShadow: `0 0 30px ${el.color}30`,
        }}>
          {el.emoji}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '1px' }}>{esper.name}</h2>
            {isCaptain && <span style={{ fontSize: '16px' }}>👑</span>}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '10px' }}>{esper.divinity}</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span className={`badge badge-${esper.element}`}>{el.emoji} {el.label}</span>
            <span className={`badge badge-${esper.role}`}>{role?.icon} {role?.label}</span>
            <span className={`badge badge-${esper.tier}`}>Tier {esper.tier}</span>
          </div>
        </div>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
        {esper.longDescription || esper.description}
      </p>

      {isCaptain && esper.captain && (
        <div style={{
          padding: '14px 18px',
          borderRadius: '10px',
          background: 'rgba(255,210,0,0.08)',
          border: '1px solid rgba(255,210,0,0.25)',
          marginBottom: '24px',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '2px', marginBottom: '6px' }}>
            👑 BONUS CAPITAINE
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{esper.captain}</div>
        </div>
      )}

      <div className="divider" />

      {/* Relic build */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--pink)', letterSpacing: '2px', marginBottom: '16px' }}>
          ⚙️ BUILD RECOMMANDÉ
        </div>

        {/* Sets */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          {relicSet && <RelicSetBadge set={relicSet} label="4 pièces" />}
          {relicSet2 && <RelicSetBadge set={relicSet2} label="2 pièces" />}
        </div>

        {/* Alt build */}
        {build.alt && (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Alternative : <span style={{ color: 'var(--text-secondary)' }}>{build.alt.label}</span>
          </div>
        )}

        {/* Main stats */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontFamily: 'var(--font-ui)', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '8px' }}>
            STATS PRINCIPALES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {Object.entries(build.mainStats).map(([slot, stat]) => (
              <div key={slot} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {{ ring: 'Anneau', helmet: 'Casque', boots: 'Bottes' }[slot]}
                </span>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-ui)', fontWeight: 700, color: 'var(--pink)' }}>
                  {stat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Substats */}
        <div>
          <div style={{ fontSize: '12px', fontFamily: 'var(--font-ui)', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '8px' }}>
            SUBSTATS PRIORITAIRES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {build.substats.map((sub, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: i === 0 ? 'rgba(255,208,74,0.2)' : 'rgba(255,255,255,0.05)',
                  border: i === 0 ? '1px solid rgba(255,208,74,0.4)' : '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: i === 0 ? 'var(--gold)' : 'var(--text-muted)',
                  flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                {sub}
              </div>
            ))}
          </div>
          {build.notes && (
            <div style={{
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(255,45,135,0.05)',
              border: '1px solid rgba(255,45,135,0.15)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}>
              💡 {build.notes}
            </div>
          )}
        </div>
      </div>

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
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{esper.tips}</div>
          </div>
        </>
      )}

      {/* Synergies in team */}
      {synergiesInTeam.length > 0 && (
        <>
          <div className="divider" />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '2px', marginBottom: '10px' }}>
              🔗 SYNERGIES ACTIVES
            </div>
            {synergiesInTeam.map((syn, i) => (
              <div key={i} style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(255,210,0,0.06)',
                border: '1px solid rgba(255,210,0,0.2)',
                marginBottom: '6px',
              }}>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                  {syn.icon} {syn.label}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{syn.desc}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function RelicSetBadge({ set, label }) {
  return (
    <div style={{
      padding: '12px',
      borderRadius: '10px',
      background: `${set.color}10`,
      border: `1px solid ${set.color}30`,
    }}>
      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '13px', color: set.color, marginBottom: '2px' }}>
        {set.name}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{set.effect}</div>
    </div>
  )
}

function TeamAnalysisPanel({ analysis, slots, captainIdx }) {
  const captain = slots[captainIdx]
  const active = slots.filter(Boolean)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Score */}
      <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-display)', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '12px' }}>
          SCORE D'ÉQUIPE
        </div>
        <div style={{
          fontSize: '56px',
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          color: analysis.verdict.color,
          textShadow: `0 0 30px ${analysis.verdict.color}`,
          lineHeight: 1,
          marginBottom: '8px',
        }}>
          {analysis.overallScore}
        </div>
        <div style={{
          display: 'inline-block',
          padding: '4px 16px',
          borderRadius: '20px',
          background: `${analysis.verdict.color}15`,
          border: `1px solid ${analysis.verdict.color}40`,
          fontFamily: 'var(--font-display)',
          fontSize: '12px',
          fontWeight: 700,
          color: analysis.verdict.color,
          letterSpacing: '1px',
        }}>
          {analysis.verdict.label}
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
          {analysis.verdict.desc}
        </p>

        {/* Score bar */}
        <div style={{
          height: '4px',
          borderRadius: '2px',
          background: 'rgba(255,255,255,0.08)',
          marginTop: '16px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${analysis.overallScore}%`,
            background: `linear-gradient(90deg, ${analysis.verdict.color}, ${analysis.verdict.color}80)`,
            borderRadius: '2px',
            transition: 'width 500ms ease',
          }} />
        </div>
      </div>

      {/* Captain bonus */}
      {captain && (
        <div className="card" style={{ padding: '16px', background: 'rgba(255,210,0,0.05)', borderColor: 'rgba(255,210,0,0.2)' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-display)', color: 'var(--gold)', letterSpacing: '2px', marginBottom: '8px' }}>
            👑 CAPITAINE : {captain.name.toUpperCase()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {captain.captain || 'Aucun bonus de capitaine défini'}
          </div>
        </div>
      )}

      {/* Role coverage */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-display)', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '14px' }}>
          COUVERTURE DES RÔLES
        </div>
        {[
          { has: analysis.hasDPS,        icon: '⚔️',  label: 'DPS',           critical: true },
          { has: analysis.hasHealer,      icon: '💚',  label: 'Soigneur',      critical: true },
          { has: analysis.hasSupport,     icon: '💙',  label: 'Support',       critical: false },
          { has: analysis.hasController,  icon: '🔒',  label: 'Contrôleur/CPA',critical: false },
          { has: analysis.hasDebuffer,    icon: '🎯',  label: 'Affaiblisseur', critical: false },
        ].map((item) => (
          <div key={item.label} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 0',
            borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: '14px' }}>{item.icon}</span>
            <span style={{ flex: 1, fontSize: '13px', color: item.has ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {item.label}
              {item.critical && <span style={{ fontSize: '10px', color: 'rgba(255,82,82,0.6)', marginLeft: '4px' }}>requis</span>}
            </span>
            <span style={{ fontSize: '14px' }}>{item.has ? '✅' : item.critical ? '❌' : '○'}</span>
          </div>
        ))}
      </div>

      {/* Missing roles alert */}
      {analysis.missingRoles.length > 0 && (
        <div style={{
          padding: '14px 18px',
          borderRadius: '12px',
          background: 'rgba(255,82,82,0.06)',
          border: '1px solid rgba(255,82,82,0.25)',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: '#ff5252', letterSpacing: '2px', marginBottom: '8px' }}>
            ⚠️ RÔLES MANQUANTS
          </div>
          {analysis.missingRoles.filter(m => m.critical).map((m) => (
            <div key={m.role} style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
              <span>{m.icon}</span> {m.label}
            </div>
          ))}
        </div>
      )}

      {/* Synergies */}
      {analysis.synergies.length > 0 && (
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-display)', color: 'var(--gold)', letterSpacing: '2px', marginBottom: '12px' }}>
            🔗 SYNERGIES DÉTECTÉES
          </div>
          {analysis.synergies.map((syn, i) => {
            const synColors = { legendary: '#FF2D87', strong: '#FFD200', good: '#38BDF8' }
            return (
              <div key={i} style={{
                display: 'flex',
                gap: '10px',
                padding: '10px 0',
                borderBottom: i < analysis.synergies.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>{syn.icon}</span>
                <div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: synColors[syn.strength] || 'var(--text-primary)',
                    marginBottom: '2px',
                  }}>{syn.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{syn.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Speed tips */}
      {analysis.speedTips.length > 0 && (
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-display)', color: 'var(--pink)', letterSpacing: '2px', marginBottom: '12px' }}>
            ⚡ CONSEILS VITESSE
          </div>
          {analysis.speedTips.map((tip, i) => {
            const colors = { success: '#52ff8a', warning: '#FFD200', info: '#FF2D87' }
            const icons = { success: '✅', warning: '⚠️', info: 'ℹ️' }
            return (
              <div key={i} style={{
                display: 'flex',
                gap: '8px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '8px',
                lineHeight: 1.4,
              }}>
                <span style={{ flexShrink: 0 }}>{icons[tip.type]}</span>
                <span>{tip.text}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Element coverage */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-display)', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '12px' }}>
          ÉLÉMENTS COUVERTS
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {analysis.elementCoverage.map(el => (
            <div key={el.element} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '20px',
              background: el.present ? `${el.color}15` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${el.present ? el.color + '40' : 'rgba(255,255,255,0.06)'}`,
              opacity: el.present ? 1 : 0.4,
              fontSize: '12px',
              fontFamily: 'var(--font-ui)',
              fontWeight: el.present ? 700 : 400,
              color: el.present ? el.color : 'var(--text-muted)',
            }}>
              {el.emoji} {el.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function EsperPickerModal({ filteredEspers, search, setSearch, filterEl, setFilterEl, filterRole, setFilterRole, filterTier, setFilterTier, onSelect, onClose, slotIdx, isMobile }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        zIndex: 2000,
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'flex-start',
        justifyContent: 'center',
        padding: isMobile ? '0' : '80px 24px 24px',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 200ms both',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(10,10,30,0.98)',
          border: '1px solid rgba(255,45,135,0.2)',
          borderRadius: isMobile ? '20px 20px 0 0' : '20px',
          width: '100%',
          maxWidth: isMobile ? '100%' : '900px',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle mobile */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.15)' }} />
          </div>
        )}
        {/* Modal header */}
        <div style={{
          padding: isMobile ? '12px 16px' : '24px 28px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '2px', color: 'var(--pink)' }}>
              CHOISIR UN ESPER
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Slot {slotIdx + 1}</div>
          </div>
          <div style={{ flex: 1 }}>
            <input
              className="input"
              type="text"
              placeholder="Rechercher un Esper..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
              fontSize: '16px',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >✕</button>
        </div>

        {/* Filters */}
        <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* Element filters */}
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', alignSelf: 'center', fontFamily: 'var(--font-ui)', marginRight: '4px' }}>Élément:</span>
          {Object.entries(ELEMENTS).map(([key, el]) => (
            <button
              key={key}
              className={`tag ${filterEl === key ? 'active' : ''}`}
              onClick={() => setFilterEl(filterEl === key ? null : key)}
            >
              {el.emoji} {el.label}
            </button>
          ))}
          <span style={{ width: '1px', background: 'var(--border)', margin: '0 4px' }} />
          {/* Tier filters */}
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', alignSelf: 'center', fontFamily: 'var(--font-ui)', marginRight: '4px' }}>Tier:</span>
          {['SS', 'S', 'A', 'B'].map(t => (
            <button
              key={t}
              className={`tag ${filterTier === t ? 'active' : ''}`}
              onClick={() => setFilterTier(filterTier === t ? null : t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Esper grid */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px 28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '10px',
          alignContent: 'start',
        }}>
          {filteredEspers.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
              Aucun Esper trouvé
            </div>
          ) : (
            filteredEspers.map(esper => (
              <EsperCard key={esper.id} esper={esper} compact onClick={() => onSelect(esper)} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
