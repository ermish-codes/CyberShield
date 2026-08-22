import { useState } from 'react'
import { signUp, logIn, AVATARS, type UserProfile } from '../lib/auth'

interface AuthProps {
  onAuth: (user: UserProfile) => void
  onBack: () => void
}

export default function Auth({ onAuth, onBack }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (mode === 'signup') {
      if (!username.trim()) return setError('Please choose a username.')
      if (!email.includes('@')) return setError('Enter a valid email address.')
      if (password.length < 6) return setError('Password must be at least 6 characters.')
      if (password !== confirmPassword) return setError('Passwords do not match.')
      setLoading(true)
      setTimeout(() => {
        const result = signUp(username.trim(), email.trim().toLowerCase(), password, selectedAvatar)
        setLoading(false)
        if (typeof result === 'string') return setError(result)
        onAuth(result)
      }, 600)
    } else {
      if (!email.trim()) return setError('Enter your email.')
      if (!password) return setError('Enter your password.')
      setLoading(true)
      setTimeout(() => {
        const result = logIn(email.trim().toLowerCase(), password)
        setLoading(false)
        if (typeof result === 'string') return setError(result)
        onAuth(result)
      }, 600)
    }
  }

  return (
    <div
      className="min-h-screen grid-bg flex items-center justify-center px-4 pt-20 pb-10"
      style={{ background: '#0B132B' }}
    >
      {/* Ambient glow */}
      <div
        className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, rgba(106,13,173,0.06) 50%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="w-full max-w-md relative">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 mb-6 text-xs transition-all"
          style={{
            color: 'rgba(0,212,255,0.6)',
            fontFamily: 'Orbitron, sans-serif',
            letterSpacing: '0.08em',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#00D4FF')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(0,212,255,0.6)')}
        >
          ← Back to Home
        </button>

        {/* Card */}
        <div
          className="rounded-2xl p-7 animate-slide-up"
          style={{
            background: 'rgba(10,36,99,0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(0,212,255,0.2)',
            boxShadow: '0 0 60px rgba(0,212,255,0.07)',
          }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-7">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #00D4FF, #6A0DAD)',
                boxShadow: '0 0 20px rgba(0,212,255,0.4)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
                  fill="rgba(11,19,43,0.8)"
                  stroke="#00D4FF"
                  strokeWidth="1.5"
                />
                <path d="M9 12l2 2 4-4" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div
                className="font-orbitron font-black text-base leading-none"
                style={{ color: '#00D4FF' }}
              >
                CyberShield
              </div>
              <div
                className="font-orbitron text-xs leading-none mt-0.5"
                style={{ color: 'rgba(0,212,255,0.5)' }}
              >
                Pakistan
              </div>
            </div>
          </div>

          {/* Tab toggle */}
          <div
            className="flex rounded-xl p-1 mb-6"
            style={{ background: 'rgba(10,36,99,0.6)', border: '1px solid rgba(0,212,255,0.1)' }}
          >
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className="flex-1 py-2.5 rounded-lg transition-all duration-200 font-orbitron font-bold text-xs"
                style={{
                  letterSpacing: '0.1em',
                  background:
                    mode === m
                      ? 'linear-gradient(135deg, rgba(0,212,255,0.22), rgba(0,212,255,0.08))'
                      : 'transparent',
                  color: mode === m ? '#00D4FF' : 'rgba(232,244,253,0.4)',
                  border: mode === m ? '1px solid rgba(0,212,255,0.3)' : '1px solid transparent',
                  boxShadow: mode === m ? '0 0 12px rgba(0,212,255,0.15)' : 'none',
                }}
              >
                {m === 'login' ? 'LOG IN' : 'SIGN UP'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar picker — signup only */}
            {mode === 'signup' && (
              <div>
                <label
                  className="block font-orbitron font-bold text-xs mb-2"
                  style={{ color: 'rgba(0,212,255,0.7)', letterSpacing: '0.08em' }}
                >
                  CHOOSE YOUR AVATAR
                </label>
                <div className="flex gap-2 flex-wrap">
                  {AVATARS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setSelectedAvatar(a)}
                      className="w-11 h-11 rounded-xl text-2xl transition-all duration-200 flex items-center justify-center"
                      style={{
                        background:
                          selectedAvatar === a
                            ? 'rgba(0,212,255,0.2)'
                            : 'rgba(10,36,99,0.5)',
                        border:
                          selectedAvatar === a
                            ? '2px solid #00D4FF'
                            : '2px solid rgba(0,212,255,0.12)',
                        boxShadow: selectedAvatar === a ? '0 0 12px rgba(0,212,255,0.3)' : 'none',
                        transform: selectedAvatar === a ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Username — signup only */}
            {mode === 'signup' && (
              <Field
                label="USERNAME"
                type="text"
                value={username}
                onChange={setUsername}
                placeholder="CyberHero_PK"
                maxLength={20}
              />
            )}

            <Field
              label="EMAIL"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
            />

            <div>
              <label
                className="block font-orbitron font-bold text-xs mb-1.5"
                style={{ color: 'rgba(0,212,255,0.7)', letterSpacing: '0.08em' }}
              >
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full rounded-xl px-4 py-3 pr-10 text-sm outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(10,36,99,0.5)',
                    border: '1.5px solid rgba(0,212,255,0.15)',
                    color: '#E8F4FD',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(0,212,255,0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(0,212,255,0.15)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: 'rgba(0,212,255,0.5)' }}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <Field
                label="CONFIRM PASSWORD"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Repeat password"
              />
            )}

            {/* Error */}
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm animate-shake"
                style={{
                  background: 'rgba(255,68,68,0.1)',
                  border: '1px solid rgba(255,68,68,0.35)',
                  color: '#FF6B6B',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-2"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <LoadingDots />
              ) : mode === 'login' ? (
                '→ ENTER THE SHIELD'
              ) : (
                '🛡 CREATE MY PROFILE'
              )}
            </button>
          </form>

          <p
            className="text-center text-xs mt-5"
            style={{ color: 'rgba(232,244,253,0.35)', fontFamily: 'Inter, sans-serif' }}
          >
            {mode === 'login' ? (
              <>
                No account?{' '}
                <button
                  onClick={() => { setMode('signup'); setError('') }}
                  style={{ color: '#00D4FF', fontWeight: 600 }}
                >
                  Sign up free →
                </button>
              </>
            ) : (
              <>
                Already have one?{' '}
                <button
                  onClick={() => { setMode('login'); setError('') }}
                  style={{ color: '#00D4FF', fontWeight: 600 }}
                >
                  Log in →
                </button>
              </>
            )}
          </p>

          <p
            className="text-center text-xs mt-3"
            style={{ color: 'rgba(232,244,253,0.22)', fontFamily: 'Inter, sans-serif' }}
          >
            🔒 Stored locally on your device only. We never sees your data.
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  maxLength?: number
}) {
  return (
    <div>
      <label
        className="block font-orbitron font-bold text-xs mb-1.5"
        style={{ color: 'rgba(0,212,255,0.7)', letterSpacing: '0.08em' }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
        style={{
          background: 'rgba(10,36,99,0.5)',
          border: '1.5px solid rgba(0,212,255,0.15)',
          color: '#E8F4FD',
          fontFamily: 'Inter, sans-serif',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'rgba(0,212,255,0.5)')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(0,212,255,0.15)')}
      />
    </div>
  )
}

function LoadingDots() {
  return (
    <span className="flex gap-1 items-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: '#0B132B',
            animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </span>
  )
}
