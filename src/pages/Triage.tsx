import { useState } from 'react'
import { updateUserStats, type UserProfile } from '../lib/auth'

type Page = 'landing' | 'game' | 'triage' | 'resources' | 'auth' | 'profile'

interface TriageProps {
  onNavigate: (page: Page) => void
  user: UserProfile | null
  onUserUpdate: (user: UserProfile) => void
}

type IncidentType =
  | 'account_hacked'
  | 'cyberbullying'
  | 'sextortion'
  | 'scam'
  | 'predator'
  | 'privacy'
  | null

type NeedType = 'recover' | 'report' | 'support' | 'stay_safe' | null

interface ChecklistItem {
  id: string
  text: string
  done: boolean
}

const incidents = [
  { id: 'account_hacked' as const, icon: '🔓', label: 'My account was hacked', desc: 'Someone took over my email, Instagram, WhatsApp, or game account' },
  { id: 'cyberbullying' as const, icon: '💬', label: 'I am being bullied online', desc: 'Harassment, threats, or humiliation on social media or gaming' },
  { id: 'sextortion' as const, icon: '🚨', label: 'Someone is threatening me with photos', desc: 'Demanding money or more images under threat of sharing private content' },
  { id: 'scam' as const, icon: '💳', label: 'I was scammed', desc: 'Lost money to fake apps, fake UPI, gaming scams, or phishing' },
  { id: 'predator' as const, icon: '⚠', label: 'Someone online made me uncomfortable', desc: 'An adult or stranger online is pressuring, grooming, or manipulating me' },
  { id: 'privacy' as const, icon: '👁', label: 'My private info was leaked', desc: 'Personal photos, location, ID, or data was shared without my permission' },
]

const needs = [
  { id: 'recover' as const, icon: '🔧', label: 'Recover my account or data', desc: 'Step-by-step help getting back what was taken' },
  { id: 'report' as const, icon: '📋', label: 'Report it officially', desc: 'File a complaint with N-CERT, FIA, or the platform' },
  { id: 'support' as const, icon: '💙', label: 'Talk to someone / get emotional support', desc: 'This is tough. Connect with a counselor or helpline' },
  { id: 'stay_safe' as const, icon: '🛡', label: 'Make sure I am safe now', desc: 'Lock down my accounts and protect myself going forward' },
]

const playbooks: Record<string, { title: string; intro: string; steps: string[]; contacts: { name: string; detail: string; color: string }[] }> = {
  account_hacked_recover: {
    title: 'Account Recovery Playbook',
    intro: 'Your account may still be recoverable. Move fast — every minute matters.',
    steps: [
      'On a DIFFERENT device, go to the platform\'s official login page (not a link in a message)',
      'Use "Forgot Password" with your phone number or backup email',
      'Once in, immediately change your password to something strong and unique (e.g., PakTech!2024##)',
      'Enable Two-Factor Authentication (2FA) under Settings → Security',
      'Go to Settings → Security → Active Sessions — revoke all sessions you do not recognize',
      'Check your email/phone for connected apps — remove anything suspicious',
      'Alert your contacts that your account was compromised so they ignore any suspicious messages from your old account',
      'Screenshot everything unusual for evidence',
    ],
    contacts: [
      { name: 'N-CERT Pakistan', detail: 'Report: ncert.gov.pk | Email: incident@ncert.gov.pk', color: '#00D4FF' },
      { name: 'FIA Cyber Crime Wing', detail: 'Helpline: 9911 | Website: fia.gov.pk/cybercrime', color: '#9B30FF' },
    ],
  },
  account_hacked_stay_safe: {
    title: 'Post-Hack Security Lockdown',
    intro: 'Time to fortify. Here is your 8-step security lockdown checklist.',
    steps: [
      'Change passwords on ALL accounts that share the same password as the hacked one',
      'Enable 2FA on every important account — use an authenticator app, not just SMS',
      'Review which apps have access to your Google/Facebook — revoke all unused ones',
      'Check your phone for any apps you did not install — delete them',
      'Never save passwords in browser autofill — use a proper password manager',
      'Set up a recovery phone number on all accounts',
      'Tell a parent or trusted adult what happened — you did nothing wrong',
      'Monitor your bank or mobile money accounts for unauthorized transactions',
    ],
    contacts: [
      { name: 'N-CERT Pakistan', detail: 'ncert.gov.pk | 24/7 incident response', color: '#00D4FF' },
    ],
  },
  cyberbullying_recover: {
    title: 'Cyberbullying Response Playbook',
    intro: 'You do not deserve this. Here is exactly what to do right now.',
    steps: [
      'DO NOT respond to the bully — it often makes things worse',
      'Screenshot everything: messages, posts, accounts (date + time visible)',
      'Block the bully on every platform they contacted you on',
      'Report the content on the platform (Instagram, TikTok, WhatsApp) — platforms take this seriously',
      'If it involves classmates, print screenshots and talk to a teacher or school counselor',
      'Tell a parent, sibling, or adult you trust — you do not have to handle this alone',
      'If threats are involved (violence, sharing images), file a police report with your screenshots',
      'Take care of yourself — step offline for a bit if you need to. That is brave, not weak.',
    ],
    contacts: [
      { name: 'Umang Helpline', detail: '0317-4288665 · Free · Urdu & English', color: '#FF6B9D' },
      { name: 'N-CERT', detail: 'ncert.gov.pk — report cyberbullying incidents', color: '#00D4FF' },
    ],
  },
  cyberbullying_support: {
    title: 'You Are Not Alone',
    intro: 'What is happening to you is not your fault. You deserve support.',
    steps: [
      'Reach out to Umang helpline — they have trained counselors who understand your situation',
      'Talk to your school counselor if you feel comfortable — they are bound to protect you',
      'Join the N-CERT youth community on their website — connect with peers',
      'Write about your feelings — journaling can help process what happened',
      'Temporarily restrict your social media to close friends only while this settles',
      'Remember: online bullying says everything about the bully, nothing about you',
    ],
    contacts: [
      { name: 'Umang Helpline', detail: '0317-4288665 · Available 9am-9pm · Free', color: '#FF6B9D' },
      { name: 'Rozan Counseling', detail: '051-2890505 · Islamabad · Free for youth', color: '#9B30FF' },
    ],
  },
  sextortion_recover: {
    title: 'Sextortion: Immediate Action Plan',
    intro: 'Stop. Breathe. This is NOT your fault. Thousands of people go through this — you are not alone, and there is a way through it.',
    steps: [
      '⛔ DO NOT pay — paying ALWAYS leads to more demands, never safety',
      '⛔ DO NOT send more images — this makes it significantly worse',
      'Screenshot all messages and the account threatening you',
      'Block the account on every platform (this does not delete their copies, but stops further contact)',
      'Report to the platform — platforms remove this content quickly once reported',
      'Contact N-CERT or FIA Cyber Crime Wing — they deal with this daily and will not judge you',
      'Tell a parent or adult you trust — you need support and legal protection',
      'Know your rights: sharing intimate images without consent is a criminal offense in Pakistan under PECA 2016',
    ],
    contacts: [
      { name: 'N-CERT Emergency', detail: 'ncert.gov.pk | incident@ncert.gov.pk', color: '#00D4FF' },
      { name: 'FIA Cyber Crime (EMERGENCY)', detail: 'Helpline: 9911 · Available 24/7', color: '#FF6B6B' },
      { name: 'Digital Rights Foundation', detail: 'Cyber Harassment Helpline: 0800-39393 · Free · Confidential', color: '#FF6B9D' },
    ],
  },
  scam_recover: {
    title: 'Scam Recovery Playbook',
    intro: 'You are not the first and you will not be the last. Let\'s try to limit the damage.',
    steps: [
      'If you shared bank details or JazzCash/Easypaisa info — call your bank/wallet immediately to freeze the account',
      'Change your mobile banking password and PIN right now',
      'Screenshot everything: messages, payment receipts, screenshots of the fake website',
      'File a complaint with FIA Cyber Crime Wing — they can sometimes trace and freeze fraudulent accounts',
      'Report the scam number/account to PTA: pta.gov.pk/complaints',
      'Alert family members about the scam method so they do not fall victim',
      'Check if your personal info was leaked — change passwords on important accounts',
      'In future: verify ANY payment request or prize claim by calling the official number first',
    ],
    contacts: [
      { name: 'FIA Cyber Crime Wing', detail: 'Helpline: 9911 | fia.gov.pk/cybercrime', color: '#9B30FF' },
      { name: 'PTA Complaint', detail: 'pta.gov.pk/complaints | 0800-55055', color: '#00D4FF' },
      { name: 'JazzCash Fraud', detail: '111-124-724 | Report within 24 hours', color: '#FF8C42' },
    ],
  },
  predator_support: {
    title: 'Online Predator: You Are Safe Now',
    intro: 'What this person did was wrong and illegal. You did nothing to cause this. Here is how to protect yourself.',
    steps: [
      'Stop all contact immediately — block the person on every platform',
      'Do NOT delete the messages yet — they are evidence',
      'Screenshot all conversations and keep them somewhere safe',
      'Tell a parent, guardian, or school counselor — this is too important to handle alone',
      'Contact N-CERT or FIA — online grooming and predatory behavior is a criminal offense',
      'If you feel unsafe at any time, call the emergency helpline Umang (0317-4288665)',
      'If the person knows where you live, contact local police immediately',
      'Be gentle with yourself — you were manipulated by an experienced adult. This is not your fault.',
    ],
    contacts: [
      { name: 'Umang Helpline', detail: '0317-4288665 · 24/7 for youth emergencies', color: '#FF6B9D' },
      { name: 'FIA Cyber Crime', detail: '9911 · Report predatory behavior', color: '#FF6B6B' },
      { name: 'Child Protection & Welfare Bureau', detail: '1121 · Free · Confidential', color: '#FFD700' },
    ],
  },
  privacy_stay_safe: {
    title: 'Privacy Breach Recovery',
    intro: 'Your data is out there — but you can still limit the damage and protect yourself going forward.',
    steps: [
      'Identify exactly what was leaked: photos, location, ID number, phone, email?',
      'If intimate images: report to the platform immediately — they have teams for this',
      'If your location was shared: change your daily routine temporarily and tell trusted people',
      'If ID or financial info: contact NADRA and your bank to watch for identity fraud',
      'Request content removal from platforms — most have dedicated forms for non-consensual content',
      'Review all your social media privacy settings: set to "Friends Only" or private',
      'Do a reverse image search of your photos to see if they appear elsewhere',
      'Change all passwords that could give access to more personal data',
    ],
    contacts: [
      { name: 'Digital Rights Foundation', detail: '0800-39393 · Privacy & image removal help', color: '#FF6B9D' },
      { name: 'N-CERT', detail: 'ncert.gov.pk · Data breach reporting', color: '#00D4FF' },
    ],
  },
}

function getPlaybookKey(incident: IncidentType, need: NeedType): string {
  const key = `${incident}_${need}`
  if (playbooks[key]) return key
  const fallbacks: Record<string, string> = {
    account_hacked: 'account_hacked_recover',
    cyberbullying: 'cyberbullying_recover',
    sextortion: 'sextortion_recover',
    scam: 'scam_recover',
    predator: 'predator_support',
    privacy: 'privacy_stay_safe',
  }
  return fallbacks[incident ?? ''] ?? 'account_hacked_recover'
}

export default function Triage({ onNavigate, user, onUserUpdate }: TriageProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [incident, setIncident] = useState<IncidentType>(null)
  const [need, setNeed] = useState<NeedType>(null)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])

  function goToStep2(incidentId: IncidentType) {
    setIncident(incidentId)
    setStep(2)
  }

  function goToStep3(needId: NeedType) {
    setNeed(needId)
    const playbookKey = getPlaybookKey(incident, needId)
    const pb = playbooks[playbookKey]
    if (pb) {
      setChecklist(pb.steps.map((text, i) => ({ id: `step-${i}`, text, done: false })))
    }
    setStep(3)
    if (user) {
      const updated = updateUserStats(user, {
        reportsSubmitted: user.stats.reportsSubmitted + 1,
        newBadgeIds: ['reporter'],
        xpGain: 50,
      })
      onUserUpdate(updated)
    }
  }

  function toggleItem(id: string) {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    )
  }

  function reset() {
    setStep(1)
    setIncident(null)
    setNeed(null)
    setChecklist([])
  }

  const playbookKey = getPlaybookKey(incident, need)
  const playbook = playbooks[playbookKey]
  const doneCount = checklist.filter((c) => c.done).length
  const donePercent = checklist.length > 0 ? (doneCount / checklist.length) * 100 : 0

  return (
    <div className="min-h-screen grid-bg pt-20 pb-16 px-4" style={{ background: '#0B132B' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <div
            className="inline-block px-3 py-1.5 rounded-full text-xs font-bold mb-4"
            style={{
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.3)',
              color: '#00D4FF',
              fontFamily: 'Orbitron, sans-serif',
              letterSpacing: '0.1em',
            }}
          >
            🔒 100% ANONYMOUS · ZERO JUDGMENT
          </div>
          <h1
            className="font-orbitron font-black text-2xl md:text-3xl mb-3"
            style={{ color: '#E8F4FD' }}
          >
            GET HELP IN{' '}
            <span className="neon-text" style={{ color: '#00D4FF' }}>
              3 STEPS
            </span>
          </h1>
          <p
            className="text-sm max-w-md mx-auto"
            style={{ color: 'rgba(232,244,253,0.65)', fontFamily: 'Inter, sans-serif' }}
          >
            No names. No judgment. Just real help from people who have your back. You are brave
            for being here.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {([1, 2, 3] as const).map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-orbitron font-bold text-sm transition-all duration-300"
                  style={{
                    background:
                      step === s
                        ? 'linear-gradient(135deg, #00D4FF, #0099CC)'
                        : step > s
                        ? 'rgba(46,204,113,0.3)'
                        : 'rgba(10,36,99,0.5)',
                    border:
                      step === s
                        ? '2px solid #00D4FF'
                        : step > s
                        ? '2px solid rgba(46,204,113,0.6)'
                        : '2px solid rgba(0,212,255,0.2)',
                    color:
                      step === s ? '#0B132B' : step > s ? '#2ecc71' : 'rgba(232,244,253,0.4)',
                    boxShadow: step === s ? '0 0 16px rgba(0,212,255,0.4)' : 'none',
                  }}
                >
                  {step > s ? '✓' : s}
                </div>
                <div
                  className="text-xs mt-1 font-orbitron"
                  style={{
                    color:
                      step === s
                        ? '#00D4FF'
                        : step > s
                        ? '#2ecc71'
                        : 'rgba(232,244,253,0.3)',
                    letterSpacing: '0.06em',
                    fontSize: '0.6rem',
                  }}
                >
                  {s === 1 ? 'WHAT' : s === 2 ? 'NEED' : 'PLAN'}
                </div>
              </div>
              {s < 3 && (
                <div
                  className="w-12 h-0.5 mb-4"
                  style={{
                    background:
                      step > s
                        ? 'linear-gradient(90deg, #2ecc71, rgba(46,204,113,0.4))'
                        : 'rgba(0,212,255,0.1)',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="animate-slide-up">
            <h2
              className="font-orbitron font-bold text-lg mb-6 text-center"
              style={{ color: '#E8F4FD' }}
            >
              What happened to you?
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {incidents.map((inc) => (
                <button
                  key={inc.id}
                  onClick={() => goToStep2(inc.id)}
                  className="text-left glass rounded-xl p-4 transition-all duration-200 group"
                  style={{ border: '1.5px solid rgba(0,212,255,0.12)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'
                    e.currentTarget.style.background = 'rgba(0,212,255,0.07)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.12)'
                    e.currentTarget.style.background = 'rgba(10,36,99,0.35)'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{
                        background: 'rgba(0,212,255,0.1)',
                        border: '1px solid rgba(0,212,255,0.2)',
                      }}
                    >
                      {inc.icon}
                    </div>
                    <div>
                      <div
                        className="font-orbitron font-bold text-xs mb-1"
                        style={{ color: '#E8F4FD', letterSpacing: '0.06em' }}
                      >
                        {inc.label}
                      </div>
                      <div
                        className="text-xs leading-snug"
                        style={{ color: 'rgba(232,244,253,0.55)', fontFamily: 'Inter, sans-serif' }}
                      >
                        {inc.desc}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <p
              className="text-center text-xs mt-6"
              style={{ color: 'rgba(232,244,253,0.4)', fontFamily: 'Inter, sans-serif' }}
            >
              Your choice is anonymous. We do not log, store, or share any identifying information.
            </p>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="animate-slide-up">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 mb-6 text-xs"
              style={{ color: 'rgba(0,212,255,0.6)', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.08em' }}
            >
              ← Back
            </button>

            <div
              className="glass rounded-xl p-3 mb-6 flex items-center gap-3"
              style={{ border: '1px solid rgba(0,212,255,0.15)' }}
            >
              <span className="text-xl">{incidents.find((i) => i.id === incident)?.icon}</span>
              <span
                className="font-orbitron text-xs font-semibold"
                style={{ color: 'rgba(0,212,255,0.8)', letterSpacing: '0.06em' }}
              >
                {incidents.find((i) => i.id === incident)?.label}
              </span>
            </div>

            <h2
              className="font-orbitron font-bold text-lg mb-6 text-center"
              style={{ color: '#E8F4FD' }}
            >
              What do you need most right now?
            </h2>
            <div className="space-y-3">
              {needs.map((n) => (
                <button
                  key={n.id}
                  onClick={() => goToStep3(n.id)}
                  className="w-full text-left glass rounded-xl p-4 transition-all duration-200"
                  style={{ border: '1.5px solid rgba(0,212,255,0.12)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(106,13,173,0.5)'
                    e.currentTarget.style.background = 'rgba(106,13,173,0.12)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.12)'
                    e.currentTarget.style.background = 'rgba(10,36,99,0.35)'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{
                        background: 'rgba(106,13,173,0.15)',
                        border: '1px solid rgba(106,13,173,0.3)',
                      }}
                    >
                      {n.icon}
                    </div>
                    <div>
                      <div
                        className="font-orbitron font-bold text-sm mb-0.5"
                        style={{ color: '#E8F4FD', letterSpacing: '0.06em' }}
                      >
                        {n.label}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: 'rgba(232,244,253,0.55)', fontFamily: 'Inter, sans-serif' }}
                      >
                        {n.desc}
                      </div>
                    </div>
                    <div
                      className="ml-auto text-sm flex-shrink-0"
                      style={{ color: 'rgba(0,212,255,0.4)' }}
                    >
                      →
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Playbook */}
        {step === 3 && playbook && (
          <div className="animate-slide-up">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 mb-6 text-xs"
              style={{ color: 'rgba(0,212,255,0.6)', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.08em' }}
            >
              ← Back
            </button>

            {/* Playbook header */}
            <div
              className="rounded-2xl p-6 mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(10,36,99,0.7), rgba(106,13,173,0.3))',
                border: '1.5px solid rgba(0,212,255,0.25)',
                boxShadow: '0 0 30px rgba(0,212,255,0.08)',
              }}
            >
              <div
                className="inline-block px-2 py-1 rounded text-xs font-bold mb-3"
                style={{
                  background: 'rgba(0,212,255,0.12)',
                  border: '1px solid rgba(0,212,255,0.3)',
                  color: '#00D4FF',
                  fontFamily: 'Orbitron, sans-serif',
                  letterSpacing: '0.08em',
                }}
              >
                📋 YOUR PLAYBOOK
              </div>
              <h2
                className="font-orbitron font-bold text-xl mb-3"
                style={{ color: '#E8F4FD' }}
              >
                {playbook.title}
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(232,244,253,0.75)', fontFamily: 'Inter, sans-serif' }}
              >
                {playbook.intro}
              </p>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-between mb-2">
              <span
                className="font-orbitron text-xs font-bold"
                style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.08em' }}
              >
                PROGRESS
              </span>
              <span
                className="font-orbitron text-xs font-bold"
                style={{ color: donePercent === 100 ? '#2ecc71' : '#00D4FF' }}
              >
                {doneCount}/{checklist.length} done
              </span>
            </div>
            <div className="progress-bar mb-6">
              <div className="progress-fill" style={{ width: `${donePercent}%` }} />
            </div>

            {/* Checklist */}
            <div className="space-y-3 mb-8">
              {checklist.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className="w-full text-left rounded-xl p-4 transition-all duration-200"
                  style={{
                    background: item.done
                      ? 'rgba(46,204,113,0.1)'
                      : 'rgba(10,36,99,0.35)',
                    border: item.done
                      ? '1px solid rgba(46,204,113,0.35)'
                      : '1px solid rgba(0,212,255,0.12)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-md flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200"
                      style={{
                        background: item.done
                          ? 'rgba(46,204,113,0.3)'
                          : 'rgba(0,212,255,0.08)',
                        border: item.done
                          ? '1.5px solid rgba(46,204,113,0.6)'
                          : '1.5px solid rgba(0,212,255,0.25)',
                      }}
                    >
                      {item.done && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke="#2ecc71" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-start gap-2 flex-1">
                      <span
                        className="font-orbitron text-xs flex-shrink-0 mt-0.5"
                        style={{ color: item.done ? '#2ecc71' : 'rgba(0,212,255,0.5)' }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span
                        className="text-sm leading-snug"
                        style={{
                          color: item.done ? 'rgba(232,244,253,0.5)' : 'rgba(232,244,253,0.85)',
                          fontFamily: 'Inter, sans-serif',
                          textDecoration: item.done ? 'line-through' : 'none',
                        }}
                      >
                        {item.text}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Contacts */}
            <div
              className="rounded-xl p-5 mb-6"
              style={{
                background: 'rgba(10,36,99,0.4)',
                border: '1px solid rgba(0,212,255,0.15)',
              }}
            >
              <div
                className="font-orbitron font-bold text-xs mb-4"
                style={{ color: '#00D4FF', letterSpacing: '0.1em' }}
              >
                📞 CONTACTS & HELPLINES
              </div>
              <div className="space-y-3">
                {playbook.contacts.map((c) => (
                  <div
                    key={c.name}
                    className="rounded-lg p-3"
                    style={{
                      background: `rgba(${hexToRgb(c.color)}, 0.08)`,
                      border: `1px solid rgba(${hexToRgb(c.color)}, 0.25)`,
                    }}
                  >
                    <div
                      className="font-orbitron font-bold text-xs mb-0.5"
                      style={{ color: c.color, letterSpacing: '0.06em' }}
                    >
                      {c.name}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: 'rgba(232,244,253,0.65)', fontFamily: 'Inter, sans-serif' }}
                    >
                      {c.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completion message */}
            {donePercent === 100 && (
              <div
                className="rounded-xl p-5 mb-6 text-center animate-fade-in"
                style={{
                  background: 'linear-gradient(135deg, rgba(46,204,113,0.15), rgba(0,212,255,0.1))',
                  border: '1.5px solid rgba(46,204,113,0.4)',
                  boxShadow: '0 0 24px rgba(46,204,113,0.15)',
                }}
              >
                <div className="text-3xl mb-2">🎉</div>
                <div
                  className="font-orbitron font-bold text-sm mb-1"
                  style={{ color: '#2ecc71' }}
                >
                  You completed the playbook!
                </div>
                <p
                  className="text-xs"
                  style={{ color: 'rgba(232,244,253,0.65)', fontFamily: 'Inter, sans-serif' }}
                >
                  You handled this with strength. Stay safe and reach out anytime.
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button className="btn-outline" onClick={reset}>
                ← Start Over
              </button>
              <button className="btn-secondary" onClick={() => onNavigate('resources')}>
                📚 More Resources
              </button>
            </div>
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
