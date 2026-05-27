import { useState } from 'react'
import { RELIC_SETS, MAIN_STATS, SUBSTAT_PRIORITY } from '../data/relics.js'
import { ROLES } from '../data/espers.js'
import { useIsMobile } from '../hooks/useMobile.js'

const ROLE_BUILDS = [
  {
    role: 'dps',
    label: 'DPS',
    icon: '⚔️',
    color: '#ff8080',
    set4: 'war',
    set2: 'recurve',
    mainStats: { ring: 'ATQ%', helmet: 'Dégâts Crit', boots: 'ATQ%' },
    substats: ['Taux de Crit ≥80%', 'Dégâts Crit ≥150%', 'ATQ%', 'VIT'],
    tip: 'Atteindre 80% Taux de Crit est la priorité absolue avant d\'investir en Dégâts Crit.',
  },
  {
    role: 'support',
    label: 'Support',
    icon: '💙',
    color: '#80b8ff',
    set4: 'wind',
    set2: 'sylvestre',
    mainStats: { ring: 'PV%', helmet: 'PV%', boots: 'VIT' },
    substats: ['VIT', 'PV%', 'DEF%', 'Résistance'],
    tip: 'Le support doit agir en premier pour appliquer ses buffs. Priorité VIT absolue.',
  },
  {
    role: 'healer',
    label: 'Soigneur',
    icon: '💚',
    color: '#80ffb0',
    set4: 'panacee',
    set2: 'sylvestre',
    mainStats: { ring: 'PV%', helmet: 'PV%', boots: 'VIT' },
    substats: ['VIT', 'PV%', 'DEF%'],
    tip: 'Le set Panacée amplifie les soins de 30%. Indispensable sur tout soigneur.',
  },
  {
    role: 'ap-controller',
    label: 'Contrôleur PA',
    icon: '⚡',
    color: '#FF2D87',
    set4: 'wind',
    set2: 'sylvestre',
    mainStats: { ring: 'PV%', helmet: 'VIT', boots: 'VIT' },
    substats: ['VIT (MAX POSSIBLE)', 'PV%', 'DEF%'],
    tip: 'VIT est l\'unique priorité. Un CPA à 250+ VIT est transformationnel pour l\'équipe.',
  },
  {
    role: 'defender',
    label: 'Défenseur',
    icon: '🛡️',
    color: '#FFD200',
    set4: 'fortification',
    set2: 'avatara',
    mainStats: { ring: 'DEF%', helmet: 'PV%', boots: 'DEF%' },
    substats: ['DEF%', 'PV%', 'VIT', 'Résistance'],
    tip: 'L\'Avatara 2p permet les contre-attaques automatiques — excellent sur les tanks.',
  },
]

export default function Relics() {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState('sets')
  const [filterType, setFilterType] = useState('all')

  const sets4 = RELIC_SETS.filter(r => r.type === '4piece')
  const sets2 = RELIC_SETS.filter(r => r.type === '2piece')

  return (
    <div className="page" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div className="section-header" style={{ marginBottom: '36px' }}>
        <div>
          <h1 className="section-title" style={{ color: 'var(--purple)' }}>Guide des Relics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            23 sets expliqués · Builds par rôle · Stats principales
          </p>
        </div>
        <div className="section-header-line" style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.3), transparent)' }} />
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '36px',
        borderBottom: '1px solid var(--border)',
        overflowX: isMobile ? 'auto' : 'visible',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
        flexShrink: 0,
      }}>
        {[
          { id: 'sets',   label: isMobile ? '⚙️ Sets'   : '⚙️ Tous les Sets' },
          { id: 'builds', label: isMobile ? '🎯 Builds'  : '🎯 Builds par Rôle' },
          { id: 'stats',  label: isMobile ? '📊 Stats'   : '📊 Stats Principales' },
          { id: 'tips',   label: isMobile ? '💡 Conseils': '💡 Conseils' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: isMobile ? '10px 14px' : '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--purple)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--purple)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)',
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 150ms',
              marginBottom: '-1px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Sets */}
      {activeTab === 'sets' && (
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {[
              { id: 'all', label: 'Tous' },
              { id: '4piece', label: '4 Pièces' },
              { id: '2piece', label: '2 Pièces' },
            ].map(f => (
              <button
                key={f.id}
                className={`tag ${filterType === f.id ? 'active' : ''}`}
                onClick={() => setFilterType(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {(filterType === 'all' || filterType === '4piece') && (
            <div style={{ marginBottom: '36px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--pink)', letterSpacing: '2px', marginBottom: '16px' }}>
                SETS 4 PIÈCES
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {sets4.map(set => <RelicSetCard key={set.id} set={set} />)}
              </div>
            </div>
          )}

          {(filterType === 'all' || filterType === '2piece') && (
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--gold)', letterSpacing: '2px', marginBottom: '16px' }}>
                SETS 2 PIÈCES
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {sets2.map(set => <RelicSetCard key={set.id} set={set} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Builds par rôle */}
      {activeTab === 'builds' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {ROLE_BUILDS.map(build => {
            const set4 = RELIC_SETS.find(r => r.id === build.set4)
            const set2 = RELIC_SETS.find(r => r.id === build.set2)
            return (
              <div key={build.role} className="card" style={{ padding: isMobile ? '16px' : '28px' }}>
                <div style={{ display: 'flex', gap: isMobile ? '14px' : '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {/* Role header */}
                  <div style={{ minWidth: '160px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '8px',
                    }}>
                      <span style={{ fontSize: '24px' }}>{build.icon}</span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: build.color, letterSpacing: '1px' }}>
                          {build.label}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Build recommandé</div>
                      </div>
                    </div>
                  </div>

                  {/* Sets */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {set4 && (
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: `${set4.color}10`,
                        border: `1px solid ${set4.color}30`,
                        minWidth: '150px',
                      }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>4 pièces</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: set4.color, fontWeight: 700 }}>{set4.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{set4.effect}</div>
                      </div>
                    )}
                    {set2 && (
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: `${set2.color}10`,
                        border: `1px solid ${set2.color}30`,
                        minWidth: '150px',
                      }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>2 pièces</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: set2.color, fontWeight: 700 }}>{set2.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{set2.effect}</div>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-display)', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '8px' }}>
                      STATS PRINCIPALES
                    </div>
                    {Object.entries(build.mainStats).map(([slot, stat]) => (
                      <div key={slot} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{{ ring: 'Anneau', helmet: 'Casque', boots: 'Bottes' }[slot]}</span>
                        <span style={{ color: build.color, fontFamily: 'var(--font-ui)', fontWeight: 700 }}>{stat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Substats */}
                  <div style={{ minWidth: '180px' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-display)', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '8px' }}>
                      SUBSTATS PRIORITÉS
                    </div>
                    {build.substats.map((sub, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '4px', fontSize: '12px', color: 'var(--text-secondary)', alignItems: 'center' }}>
                        <span style={{ color: i === 0 ? 'var(--gold)' : 'var(--text-muted)', fontSize: '10px' }}>{i + 1}.</span>
                        {sub}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  marginTop: '16px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: 'rgba(255,45,135,0.04)',
                  border: '1px solid rgba(255,45,135,0.1)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}>
                  💡 {build.tip}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Tab: Stats principales */}
      {activeTab === 'stats' && (
        <div>
          <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--pink)', letterSpacing: '1px', marginBottom: '20px' }}>
              SLOTS & STATS FIXES
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
              {Object.entries(MAIN_STATS).map(([slot, info]) => (
                <div key={slot} style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>
                    {info.label}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                    {info.options.map(opt => (
                      <span key={opt} style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: 'rgba(255,45,135,0.08)',
                        border: '1px solid rgba(255,45,135,0.2)',
                        fontSize: '11px',
                        color: 'var(--pink)',
                        fontFamily: 'var(--font-ui)',
                        fontWeight: 600,
                      }}>
                        {opt}
                      </span>
                    ))}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{info.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual slots diagram */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--gold)', letterSpacing: '1px', marginBottom: '20px' }}>
              RÈGLES D'OR DES SUBSTATS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: '⚡', text: 'La VIT est la stat la plus importante du jeu — elle dicte l\'ordre des tours.', color: 'var(--pink)' },
                { icon: '🎯', text: 'Vise Taux de Crit ≥ 80% AVANT d\'investir en Dégâts Critiques.', color: 'var(--gold)' },
                { icon: '📈', text: 'Une bonne Relic dès le départ (+0) est meilleure qu\'une mauvaise améliorée à +15.', color: 'var(--purple)' },
                { icon: '🔄', text: 'Upgrade par paliers de +3 pour tester les substats avant d\'investir davantage.', color: '#52ff8a' },
                { icon: '💎', text: 'Les sets Guerre (4p) + Incandescence (2p) sont le combo DPS universel de référence.', color: '#ff8080' },
              ].map((rule, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: `${rule.color}06`,
                  border: `1px solid ${rule.color}20`,
                  alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{rule.icon}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{rule.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Tips */}
      {activeTab === 'tips' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            {
              title: 'Évaluer une Relic à +0',
              icon: '🔍',
              color: 'var(--pink)',
              tips: [
                'La stat principale est-elle la bonne pour le slot ? (Ex: Dégâts Crit sur Casque pour un DPS)',
                'Deux substats sur les 4 sont-elles pertinentes pour l\'Esper ciblé ?',
                'Y a-t-il une substat VIT avec une valeur décente (≥7) ?',
                'Si non à toutes ces questions → recycle immédiatement.',
              ]
            },
            {
              title: 'Méthode d\'upgrade progressive',
              icon: '📈',
              color: 'var(--gold)',
              tips: [
                '+0 → +3 : Vérifie les 2 premières substats révélées. Si mauvaises → arrête.',
                '+3 → +6 : Révèle les 4 substats. Au moins 2 bonnes → continue.',
                '+6 → +9 : Si les substats s\'améliorent dans le bon sens → continue.',
                '+9 → +15 : Uniquement sur des Relics prometteuses. Très coûteux en or.',
              ]
            },
            {
              title: 'Combos de substats gagnants',
              icon: '✅',
              color: '#52ff8a',
              tips: [
                'DPS : Taux de Crit + Dégâts Crit + ATQ% = parfait',
                'Support/CPA : VIT + VIT (double substat) = ultra rare et précieux',
                'Soigneur : VIT + PV% + DEF% = combo survivabilité',
                'PvP universel : VIT + Résistance + PV% = difficile à contrer',
              ]
            },
            {
              title: 'Combos à éviter',
              icon: '❌',
              color: '#ff5252',
              tips: [
                'DPS : DEF% ou PV% en substat → espace gâché',
                'Support : ATQ% en substat → inutile',
                'Toute Relic : Précision en substat sur un Esper non-debuffeur',
                'Casque : PV flat (substat) sur un DPS → gaspillage majeur',
              ]
            },
          ].map(section => (
            <div key={section.title} className="card" style={{ padding: '24px' }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '15px',
                color: section.color,
                letterSpacing: '1px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span>{section.icon}</span>
                {section.title}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {section.tips.map((tip, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}>
                    <span style={{ color: section.color, flexShrink: 0, marginTop: '2px' }}>▹</span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function RelicSetCard({ set }) {
  const roleColors = {
    dps: '#ff8080', support: '#80b8ff', healer: '#80ffb0',
    controller: '#c880ff', debuffer: '#ffb040', defender: '#FFD200',
    'ap-controller': '#FF2D87',
  }
  const roleLabels = { dps: 'DPS', support: 'Support', healer: 'Soigneur', controller: 'Contrôleur', debuffer: 'Affaiblisseur', defender: 'Défenseur', 'ap-controller': 'CPA' }

  return (
    <div className="card" style={{ padding: '20px', transition: 'all 200ms' }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${set.color}50`
        e.currentTarget.style.background = `${set.color}05`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.background = 'var(--bg-card)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: set.color, letterSpacing: '0.5px' }}>
            {set.name}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{set.nameEn}</div>
        </div>
        <span style={{
          padding: '3px 8px',
          borderRadius: '4px',
          background: `${set.color}15`,
          border: `1px solid ${set.color}30`,
          fontSize: '10px',
          color: set.color,
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          letterSpacing: '1px',
          whiteSpace: 'nowrap',
        }}>
          {set.type === '4piece' ? '4P' : '2P'}
        </span>
      </div>

      <div style={{
        padding: '8px 12px',
        borderRadius: '8px',
        background: `${set.color}10`,
        border: `1px solid ${set.color}20`,
        fontSize: '12px',
        fontFamily: 'var(--font-ui)',
        fontWeight: 700,
        color: set.color,
        marginBottom: '10px',
      }}>
        {set.effect}
      </div>

      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
        {set.description}
      </div>

      {set.bestFor.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {set.bestFor.map(role => (
            <span key={role} style={{
              padding: '2px 8px',
              borderRadius: '4px',
              background: `${roleColors[role] || '#fff'}10`,
              border: `1px solid ${roleColors[role] || '#fff'}20`,
              fontSize: '10px',
              color: roleColors[role] || '#fff',
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
            }}>
              {roleLabels[role] || role}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
