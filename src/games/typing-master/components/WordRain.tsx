import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useTypingGameStore } from '../stores/typingStore';
import { getWordRainWords } from '../data/wordLists';
import type { WordRainWord } from '../types';

interface WordRainProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onGameOver: () => void;
}

export function WordRain({ difficulty, onGameOver }: WordRainProps) {
  const {
    wordRainWords,
    wordRainLives,
    wordRainScore,
    addWordRainWord,
    updateWordRainWord,
    removeWordRainWord,
    loseWordRainLife,
    addWordRainScore,
    gameState,
  } = useTypingGameStore();

  const [currentInput, setCurrentInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wordListRef = useRef<string[]>(getWordRainWords(difficulty));
  const gameLoopRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number | null>(null);

  // Spawn settings based on difficulty
  const settings = {
    easy: { spawnInterval: 3000, fallSpeed: 0.5, maxWords: 5 },
    medium: { spawnInterval: 2000, fallSpeed: 0.8, maxWords: 7 },
    hard: { spawnInterval: 1500, fallSpeed: 1.2, maxWords: 10 },
  }[difficulty];

  // Generate a unique ID
  const generateId = () => Math.random().toString(36).substring(7);

  // Spawn a new word
  const spawnWord = useCallback(() => {
    if (wordRainWords.length >= settings.maxWords) return;

    const words = wordListRef.current;
    const word = words[Math.floor(Math.random() * words.length)];
    const containerWidth = containerRef.current?.offsetWidth || 600;

    const newWord: WordRainWord = {
      id: generateId(),
      word,
      x: Math.random() * (containerWidth - 150) + 50,
      y: 0,
      speed: settings.fallSpeed + Math.random() * 0.3,
      typed: '',
    };

    addWordRainWord(newWord);
  }, [wordRainWords.length, settings.maxWords, settings.fallSpeed, addWordRainWord]);

  // Game loop - update word positions
  useEffect(() => {
    if (gameState !== 'playing') return;

    const updatePositions = () => {
      const containerHeight = containerRef.current?.offsetHeight || 400;

      wordRainWords.forEach((word) => {
        const newY = word.y + word.speed;

        if (newY > containerHeight - 50) {
          // Word hit the bottom
          removeWordRainWord(word.id);
          loseWordRainLife();
        } else {
          updateWordRainWord(word.id, { y: newY });
        }
      });

      gameLoopRef.current = requestAnimationFrame(updatePositions);
    };

    gameLoopRef.current = requestAnimationFrame(updatePositions);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, wordRainWords, updateWordRainWord, removeWordRainWord, loseWordRainLife]);

  // Spawn timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Initial spawn
    spawnWord();

    spawnTimerRef.current = window.setInterval(spawnWord, settings.spawnInterval);

    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
      }
    };
  }, [gameState, settings.spawnInterval, spawnWord]);

  // Check for game over
  useEffect(() => {
    if (wordRainLives <= 0) {
      onGameOver();
    }
  }, [wordRainLives, onGameOver]);

  // Handle typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setCurrentInput(value);

    // Check if input matches any falling word
    const matchedWord = wordRainWords.find(
      (w) => w.word.toLowerCase() === value
    );

    if (matchedWord) {
      // Word completed!
      removeWordRainWord(matchedWord.id);
      addWordRainScore(matchedWord.word.length * 10);
      setCurrentInput('');
    } else {
      // Update partial matches
      wordRainWords.forEach((word) => {
        if (word.word.toLowerCase().startsWith(value)) {
          updateWordRainWord(word.id, { typed: value });
        } else {
          updateWordRainWord(word.id, { typed: '' });
        }
      });
    }
  };

  // Focus input on click
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="relative w-full h-[400px] bg-bg-card/50 rounded-2xl overflow-hidden border border-white/5 cursor-text"
    >
      {/* Falling words */}
      <AnimatePresence>
        {wordRainWords.map((word) => (
          <motion.div
            key={word.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            style={{
              position: 'absolute',
              left: word.x,
              top: word.y,
            }}
            className="px-4 py-2 bg-bg-secondary rounded-lg border-2 border-neon-cyan/30 shadow-[0_0_10px_rgba(0,245,255,0.2)]"
          >
            <span className="font-mono text-lg">
              {word.word.split('').map((char, idx) => (
                <span
                  key={idx}
                  className={
                    idx < word.typed.length
                      ? 'text-neon-green'
                      : 'text-white'
                  }
                >
                  {char}
                </span>
              ))}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Bottom danger zone */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-neon-red/20 to-transparent border-t border-neon-red/30" />

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={handleInputChange}
        className="absolute opacity-0 pointer-events-none"
        autoFocus
      />

      {/* Current input display */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
        <div className="px-6 py-3 bg-bg-primary rounded-xl border-2 border-neon-cyan/50 min-w-[200px] text-center">
          <span className="font-mono text-xl text-neon-cyan">
            {currentInput || <span className="text-text-muted">Type here...</span>}
          </span>
        </div>
      </div>

      {/* Lives display */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        {Array.from({ length: 3 }).map((_, idx) => (
          <motion.span
            key={idx}
            initial={{ scale: 1 }}
            animate={idx >= wordRainLives ? { scale: 0, opacity: 0 } : {}}
            className="text-2xl"
          >
            ❤️
          </motion.span>
        ))}
      </div>

      {/* Score display */}
      <div className="absolute top-4 right-4">
        <div className="px-4 py-2 bg-bg-secondary rounded-lg">
          <span className="text-neon-yellow font-display font-bold">
            {wordRainScore}
          </span>
        </div>
      </div>

      {/* Instruction hint */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-text-muted text-sm">
        Type the falling words before they hit the bottom!
      </div>
    </div>
  );
}
