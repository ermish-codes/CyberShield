export interface UserProfile {
  username: string
  email: string
  avatar: string
  joinedAt: string
  xp: number
  level: number
  badges: Badge[]
  stats: {
    gamesPlayed: number
    correctAnswers: number
    totalAnswers: number
    reportsSubmitted: number
    streakDays: number
  }
}

export interface Badge {
  id: string
  name: string
  icon: string
  desc: string
  color: string
  unlockedAt: string | null
}

export const ALL_BADGES: Badge[] = [
  { id: 'novice', name: 'Novice', icon: '🌱', desc: 'Complete your first game', color: '#2ecc71', unlockedAt: null },
  { id: 'expert', name: 'Expert', icon: '⚡', desc: 'Score 300+ XP in a game', color: '#00D4FF', unlockedAt: null },
  { id: 'warrior', name: 'Warrior', icon: '🏆', desc: 'Score 600+ XP in a game', color: '#e040fb', unlockedAt: null },
  { id: 'reporter', name: 'Reporter', icon: '📋', desc: 'Use the triage portal', color: '#FF8C42', unlockedAt: null },
  { id: 'perfect', name: 'Flawless', icon: '💎', desc: 'Answer all 5 questions correctly', color: '#FFD700', unlockedAt: null },
  { id: 'guardian', name: 'Guardian', icon: '🛡', desc: 'Complete 3 games', color: '#9B30FF', unlockedAt: null },
  { id: 'scholar', name: 'Scholar', icon: '📚', desc: 'Visit the Resources hub', color: '#FF6B9D', unlockedAt: null },
  { id: 'streak3', name: 'On Fire', icon: '🔥', desc: 'Log in 3 days in a row', color: '#FF6B6B', unlockedAt: null },
]

const STORAGE_KEY = 'cybershield_user'
const USERS_KEY = 'cybershield_users'

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveUser(user: UserProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  const usersRaw = localStorage.getItem(USERS_KEY)
  const users: Record<string, unknown> = usersRaw ? JSON.parse(usersRaw) : {}
  const existing = users[user.email] as (UserProfile & { password?: string }) | undefined
  users[user.email] = { ...existing, ...user }
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function getAllUsers(): Record<string, UserProfile & { password: string }> {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function signUp(username: string, email: string, password: string, avatar: string): UserProfile | string {
  const users = getAllUsers()
  if (users[email]) return 'An account with this email already exists.'
  const profile: UserProfile = {
    username,
    email,
    avatar,
    joinedAt: new Date().toISOString(),
    xp: 0,
    level: 1,
    badges: ALL_BADGES.map((b) => ({ ...b, unlockedAt: null })),
    stats: { gamesPlayed: 0, correctAnswers: 0, totalAnswers: 0, reportsSubmitted: 0, streakDays: 1 },
  }
  const stored = { ...profile, password } as UserProfile & { password: string }
  users[email] = stored
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  saveUser(profile)
  return profile
}

export function logIn(email: string, password: string): UserProfile | string {
  const users = getAllUsers()
  const found = users[email]
  if (!found) return 'No account found with that email.'
  if (found.password !== password) return 'Incorrect password.'
  const { password: _pw, ...profile } = found
  saveUser(profile)
  return profile
}

export function logOut() {
  localStorage.removeItem(STORAGE_KEY)
}

export function updateUserStats(
  user: UserProfile,
  patch: Partial<UserProfile['stats']> & { xpGain?: number; newBadgeIds?: string[] }
): UserProfile {
  const { xpGain = 0, newBadgeIds = [], ...statPatch } = patch
  const updated: UserProfile = {
    ...user,
    xp: user.xp + xpGain,
    level: Math.floor((user.xp + xpGain) / 500) + 1,
    stats: { ...user.stats, ...statPatch },
    badges: user.badges.map((b) =>
      newBadgeIds.includes(b.id) && !b.unlockedAt
        ? { ...b, unlockedAt: new Date().toISOString() }
        : b
    ),
  }
  saveUser(updated)
  return updated
}

export const AVATARS = ['🧑‍💻', '👩‍💻', '🧑‍🎮', '👩‍🎮', '🦸', '🦹', '🥷', '🧙']
