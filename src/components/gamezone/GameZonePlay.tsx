import React, { useState, useEffect } from 'react';
import type { Choice } from '../../data/cases';
import { useTypewriter } from '../../hooks/useTypewriter';

const DialogueBubble = ({ line, isNova, avatarColor, initial, isActive, isDone, onComplete }: any) => {
  const { displayedText, isComplete, startTyping } = useTypewriter(line.text, 30);

  useEffect(() => {
    if (isActive) {
      startTyping();
    }
  }, [isActive, startTyping]);

  useEffect(() => {
    if (isComplete && isActive) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, isActive, onComplete]);

  if (!isActive && !isDone) return null;

  const textToShow = isDone ? line.text : displayedText;
  const showCursor = isActive && !isComplete;

  return (
    <div className={`flex gap-[12px] animate-slide-up ${isNova ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
        <div className="font-mono text-[10.5px] uppercase tracking-[1px]" style={{ color: 'var(--gz-muted)' }}>
          {line.speaker}
        </div>
        <div 
          className={`w-[38px] h-[38px] rounded-[10px] flex items-center justify-center font-orbitron font-bold text-lg text-[#0A0E1A] ${isActive && !isComplete ? 'animate-pulse-glow' : ''}`}
          style={{ background: avatarColor, boxShadow: isActive && !isComplete ? `0 0 15px ${avatarColor}` : 'none' }}
        >
          {initial}
        </div>
      </div>
      
      {/* Bubble */}
      <div className="flex flex-col mt-5 max-w-[82%]">
        <div 
          className="p-[10px_14px] rounded-[12px]"
          style={{
            background: isNova ? 'rgba(123,97,255,0.12)' : 'var(--gz-panel-2)',
            border: `1px solid ${isNova ? 'var(--gz-primary-dim)' : 'var(--gz-line)'}`,
            color: 'var(--gz-text)',
            fontSize: '14.5px',
            fontFamily: 'Manrope, Inter, sans-serif'
          }}
        >
          {textToShow}
          {showCursor && <span className="animate-blink">|</span>}
        </div>
      </div>
    </div>
  );
};

export default function GameZonePlay({ engine }: { engine: any }) {
  const scene = engine.getCurrentScene();
  const { threatMeter, selectedChoice, currentSceneIndex, caseFile } = engine;
  
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isDialogueComplete, setIsDialogueComplete] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset dialogue queue when scene changes
  useEffect(() => {
    setCurrentDialogueIndex(0);
    setIsDialogueComplete(scene.dialogue.length === 0);
  }, [currentSceneIndex, scene]);

  const handleDialogueComplete = () => {
    if (currentDialogueIndex < scene.dialogue.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      setIsDialogueComplete(true);
    }
  };
  
  // Threat color logic
  let threatColor = 'var(--gz-safe)';
  if (threatMeter >= 30) threatColor = 'var(--gz-warn)';
  if (threatMeter > 60) threatColor = 'var(--gz-danger)';

  // Total scenes for progress
  const totalScenes = caseFile.scenes.length;

  const handleContinue = () => {
    if (currentSceneIndex < totalScenes - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        engine.nextScene();
        setIsTransitioning(false);
      }, 300);
    } else {
      engine.nextScene();
    }
  };

  return (
    <div className={`max-w-[760px] mx-auto pt-7 px-4 pb-20 ${isTransitioning ? 'animate-fade-out' : 'animate-fade-in'}`}>
      
      {/* HUD Bar */}
      <div 
        className="flex items-center justify-between p-[14px_18px] rounded-[14px] mb-[22px]"
        style={{
          border: '1px solid var(--gz-line)',
          background: 'linear-gradient(90deg, rgba(123,97,255,0.08) 0%, transparent 100%)'
        }}
      >
        <div className="font-mono text-[11px] uppercase tracking-wide flex gap-1">
          <span style={{ color: 'var(--gz-muted)' }}>CYBERSHIELD //</span>
          <span className="font-bold" style={{ color: 'var(--gz-text)' }}>LIVE CASE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase" style={{ color: 'var(--gz-muted)', letterSpacing: '1px' }}>
            THREAT
          </span>
          <div className="w-[110px] h-[8px] rounded-full overflow-hidden" style={{ background: '#1B2236', border: '1px solid var(--gz-line)' }}>
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${threatMeter}%`, background: threatColor }}
            />
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex gap-[6px] mb-8">
        {Array.from({ length: totalScenes }).map((_, i) => {
          let bg = '#1B2236'; // empty
          let isCurrent = false;
          if (i < currentSceneIndex) bg = 'var(--gz-primary)'; // done
          else if (i === currentSceneIndex) {
            bg = 'var(--gz-primary-dim)';
            isCurrent = true;
          }
          
          return (
            <div key={i} className="flex-1 h-[5px] rounded-full relative overflow-hidden" style={{ background: bg }}>
              {isCurrent && (
                <div 
                  className="absolute inset-0 bg-[var(--gz-primary)] animate-pulse"
                  style={{ animationDuration: '1.4s' }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Scene Tag & Title */}
      <div className="mb-[12px]">
        <div className="font-mono text-[11px] uppercase mb-1" style={{ color: 'var(--gz-primary)', letterSpacing: '2px' }}>
          {scene.tag}
        </div>
        <h2 className="font-orbitron font-bold text-[14px] leading-tight" style={{ color: 'var(--gz-text)', letterSpacing: '0.5px' }}>
          {scene.title}
        </h2>
      </div>

      {/* Notification Feed */}
      {scene.notificationFeed && scene.notificationFeed.length > 0 && (
        <div className="flex flex-col gap-2 mb-8">
          {scene.notificationFeed.map((notif: string, i: number) => {
            const parts = notif.split(':');
            const isAlert = parts.length > 1;
            
            return (
              <div 
                key={i}
                className="flex items-start gap-3 p-[10px_12px] rounded-[12px] animate-slide-up"
                style={{ background: 'var(--gz-panel-2)', border: '1px solid var(--gz-line)' }}
              >
                <div className="font-mono text-[12.5px] leading-relaxed" style={{ color: 'var(--gz-muted)' }}>
                  {isAlert ? (
                    <>
                      <span className="font-bold" style={{ color: 'var(--gz-text)' }}>{parts[0]}:</span>
                      {parts.slice(1).join(':')}
                    </>
                  ) : (
                    notif
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Forwarded Message */}
      {scene.forwardedMessage && (
        <div className="mb-8 animate-slide-up">
          <div 
            className="flex flex-col gap-2 rounded-[12px] p-[12px_14px]"
            style={{ 
              background: 'var(--gz-panel-2)', 
              border: '1px solid var(--gz-line)',
              borderLeft: '4px solid var(--gz-safe)' 
            }}
          >
            {scene.forwardedMessage.label && (
              <div className="font-mono text-[11px] italic" style={{ color: 'var(--gz-muted)' }}>
                {scene.forwardedMessage.label}
              </div>
            )}
            <div className="font-mono text-[12px] font-bold" style={{ color: 'var(--gz-text)' }}>
              {scene.forwardedMessage.sender}
            </div>
            <div className="text-[13.5px] leading-relaxed" style={{ color: 'var(--gz-muted)', fontFamily: 'Manrope, Inter, sans-serif' }}>
              {scene.forwardedMessage.body}
            </div>
            {scene.forwardedMessage.footer && (
              <div className="font-mono text-[12px] break-words pt-1" style={{ color: 'var(--gz-warn)' }}>
                {scene.forwardedMessage.footer}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scam Preview */}
      {scene.scamPreview && (
        <div className="mb-8 animate-slide-up">
          <div 
            className="flex flex-col rounded-[12px] overflow-hidden"
            style={{ 
              background: 'var(--gz-panel-2)', 
              border: '1px solid var(--gz-line)',
              borderTop: '3px solid var(--gz-danger)' 
            }}
          >
            <div className="p-[12px_14px]" style={{ borderBottom: '1px solid var(--gz-line)' }}>
              <div className="font-mono text-[11px] mb-1" style={{ color: 'var(--gz-muted)' }}>
                {scene.scamPreview.label}
              </div>
              <div className="font-bold text-[13.5px] uppercase leading-tight" style={{ color: 'var(--gz-text)' }}>
                {scene.scamPreview.title}
              </div>
            </div>
            <div className="p-[12px_14px]">
              <div className="rounded-full p-[4px_12px] mb-3 inline-block" style={{ background: 'var(--gz-bg)', border: '1px solid var(--gz-line)' }}>
                <span className="font-mono text-[12px]" style={{ color: 'var(--gz-muted)' }}>{scene.scamPreview.url}</span>
              </div>
              <div className="text-[13.5px] leading-relaxed mb-2" style={{ color: 'var(--gz-text)', fontFamily: 'Manrope, Inter, sans-serif' }}>
                {scene.scamPreview.body}
              </div>
              {scene.scamPreview.footer && (
                <div className="font-mono text-[12px] break-words pt-1" style={{ color: 'var(--gz-warn)' }}>
                  {scene.scamPreview.footer}
                </div>
              )}
              {scene.scamPreview.note && (
                <div className="text-[12px] opacity-70 pt-2 italic" style={{ color: 'var(--gz-muted)', fontFamily: 'Manrope, Inter, sans-serif' }}>
                  {scene.scamPreview.note}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trade Offer */}
      {scene.tradeOffer && (
        <div className="mb-8 animate-slide-up">
          <div 
            className="flex flex-col gap-2 rounded-[12px] p-[12px_14px]"
            style={{ 
              background: 'var(--gz-panel-2)', 
              border: '1px solid var(--gz-line)'
            }}
          >
            <div className="font-mono text-[12px] font-bold" style={{ color: 'var(--gz-text)' }}>
              {scene.tradeOffer.sender}
            </div>
            {scene.tradeOffer.reputation && (
              <div 
                className="font-mono text-[12px] p-[4px_8px] rounded inline-block"
                style={{ 
                  background: '#151C2E', 
                  border: '1px dashed var(--gz-line)',
                  color: 'var(--gz-text)'
                }}
              >
                {scene.tradeOffer.reputation}
              </div>
            )}
            <div className="text-[13.5px] leading-relaxed" style={{ color: 'var(--gz-muted)', fontFamily: 'Manrope, Inter, sans-serif' }}>
              {scene.tradeOffer.message}
            </div>
            {scene.tradeOffer.link && (
              <div className="font-mono text-[12px] break-words pt-1" style={{ color: 'var(--gz-warn)' }}>
                {scene.tradeOffer.link}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tournament Invite (Case 5) */}
      {scene.tournamentInvite && (
        <div className="mb-8 animate-slide-up">
          <div 
            className="flex flex-col gap-2 rounded-[12px] p-[14px_16px]"
            style={{ 
              background: 'var(--gz-panel-2)', 
              border: '1px solid var(--gz-line)'
            }}
          >
            <div 
              className="font-mono font-bold text-[10px] rounded-full p-[4px_10px] inline-block self-start mb-1"
              style={{ 
                background: 'rgba(255,184,77,0.15)', 
                color: 'var(--gz-warn)',
                border: '1px solid var(--gz-warn)'
              }}
            >
              {scene.tournamentInvite.badge}
            </div>
            <div className="font-mono text-[12px] font-bold mb-1" style={{ color: 'var(--gz-stranger)' }}>
              {scene.tournamentInvite.sender}
            </div>
            <div className="text-[13.5px] leading-relaxed" style={{ color: 'var(--gz-text)', fontFamily: 'Manrope, Inter, sans-serif' }}>
              {scene.tournamentInvite.body}
            </div>
          </div>
        </div>
      )}

      {/* Threat Message (Case 6) */}
      {scene.threatMessage && (
        <div className="mb-8 animate-slide-up">
          <div 
            className="flex flex-col gap-2 rounded-[12px] p-[14px_16px]"
            style={{ 
              background: 'var(--gz-panel-2)', 
              border: '1px solid var(--gz-danger)'
            }}
          >
            <div className="font-mono text-[12px] mb-1" style={{ color: 'var(--gz-stranger)' }}>
              {scene.threatMessage.sender}
            </div>
            <div className="text-[13.5px] leading-relaxed" style={{ color: 'var(--gz-text)', fontFamily: 'Manrope, Inter, sans-serif' }}>
              {scene.threatMessage.body}
            </div>
          </div>
        </div>
      )}

      {/* Fake Message Card (Case 7) */}
      {scene.fakeMessageCard && (
        <div className="mb-8 animate-slide-up">
          <div 
            className="flex flex-col gap-2 rounded-[12px] p-[10px_12px]"
            style={{ 
              background: 'var(--gz-panel-2)', 
              border: '1px solid var(--gz-danger)'
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="font-mono text-[9.5px] rounded p-[2px_6px] uppercase"
                style={{ 
                  color: 'var(--gz-danger)',
                  border: '1px solid var(--gz-danger)'
                }}
              >
                {scene.fakeMessageCard.badge}
              </div>
              <div className="font-mono text-[12px] font-bold" style={{ color: 'var(--gz-text)' }}>
                {scene.fakeMessageCard.sender}
              </div>
            </div>
            <div className="text-[13.5px] leading-relaxed" style={{ color: 'var(--gz-muted)', fontFamily: 'Manrope, Inter, sans-serif' }}>
              {scene.fakeMessageCard.body}
            </div>
            {scene.fakeMessageCard.link && (
              <div className="font-mono text-[12px] break-words pt-1" style={{ color: 'var(--gz-warn)' }}>
                {scene.fakeMessageCard.link}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dialogue Area */}
      <div className="flex flex-col gap-6 mb-8">
        {scene.dialogue.map((line: any, i: number) => {
          const isNova = line.speaker === 'NOVA';
          let avatarColor = '#7B61FF';
          if (line.speaker === 'Zara') avatarColor = '#33D6A6';
          else if (line.speaker === 'NOVA') avatarColor = '#FFB84D';
          else if (line.speaker === 'Ammi') avatarColor = '#FF7EB6';
          else if (line.speaker === 'Sana') avatarColor = '#38BDF8';
          
          const isActive = i === currentDialogueIndex;
          const isDone = i < currentDialogueIndex;

          return (
            <DialogueBubble
              key={i}
              line={line}
              isNova={isNova}
              avatarColor={avatarColor}
              initial={line.speaker.charAt(0)}
              isActive={isActive}
              isDone={isDone}
              onComplete={handleDialogueComplete}
            />
          );
        })}
      </div>

      {/* Choices (only show when dialogue is complete) */}
      {isDialogueComplete && (
        <div className="flex flex-col gap-[10px] mb-8 animate-slide-up">
          {scene.choices.map((choice: Choice) => {
            const isSelected = selectedChoice?.id === choice.id;
            const isDisabled = selectedChoice !== null;
            
            return (
              <button
                key={choice.id}
                disabled={isDisabled}
                onClick={() => engine.selectChoice(choice)}
                className="flex items-start gap-3 p-[13px_16px] rounded-[12px] text-left transition-all duration-150"
                style={{
                  background: isSelected ? 'rgba(123,97,255,0.08)' : 'var(--gz-panel-2)',
                  border: `1px solid ${isSelected ? 'var(--gz-primary)' : 'var(--gz-line)'}`,
                  opacity: isDisabled && !isSelected ? 0.4 : 1,
                  transform: isSelected ? 'translateX(2px)' : 'none',
                  cursor: isDisabled ? 'default' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isDisabled) {
                    e.currentTarget.style.borderColor = 'var(--gz-primary)';
                    e.currentTarget.style.background = 'rgba(123,97,255,0.05)';
                    e.currentTarget.style.transform = 'translateX(2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDisabled) {
                    e.currentTarget.style.borderColor = 'var(--gz-line)';
                    e.currentTarget.style.background = 'var(--gz-panel-2)';
                    e.currentTarget.style.transform = 'none';
                  }
                }}
              >
                <span className="font-mono text-[10px] pt-0.5" style={{ color: 'var(--gz-primary)' }}>{choice.id}</span>
                <span className="font-bold text-[14.5px] leading-snug" style={{ color: 'var(--gz-text)', fontFamily: 'Manrope, Inter, sans-serif' }}>
                  {choice.text}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Feedback Block */}
      {selectedChoice && (
        <div 
          className="rounded-[14px] p-[16px_18px] mb-8 animate-slide-up"
          style={{
            background: `rgba(${selectedChoice.type === 'best' ? '51,214,166' : selectedChoice.type === 'risky' ? '255,184,77' : '255,84,104'}, 0.08)`,
            border: `1px solid var(--gz-${selectedChoice.type === 'best' ? 'safe' : selectedChoice.type === 'risky' ? 'warn' : 'danger'})`
          }}
        >
          <div 
            className="font-mono text-[11px] uppercase tracking-[1.5px] mb-2 flex items-center gap-1.5"
            style={{ color: `var(--gz-${selectedChoice.type === 'best' ? 'safe' : selectedChoice.type === 'risky' ? 'warn' : 'danger'})` }}
          >
            {(() => {
              const isDeepfakeCase = engine.currentCaseId === 'ai-deepfake-scam';
              const label = selectedChoice.type === 'best' 
                ? (isDeepfakeCase ? 'SAFE CHOICE' : '✅ SOLID CALL') 
                : selectedChoice.type === 'risky' 
                  ? (isDeepfakeCase ? 'CAUTION' : '⚠️ PARTIALLY RIGHT') 
                  : (isDeepfakeCase ? 'DANGER' : '⛔ NOT IT');
              return <span>{label}</span>;
            })()}
          </div>
          
          <div className="text-[14px] leading-relaxed mb-4" style={{ color: 'var(--gz-text)', fontFamily: 'Manrope, Inter, sans-serif' }}>
            {selectedChoice.feedback}
          </div>
          
          <div 
            className="pt-3 text-[13px] leading-relaxed"
            style={{ 
              borderTop: '1px solid var(--gz-line)',
              color: 'var(--gz-muted)',
              fontFamily: 'Manrope, Inter, sans-serif'
            }}
          >
            {(() => {
              const parts = selectedChoice.insight.split(':');
              if (parts.length > 1) {
                return (
                  <>
                    <strong style={{ color: 'var(--gz-text)' }}>{parts[0]}:</strong>
                    {parts.slice(1).join(':')}
                  </>
                );
              }
              return selectedChoice.insight;
            })()}
          </div>
        </div>
      )}

      {/* Continue Button */}
      {selectedChoice && (
        <button
          onClick={handleContinue}
          className="w-full text-white font-bold text-[14px] rounded-[12px] p-[12px_20px] transition-colors animate-fade-in"
          style={{ background: 'var(--gz-primary)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#6a52e6'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--gz-primary)'; }}
        >
          {currentSceneIndex < totalScenes - 1 ? 'Continue Investigation →' : 'See Full Debrief →'}
        </button>
      )}

    </div>
  );
}
