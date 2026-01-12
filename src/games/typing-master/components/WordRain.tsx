import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useTypingGameStore } from '../stores/typingStore';
import { getWordRainWords } from '../data/wordLists';
import type { WordRainWord } from '../types';

interface WordRainProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onGameOver: () => void;
}

// Explosion particle for word completion
interface ExplosionParticle {
  id: string;
  x: number;
  y: number;
  color: string;
}

// Background data stream column
function DataStreamColumn({ index, totalColumns }: { index: number; totalColumns: number }) {
  const chars = useMemo(
    () => Array.from({ length: 30 }, () =>
      String.fromCharCode(33 + Math.floor(Math.random() * 93))
    ),
    []
  );
  const left = `${(index / totalColumns) * 100}%`;
  const delay = Math.random() * 5;
  const duration = 8 + Math.random() * 4;

  return (
    <motion.div
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: '150%', opacity: [0, 0.3, 0.3, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="absolute top-0 text-[10px] font-mono text-neon-cyan/20 whitespace-nowrap pointer-events-none"
      style={{ left, writingMode: 'vertical-rl' }}
    >
      {chars.join('')}
    </motion.div>
  );
}

// Explosion effect on word completion
function WordExplosion({ x, y, onComplete }: { x: number; y: number; onComplete: () => void }) {
  useEffect(() => {
    const timeout = setTimeout(onComplete, 800);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (i / 12) * Math.PI * 2,
        distance: 30 + Math.random() * 40,
        size: 4 + Math.random() * 4,
        color: ['#00F5FF', '#00FF88', '#FFE55C', '#FF00FF'][Math.floor(Math.random() * 4)],
      })),
    []
  );

  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      {/* Central flash */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-green"
        style={{ boxShadow: '0 0 30px rgba(0,255,136,0.8)' }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: Math.cos(p.angle) * p.distance,
            y: Math.sin(p.angle) * p.distance,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: p.color,
            boxShadow: `0 0 8px ${p.color}`,
            width: p.size,
            height: p.size,
          }}
        />
      ))}

      {/* Score popup */}
      <motion.div
        initial={{ y: 0, opacity: 1, scale: 0.5 }}
        animate={{ y: -40, opacity: 0, scale: 1.2 }}
        transition={{ duration: 0.6 }}
        className="absolute left-1/2 -translate-x-1/2 text-neon-green font-display font-bold text-lg whitespace-nowrap"
        style={{ textShadow: '0 0 10px rgba(0,255,136,0.8)' }}
      >
        +10
      </motion.div>
    </div>
  );
}

// Enhanced falling word component
function FallingWord({
  word,
  onExplosion,
}: {
  word: WordRainWord;
  onExplosion: (x: number, y: number) => void;
}) {
  const isMatching = word.typed.length > 0;
  const progress = word.typed.length / word.word.length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotateX: -30 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      exit={{
        opacity: 0,
        scale: 1.5,
        transition: { duration: 0.2 },
      }}
      style={{
        position: 'absolute',
        left: word.x,
        top: word.y,
      }}
      className="relative"
    >
      {/* Glow effect */}
      <motion.div
        animate={{
          boxShadow: isMatching
            ? [
                '0 0 20px rgba(0,255,136,0.4)',
                '0 0 40px rgba(0,255,136,0.6)',
                '0 0 20px rgba(0,255,136,0.4)',
              ]
            : '0 0 15px rgba(0,245,255,0.3)',
        }}
        transition={{ duration: 0.3, repeat: isMatching ? Infinity : 0 }}
        className={`
          px-4 py-2 rounded-lg border-2
          ${isMatching
            ? 'bg-neon-green/10 border-neon-green/60'
            : 'bg-bg-secondary/90 border-neon-cyan/30'}
          backdrop-blur-sm
        `}
      >
        {/* Progress bar */}
        {isMatching && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            className="absolute bottom-0 left-0 h-1 bg-neon-green rounded-b-lg"
          />
        )}

        {/* Scanline effect */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none opacity-20"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.1) 2px, rgba(0,245,255,0.1) 4px)',
          }}
        />

        {/* Word text */}
        <span className="font-mono text-lg font-semibold relative z-10">
          {word.word.split('').map((char, idx) => (
            <motion.span
              key={idx}
              animate={
                idx < word.typed.length
                  ? { scale: [1, 1.2, 1], color: '#00FF88' }
                  : {}
              }
              transition={{ duration: 0.15 }}
              className={
                idx < word.typed.length
                  ? 'text-neon-green'
                  : isMatching
                  ? 'text-white/80'
                  : 'text-white'
              }
              style={{
                textShadow:
                  idx < word.typed.length
                    ? '0 0 8px rgba(0,255,136,0.8)'
                    : 'none',
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>

        {/* Corner brackets for matching words */}
        {isMatching && (
          <>
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-neon-green" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-neon-green" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-neon-green" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-neon-green" />
          </>
        )}
      </motion.div>

      {/* Warning indicator when close to bottom */}
      {word.y > 280 && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.3, repeat: Infinity }}
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs text-neon-red"
        >
          ⚠️
        </motion.div>
      )}
    </motion.div>
  );
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
  const [explosions, setExplosions] = useState<ExplosionParticle[]>([]);
  const [combo, setCombo] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wordListRef = useRef<string[]>(getWordRainWords(difficulty));
  const gameLoopRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number | null>(null);

  const dataStreamColumns = 20;

  // Spawn settings based on difficulty
  const settings = {
    easy: { spawnInterval: 3000, fallSpeed: 0.5, maxWords: 5 },
    medium: { spawnInterval: 2000, fallSpeed: 0.8, maxWords: 7 },
    hard: { spawnInterval: 1500, fallSpeed: 1.2, maxWords: 10 },
  }[difficulty];

  // Generate a unique ID
  const generateId = () => Math.random().toString(36).substring(7);

  // Add explosion at position
  const addExplosion = useCallback((x: number, y: number) => {
    const id = generateId();
    setExplosions((prev) => [...prev, { id, x, y, color: '#00FF88' }]);
  }, []);

  // Remove explosion
  const removeExplosion = useCallback((id: string) => {
    setExplosions((prev) => prev.filter((e) => e.id !== id));
  }, []);

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
      y: -10,
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

        if (newY > containerHeight - 60) {
          // Word hit the bottom
          removeWordRainWord(word.id);
          loseWordRainLife();
          setCombo(0);
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
      addExplosion(matchedWord.x + 40, matchedWord.y + 20);
      removeWordRainWord(matchedWord.id);
      const newCombo = combo + 1;
      setCombo(newCombo);
      const comboBonus = Math.floor(newCombo / 3) * 5;
      addWordRainScore(matchedWord.word.length * 10 + comboBonus);
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
      className="relative w-full h-[400px] bg-bg-primary/80 rounded-2xl overflow-hidden border border-neon-cyan/20 cursor-text"
    >
      {/* Data stream background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(dataStreamColumns)].map((_, i) => (
          <DataStreamColumn key={i} index={i} totalColumns={dataStreamColumns} />
        ))}
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,245,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.5) 2px, rgba(0,245,255,0.5) 4px)',
        }}
      />

      {/* Falling words */}
      <AnimatePresence>
        {wordRainWords.map((word) => (
          <FallingWord
            key={word.id}
            word={word}
            onExplosion={addExplosion}
          />
        ))}
      </AnimatePresence>

      {/* Explosion effects */}
      <AnimatePresence>
        {explosions.map((exp) => (
          <WordExplosion
            key={exp.id}
            x={exp.x}
            y={exp.y}
            onComplete={() => removeExplosion(exp.id)}
          />
        ))}
      </AnimatePresence>

      {/* Bottom danger zone */}
      <div className="absolute bottom-0 left-0 right-0 h-14 overflow-hidden">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-t from-neon-red/30 to-transparent"
        />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-neon-red/60" />
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-0 h-[2px] w-1/4 bg-gradient-to-r from-transparent via-neon-red to-transparent"
        />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-neon-red/60 text-xs font-mono uppercase tracking-widest">
          Danger Zone
        </div>
      </div>

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
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{
            boxShadow: currentInput
              ? '0 0 30px rgba(0,245,255,0.4)'
              : '0 0 15px rgba(0,245,255,0.2)',
          }}
          className="px-8 py-3 bg-bg-secondary/90 rounded-xl border-2 border-neon-cyan/50 min-w-[220px] text-center backdrop-blur-sm"
        >
          <span className="font-mono text-xl">
            {currentInput ? (
              <span
                className="text-neon-cyan"
                style={{ textShadow: '0 0 10px rgba(0,245,255,0.8)' }}
              >
                {currentInput}
              </span>
            ) : (
              <span className="text-text-muted">Type here...</span>
            )}
          </span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-neon-cyan"
          >
            |
          </motion.span>
        </motion.div>
      </div>

      {/* Lives display */}
      <div className="absolute top-4 left-4 flex items-center gap-1">
        <span className="text-xs text-text-muted font-mono mr-2">LIVES</span>
        {Array.from({ length: 3 }).map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 1 }}
            animate={
              idx >= wordRainLives
                ? { scale: 0, opacity: 0 }
                : { scale: [1, 1.1, 1] }
            }
            transition={
              idx >= wordRainLives
                ? { duration: 0.3 }
                : { duration: 1, repeat: Infinity, delay: idx * 0.2 }
            }
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              idx < wordRainLives
                ? 'bg-neon-red/20 border border-neon-red/50'
                : 'bg-bg-tertiary border border-white/10'
            }`}
          >
            {idx < wordRainLives && (
              <span className="text-sm" style={{ filter: 'drop-shadow(0 0 4px rgba(255,51,102,0.8))' }}>
                ❤️
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Score display */}
      <div className="absolute top-4 right-4">
        <motion.div
          animate={{
            boxShadow: [
              '0 0 10px rgba(255,229,92,0.3)',
              '0 0 20px rgba(255,229,92,0.5)',
              '0 0 10px rgba(255,229,92,0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="px-5 py-2 bg-bg-secondary/90 rounded-lg border border-neon-yellow/40 backdrop-blur-sm"
        >
          <span className="text-xs text-text-muted font-mono block">SCORE</span>
          <motion.span
            key={wordRainScore}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-neon-yellow font-display font-bold text-xl"
            style={{ textShadow: '0 0 10px rgba(255,229,92,0.6)' }}
          >
            {wordRainScore}
          </motion.span>
        </motion.div>
      </div>

      {/* Combo display */}
      <AnimatePresence>
        {combo >= 3 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="px-4 py-1 bg-neon-orange/20 border border-neon-orange/50 rounded-full"
            >
              <span
                className="text-neon-orange font-display font-bold"
                style={{ textShadow: '0 0 10px rgba(255,136,0,0.8)' }}
              >
                🔥 {combo}x COMBO
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instruction hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-text-muted text-xs font-mono"
      >
        Type the falling words before they reach the danger zone!
      </motion.div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-cyan/30" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon-cyan/30" />
      <div className="absolute bottom-14 left-0 w-8 h-8 border-b-2 border-l-2 border-neon-red/30" />
      <div className="absolute bottom-14 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-red/30" />
    </div>
  );
}
