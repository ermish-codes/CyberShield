import { useState, useEffect } from 'react'
import { updateUserStats, type UserProfile } from '../lib/auth'

const articles = [
  {
    tag: 'Gaming Safety',
    tagColor: '#00D4FF',
    title: 'How to Spot Fake "Free UC" & In-Game Scams',
    desc: 'Every week, thousands of Pakistani gamers lose their accounts to fake currency generators. Here is how to identify and avoid them.',
    readTime: '4 min read',
    emoji: '🎮',
  },
  {
    tag: 'Account Security',
    tagColor: '#9B30FF',
    title: 'Setting Up 2FA on WhatsApp, Instagram & Gmail',
    desc: 'Two-Factor Authentication is the single most effective defense against account takeovers. Here is your 5-minute setup guide.',
    readTime: '5 min read',
    emoji: '🔐',
  },
  {
    tag: 'Social Media',
    tagColor: '#FF6B9D',
    title: 'Privacy Settings Every Teen Should Configure',
    desc: 'TikTok, Instagram, Snapchat — default settings are designed for engagement, not your privacy. Here is what to change today.',
    readTime: '6 min read',
    emoji: '📱',
  },
  {
    tag: 'Sextortion',
    tagColor: '#FF8C42',
    title: 'What to Do If Someone Threatens You With Photos',
    desc: 'Sextortion affects 1 in 4 Pakistani teens online. This is not your fault — and there is a clear path to safety.',
    readTime: '7 min read',
    emoji: '🚨',
  },
  {
    tag: 'Passwords',
    tagColor: '#00FF88',
    title: 'Creating Passwords That Actually Work (And Remembering Them)',
    desc: 'Strong does not have to mean complicated. Learn the passphrase method that security professionals actually use.',
    readTime: '3 min read',
    emoji: '🔑',
  },
  {
    tag: 'Cyberbullying',
    tagColor: '#FFD700',
    title: 'When Online Harassment Goes Too Far: A Guide for Teens',
    desc: 'Know the difference between drama and targeted harassment — and the exact steps to document and report it.',
    readTime: '5 min read',
    emoji: '💬',
  },
]

const videos = [
  { title: 'Cyber Safety 101: Pakistani Youth Edition', duration: '8:24', views: '124K', emoji: '🎯', color: '#00D4FF' },
  { title: 'Real Scam Call Recording — Learn to Recognize It', duration: '5:11', views: '89K', emoji: '📞', color: '#FF6B6B' },
  { title: 'Ali ka Safar: Online Pe Mehfooz Rehna', duration: '12:03', views: '203K', emoji: '🌟', color: '#9B30FF' },
  { title: 'Password Manager Setup — Step by Step in Urdu', duration: '6:45', views: '56K', emoji: '🔐', color: '#00FF88' },
]

const helplines = [
  { name: 'N-CERT Pakistan', detail: 'ncert.gov.pk · incident@ncert.gov.pk', sub: 'Cyber incident reporting — 24/7', color: '#00D4FF', emoji: '🛡' },
  { name: 'FIA Cyber Crime Wing', detail: 'Helpline: 9911', sub: 'Online fraud, blackmail, hacking — 24/7', color: '#9B30FF', emoji: '⚖' },
  { name: 'Digital Rights Foundation', detail: 'Cyber Harassment Helpline: 0800-39393', sub: 'Free · Anonymous · Available 8am–8pm', color: '#FF6B9D', emoji: '💙' },
  { name: 'Umang Helpline', detail: '0317-4288665', sub: 'Youth mental health & crisis support — 9am–9pm', color: '#FF8C42', emoji: '🌱' },
  { name: 'Child Protection & Welfare Bureau', detail: '1121', sub: 'Free · Confidential · For under-18s', color: '#FFD700', emoji: '👶' },
  { name: 'PTA Complaint Center', detail: '0800-55055 · pta.gov.pk/complaints', sub: 'Platform abuse, illegal content, fraud', color: '#00FF88', emoji: '📋' },
]

const gamingTips = [
  { tip: 'Never share your login credentials for "free items" — no legitimate service ever needs your password.', icon: '🎮' },
  { tip: 'Enable 2FA on Steam, PUBG, and Free Fire accounts — tournament accounts are prime targets.', icon: '🔒' },
  { tip: 'In multiplayer chats, never share your real name, school, city, or phone number with strangers.', icon: '💬' },
  { tip: 'Only buy in-game currency from official stores (Google Play, App Store, official website).', icon: '💳' },
  { tip: 'Report toxic behavior in-game immediately — most games have a dedicated report button.', icon: '🚩' },
  { tip: 'Use a gaming alias that does not reveal your real identity, age, or location.', icon: '🎭' },
]

const socialTips = [
  { tip: 'Set Instagram, TikTok, and Snapchat to Private. Strangers should not have default access to your life.', icon: '🔒' },
  { tip: 'Before posting, ask: "Would I be okay if my school, parents, or employer saw this in 5 years?"', icon: '🤔' },
  { tip: 'Turn off location tagging on Instagram stories — it tells people exactly where you are and when.', icon: '📍' },
  { tip: 'Recognize love bombing: someone being unusually friendly and fast to build "closeness" is a red flag.', icon: '❤' },
  { tip: 'WhatsApp privacy: Go to Settings → Privacy → set "Last Seen", "Profile Photo", "Status" to "My Contacts."', icon: '💬' },
  { tip: 'Report fake accounts claiming to be your friends — scammers build duplicate profiles to scam your contacts.', icon: '👤' },
]

const faqs = [
  {
    q: 'Is this platform really anonymous?',
    a: "Yes. CyberShield does not collect your name, phone number, email, or any identifying information. The triage wizard runs entirely in your browser.",
  },
  {
    q: 'If I report something to N-CERT, will the police contact my parents?',
    a: "N-CERT focuses on technical incident response. You can report anonymously. For cases involving minors, they follow child-protection protocols, but their first goal is to help you.",
  },
  {
    q: 'My friend is being cyberbullied but they do not want to report it. What should I do?',
    a: "Support them first — being heard matters. Offer to help them screenshot evidence so it is not lost. Gently encourage talking to a trusted adult, and remind them the Digital Rights Foundation helpline is free and anonymous.",
  },
  {
    q: 'I accidentally clicked a suspicious link. What now?',
    a: "Immediately: (1) Do not enter any information on the page. (2) Change the password for any account you were logged into. (3) Run a quick antivirus scan. (4) Tell a trusted adult. You caught it early — that is a win.",
  },
  {
    q: 'Can my parents see what I report on this platform?',
    a: "No. Nothing is stored or shareable. The playbooks and steps exist only in your browser session. When you close the tab, they are gone.",
  },
]

type Tab = 'articles' | 'videos' | 'helplines' | 'gaming' | 'social' | 'faq'

interface ResourcesProps {
  user: UserProfile | null
  onUserUpdate: (user: UserProfile) => void
}

export default function Resources({ user, onUserUpdate }: ResourcesProps) {
  const [activeTab, setActiveTab] = useState<Tab>('articles')

  useEffect(() => {
    if (user) {
      const updated = updateUserStats(user, { newBadgeIds: ['scholar'], xpGain: 0 })
      onUserUpdate(updated)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'articles', label: 'Articles', icon: '📖' },
    { id: 'videos', label: 'Videos', icon: '▶' },
    { id: 'helplines', label: 'Helplines', icon: '📞' },
    { id: 'gaming', label: 'Gaming Safety', icon: '🎮' },
    { id: 'social', label: 'Social Media', icon: '📱' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
  ]

  return (
    <div className="min-h-screen grid-bg pt-20 pb-16 px-4" style={{ background: '#0B132B' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <h1
            className="font-orbitron font-black text-3xl md:text-4xl mb-3"
            style={{ color: '#E8F4FD' }}
          >
            RESOURCE{' '}
            <span className="neon-text" style={{ color: '#00D4FF' }}>
              HUB
            </span>
          </h1>
          <p
            className="text-sm max-w-lg mx-auto"
            style={{ color: 'rgba(232,244,253,0.65)', fontFamily: 'Inter, sans-serif' }}
          >
            Everything you need to stay safe online — articles, videos, helplines, and pro tips
            built for Pakistani youth.
          </p>
        </div>

        {/* Tab bar */}
        <div
          className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-xl"
          style={{
            background: 'rgba(10,36,99,0.4)',
            border: '1px solid rgba(0,212,255,0.12)',
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 text-xs font-semibold"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                letterSpacing: '0.06em',
                background:
                  activeTab === t.id
                    ? 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,212,255,0.08))'
                    : 'transparent',
                color: activeTab === t.id ? '#00D4FF' : 'rgba(232,244,253,0.5)',
                border:
                  activeTab === t.id ? '1px solid rgba(0,212,255,0.3)' : '1px solid transparent',
                boxShadow: activeTab === t.id ? '0 0 12px rgba(0,212,255,0.15)' : 'none',
              }}
            >
              <span>{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Articles */}
        {activeTab === 'articles' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
            {articles.map((a) => (
              <div
                key={a.title}
                className="glass rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                style={{ border: `1px solid rgba(${hexToRgb(a.tagColor)}, 0.15)` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 24px rgba(${hexToRgb(a.tagColor)}, 0.15)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div
                  className="h-24 flex items-center justify-center text-5xl"
                  style={{
                    background: `linear-gradient(135deg, rgba(${hexToRgb(a.tagColor)}, 0.12), rgba(10,36,99,0.6))`,
                    borderBottom: `1px solid rgba(${hexToRgb(a.tagColor)}, 0.15)`,
                  }}
                >
                  {a.emoji}
                </div>
                <div className="p-4">
                  <div
                    className="inline-block px-2 py-0.5 rounded text-xs font-bold mb-3"
                    style={{
                      background: `rgba(${hexToRgb(a.tagColor)}, 0.12)`,
                      border: `1px solid rgba(${hexToRgb(a.tagColor)}, 0.3)`,
                      color: a.tagColor,
                      fontFamily: 'Orbitron, sans-serif',
                      letterSpacing: '0.06em',
                      fontSize: '0.6rem',
                    }}
                  >
                    {a.tag}
                  </div>
                  <h3
                    className="font-orbitron font-bold text-sm mb-2 leading-snug"
                    style={{ color: '#E8F4FD' }}
                  >
                    {a.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed mb-3"
                    style={{ color: 'rgba(232,244,253,0.55)', fontFamily: 'Inter, sans-serif' }}
                  >
                    {a.desc}
                  </p>
                  <div
                    className="flex items-center justify-between text-xs"
                    style={{ color: 'rgba(232,244,253,0.35)', fontFamily: 'Inter, sans-serif' }}
                  >
                    <span>{a.readTime}</span>
                    <span style={{ color: a.tagColor }}>Read →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Videos */}
        {activeTab === 'videos' && (
          <div className="grid sm:grid-cols-2 gap-5 animate-fade-in">
            {videos.map((v) => (
              <div
                key={v.title}
                className="glass rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.02]"
                style={{ border: `1px solid rgba(${hexToRgb(v.color)}, 0.2)` }}
              >
                <div
                  className="h-36 flex items-center justify-center relative"
                  style={{
                    background: `linear-gradient(135deg, rgba(${hexToRgb(v.color)}, 0.15), rgba(10,36,99,0.7))`,
                  }}
                >
                  <div className="text-5xl">{v.emoji}</div>
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(0,0,0,0.4)' }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        background: v.color,
                        boxShadow: `0 0 24px rgba(${hexToRgb(v.color)}, 0.6)`,
                      }}
                    >
                      <span style={{ color: '#0B132B', fontWeight: 'bold', fontSize: '1.2rem' }}>▶</span>
                    </div>
                  </div>
                  <div
                    className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs font-bold"
                    style={{
                      background: 'rgba(0,0,0,0.7)',
                      color: '#E8F4FD',
                      fontFamily: 'Orbitron, sans-serif',
                    }}
                  >
                    {v.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3
                    className="font-orbitron font-bold text-sm mb-2 leading-snug"
                    style={{ color: '#E8F4FD' }}
                  >
                    {v.title}
                  </h3>
                  <div
                    className="text-xs"
                    style={{ color: 'rgba(232,244,253,0.4)', fontFamily: 'Inter, sans-serif' }}
                  >
                    {v.views} views
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Helplines */}
        {activeTab === 'helplines' && (
          <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
            {helplines.map((h) => (
              <div
                key={h.name}
                className="glass rounded-xl p-5 transition-all duration-200 hover:scale-[1.02]"
                style={{ border: `1.5px solid rgba(${hexToRgb(h.color)}, 0.2)` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      background: `rgba(${hexToRgb(h.color)}, 0.12)`,
                      border: `1px solid rgba(${hexToRgb(h.color)}, 0.3)`,
                    }}
                  >
                    {h.emoji}
                  </div>
                  <div>
                    <div
                      className="font-orbitron font-bold text-sm mb-1"
                      style={{ color: h.color, letterSpacing: '0.06em' }}
                    >
                      {h.name}
                    </div>
                    <div
                      className="text-sm font-semibold mb-0.5"
                      style={{ color: '#E8F4FD', fontFamily: 'Inter, sans-serif' }}
                    >
                      {h.detail}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: 'rgba(232,244,253,0.5)', fontFamily: 'Inter, sans-serif' }}
                    >
                      {h.sub}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Emergency note */}
            <div
              className="sm:col-span-2 rounded-xl p-4 text-center"
              style={{
                background: 'rgba(255,68,68,0.1)',
                border: '1px solid rgba(255,68,68,0.3)',
              }}
            >
              <p
                className="text-sm font-semibold"
                style={{ color: '#FF6B6B', fontFamily: 'Inter, sans-serif' }}
              >
                🚨 If you are in immediate danger, call <strong>15</strong> (Police) or{' '}
                <strong>1122</strong> (Emergency).
              </p>
            </div>
          </div>
        )}

        {/* Gaming Safety */}
        {activeTab === 'gaming' && (
          <div className="animate-fade-in">
            <div
              className="rounded-2xl p-6 mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(10,36,99,0.6))',
                border: '1.5px solid rgba(0,212,255,0.2)',
              }}
            >
              <h2
                className="font-orbitron font-bold text-xl mb-2"
                style={{ color: '#00D4FF' }}
              >
                🎮 Gaming Safety Guide
              </h2>
              <p
                className="text-sm"
                style={{ color: 'rgba(232,244,253,0.7)', fontFamily: 'Inter, sans-serif' }}
              >
                Pakistani gamers — PUBG, Free Fire, Roblox, Valorant — are among the most
                targeted by scammers. Know the rules of the game.
              </p>
            </div>
            <div className="space-y-3">
              {gamingTips.map((t, i) => (
                <div
                  key={i}
                  className="glass rounded-xl p-4 flex items-start gap-4"
                  style={{ border: '1px solid rgba(0,212,255,0.12)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{
                      background: 'rgba(0,212,255,0.1)',
                      border: '1px solid rgba(0,212,255,0.2)',
                    }}
                  >
                    {t.icon}
                  </div>
                  <p
                    className="text-sm leading-relaxed mt-1"
                    style={{ color: 'rgba(232,244,253,0.8)', fontFamily: 'Inter, sans-serif' }}
                  >
                    {t.tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Media */}
        {activeTab === 'social' && (
          <div className="animate-fade-in">
            <div
              className="rounded-2xl p-6 mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(106,13,173,0.2), rgba(10,36,99,0.6))',
                border: '1.5px solid rgba(106,13,173,0.3)',
              }}
            >
              <h2
                className="font-orbitron font-bold text-xl mb-2"
                style={{ color: '#9B30FF' }}
              >
                📱 Social Media Safety
              </h2>
              <p
                className="text-sm"
                style={{ color: 'rgba(232,244,253,0.7)', fontFamily: 'Inter, sans-serif' }}
              >
                Instagram, TikTok, Snapchat, WhatsApp — these platforms are designed to share.
                Here is how to control what you share and with whom.
              </p>
            </div>
            <div className="space-y-3">
              {socialTips.map((t, i) => (
                <div
                  key={i}
                  className="glass rounded-xl p-4 flex items-start gap-4"
                  style={{ border: '1px solid rgba(106,13,173,0.15)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{
                      background: 'rgba(106,13,173,0.12)',
                      border: '1px solid rgba(106,13,173,0.25)',
                    }}
                  >
                    {t.icon}
                  </div>
                  <p
                    className="text-sm leading-relaxed mt-1"
                    style={{ color: 'rgba(232,244,253,0.8)', fontFamily: 'Inter, sans-serif' }}
                  >
                    {t.tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-3 animate-fade-in">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="glass rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  border:
                    expandedFaq === i
                      ? '1.5px solid rgba(0,212,255,0.3)'
                      : '1px solid rgba(0,212,255,0.12)',
                }}
              >
                <button
                  className="w-full text-left p-4 flex items-center justify-between gap-4"
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                >
                  <span
                    className="font-orbitron font-bold text-sm leading-snug"
                    style={{ color: expandedFaq === i ? '#00D4FF' : '#E8F4FD' }}
                  >
                    {f.q}
                  </span>
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-transform duration-200"
                    style={{
                      background: 'rgba(0,212,255,0.1)',
                      border: '1px solid rgba(0,212,255,0.2)',
                      color: '#00D4FF',
                      transform: expandedFaq === i ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    +
                  </span>
                </button>
                {expandedFaq === i && (
                  <div
                    className="px-4 pb-4 animate-fade-in"
                    style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}
                  >
                    <p
                      className="text-sm leading-relaxed pt-3"
                      style={{ color: 'rgba(232,244,253,0.75)', fontFamily: 'Inter, sans-serif' }}
                    >
                      {f.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
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
