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
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

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
    // Only start/stop based on gameState changes
    const currentTime = useTypingGameStore.getState().timeRemaining;
    if (gameState === 'playing' && currentTime !== null && currentTime > 0) {
      // Clear any existing interval before starting a new one
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(() => {
        const latestTime = useTypingGameStore.getState().timeRemaining;
        const newTime = (latestTime ?? 0) - 1;
        updateTimer(newTime);

        if (newTime <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          onCompleteRef.current?.();
        }
      }, 1000);
    } else {
      stopTimer();
    }

    return () => stopTimer();
  }, [gameState, updateTimer, stopTimer]);

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
