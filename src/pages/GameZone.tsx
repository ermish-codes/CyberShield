import React, { useState } from 'react';
import { cases, type CaseFile } from '../data/cases';
import { useGameEngine } from '../lib/gameEngine';
import GameZoneHub from '../components/gamezone/GameZoneHub';
import GameZonePlay from '../components/gamezone/GameZonePlay';
import GameZoneDebrief from '../components/gamezone/GameZoneDebrief';

// Wrapper component to manage engine state for a specific case
function GameZoneSession({ caseFile, onExit }: { caseFile: CaseFile; onExit: () => void }) {
  const engine = useGameEngine(caseFile);

  // Background blooms (part of the design system)
  return (
    <div className="relative min-h-screen pt-16">
      {/* Top Left Violet Bloom */}
      <div 
        className="fixed pointer-events-none" 
        style={{
          width: '45vw', height: '45vw',
          left: '15%', top: '-10%', transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(123,97,255,0.16) 0%, rgba(123,97,255,0) 70%)',
          zIndex: 0
        }}
      />
      
      {/* Top Right Green Bloom */}
      <div 
        className="fixed pointer-events-none" 
        style={{
          width: '40vw', height: '40vw',
          left: '90%', top: '10%', transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(51,214,166,0.10) 0%, rgba(51,214,166,0) 70%)',
          zIndex: 0
        }}
      />

      <div className="relative z-10">
        <button
          onClick={onExit}
          className="absolute top-4 left-4 sm:left-8 text-[12px] font-bold uppercase tracking-wider transition-colors hover:text-white"
          style={{ color: 'var(--gz-muted)', fontFamily: 'Orbitron, sans-serif' }}
        >
          ← Back to Hub
        </button>

        {engine.isComplete ? (
          <GameZoneDebrief engine={engine} onExit={onExit} />
        ) : (
          <GameZonePlay engine={engine} />
        )}
      </div>
    </div>
  );
}

export default function GameZone() {
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);

  if (!activeCaseId) {
    return (
      <div className="min-h-screen pt-16" style={{ background: 'var(--gz-bg)' }}>
        <GameZoneHub cases={cases} onSelectCase={setActiveCaseId} />
      </div>
    );
  }

  const activeCase = cases.find(c => c.id === activeCaseId);
  if (!activeCase) return null; // Fallback

  return (
    <div className="min-h-screen" style={{ background: 'var(--gz-bg)' }}>
      <GameZoneSession caseFile={activeCase} onExit={() => setActiveCaseId(null)} />
    </div>
  );
}
