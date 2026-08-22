import React from 'react';
import type { PlaybookStep, PreventionTip } from '../../data/cases';

export default function GameZoneDebrief({ engine, onExit }: { engine: any; onExit?: () => void }) {
  const badge = engine.calculateBadge();
  const debrief = engine.getDebrief();
  const { threatMeter } = engine;
  
  // Badge config
  const badgeConfig = {
    elite: { text: 'ELITE DEFENDER', color: 'var(--gz-safe)', icon: '🛡️' },
    defender: { text: 'SHIELD DEFENDER', color: 'var(--gz-warn)', icon: '🛡️' },
    rookie: { text: 'SHIELD ROOKIE', color: 'var(--gz-danger)', icon: '🔰' }
  }[badge as 'elite' | 'defender' | 'rookie'];

  let threatColor = 'var(--gz-safe)';
  if (threatMeter >= 30) threatColor = 'var(--gz-warn)';
  if (threatMeter > 60) threatColor = 'var(--gz-danger)';

  return (
    <div className="max-w-[760px] mx-auto pt-7 px-4 pb-20 animate-fade-in">
      
      {/* HUD Bar */}
      <div 
        className="flex items-center justify-between p-[14px_18px] rounded-[14px] mb-8"
        style={{
          border: '1px solid var(--gz-line)',
          background: 'linear-gradient(90deg, rgba(123,97,255,0.08) 0%, transparent 100%)'
        }}
      >
        <div className="font-mono text-[11px] uppercase tracking-wide flex gap-1">
          <span style={{ color: 'var(--gz-muted)' }}>CYBERSHIELD //</span>
          <span className="font-bold" style={{ color: 'var(--gz-text)' }}>CASE CLOSED</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase" style={{ color: 'var(--gz-muted)', letterSpacing: '1px' }}>
            FINAL THREAT
          </span>
          <div className="w-[110px] h-[8px] rounded-full overflow-hidden" style={{ background: '#1B2236', border: '1px solid var(--gz-line)' }}>
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${threatMeter}%`, background: threatColor }}
            />
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="text-center mb-10">
        <div 
          className="inline-flex items-center gap-1.5 p-[8px_18px] rounded-full mb-4"
          style={{
            background: `rgba(${badge === 'elite' ? '51,214,166' : badge === 'defender' ? '255,184,77' : '255,84,104'}, 0.1)`,
            border: `1px solid ${badgeConfig.color}`
          }}
        >
          <span>{badgeConfig.icon}</span>
          <span className="font-orbitron text-[12px] tracking-[1px]" style={{ color: badgeConfig.color }}>
            {badgeConfig.text}
          </span>
        </div>
        
        <h1 className="font-orbitron font-bold text-[14px] mb-2" style={{ color: 'var(--gz-text)' }}>
          {debrief.heading}
        </h1>
        
        <p className="text-[14px] mx-auto max-w-[480px] leading-relaxed" style={{ color: 'var(--gz-muted)', fontFamily: 'Manrope, Inter, sans-serif' }}>
          {debrief.subtext}
        </p>
      </div>

      {/* Red Flags (Spot This Scam Instantly) */}
      {debrief.redFlags && debrief.redFlags.length > 0 && (
        <div className="mb-10">
          <h3 className="font-orbitron font-bold text-[14px] mb-4" style={{ color: 'var(--gz-text)', letterSpacing: '1px' }}>
            SPOT THIS SCAM INSTANTLY
          </h3>
          <div className="flex flex-col gap-3">
            {debrief.redFlags.map((flag: any, i: number) => (
              <div 
                key={i} 
                className="rounded-[12px] p-[16px_18px] flex gap-4 items-start"
                style={{ 
                  background: 'rgba(255,84,104,0.08)', 
                  border: '1px solid var(--gz-danger)' 
                }}
              >
                <div className="font-orbitron text-[18px] font-bold mt-0.5" style={{ color: 'var(--gz-danger)' }}>
                  {i < 9 ? `0${i + 1}` : i + 1}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="font-bold text-[14.5px] leading-tight" style={{ color: 'var(--gz-text)', fontFamily: 'Manrope, Inter, sans-serif' }}>
                    {flag.title}
                  </div>
                  <div className="text-[13px] leading-relaxed" style={{ color: 'var(--gz-muted)', fontFamily: 'Manrope, Inter, sans-serif' }}>
                    {flag.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Playbook */}
      <div className="mb-10">
        <h3 className="font-orbitron font-bold text-[14px] mb-4" style={{ color: 'var(--gz-text)', letterSpacing: '1px' }}>
          RECOVERY PLAYBOOK
        </h3>
        <div 
          className="rounded-[18px] p-[22px] flex flex-col"
          style={{ background: 'var(--gz-panel)', border: '1px solid var(--gz-line)', boxShadow: '0 20px 40px -20px rgba(0,0,0,0.6)' }}
        >
          {debrief.playbook.map((step: any, i: number) => (
            <div 
              key={i} 
              className="flex gap-[12px] py-[13px]"
              style={{ borderBottom: i === debrief.playbook.length - 1 ? 'none' : '1px solid var(--gz-line)' }}
            >
              <div className="font-orbitron text-[18px] font-bold w-[26px] flex-shrink-0" style={{ color: 'var(--gz-primary)' }}>
                {i < 9 ? `0${i + 1}` : i + 1}
              </div>
              <div className="flex flex-col gap-1 mt-0.5">
                <div className="font-bold text-[14.5px] leading-tight" style={{ color: 'var(--gz-text)', fontFamily: 'Manrope, Inter, sans-serif' }}>
                  {step.title}
                </div>
                <div className="text-[13px] leading-relaxed" style={{ color: 'var(--gz-muted)', fontFamily: 'Manrope, Inter, sans-serif' }}>
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prevention Grid */}
      <div className="mb-10">
        <h3 className="font-orbitron font-bold text-[14px] mb-4" style={{ color: 'var(--gz-text)', letterSpacing: '1px' }}>
          PREVENT THE NEXT ONE
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
          {debrief.prevention.map((tip: any, i: number) => (
            <div 
              key={i} 
              className="rounded-[12px] p-[12px_14px]"
              style={{ background: 'var(--gz-panel-2)', border: '1px solid var(--gz-line)' }}
            >
              <div className="font-bold text-[13px] mb-1 leading-snug" style={{ color: 'var(--gz-text)', fontFamily: 'Manrope, Inter, sans-serif' }}>
                {tip.title}
              </div>
              <div className="text-[12.5px] leading-relaxed" style={{ color: 'var(--gz-muted)', fontFamily: 'Manrope, Inter, sans-serif' }}>
                {tip.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 mb-4" style={{ borderTop: '1px solid var(--gz-line)' }}>
        <button
          onClick={() => engine.resetGame()}
          className="w-full sm:w-auto font-semibold text-[13px] rounded-[12px] p-[11px_20px] transition-colors"
          style={{ background: 'transparent', border: '1px solid var(--gz-line)', color: 'var(--gz-muted)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--gz-primary)';
            e.currentTarget.style.color = 'var(--gz-text)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--gz-line)';
            e.currentTarget.style.color = 'var(--gz-muted)';
          }}
        >
          ↻ Replay the Case
        </button>
        {onExit && (
          <button
            onClick={onExit}
            className="w-full sm:w-auto font-semibold text-[13px] rounded-[12px] p-[11px_20px] transition-colors"
            style={{ background: 'var(--gz-primary)', border: '1px solid var(--gz-primary)', color: '#fff' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#6a52e6';
              e.currentTarget.style.borderColor = '#6a52e6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--gz-primary)';
              e.currentTarget.style.borderColor = 'var(--gz-primary)';
            }}
          >
            ← Back to Hub
          </button>
        )}
      </div>
      <div className="text-center">
        <p className="text-[11.5px]" style={{ color: 'var(--gz-muted)', fontFamily: 'Manrope, Inter, sans-serif' }}>
          CyberShield training scenario · Nova Arena, Kian, and Zara are fictional, built to teach real account-recovery steps.
        </p>
      </div>

    </div>
  );
}
