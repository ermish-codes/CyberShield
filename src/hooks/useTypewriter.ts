import { useState, useEffect, useCallback } from 'react';

export function useTypewriter(text: string, speed: number = 30) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const startTyping = useCallback(() => {
    setDisplayedText('');
    setIsComplete(false);
    let index = 0;
    
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index));
      index++;
      if (index > text.length) {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, speed]);

  useEffect(() => {
    const cleanup = startTyping();
    return cleanup;
  }, [startTyping]);

  return { displayedText, isComplete, startTyping };
}
