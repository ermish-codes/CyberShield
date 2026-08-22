import { useState } from 'react';
import type { CaseFile, Choice, Scene, Debrief } from '../data/cases';

export type BadgeTier = 'elite' | 'defender' | 'rookie';

export function useGameEngine(caseFile: CaseFile) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [threatMeter, setThreatMeter] = useState(50);
  const [bestCount, setBestCount] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  function selectChoice(choice: Choice) {
    if (selectedChoice) return; // Prevent multiple selections in one scene
    
    setSelectedChoice(choice);
    
    if (choice.type === 'best') {
      setBestCount(prev => prev + 1);
    }
    
    // threatDelta * 8, clamp 5 to 95
    setThreatMeter(prev => {
      let next = prev + (choice.threatDelta * 8);
      if (next < 5) next = 5;
      if (next > 95) next = 95;
      return next;
    });
  }

  function nextScene() {
    if (currentSceneIndex < caseFile.scenes.length - 1) {
      setCurrentSceneIndex(prev => prev + 1);
      setSelectedChoice(null);
    } else {
      setIsComplete(true);
    }
  }

  function getCurrentScene(): Scene {
    return caseFile.scenes[currentSceneIndex];
  }

  function getDebrief(): Debrief {
    return caseFile.debrief;
  }

  function resetGame() {
    setCurrentSceneIndex(0);
    setThreatMeter(50);
    setBestCount(0);
    setSelectedChoice(null);
    setIsComplete(false);
  }

  function calculateBadge(): BadgeTier {
    if (bestCount >= 4) return 'elite';
    if (bestCount >= 2) return 'defender';
    return 'rookie';
  }

  return {
    currentSceneIndex,
    threatMeter,
    bestCount,
    selectedChoice,
    isComplete,
    selectChoice,
    nextScene,
    getCurrentScene,
    getDebrief,
    resetGame,
    calculateBadge,
    caseFile
  };
}
