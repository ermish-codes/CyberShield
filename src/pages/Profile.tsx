import { useState } from 'react'
import { logOut, saveUser, type UserProfile } from '../lib/auth'

type Page = 'landing' | 'game' | 'triage' | 'resources'

interface ProfileProps {
  user: UserProfile
  onNavigate: (page: Page) => void
  onLogout: () => void
  onUserUpdate: (user: UserProfile) => void
}

const RANK_THRESHOLDS = [
  { min: 0, rank: 'Recruit', color: '#8BA3C7', icon: '🌱' },
  { min: 500, rank: 'Operative', color: '#2ecc71', icon: '⚡' },
  { min: 1500, rank: 'Agent', color: '#00D4FF', icon: '🎯' },
  { min: 3000, rank: 'Specialist', color: '#9B30FF', icon: '🛡' },
  { min: 6000, rank: 'Cyber Warrior', color: '#e040fb', icon: '🏆' },
  { min: 10000, rank: 'Legend', color: '#FFD700', icon: '👑' },
]

function getRank(xp: number) {
  return [...RANK_THRESHOLDS].reverse().find((r) => xp >= r.min) ?? RANK_THRESHOLDS[0]
}

function getNextRank(xp: number) {
  return RANK_THRESHOLDS.find((r) => xp < r.min)
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Profile({ user, onNavigate, onLogout, onUserUpdate }: ProfileProps) {
  const [editing, setEditing] = useState(false)
  const [newUsername, setNewUsername] = useState(user.username)
  const [newAvatar, setNewAvatar] = useState(user.avatar)
  const [tab, setTab] = useState<'overview' | 'badges' | 'history'>('overview')

  const rank = getRank(user.xp)
  const nextRank = getNextRank(user.xp)
  const xpToNext = nextRank ? nextRank.min - user.xp : 0
  const xpProgress = nextRank
    ? ((user.xp - (RANK_THRESHOLDS.find((_, i, arr) => arr[i + 1]?.min > user.xp)?.min ?? 0)) /
        (nextRank.min - (RANK_THRESHOLDS.find((_, i, arr) => arr[i + 1]?.min > user.xp)?.min ?? 0))) *
      100
    : 100

  const unlockedBadges = user.badges.filter((b) => b.unlockedAt)
  const lockedBadges = user.badges.filter((b) => !b.unlockedAt)
  const accuracy =
    user.stats.totalAnswers > 0
      ? Math.round((user.stats.correctAnswers / user.stats.totalAnswers) * 100)
      : 0

  function saveEdit() {
    if (!newUsername.trim()) return
    const updated = { ...user, username: newUsername.trim(), avatar: newAvatar }
    saveUser(updated)
    onUserUpdate(updated)
    setEditing(false)
  }

  const AVATARS = ['🧑‍💻', '👩‍💻', '🧑‍🎮', '👩‍🎮', '🦸', '🦹', '🥷', '🧙']

  return (
    <div className="min-h-screen grid-bg pt-20 pb-16 px-4" style={{ background: '#0B132B' }}>
      <div className="max-w-4xl mx-auto">

        {/* Profile hero card */}
        <div
          className="rounded-2xl p-6 md:p-8 mb-6 relative overflow-hidden animate-slide-up"
          style={{
            background: 'linear-gradient(135deg, rgba(10,36,99,0.7) 0%, rgba(106,13,173,0.35) 100%)',
            border: '1.5px solid rgba(0,212,255,0.22)',
            boxShadow: '0 0 60px rgba(0,212,255,0.07)',
          }}
        >
          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(106,13,173,0.3))',
                  border: `2px solid ${rank.color}`,
                  boxShadow: `0 0 20px rgba(${hexToRgb(rank.color)}, 0.3)`,
                }}
              >
                {user.avatar}
              </div>
              <div
                className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm"
                style={{
                  background: '#0B132B',
                  border: `2px solid ${rank.color}`,
                }}
              >
                {rank.icon}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1
                  className="font-orbitron font-black text-xl"
                  style={{ color: '#E8F4FD' }}
                >
                  {user.username}
                </h1>
                <span
                  className="px-2.5 py-1 rounded-full font-orbitron font-bold text-xs"
                  style={{
                    background: `rgba(${hexToRgb(rank.color)}, 0.15)`,
                    border: `1px solid rgba(${hexToRgb(rank.color)}, 0.4)`,
                    color: rank.color,
                    letterSpacing: '0.08em',
                  }}
                >
                  {rank.rank}
                </span>
              </div>
              <div
                className="text-xs mb-3"
                style={{ color: 'rgba(232,244,253,0.45)', fontFamily: 'Inter, sans-serif' }}
              >
                {user.email} · Joined {formatDate(user.joinedAt)}
              </div>

              {/* XP bar */}
              <div className="max-w-xs">
                <div
                  className="flex justify-between text-xs mb-1"
                  style={{
                    color: 'rgba(232,244,253,0.5)',
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '0.6rem',
                    letterSpacing: '0.06em',
                  }}
                >
                  <span style={{ color: rank.color }}>{user.xp.toLocaleString()} XP</span>
                  {nextRank && <span>{xpToNext} to {nextRank.rank}</span>}
                  {!nextRank && <span style={{ color: '#FFD700' }}>MAX RANK</span>}
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(xpProgress, 100)}%`,
                      background: `linear-gradient(90deg, ${rank.color}, ${nextRank?.color ?? '#FFD700'})`,
                      boxShadow: `0 0 8px rgba(${hexToRgb(rank.color)}, 0.6)`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Edit / Logout */}
            <div className="flex gap-2 sm:ml-auto flex-shrink-0">
              <button
                className="btn-outline py-2 px-3 text-xs"
                onClick={() => setEditing(true)}
              >
                ✏ Edit
              </button>
              <button
                onClick={onLogout}
                className="px-3 py-2 rounded-lg text-xs font-bold transition-all"
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  letterSpacing: '0.08em',
                  background: 'rgba(255,68,68,0.1)',
                  border: '1px solid rgba(255,68,68,0.3)',
                  color: '#FF6B6B',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,68,68,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,68,68,0.1)'
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Edit modal */}
        {editing && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          >
            <div
              className="w-full max-w-sm rounded-2xl p-6 animate-slide-up"
              style={{
                background: 'rgba(10,36,99,0.95)',
                border: '1.5px solid rgba(0,212,255,0.3)',
                boxShadow: '0 0 40px rgba(0,212,255,0.15)',
              }}
            >
              <h3
                className="font-orbitron font-bold text-base mb-5"
                style={{ color: '#00D4FF' }}
              >
                Edit Profile
              </h3>
              <div className="mb-4">
                <label
                  className="block font-orbitron font-bold text-xs mb-2"
                  style={{ color: 'rgba(0,212,255,0.7)', letterSpacing: '0.08em' }}
                >
                  USERNAME
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  maxLength={20}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{
                    background: 'rgba(10,36,99,0.6)',
                    border: '1.5px solid rgba(0,212,255,0.3)',
                    color: '#E8F4FD',
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
              </div>
              <div className="mb-5">
                <label
                  className="block font-orbitron font-bold text-xs mb-2"
                  style={{ color: 'rgba(0,212,255,0.7)', letterSpacing: '0.08em' }}
                >
                  AVATAR
                </label>
                <div className="flex gap-2 flex-wrap">
                  {AVATARS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setNewAvatar(a)}
                      className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all"
                      style={{
                        background: newAvatar === a ? 'rgba(0,212,255,0.2)' : 'rgba(10,36,99,0.5)',
                        border: newAvatar === a ? '2px solid #00D4FF' : '2px solid rgba(0,212,255,0.12)',
                        transform: newAvatar === a ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-primary flex-1 py-2.5" onClick={saveEdit}>
                  Save Changes
                </button>
                <button
                  className="btn-outline flex-1 py-2.5"
                  onClick={() => { setEditing(false); setNewUsername(user.username); setNewAvatar(user.avatar) }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stat strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Games Played', value: user.stats.gamesPlayed, icon: '🎮', color: '#00D4FF' },
            { label: 'Accuracy', value: `${accuracy}%`, icon: '🎯', color: '#2ecc71' },
            { label: 'Total XP', value: user.xp.toLocaleString(), icon: '⭐', color: '#FFD700' },
            { label: 'Badges Earned', value: unlockedBadges.length, icon: '🏅', color: '#9B30FF' },
          ].map((s) => (
            <div
              key={s.label}
              className="glass rounded-xl p-4 text-center"
              style={{ border: `1px solid rgba(${hexToRgb(s.color)}, 0.2)` }}
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <div
                className="font-orbitron font-black text-xl"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
              <div
                className="text-xs mt-0.5"
                style={{ color: 'rgba(232,244,253,0.45)', fontFamily: 'Inter, sans-serif' }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div
          className="flex gap-1.5 p-1.5 rounded-xl mb-6"
          style={{ background: 'rgba(10,36,99,0.4)', border: '1px solid rgba(0,212,255,0.1)' }}
        >
          {([
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'badges', label: 'Badges', icon: '🏅' },
            { id: 'history', label: 'Activity', icon: '📋' },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all duration-200 text-xs font-semibold"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                letterSpacing: '0.06em',
                background:
                  tab === t.id
                    ? 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,212,255,0.08))'
                    : 'transparent',
                color: tab === t.id ? '#00D4FF' : 'rgba(232,244,253,0.45)',
                border: tab === t.id ? '1px solid rgba(0,212,255,0.3)' : '1px solid transparent',
              }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="space-y-4 animate-fade-in">
            {/* Rank progression */}
            <div
              className="glass rounded-xl p-5"
              style={{ border: '1px solid rgba(0,212,255,0.15)' }}
            >
              <h3
                className="font-orbitron font-bold text-xs mb-4"
                style={{ color: '#00D4FF', letterSpacing: '0.1em' }}
              >
                RANK PROGRESSION
              </h3>
              <div className="flex items-center gap-3 flex-wrap">
                {RANK_THRESHOLDS.map((r, i) => {
                  const reached = user.xp >= r.min
                  const isCurrent = getRank(user.xp).rank === r.rank
                  return (
                    <div key={r.rank} className="flex items-center gap-2">
                      <div
                        className="flex flex-col items-center gap-1"
                        style={{ opacity: reached ? 1 : 0.35 }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                          style={{
                            background: reached
                              ? `rgba(${hexToRgb(r.color)}, 0.2)`
                              : 'rgba(10,36,99,0.4)',
                            border: isCurrent
                              ? `2px solid ${r.color}`
                              : reached
                              ? `1px solid rgba(${hexToRgb(r.color)}, 0.4)`
                              : '1px solid rgba(255,255,255,0.08)',
                            boxShadow: isCurrent ? `0 0 12px rgba(${hexToRgb(r.color)}, 0.4)` : 'none',
                          }}
                        >
                          {r.icon}
                        </div>
                        <span
                          className="font-orbitron font-bold"
                          style={{
                            fontSize: '0.55rem',
                            letterSpacing: '0.04em',
                            color: reached ? r.color : 'rgba(232,244,253,0.3)',
                          }}
                        >
                          {r.rank}
                        </span>
                      </div>
                      {i < RANK_THRESHOLDS.length - 1 && (
                        <div
                          className="w-6 h-0.5 mb-4"
                          style={{
                            background: user.xp >= RANK_THRESHOLDS[i + 1].min
                              ? `linear-gradient(90deg, ${r.color}, ${RANK_THRESHOLDS[i+1].color})`
                              : 'rgba(255,255,255,0.08)',
                          }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Detailed stats */}
            <div
              className="glass rounded-xl p-5"
              style={{ border: '1px solid rgba(0,212,255,0.15)' }}
            >
              <h3
                className="font-orbitron font-bold text-xs mb-4"
                style={{ color: '#00D4FF', letterSpacing: '0.1em' }}
              >
                DETAILED STATS
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Games Played', value: user.stats.gamesPlayed, max: 10, color: '#00D4FF' },
                  { label: 'Correct Answers', value: user.stats.correctAnswers, max: 50, color: '#2ecc71' },
                  { label: 'Total Questions', value: user.stats.totalAnswers, max: 50, color: '#9B30FF' },
                  { label: 'Reports Submitted', value: user.stats.reportsSubmitted, max: 5, color: '#FF8C42' },
                ].map((s) => (
                  <div key={s.label}>
                    <div
                      className="flex justify-between text-xs mb-1"
                      style={{ color: 'rgba(232,244,253,0.6)', fontFamily: 'Orbitron, sans-serif', fontSize: '0.65rem' }}
                    >
                      <span>{s.label}</span>
                      <span style={{ color: s.color }}>{s.value}</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min((s.value / s.max) * 100, 100)}%`,
                          background: `linear-gradient(90deg, ${s.color}, ${s.color}88)`,
                          boxShadow: `0 0 6px rgba(${hexToRgb(s.color)}, 0.4)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { label: 'Play Game', icon: '🎮', page: 'game' as Page, color: '#00D4FF' },
                { label: 'Get Help', icon: '🛡', page: 'triage' as Page, color: '#9B30FF' },
                { label: 'Resources', icon: '📚', page: 'resources' as Page, color: '#FF8C42' },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={() => onNavigate(a.page)}
                  className="glass rounded-xl p-4 flex items-center gap-3 transition-all duration-200 hover:scale-[1.02]"
                  style={{ border: `1px solid rgba(${hexToRgb(a.color)}, 0.2)` }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `rgba(${hexToRgb(a.color)}, 0.5)` }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = `rgba(${hexToRgb(a.color)}, 0.2)` }}
                >
                  <span className="text-xl">{a.icon}</span>
                  <span
                    className="font-orbitron font-bold text-xs"
                    style={{ color: a.color, letterSpacing: '0.08em' }}
                  >
                    {a.label}
                  </span>
                  <span className="ml-auto" style={{ color: a.color, opacity: 0.5 }}>→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* BADGES TAB */}
        {tab === 'badges' && (
          <div className="animate-fade-in">
            {unlockedBadges.length > 0 && (
              <div className="mb-6">
                <h3
                  className="font-orbitron font-bold text-xs mb-3"
                  style={{ color: '#2ecc71', letterSpacing: '0.1em' }}
                >
                  ✅ EARNED ({unlockedBadges.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {unlockedBadges.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-xl p-4 text-center"
                      style={{
                        background: `rgba(${hexToRgb(b.color)}, 0.12)`,
                        border: `1.5px solid rgba(${hexToRgb(b.color)}, 0.4)`,
                        boxShadow: `0 0 16px rgba(${hexToRgb(b.color)}, 0.15)`,
                      }}
                    >
                      <div className="text-3xl mb-2">{b.icon}</div>
                      <div
                        className="font-orbitron font-bold text-xs mb-1"
                        style={{ color: b.color, letterSpacing: '0.06em' }}
                      >
                        {b.name}
                      </div>
                      <div
                        className="text-xs mb-2 leading-snug"
                        style={{ color: 'rgba(232,244,253,0.55)', fontFamily: 'Inter, sans-serif' }}
                      >
                        {b.desc}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: 'rgba(232,244,253,0.3)', fontFamily: 'Inter, sans-serif' }}
                      >
                        {formatDate(b.unlockedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lockedBadges.length > 0 && (
              <div>
                <h3
                  className="font-orbitron font-bold text-xs mb-3"
                  style={{ color: 'rgba(232,244,253,0.3)', letterSpacing: '0.1em' }}
                >
                  🔒 LOCKED ({lockedBadges.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {lockedBadges.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-xl p-4 text-center"
                      style={{
                        background: 'rgba(10,36,99,0.3)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        opacity: 0.5,
                      }}
                    >
                      <div className="text-3xl mb-2 grayscale">{b.icon}</div>
                      <div
                        className="font-orbitron font-bold text-xs mb-1"
                        style={{ color: 'rgba(232,244,253,0.4)', letterSpacing: '0.06em' }}
                      >
                        {b.name}
                      </div>
                      <div
                        className="text-xs leading-snug"
                        style={{ color: 'rgba(232,244,253,0.3)', fontFamily: 'Inter, sans-serif' }}
                      >
                        {b.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {unlockedBadges.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔒</div>
                <p
                  className="font-orbitron font-bold text-sm mb-2"
                  style={{ color: 'rgba(232,244,253,0.4)' }}
                >
                  No badges yet
                </p>
                <p
                  className="text-sm mb-5"
                  style={{ color: 'rgba(232,244,253,0.3)', fontFamily: 'Inter, sans-serif' }}
                >
                  Play the game, use the triage portal, and explore resources to unlock them.
                </p>
                <button className="btn-primary" onClick={() => onNavigate('game')}>
                  ▶ Start Playing
                </button>
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {tab === 'history' && (
          <div className="animate-fade-in">
            {user.stats.gamesPlayed === 0 && user.stats.reportsSubmitted === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📋</div>
                <p
                  className="font-orbitron font-bold text-sm mb-2"
                  style={{ color: 'rgba(232,244,253,0.4)' }}
                >
                  No activity yet
                </p>
                <p
                  className="text-sm mb-5"
                  style={{ color: 'rgba(232,244,253,0.3)', fontFamily: 'Inter, sans-serif' }}
                >
                  Your game sessions and triage reports will appear here.
                </p>
                <button className="btn-primary" onClick={() => onNavigate('game')}>
                  ▶ Play Your First Game
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {user.stats.gamesPlayed > 0 && (
                  <div
                    className="glass rounded-xl p-4 flex items-center gap-4"
                    style={{ border: '1px solid rgba(0,212,255,0.15)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}
                    >
                      🎮
                    </div>
                    <div className="flex-1">
                      <div
                        className="font-orbitron font-bold text-sm"
                        style={{ color: '#E8F4FD' }}
                      >
                        {user.stats.gamesPlayed} Game{user.stats.gamesPlayed !== 1 ? 's' : ''} Completed
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: 'rgba(232,244,253,0.45)', fontFamily: 'Inter, sans-serif' }}
                      >
                        {user.stats.correctAnswers} correct out of {user.stats.totalAnswers} questions · {accuracy}% accuracy
                      </div>
                    </div>
                    <span
                      className="font-orbitron font-bold text-sm"
                      style={{ color: '#00D4FF' }}
                    >
                      +{user.xp} XP
                    </span>
                  </div>
                )}
                {user.stats.reportsSubmitted > 0 && (
                  <div
                    className="glass rounded-xl p-4 flex items-center gap-4"
                    style={{ border: '1px solid rgba(106,13,173,0.2)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: 'rgba(106,13,173,0.12)', border: '1px solid rgba(106,13,173,0.25)' }}
                    >
                      🛡
                    </div>
                    <div>
                      <div
                        className="font-orbitron font-bold text-sm"
                        style={{ color: '#E8F4FD' }}
                      >
                        {user.stats.reportsSubmitted} Triage Report{user.stats.reportsSubmitted !== 1 ? 's' : ''}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: 'rgba(232,244,253,0.45)', fontFamily: 'Inter, sans-serif' }}
                      >
                        Anonymous incident reports completed
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
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
