import React from 'react';
import type { CaseFile } from '../../data/cases';

interface GameZoneHubProps {
  cases: CaseFile[];
  onSelectCase: (caseId: string) => void;
}

export default function GameZoneHub({ cases, onSelectCase }: GameZoneHubProps) {
  return (
    <div className="max-w-[760px] mx-auto pt-7 px-4 animate-fade-in">
      <div className="text-center mb-8">
        <h1
          className="font-orbitron font-black text-[14px] mb-3"
          style={{ color: 'var(--gz-text)' }}
        >
          CYBERSHIELD{' '}
          <span className="neon-text-purple" style={{ color: 'var(--gz-primary)' }}>
            GAMEZONE
          </span>
        </h1>
        <p
          className="text-sm mx-auto"
          style={{ color: 'var(--gz-muted)', fontFamily: 'Inter, sans-serif' }}
        >
          Select a case file to begin your investigation. Follow the evidence, make the right choices, and secure the network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cases.map((c) => (
          <div
            key={c.id}
            className="rounded-[18px] p-[22px] flex flex-col justify-between transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'var(--gz-panel)',
              border: '1px solid var(--gz-line)',
              boxShadow: '0 20px 40px -20px rgba(0,0,0,0.6)',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className="font-mono text-[11px] uppercase"
                  style={{ color: 'var(--gz-primary)', letterSpacing: '2px' }}
                >
                  Case {c.number < 10 ? `0${c.number}` : c.number}
                </span>
                <span
                  className="font-mono text-[10px] px-2 py-0.5 rounded uppercase"
                  style={{
                    background: c.difficulty === 'Easy' ? 'rgba(51,214,166,0.1)' : c.difficulty === 'Medium' ? 'rgba(255,184,77,0.1)' : 'rgba(255,84,104,0.1)',
                    color: c.difficulty === 'Easy' ? 'var(--gz-safe)' : c.difficulty === 'Medium' ? 'var(--gz-warn)' : 'var(--gz-danger)',
                    border: `1px solid ${c.difficulty === 'Easy' ? 'var(--gz-safe)' : c.difficulty === 'Medium' ? 'var(--gz-warn)' : 'var(--gz-danger)'}`
                  }}
                >
                  {c.difficulty}
                </span>
              </div>
              
              <div className="text-3xl mb-3">{c.icon}</div>
              
              <h3 className="font-orbitron font-bold text-[14px] mb-2 leading-snug" style={{ color: 'var(--gz-text)' }}>
                {c.title}
              </h3>
              
              <p className="text-[13.5px] leading-relaxed mb-6" style={{ color: 'var(--gz-muted)', fontFamily: 'Inter, sans-serif' }}>
                {c.description}
              </p>
            </div>
            
            <button
              onClick={() => onSelectCase(c.id)}
              className="w-full font-bold text-[14px] rounded-[12px] py-3 transition-colors"
              style={{
                background: 'var(--gz-primary)',
                color: '#fff',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#6a52e6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--gz-primary)'; }}
            >
              Start Investigation →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
