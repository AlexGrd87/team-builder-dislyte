import { ELEMENTS, ROLES } from '../data/espers.js'
import { useIsMobile } from '../hooks/useMobile.js'

const ELEMENT_BG = {
  flow:    'radial-gradient(ellipse at top, rgba(74,158,255,0.25) 0%, transparent 70%)',
  inferno: 'radial-gradient(ellipse at top, rgba(255,82,82,0.25) 0%, transparent 70%)',
  wind:    'radial-gradient(ellipse at top, rgba(82,255,138,0.25) 0%, transparent 70%)',
  umbra:   'radial-gradient(ellipse at top, rgba(176,74,255,0.25) 0%, transparent 70%)',
  shimmer: 'radial-gradient(ellipse at top, rgba(255,208,74,0.25) 0%, transparent 70%)',
}

const TIER_COLORS = {
  SS: '#FF2D87', S: '#FFD200', A: '#38BDF8', B: '#4ADE80', C: 'rgba(232,232,240,0.5)',
}

export default function EsperCard({ esper, onClick, compact = false, selected = false }) {
  const isMobile = useIsMobile()
  if (!esper) return null

  const el = ELEMENTS[esper.element]
  const role = ROLES[esper.role]
  const tierColor = TIER_COLORS[esper.tier] || '#fff'

  return (
    <div
      onClick={onClick}
      style={{
        background: selected
          ? `rgba(255,45,135,0.08)`
          : `var(--bg-card)`,
        border: selected
          ? '1px solid rgba(255,45,135,0.5)'
          : `1px solid ${selected ? 'rgba(255,45,135,0.3)' : 'var(--border)'}`,
        borderRadius: '14px',
        padding: compact ? '12px' : '16px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 200ms',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: selected ? '0 0 20px rgba(255,45,135,0.2)' : 'none',
      }}
      onMouseEnter={e => {
        if (!selected && !isMobile) {
          e.currentTarget.style.borderColor = 'rgba(255,45,135,0.3)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'
        }
      }}
      onMouseLeave={e => {
        if (!selected && !isMobile) {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.background = 'var(--bg-card)'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      {/* Element gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: ELEMENT_BG[esper.element],
        pointerEvents: 'none',
      }} />

      {/* Tier corner badge */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontFamily: 'var(--font-display)',
        fontSize: '11px',
        fontWeight: 900,
        color: tierColor,
        textShadow: `0 0 10px ${tierColor}`,
        letterSpacing: '1px',
      }}>
        {esper.tier}
      </div>

      {/* Avatar */}
      <div style={{
        width: compact ? '48px' : '64px',
        height: compact ? '48px' : '64px',
        borderRadius: compact ? '10px' : '14px',
        background: `linear-gradient(135deg, ${el.color}40 0%, ${el.color}15 100%)`,
        border: `2px solid ${el.color}50`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: compact ? '22px' : '28px',
        marginBottom: compact ? '8px' : '12px',
        flexShrink: 0,
        boxShadow: `0 0 20px ${el.color}30`,
        position: 'relative',
      }}>
        {el.emoji}

        {/* Rarity stars */}
        {!compact && (
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '1px',
          }}>
            {Array.from({ length: esper.rarity }).map((_, i) => (
              <span key={i} style={{ fontSize: '7px', color: '#FFD200' }}>★</span>
            ))}
          </div>
        )}
      </div>

      {/* Name */}
      <div style={{
        fontFamily: 'var(--font-ui)',
        fontWeight: 700,
        fontSize: compact ? '13px' : '15px',
        color: 'var(--text-primary)',
        marginBottom: '2px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        position: 'relative',
      }}>
        {esper.name}
      </div>

      {!compact && (
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          marginBottom: '10px',
          position: 'relative',
        }}>
          {esper.divinity}
        </div>
      )}

      {/* Badges */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', position: 'relative' }}>
        <span className={`badge badge-${esper.element}`} style={{ fontSize: '10px', padding: '2px 7px' }}>
          {el.emoji} {compact ? '' : el.label}
        </span>
        {!compact && (
          <span className={`badge badge-${esper.role}`} style={{ fontSize: '10px', padding: '2px 7px' }}>
            {role?.icon} {role?.label}
          </span>
        )}
      </div>
    </div>
  )
}

export function EsperAvatar({ esper, size = 48 }) {
  if (!esper) return null
  const el = ELEMENTS[esper.element]
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: Math.round(size * 0.2) + 'px',
      background: `linear-gradient(135deg, ${el.color}40, ${el.color}15)`,
      border: `2px solid ${el.color}60`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.45 + 'px',
      boxShadow: `0 0 15px ${el.color}30`,
      flexShrink: 0,
    }}>
      {el.emoji}
    </div>
  )
}
