import { useState } from 'react'
import { updateUserStats, type UserProfile } from '../lib/auth'

type Page = 'landing' | 'game' | 'triage' | 'resources' | 'auth' | 'profile'

interface GameProps {
  onNavigate: (page: Page) => void
  user: UserProfile | null
  onUserUpdate: (user: UserProfile) => void
}

interface Scenario {
  id: number
  level: string
  question: string
  context: string
  options: { text: string; correct: boolean; explanation: string }[]
  xp: number
}

const scenarios: Scenario[] = [
  {
    id: 1,
    level: 'Novice',
    question: 'Someone in your PUBG lobby messages you: "Get free UC — just log in at free-uc-pakistan.com." What do you do?',
    context: '🎮 PUBG Mobile Chat · Stranger',
    options: [
      { text: 'Click the link — free UC sounds awesome!', correct: false, explanation: 'This is a classic phishing trap. "free-uc-pakistan.com" is a fake site that steals your PUBG credentials. Legitimate UC rewards never happen through random DMs.' },
      { text: 'Ignore and report the player in-game', correct: true, explanation: '✅ Smart move! Strangers offering free in-game currency via links are almost always phishing scams. Reporting helps protect other players too.' },
      { text: 'Ask your friend if the site is legit', correct: false, explanation: 'Your friend probably cannot verify the site either. Never click unknown links — report and move on.' },
      { text: 'Google the site name first', correct: false, explanation: 'Even googling first does not make clicking the link safe. Phishing sites can appear legitimate and can also appear in paid search ads.' },
    ],
    xp: 100,
  },
  {
    id: 2,
    level: 'Novice',
    question: 'A classmate is posting humiliating edited photos of you on Instagram. You feel embarrassed and scared. What is your first step?',
    context: '📱 Instagram · Cyberbullying',
    options: [
      { text: 'Post something mean about them in return', correct: false, explanation: 'Retaliating online escalates the situation, can get you in trouble too, and rarely solves the problem. Avoid the cycle.' },
      { text: 'Screenshot the posts, block the account, report to Instagram, and tell a trusted adult', correct: true, explanation: '✅ Perfect response! Screenshot first (evidence), block to stop seeing it, report to the platform, and tell someone you trust. You are not alone.' },
      { text: 'Delete your Instagram account', correct: false, explanation: 'You should not have to leave a platform because of a bully. Reporting and blocking are better first steps.' },
      { text: 'Just ignore it — it will stop eventually', correct: false, explanation: 'Cyberbullying rarely stops on its own. Documenting and reporting is important and can prevent others from being targeted too.' },
    ],
    xp: 100,
  },
  {
    id: 3,
    level: 'Expert',
    question: 'You receive a WhatsApp message: "JazzCash: Your account has been suspended. Verify now or lose PKR 5,000 balance: bit.ly/jcverify." The link is urgent. What do you do?',
    context: '📲 WhatsApp · Suspicious Message',
    options: [
      { text: 'Click the link immediately — I might lose my money!', correct: false, explanation: 'This is a urgency phishing attack. Scammers create panic so you click without thinking. JazzCash never sends suspension notices via WhatsApp with short links.' },
      { text: 'Forward it to family to warn them', correct: false, explanation: 'Forwarding spreads the scam. Block and delete instead.' },
      { text: 'Ignore and open the official JazzCash app directly to check your balance', correct: true, explanation: '✅ Correct! Always go directly to the official app or website — never through a link in a message. Your balance will be fine.' },
      { text: 'Reply asking for more details', correct: false, explanation: 'Replying confirms your number is active and may lead to more scam attempts. Ignore and block.' },
    ],
    xp: 150,
  },
  {
    id: 4,
    level: 'Expert',
    question: 'Someone you met on Discord a month ago asks you to send a private photo. They claim to really like you. What do you do?',
    context: '💬 Discord · Online Friend',
    options: [
      { text: 'Send it — you trust them after a month of chatting', correct: false, explanation: 'Online "friendships" can be fabricated. Sextortion starts exactly this way — someone builds false trust then demands images. Once sent, you cannot take them back.' },
      { text: 'Ask them to video call first to verify they are real', correct: false, explanation: 'Video calls can be faked using deepfake tools. This alone is not enough protection.' },
      { text: 'Decline firmly, and if they pressure you, block them', correct: true, explanation: '✅ Yes. Anyone who pressures you for private images online is a red flag regardless of how long you have known them online. Block without guilt.' },
      { text: 'Tell them your age — that will stop them', correct: false, explanation: 'Online predators may already know your age and may even use it to manipulate you further. The only safe action is to block.' },
    ],
    xp: 150,
  },
  {
    id: 5,
    level: 'Warrior',
    question: 'Your email password stopped working. You check your Gmail and see login attempts from 3 countries you have never visited. What do you do FIRST?',
    context: '📧 Gmail · Account Compromise',
    options: [
      { text: 'Wait to see if it fixes itself', correct: false, explanation: 'Account takeovers get worse the longer you wait. The attacker may already be accessing your bank, social media, and personal files.' },
      { text: 'Use "Forgot Password" on another trusted device, change password, enable 2FA, revoke all other sessions', correct: true, explanation: '✅ This is the full incident response playbook. Change password, add 2FA, and revoke all active sessions under Google Account → Security → Your Devices.' },
      { text: 'Create a new Gmail account', correct: false, explanation: 'Creating a new account does not secure the old one. The attacker may use your old account to reset passwords for your other services.' },
      { text: 'Post about it on social media to warn people', correct: false, explanation: 'Posting publicly about a compromised account can give attackers more information about you. Secure the account first.' },
    ],
    xp: 200,
  },
]

const levelBadges = [
  { name: 'Novice', icon: '🌱', color: '#2ecc71', desc: 'You are aware of the basics. Good start!', className: 'badge-novice', minScore: 0 },
  { name: 'Expert', icon: '⚡', color: '#00D4FF', desc: 'You can spot most threats. Sharp instincts!', className: 'badge-expert', minScore: 300 },
  { name: 'Warrior', icon: '🏆', color: '#e040fb', desc: 'You are a certified Cyber Warrior. Pakistan salutes you!', className: 'badge-warrior', minScore: 600 },
]

type GameState = 'start' | 'playing' | 'feedback' | 'complete'

export default function Game({ onNavigate, user, onUserUpdate }: GameProps) {
  const [gameState, setGameState] = useState<GameState>('start')
  const [currentScenario, setCurrentScenario] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [shakeKey, setShakeKey] = useState(0)

  const scenario = scenarios[currentScenario]

  function handleAnswer(idx: number) {
    if (selectedOption !== null) return
    setSelectedOption(idx)
    const isCorrect = scenario.options[idx].correct
    if (isCorrect) {
      setScore((s) => s + scenario.xp)
      setCorrectCount((c) => c + 1)
    } else {
      setShakeKey((k) => k + 1)
    }
    setTimeout(() => setGameState('feedback'), 400)
  }

  function handleNext() {
    if (currentScenario + 1 >= scenarios.length) {
      setGameState('complete')
      if (user) {
        const newBadgeIds: string[] = ['novice']
        if (score >= 300) newBadgeIds.push('expert')
        if (score >= 600) newBadgeIds.push('warrior')
        if (correctCount === scenarios.length) newBadgeIds.push('perfect')
        const newGamesPlayed = user.stats.gamesPlayed + 1
        if (newGamesPlayed >= 3) newBadgeIds.push('guardian')
        const updated = updateUserStats(user, {
          xpGain: score,
          gamesPlayed: newGamesPlayed,
          correctAnswers: user.stats.correctAnswers + correctCount,
          totalAnswers: user.stats.totalAnswers + scenarios.length,
          newBadgeIds,
        })
        onUserUpdate(updated)
      }
    } else {
      setCurrentScenario((c) => c + 1)
      setSelectedOption(null)
      setGameState('playing')
    }
  }

  function handleRestart() {
    setGameState('start')
    setCurrentScenario(0)
    setSelectedOption(null)
    setScore(0)
    setCorrectCount(0)
  }

  const earnedBadge = [...levelBadges].reverse().find((b) => score >= b.minScore) ?? levelBadges[0]
  const progress = ((currentScenario) / scenarios.length) * 100

  return (
    <div className="min-h-screen grid-bg pt-20 pb-16 px-4" style={{ background: '#0B132B' }}>
      <div className="max-w-3xl mx-auto">
        {gameState === 'start' && <StartScreen onStart={() => setGameState('playing')} />}
        {gameState === 'playing' && (
          <PlayScreen
            scenario={scenario}
            scenarioIndex={currentScenario}
            total={scenarios.length}
            progress={progress}
            score={score}
            selectedOption={selectedOption}
            shakeKey={shakeKey}
            onAnswer={handleAnswer}
          />
        )}
        {gameState === 'feedback' && selectedOption !== null && (
          <FeedbackScreen
            scenario={scenario}
            selectedOption={selectedOption}
            score={score}
            scenarioIndex={currentScenario}
            total={scenarios.length}
            onNext={handleNext}
          />
        )}
        {gameState === 'complete' && (
          <CompleteScreen
            score={score}
            correctCount={correctCount}
            total={scenarios.length}
            earnedBadge={earnedBadge}
            badges={levelBadges}
            onRestart={handleRestart}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </div>
  )
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center animate-slide-up">
      <div className="mb-6">
        <div
          className="inline-flex items-center justify-center w-24 h-24 rounded-full text-5xl mb-4 animate-float"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(106,13,173,0.3))',
            border: '2px solid rgba(0,212,255,0.4)',
            boxShadow: '0 0 40px rgba(0,212,255,0.2)',
          }}
        >
          🛡
        </div>
      </div>

      <div
        className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
        style={{
          background: 'rgba(0,212,255,0.1)',
          border: '1px solid rgba(0,212,255,0.3)',
          color: '#00D4FF',
          fontFamily: 'Orbitron, sans-serif',
          letterSpacing: '0.1em',
        }}
      >
        5 SCENARIOS · ~10 MINUTES
      </div>

      <h1
        className="font-orbitron font-black text-3xl md:text-4xl mb-3"
        style={{ color: '#E8F4FD' }}
      >
        CYBER WARRIOR
        <br />
        <span className="neon-text" style={{ color: '#00D4FF' }}>
          CHALLENGE
        </span>
      </h1>
      <p
        className="text-sm mb-10 max-w-md mx-auto leading-relaxed"
        style={{ color: 'rgba(232,244,253,0.65)', fontFamily: 'Inter, sans-serif' }}
      >
        Face real-world cyber scenarios and make the right call. Earn XP, unlock badges, and
        become Pakistan's next Cyber Warrior.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-10 max-w-sm mx-auto">
        {levelBadges.map((b) => (
          <div
            key={b.name}
            className="glass rounded-xl p-3 text-center"
            style={{ border: `1px solid rgba(${hexToRgb(b.color)}, 0.25)` }}
          >
            <div className="text-2xl mb-1">{b.icon}</div>
            <div
              className="font-orbitron font-bold text-xs"
              style={{ color: b.color }}
            >
              {b.name}
            </div>
          </div>
        ))}
      </div>

      <button className="btn-primary text-base px-8 py-4" onClick={onStart}>
        ▶ START MISSION
      </button>
    </div>
  )
}

interface PlayScreenProps {
  scenario: Scenario
  scenarioIndex: number
  total: number
  progress: number
  score: number
  selectedOption: number | null
  shakeKey: number
  onAnswer: (idx: number) => void
}

function PlayScreen({
  scenario,
  scenarioIndex,
  total,
  progress,
  score,
  selectedOption,
  shakeKey,
  onAnswer,
}: PlayScreenProps) {
  return (
    <div className="animate-slide-up">
      {/* HUD bar */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="font-orbitron font-bold text-xs"
          style={{ color: 'rgba(0,212,255,0.7)', letterSpacing: '0.1em' }}
        >
          SCENARIO {scenarioIndex + 1}/{total}
        </div>
        <div
          className="px-3 py-1 rounded-full font-orbitron font-bold text-xs"
          style={{
            background: 'rgba(0,212,255,0.1)',
            border: '1px solid rgba(0,212,255,0.3)',
            color: '#00D4FF',
          }}
        >
          {score} XP
        </div>
        <div
          className="font-orbitron font-bold text-xs"
          style={{ color: 'rgba(155,48,255,0.8)', letterSpacing: '0.08em' }}
        >
          LEVEL: {scenario.level.toUpperCase()}
        </div>
      </div>

      <div className="progress-bar mb-6">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Context pill */}
      <div
        className="inline-block px-3 py-1.5 rounded-full text-xs mb-4"
        style={{
          background: 'rgba(106,13,173,0.2)',
          border: '1px solid rgba(106,13,173,0.4)',
          color: 'rgba(232,244,253,0.8)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {scenario.context}
      </div>

      {/* Question card */}
      <div
        className="glass rounded-2xl p-6 md:p-8 mb-6"
        style={{
          border: '1.5px solid rgba(0,212,255,0.2)',
          boxShadow: '0 0 30px rgba(0,212,255,0.06)',
        }}
      >
        <h2
          className="font-orbitron font-bold text-lg md:text-xl leading-snug"
          style={{ color: '#E8F4FD' }}
        >
          {scenario.question}
        </h2>
      </div>

      {/* Options */}
      <div
        key={shakeKey}
        className="space-y-3"
        style={shakeKey > 0 ? { animation: 'shake 0.4s ease-out' } : {}}
      >
        {scenario.options.map((opt, idx) => {
          const isSelected = selectedOption === idx
          const isDisabled = selectedOption !== null
          return (
            <button
              key={idx}
              disabled={isDisabled}
              onClick={() => onAnswer(idx)}
              className="w-full text-left rounded-xl p-4 transition-all duration-200"
              style={{
                background: isSelected
                  ? 'rgba(0,212,255,0.12)'
                  : 'rgba(10,36,99,0.3)',
                border: isSelected
                  ? '1.5px solid rgba(0,212,255,0.5)'
                  : '1.5px solid rgba(0,212,255,0.12)',
                color: '#E8F4FD',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
                opacity: isDisabled && !isSelected ? 0.5 : 1,
                cursor: isDisabled ? 'default' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.background = 'rgba(0,212,255,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isDisabled && !isSelected) {
                  e.currentTarget.style.background = 'rgba(10,36,99,0.3)'
                  e.currentTarget.style.borderColor = 'rgba(0,212,255,0.12)'
                }
              }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center font-orbitron font-bold text-xs mt-0.5"
                  style={{
                    background: isSelected
                      ? 'rgba(0,212,255,0.25)'
                      : 'rgba(10,36,99,0.6)',
                    border: '1px solid rgba(0,212,255,0.3)',
                    color: '#00D4FF',
                  }}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="leading-snug">{opt.text}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface FeedbackScreenProps {
  scenario: Scenario
  selectedOption: number
  score: number
  scenarioIndex: number
  total: number
  onNext: () => void
}

function FeedbackScreen({
  scenario,
  selectedOption,
  score,
  scenarioIndex,
  total,
  onNext,
}: FeedbackScreenProps) {
  const chosen = scenario.options[selectedOption]
  const isCorrect = chosen.correct

  return (
    <div className="animate-fade-in">
      {/* Result banner */}
      <div
        className="rounded-2xl p-6 mb-6 text-center"
        style={{
          background: isCorrect
            ? 'linear-gradient(135deg, rgba(46,204,113,0.2), rgba(0,212,255,0.1))'
            : 'linear-gradient(135deg, rgba(255,107,107,0.2), rgba(255,68,68,0.1))',
          border: isCorrect
            ? '1.5px solid rgba(46,204,113,0.5)'
            : '1.5px solid rgba(255,107,107,0.5)',
          boxShadow: isCorrect
            ? '0 0 30px rgba(46,204,113,0.15)'
            : '0 0 30px rgba(255,68,68,0.15)',
        }}
      >
        <div className="text-4xl mb-3">{isCorrect ? '✅' : '❌'}</div>
        <h2
          className="font-orbitron font-black text-xl mb-1"
          style={{ color: isCorrect ? '#2ecc71' : '#FF6B6B' }}
        >
          {isCorrect ? 'CORRECT!' : 'NOT QUITE...'}
        </h2>
        {isCorrect && (
          <div
            className="font-orbitron font-bold text-sm"
            style={{ color: '#00D4FF' }}
          >
            +{scenario.xp} XP earned
          </div>
        )}
      </div>

      {/* Explanation */}
      <div
        className="glass rounded-xl p-5 mb-6"
        style={{ border: '1px solid rgba(0,212,255,0.15)' }}
      >
        <div
          className="font-orbitron font-bold text-xs mb-3"
          style={{ color: 'rgba(0,212,255,0.7)', letterSpacing: '0.1em' }}
        >
          WHY?
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'rgba(232,244,253,0.8)', fontFamily: 'Inter, sans-serif' }}
        >
          {chosen.explanation}
        </p>
      </div>

      {/* Correct answer reveal if wrong */}
      {!isCorrect && (
        <div
          className="rounded-xl p-4 mb-6"
          style={{
            background: 'rgba(46,204,113,0.1)',
            border: '1px solid rgba(46,204,113,0.3)',
          }}
        >
          <div
            className="font-orbitron font-bold text-xs mb-2"
            style={{ color: '#2ecc71', letterSpacing: '0.08em' }}
          >
            ✅ CORRECT ANSWER:
          </div>
          <p
            className="text-sm"
            style={{ color: 'rgba(232,244,253,0.75)', fontFamily: 'Inter, sans-serif' }}
          >
            {scenario.options.find((o) => o.correct)?.text}
          </p>
        </div>
      )}

      {/* Score & next */}
      <div className="flex items-center justify-between">
        <div
          className="font-orbitron text-xs"
          style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.08em' }}
        >
          Total XP: <span style={{ color: '#00D4FF' }}>{score}</span>
        </div>
        <button className="btn-primary" onClick={onNext}>
          {scenarioIndex + 1 >= total ? 'See Results →' : 'Next Scenario →'}
        </button>
      </div>
    </div>
  )
}

interface CompleteScreenProps {
  score: number
  correctCount: number
  total: number
  earnedBadge: typeof levelBadges[0]
  badges: typeof levelBadges
  onRestart: () => void
  onNavigate: (page: Page) => void
}

function CompleteScreen({
  score,
  correctCount,
  total,
  earnedBadge,
  badges,
  onRestart,
  onNavigate,
}: CompleteScreenProps) {
  return (
    <div className="text-center animate-slide-up">
      {/* Trophy */}
      <div
        className="inline-flex items-center justify-center w-28 h-28 rounded-full text-6xl mb-6 animate-float"
        style={{
          background: `linear-gradient(135deg, rgba(${hexToRgb(earnedBadge.color)}, 0.2), rgba(${hexToRgb(earnedBadge.color)}, 0.05))`,
          border: `2px solid rgba(${hexToRgb(earnedBadge.color)}, 0.5)`,
          boxShadow: `0 0 40px rgba(${hexToRgb(earnedBadge.color)}, 0.3)`,
        }}
      >
        {earnedBadge.icon}
      </div>

      <div
        className="inline-block px-4 py-1.5 rounded-full font-orbitron font-black text-sm mb-4"
        style={{
          background: `rgba(${hexToRgb(earnedBadge.color)}, 0.2)`,
          border: `1.5px solid rgba(${hexToRgb(earnedBadge.color)}, 0.5)`,
          color: earnedBadge.color,
          letterSpacing: '0.12em',
        }}
      >
        {earnedBadge.name.toUpperCase()} UNLOCKED
      </div>

      <h1
        className="font-orbitron font-black text-3xl md:text-4xl mb-3"
        style={{ color: '#E8F4FD' }}
      >
        MISSION{' '}
        <span className="neon-text" style={{ color: '#00D4FF' }}>
          COMPLETE
        </span>
      </h1>
      <p
        className="text-sm mb-8 max-w-sm mx-auto"
        style={{ color: 'rgba(232,244,253,0.65)', fontFamily: 'Inter, sans-serif' }}
      >
        {earnedBadge.desc}
      </p>

      {/* Score card */}
      <div
        className="glass rounded-2xl p-6 mb-8 max-w-sm mx-auto"
        style={{ border: '1.5px solid rgba(0,212,255,0.2)' }}
      >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div
              className="font-orbitron font-black text-2xl neon-text"
              style={{ color: '#00D4FF' }}
            >
              {score}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: 'rgba(232,244,253,0.5)', fontFamily: 'Inter, sans-serif' }}
            >
              XP EARNED
            </div>
          </div>
          <div>
            <div
              className="font-orbitron font-black text-2xl"
              style={{ color: '#2ecc71' }}
            >
              {correctCount}/{total}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: 'rgba(232,244,253,0.5)', fontFamily: 'Inter, sans-serif' }}
            >
              CORRECT
            </div>
          </div>
          <div>
            <div
              className="font-orbitron font-black text-2xl"
              style={{ color: '#9B30FF' }}
            >
              {Math.round((correctCount / total) * 100)}%
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: 'rgba(232,244,253,0.5)', fontFamily: 'Inter, sans-serif' }}
            >
              ACCURACY
            </div>
          </div>
        </div>
      </div>

      {/* All badges */}
      <div className="flex justify-center gap-4 mb-8">
        {badges.map((b) => {
          const earned = score >= b.minScore
          return (
            <div
              key={b.name}
              className={`rounded-xl p-4 text-center transition-all ${earned ? b.className : ''}`}
              style={{
                minWidth: '80px',
                background: earned
                  ? undefined
                  : 'rgba(10,36,99,0.3)',
                border: earned
                  ? undefined
                  : '1px solid rgba(255,255,255,0.08)',
                opacity: earned ? 1 : 0.35,
              }}
            >
              <div className="text-2xl mb-1">{b.icon}</div>
              <div
                className="font-orbitron font-bold text-xs"
                style={{ color: earned ? '#fff' : 'rgba(232,244,253,0.4)' }}
              >
                {b.name}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button className="btn-primary" onClick={onRestart}>
          🔄 Play Again
        </button>
        <button className="btn-secondary" onClick={() => onNavigate('resources')}>
          📚 Learn More
        </button>
        <button className="btn-outline" onClick={() => onNavigate('triage')}>
          🛡 Need Help?
        </button>
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
