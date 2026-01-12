import { useCallback, useEffect } from 'react';
import { useTypingGameStore } from '../stores/typingStore';

interface UseTypingEngineProps {
  enabled?: boolean;
}

export function useTypingEngine({ enabled = true }: UseTypingEngineProps = {}) {
  const {
    gameState,
    characters,
    currentIndex,
    handleKeyPress,
    getWpm,
    getCpm,
    getAccuracy,
    correctStreak,
    maxStreak,
  } = useTypingGameStore();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || gameState !== 'playing') return;

      // Prevent default for typing keys to avoid browser shortcuts
      if (event.key.length === 1 || event.key === 'Backspace') {
        event.preventDefault();
      }

      // Ignore modifier keys alone
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(event.key)) {
        return;
      }

      // Handle backspace (optional feature for corrections)
      if (event.key === 'Backspace') {
        // For now, we don't allow backspace corrections
        // This could be enabled based on game mode
        return;
      }

      // Handle regular key press
      if (event.key.length === 1) {
        handleKeyPress(event.key);
      }
    },
    [enabled, gameState, handleKeyPress]
  );

  useEffect(() => {
    if (enabled && gameState === 'playing') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, gameState, handleKeyDown]);

  return {
    characters,
    currentIndex,
    currentChar: characters[currentIndex]?.char || null,
    nextChar: characters[currentIndex + 1]?.char || null,
    isComplete: currentIndex >= characters.length,
    wpm: getWpm(),
    cpm: getCpm(),
    accuracy: getAccuracy(),
    correctStreak,
    maxStreak,
  };
}
