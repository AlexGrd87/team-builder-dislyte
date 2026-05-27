import { useAuth } from '../context/AuthContext.jsx'

export default function AuthModal({ onClose }) {
  const { signInWithGoogle, signInWithDiscord, isConfigured } = useAuth()

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(6,5,15,0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0B0A1C',
          border: '1px solid rgba(255,45,135,0.25)',
          borderRadius: '20px',
          padding: 'clamp(24px, 5vw, 40px) clamp(18px, 5vw, 36px)',
          width: '90vw',
          maxWidth: '420px',
          boxShadow: '0 0 60px rgba(255,45,135,0.12), 0 24px 60px rgba(0,0,0,0.6)',
          position: 'relative',
        }}
      >
        {/* Déco top */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '120px', height: '2px',
          background: 'linear-gradient(90deg, transparent, #FF2D87, transparent)',
        }} />

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '14px', right: '16px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(237,233,255,0.4)', fontSize: '18px', lineHeight: 1,
          }}
        >✕</button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #FF2D87 0%, #8B5CF6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '22px', color: '#fff',
            margin: '0 auto 16px',
            boxShadow: '0 0 24px rgba(255,45,135,0.4)',
          }}>D</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 900,
            letterSpacing: '2px', marginBottom: '8px',
            background: 'linear-gradient(135deg, #FF2D87, #FFD200)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>CONNEXION</h2>
          <p style={{ fontSize: '13px', color: 'rgba(237,233,255,0.5)', lineHeight: 1.5 }}>
            Connecte-toi pour sauvegarder ta box, tes builds et tes équipes sur tous tes appareils.
          </p>
        </div>

        {/* Message si Supabase non configuré */}
        {!isConfigured && (
          <div style={{
            padding: '14px 18px', borderRadius: '12px', marginBottom: '16px',
            background: 'rgba(255,210,0,0.08)', border: '1px solid rgba(255,210,0,0.3)',
            fontSize: '12px', color: 'rgba(255,210,0,0.9)', lineHeight: 1.6, textAlign: 'center',
          }}>
            ⚙️ La base de données n'est pas encore configurée.<br/>
            Suis les instructions du README pour connecter Supabase.
          </div>
        )}

        {/* Boutons OAuth */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={isConfigured ? signInWithGoogle : undefined}
            disabled={!isConfigured}
            style={{
              width: '100%', padding: '14px 20px',
              background: isConfigured ? '#fff' : 'rgba(255,255,255,0.1)',
              border: 'none', borderRadius: '12px',
              opacity: isConfigured ? 1 : 0.5, cursor: isConfigured ? 'pointer' : 'not-allowed',
              fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '14px',
              color: '#1a1a2e', cursor: 'pointer', transition: 'all 150ms',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.826.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
            </svg>
            Continuer avec Google
          </button>

          <button
            onClick={isConfigured ? signInWithDiscord : undefined}
            disabled={!isConfigured}
            style={{
              width: '100%', padding: '14px 20px',
              background: '#5865F2', border: 'none', borderRadius: '12px',
              fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '14px',
              color: '#fff', cursor: isConfigured ? 'pointer' : 'not-allowed',
              transition: 'all 150ms', opacity: isConfigured ? 1 : 0.5,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: '0 4px 16px rgba(88,101,242,0.35)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(88,101,242,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(88,101,242,0.35)' }}
          >
            <svg width="20" height="15" viewBox="0 0 20 15" fill="#fff">
              <path d="M16.93 1.33A16.42 16.42 0 0 0 12.86.02a.06.06 0 0 0-.07.03c-.18.32-.38.73-.52 1.06a15.16 15.16 0 0 0-4.54 0C7.6.74 7.38.32 7.2 0a.06.06 0 0 0-.07-.02A16.38 16.38 0 0 0 3.06 1.33a.06.06 0 0 0-.03.02C.44 5.2-.27 8.97.08 12.7c0 .02.01.04.03.05a16.52 16.52 0 0 0 4.97 2.5.06.06 0 0 0 .07-.02c.38-.52.72-1.07 1.01-1.65a.06.06 0 0 0-.03-.09 10.87 10.87 0 0 1-1.55-.74.06.06 0 0 1-.01-.1c.1-.08.21-.16.31-.24a.06.06 0 0 1 .06-.01c3.26 1.49 6.79 1.49 10.01 0a.06.06 0 0 1 .06.01c.1.08.2.16.31.24a.06.06 0 0 1-.01.1c-.5.29-1.01.54-1.55.73a.06.06 0 0 0-.03.1c.3.58.63 1.13 1.01 1.65a.06.06 0 0 0 .07.02 16.48 16.48 0 0 0 4.97-2.5.06.06 0 0 0 .03-.04c.42-4.32-.7-8.07-2.96-11.39a.05.05 0 0 0-.03-.02zM6.68 10.44c-.98 0-1.79-.9-1.79-2s.79-2 1.79-2c1.01 0 1.8.91 1.79 2 0 1.1-.79 2-1.79 2zm6.61 0c-.98 0-1.79-.9-1.79-2s.79-2 1.79-2c1.01 0 1.8.91 1.79 2 0 1.1-.78 2-1.79 2z"/>
            </svg>
            Continuer avec Discord
          </button>
        </div>

        <p style={{ fontSize: '11px', color: 'rgba(237,233,255,0.25)', textAlign: 'center', marginTop: '20px', lineHeight: 1.5 }}>
          En te connectant, tu acceptes que tes données de jeu soient stockées<br/>pour personnaliser ton expérience sur ce site.
        </p>
      </div>
    </div>
  )
}
