type Page = 'landing' | 'game' | 'triage' | 'resources' | 'auth' | 'profile'

interface LandingProps {
  onNavigate: (page: Page) => void
}

const threats = [
  {
    icon: '🎮',
    title: 'Gaming Scams',
    desc: "Fake free V-Bucks, skins, or cheats that steal your account credentials and real money.",
    color: '#00D4FF',
  },
  {
    icon: '💬',
    title: 'Cyberbullying',
    desc: 'Harassment, hate speech, or threats in DMs, comments, or multiplayer chats.',
    color: '#FF6B9D',
  },
  {
    icon: '📱',
    title: 'Sextortion',
    desc: 'Threats to share private images unless you pay or comply. 100% not your fault.',
    color: '#FF8C42',
  },
  {
    icon: '🎣',
    title: 'Phishing Links',
    desc: "Fake login pages for WhatsApp, PUBG, or Instagram designed to steal your password.",
    color: '#FFD700',
  },
  {
    icon: '👤',
    title: 'Online Predators',
    desc: "Adults who pose as peers on Discord, Roblox, or dating apps to groom teenagers.",
    color: '#9B30FF',
  },
  {
    icon: '💳',
    title: 'Fake UPI/JazzCash',
    desc: "Fraudulent payment requests disguised as prize winnings or refund confirmations.",
    color: '#00FF88',
  },
]

const features = [
  {
    icon: '🎯',
    title: 'Learn',
    desc: 'Play scenario-based games to sharpen your cyber instincts and level up your defenses.',
    color: '#00D4FF',
    cta: 'Start Learning',
    page: 'game' as Page,
  },
  {
    icon: '🛡',
    title: 'Report',
    desc: "Something happened? Our anonymous 3-click wizard guides you through reporting it safely.",
    color: '#9B30FF',
    cta: 'Report Incident',
    page: 'triage' as Page,
  },
  {
    icon: '🔧',
    title: 'Recover',
    desc: 'Step-by-step playbooks to reclaim your accounts, protect your privacy, and bounce back.',
    color: '#00FF88',
    cta: 'Get Help',
    page: 'triage' as Page,
  },
]

export default function Landing({ onNavigate }: LandingProps) {
  return (
    <div
      className="min-h-screen grid-bg"
      style={{ background: '#0B132B' }}
    >
      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        {/* Ambient orbs */}
        <div
          className="absolute top-10 right-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(106,13,173,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="animate-slide-up">
              {/* N-CERT badge */}
              <div className="inline-flex items-center gap-2 mb-6">
                <div
                  className="px-3 py-1.5 rounded-full flex items-center gap-2"
                  style={{
                    background: 'rgba(106,13,173,0.3)',
                    border: '1px solid rgba(106,13,173,0.6)',
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: '#00D4FF', boxShadow: '0 0 8px #00D4FF' }}
                  />
                  <span
                    className="font-orbitron text-xs font-bold"
                    style={{ color: '#00D4FF', letterSpacing: '0.12em' }}
                  >
                    N-CERT PAKISTAN
                  </span>
                </div>
                <div
                  className="px-2 py-1 rounded text-xs font-semibold"
                  style={{
                    background: 'rgba(0,212,255,0.1)',
                    border: '1px solid rgba(0,212,255,0.3)',
                    color: '#00D4FF',
                    fontFamily: 'Orbitron, sans-serif',
                    letterSpacing: '0.08em',
                  }}
                >
                  BETA v1.0
                </div>
              </div>

              <h1
                className="font-orbitron font-black leading-tight mb-4"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#E8F4FD' }}
              >
                STAY SAFE.
                <br />
                <span
                  className="neon-text"
                  style={{ color: '#00D4FF' }}
                >
                  LEVEL UP.
                </span>
                <br />
                <span style={{ color: '#9B30FF' }}>WIN ONLINE.</span>
              </h1>

              <p
                className="text-base leading-relaxed mb-8 max-w-lg"
                style={{ color: 'rgba(232,244,253,0.72)', fontFamily: 'Inter, sans-serif' }}
              >
                Pakistan's first gamified cyber awareness platform — designed by N-CERT for
                teenagers and gamers who deserve to own the internet, not fear it.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <button
                  className="btn-primary flex items-center gap-2"
                  onClick={() => onNavigate('game')}
                >
                  <span>▶</span> Play Game
                </button>
                <button
                  className="btn-secondary flex items-center gap-2"
                  onClick={() => onNavigate('triage')}
                >
                  🛡 Fix My Issue
                </button>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-6">
                {[
                  { value: '2.4M+', label: 'Youth Reached' },
                  { value: '98%', label: 'Anonymous' },
                  { value: '24/7', label: 'Support' },
                ].map((s) => (
                  <div key={s.label}>
                    <div
                      className="font-orbitron font-bold text-xl neon-text"
                      style={{ color: '#00D4FF' }}
                    >
                      {s.value}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: 'rgba(232,244,253,0.5)', fontFamily: 'Inter, sans-serif' }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2
              className="font-orbitron font-bold text-2xl md:text-3xl mb-3"
              style={{ color: '#E8F4FD' }}
            >
              YOUR MISSION,{' '}
              <span className="neon-text" style={{ color: '#00D4FF' }}>
                COMMANDER
              </span>
            </h2>
            <p
              className="text-sm max-w-xl mx-auto"
              style={{ color: 'rgba(232,244,253,0.6)', fontFamily: 'Inter, sans-serif' }}
            >
              Three ways CyberShield has your back — learn the threats, report incidents, and
              recover fast.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass rounded-xl p-6 group cursor-pointer transition-all duration-300"
                style={{
                  border: `1.5px solid rgba(${hexToRgb(f.color)}, 0.2)`,
                }}
                onClick={() => onNavigate(f.page)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 24px rgba(${hexToRgb(f.color)}, 0.25)`
                  e.currentTarget.style.borderColor = `rgba(${hexToRgb(f.color)}, 0.5)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = `rgba(${hexToRgb(f.color)}, 0.2)`
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{
                    background: `rgba(${hexToRgb(f.color)}, 0.12)`,
                    border: `1px solid rgba(${hexToRgb(f.color)}, 0.3)`,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  className="font-orbitron font-bold text-base mb-2"
                  style={{ color: f.color }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ color: 'rgba(232,244,253,0.65)', fontFamily: 'Inter, sans-serif' }}
                >
                  {f.desc}
                </p>
                <div
                  className="flex items-center gap-1.5 text-xs font-semibold"
                  style={{ color: f.color, fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.08em' }}
                >
                  {f.cta} <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Threats section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{
                background: 'rgba(255,107,107,0.15)',
                border: '1px solid rgba(255,107,107,0.4)',
                color: '#FF6B6B',
                fontFamily: 'Orbitron, sans-serif',
                letterSpacing: '0.1em',
              }}
            >
              ⚠ ACTIVE THREATS
            </div>
            <h2
              className="font-orbitron font-bold text-2xl md:text-3xl mb-3"
              style={{ color: '#E8F4FD' }}
            >
              DANGERS IN THE{' '}
              <span style={{ color: '#FF6B6B' }}>DIGITAL STREETS</span>
            </h2>
            <p
              className="text-sm max-w-xl mx-auto"
              style={{ color: 'rgba(232,244,253,0.6)', fontFamily: 'Inter, sans-serif' }}
            >
              Know your enemy. These are the 6 cyber threats hitting Pakistani youth hardest right
              now.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {threats.map((t) => (
              <div
                key={t.title}
                className="glass rounded-xl p-5 group cursor-default transition-all duration-300 hover:scale-[1.02]"
                style={{ border: `1px solid rgba(${hexToRgb(t.color)}, 0.15)` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{
                      background: `rgba(${hexToRgb(t.color)}, 0.1)`,
                      border: `1px solid rgba(${hexToRgb(t.color)}, 0.25)`,
                    }}
                  >
                    {t.icon}
                  </div>
                  <div>
                    <h3
                      className="font-orbitron font-bold text-sm mb-1.5"
                      style={{ color: t.color }}
                    >
                      {t.title}
                    </h3>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: 'rgba(232,244,253,0.6)', fontFamily: 'Inter, sans-serif' }}
                    >
                      {t.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(10,36,99,0.8) 0%, rgba(106,13,173,0.4) 100%)',
              border: '1.5px solid rgba(0,212,255,0.25)',
              boxShadow: '0 0 60px rgba(0,212,255,0.08)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />
            <h2
              className="font-orbitron font-black text-2xl md:text-4xl mb-3 relative"
              style={{ color: '#E8F4FD' }}
            >
              Ready to become a{' '}
              <span className="neon-text" style={{ color: '#00D4FF' }}>
                Cyber Warrior?
              </span>
            </h2>
            <p
              className="text-sm mb-8 max-w-lg mx-auto relative"
              style={{ color: 'rgba(232,244,253,0.65)', fontFamily: 'Inter, sans-serif' }}
            >
              Join thousands of Pakistani teens who are leveling up their digital defenses. No
              signup needed — start playing in 10 seconds.
            </p>
            <div className="flex flex-wrap justify-center gap-3 relative">
              <button className="btn-primary" onClick={() => onNavigate('game')}>
                ▶ Play Now — Free
              </button>
              <button className="btn-outline" onClick={() => onNavigate('resources')}>
                Browse Resources
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-4 mt-8"
        style={{ borderTop: '1px solid rgba(0,212,255,0.08)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #00D4FF, #6A0DAD)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
                  fill="rgba(11,19,43,0.8)"
                  stroke="#00D4FF"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

          </div>
          <div
            className="text-xs"
            style={{ color: 'rgba(232,244,253,0.35)', fontFamily: 'Inter, sans-serif' }}
          >
            All reports are anonymous. You are safe here.
          </div>
        </div>
      </footer>
    </div>
  )
}

function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `${r},${g},${b}`
}
