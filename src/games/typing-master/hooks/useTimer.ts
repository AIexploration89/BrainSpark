import { useEffect, useRef, useCallback } from 'react';
import { useTypingGameStore } from '../stores/typingStore';

interface UseTimerProps {
  onComplete?: () => void;
}

export function useTimer({ onComplete }: UseTimerProps = {}) {
  const {
    gameState,
    timeRemaining,
    timerDuration,
    updateTimer,
    setTimerDuration,
  } = useTypingGameStore();

  const intervalRef = useRef<number | null>(null);

  const startTimer = useCallback((duration: number) => {
    setTimerDuration(duration);
  }, [setTimerDuration]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && timeRemaining !== null && timeRemaining > 0) {
      intervalRef.current = window.setInterval(() => {
        const newTime = (timeRemaining ?? 0) - 1;
        updateTimer(newTime);

        if (newTime <= 0) {
          stopTimer();
          onComplete?.();
        }
      }, 1000);
    } else {
      stopTimer();
    }

    return () => stopTimer();
  }, [gameState, timeRemaining, updateTimer, stopTimer, onComplete]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeRemaining,
    timerDuration,
    formattedTime: timeRemaining !== null ? formatTime(timeRemaining) : null,
    isRunning: gameState === 'playing' && timeRemaining !== null && timeRemaining > 0,
    startTimer,
    stopTimer,
  };
}
