import { useState } from 'react'
import type { UserProfile } from '../lib/auth'

type Page = 'landing' | 'game' | 'triage' | 'resources' | 'profile' | 'auth' | 'splash'

interface NavProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  user: UserProfile | null
}

export default function Nav({ currentPage, onNavigate, user }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const links: { label: string; page: Page }[] = [
    { label: 'Home', page: 'landing' },
    { label: 'Play Game', page: 'game' },
    { label: 'Get Help', page: 'triage' },
    { label: 'Resources', page: 'resources' },
  ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(11, 19, 43, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0, 212, 255, 0.12)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #00D4FF, #6A0DAD)',
                boxShadow: '0 0 16px rgba(0, 212, 255, 0.4)',
              }}
            >
              <ShieldIcon />
            </div>
            <div className="text-left">
              <div
                className="font-orbitron font-bold text-sm leading-none neon-text"
                style={{ color: '#00D4FF' }}
              >
                CyberShield
              </div>
              <div
                className="font-orbitron font-medium text-xs leading-none mt-0.5"
                style={{ color: 'rgba(0,212,255,0.6)' }}
              >
                Pakistan
              </div>
            </div>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <button
                key={l.page}
                onClick={() => onNavigate(l.page)}
                className="font-orbitron text-xs font-semibold px-4 py-2 rounded-md transition-all duration-200"
                style={{
                  letterSpacing: '0.08em',
                  color: currentPage === l.page ? '#00D4FF' : 'rgba(232,244,253,0.65)',
                  background: currentPage === l.page ? 'rgba(0,212,255,0.1)' : 'transparent',
                  borderBottom: currentPage === l.page ? '2px solid #00D4FF' : '2px solid transparent',
                }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Right side: profile or login */}
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all duration-200"
                style={{
                  background: currentPage === 'profile'
                    ? 'rgba(0,212,255,0.12)'
                    : 'rgba(10,36,99,0.4)',
                  border: currentPage === 'profile'
                    ? '1.5px solid rgba(0,212,255,0.4)'
                    : '1px solid rgba(0,212,255,0.15)',
                  boxShadow: currentPage === 'profile' ? '0 0 12px rgba(0,212,255,0.2)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 'profile') {
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'
                    e.currentTarget.style.background = 'rgba(0,212,255,0.08)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 'profile') {
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)'
                    e.currentTarget.style.background = 'rgba(10,36,99,0.4)'
                  }
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(106,13,173,0.3))',
                    border: '1.5px solid rgba(0,212,255,0.35)',
                  }}
                >
                  {user.avatar}
                </div>
                <div className="hidden sm:block text-left">
                  <div
                    className="font-orbitron font-bold text-xs leading-none"
                    style={{ color: '#00D4FF', letterSpacing: '0.06em' }}
                  >
                    {user.username.length > 10 ? user.username.slice(0, 10) + '…' : user.username}
                  </div>
                  <div
                    className="font-orbitron text-xs leading-none mt-0.5"
                    style={{ color: 'rgba(0,212,255,0.5)', fontSize: '0.6rem' }}
                  >
                    {user.xp} XP
                  </div>
                </div>
              </button>
            ) : (
              <button
                className="hidden sm:flex items-center gap-1.5 btn-outline py-1.5 px-3"
                onClick={() => onNavigate('splash')}
              >
                <span>→</span>
                <span>Log In</span>
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-md"
              style={{ color: '#00D4FF' }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden animate-slide-up"
          style={{ background: 'rgba(11,19,43,0.97)', borderTop: '1px solid rgba(0,212,255,0.1)' }}
        >
          <div className="px-4 py-3 space-y-1">
            {links.map((l) => (
              <button
                key={l.page}
                onClick={() => { onNavigate(l.page); setMenuOpen(false) }}
                className="w-full text-left font-orbitron text-xs font-semibold px-4 py-3 rounded-md transition-all"
                style={{
                  letterSpacing: '0.08em',
                  color: currentPage === l.page ? '#00D4FF' : 'rgba(232,244,253,0.65)',
                  background: currentPage === l.page ? 'rgba(0,212,255,0.1)' : 'transparent',
                }}
              >
                {l.label}
              </button>
            ))}
            <div
              className="my-2"
              style={{ borderTop: '1px solid rgba(0,212,255,0.08)' }}
            />
            {user ? (
              <button
                onClick={() => { onNavigate('profile'); setMenuOpen(false) }}
                className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-md"
                style={{ background: 'rgba(0,212,255,0.06)' }}
              >
                <span className="text-xl">{user.avatar}</span>
                <div>
                  <div className="font-orbitron font-bold text-xs" style={{ color: '#00D4FF' }}>
                    {user.username}
                  </div>
                  <div className="font-orbitron text-xs" style={{ color: 'rgba(0,212,255,0.5)', fontSize: '0.6rem' }}>
                    {user.xp} XP
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => { onNavigate('splash'); setMenuOpen(false) }}
                className="w-full text-left font-orbitron text-xs font-semibold px-4 py-3 rounded-md"
                style={{ color: '#00D4FF', letterSpacing: '0.08em' }}
              >
                → Log In / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
        fill="rgba(11,19,43,0.8)"
        stroke="#00D4FF"
        strokeWidth="1.5"
      />
      <path d="M9 12l2 2 4-4" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
