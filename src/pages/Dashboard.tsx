import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { GameCard } from '../components/ui/GameCard';
import { GlassCard } from '../components/ui/Card';
import type { Game } from '../types';

// Mock user profile for demo
const mockUserProfile = {
  nickname: 'SparkMaster',
  avatar: '🚀',
  level: 12,
  xp: 2450,
  xpToNextLevel: 3000,
  sparks: 1250,
  streak: 7,
};

// Games data
const games: Game[] = [
  {
    id: 'typing-master',
    name: 'Typing Master',
    description: 'Master the keyboard from home row to full paragraphs. Track your WPM and accuracy!',
    icon: '⌨️',
    color: 'cyan',
    ageRange: '5-12',
    difficulty: 'easy',
    isNew: true,
  },
  {
    id: 'mouse-expert',
    name: 'Mouse Expert',
    description: 'Perfect your mouse control with precision clicking and smooth tracking.',
    icon: '🖱️',
    color: 'pink',
    ageRange: '3-10',
    difficulty: 'easy',
  },
  {
    id: 'physics-lab',
    name: 'Physics Lab',
    description: 'Explore gravity, momentum, and energy through interactive experiments.',
    icon: '🔬',
    color: 'purple',
    ageRange: '6-12',
    difficulty: 'medium',
    isHot: true,
  },
  {
    id: 'math-basics',
    name: 'Math Basics',
    description: 'From counting to multiplication, build strong math foundations.',
    icon: '➕',
    color: 'green',
    ageRange: '3-12',
    difficulty: 'easy',
  },
  {
    id: 'word-builder',
    name: 'Word Builder',
    description: 'Build vocabulary and spelling skills with engaging word puzzles.',
    icon: '📝',
    color: 'orange',
    ageRange: '4-12',
    difficulty: 'easy',
    isNew: true,
  },
  {
    id: 'code-quest',
    name: 'Code Quest',
    description: 'Learn programming logic through visual block coding adventures.',
    icon: '💻',
    color: 'cyan',
    ageRange: '7-12',
    difficulty: 'hard',
  },
  {
    id: 'memory-matrix',
    name: 'Memory Matrix',
    description: 'Challenge your memory with patterns, sequences, and matching games.',
    icon: '🧠',
    color: 'pink',
    ageRange: '3-12',
    difficulty: 'medium',
  },
  {
    id: 'rhythm-reflex',
    name: 'Rhythm & Reflex',
    description: 'Train timing and coordination with beat-matching challenges.',
    icon: '🎵',
    color: 'yellow',
    ageRange: '5-12',
    difficulty: 'medium',
    isHot: true,
  },
];

// Mock progress data
const gameProgress: Record<string, number> = {
  'typing-master': 45,
  'mouse-expert': 72,
  'physics-lab': 23,
  'math-basics': 89,
  'word-builder': 15,
  'code-quest': 8,
  'memory-matrix': 56,
  'rhythm-reflex': 34,
};

// Daily challenges
const dailyChallenges = [
  { id: 1, title: 'Type 50 words', game: 'Typing Master', progress: 32, target: 50, reward: 25 },
  { id: 2, title: 'Score 90%+ in Math', game: 'Math Basics', progress: 0, target: 1, reward: 25 },
  { id: 3, title: 'Complete 3 Physics levels', game: 'Physics Lab', progress: 1, target: 3, reward: 25 },
];

export function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const navigate = useNavigate();

  const xpPercent = (mockUserProfile.xp / mockUserProfile.xpToNextLevel) * 100;

  const filteredGames = selectedCategory === 'all'
    ? games
    : games.filter(g => g.difficulty === selectedCategory);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar isLoggedIn={true} userProfile={mockUserProfile} />

      {/* Main content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
            Welcome back, <span className="text-neon-cyan">{mockUserProfile.nickname}</span>!
          </h1>
          <p className="text-text-secondary">
            You're on a <span className="text-neon-orange font-bold">{mockUserProfile.streak} day streak</span>. Keep it up!
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon="⚡"
            label="Sparks"
            value={mockUserProfile.sparks.toLocaleString()}
            color="yellow"
            delay={0}
          />
          <StatCard
            icon="🎯"
            label="Level"
            value={mockUserProfile.level.toString()}
            color="purple"
            delay={0.1}
          />
          <StatCard
            icon="🔥"
            label="Streak"
            value={`${mockUserProfile.streak} days`}
            color="orange"
            delay={0.2}
          />
          <StatCard
            icon="⭐"
            label="XP"
            value={`${mockUserProfile.xp}/${mockUserProfile.xpToNextLevel}`}
            color="cyan"
            delay={0.3}
            showProgress
            progress={xpPercent}
          />
        </div>

        {/* Daily challenges */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📅</span> Daily Challenges
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {dailyChallenges.map((challenge, i) => (
              <GlassCard key={challenge.id} className="p-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-display font-bold text-white">{challenge.title}</h3>
                      <p className="text-text-muted text-sm">{challenge.game}</p>
                    </div>
                    <div className="flex items-center gap-1 text-neon-yellow text-sm font-mono">
                      <span>⚡</span>
                      <span>{challenge.reward}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
                    />
                  </div>
                  <p className="text-text-muted text-xs mt-2 text-right">
                    {challenge.progress}/{challenge.target}
                  </p>
                </motion.div>
              </GlassCard>
            ))}
          </div>
        </motion.section>

        {/* Games section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🎮</span> Your Games
            </h2>

            {/* Filter tabs */}
            <div className="flex gap-2">
              {(['all', 'easy', 'medium', 'hard'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-display uppercase tracking-wider
                    transition-all duration-300
                    ${selectedCategory === cat
                      ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-[0_0_20px_rgba(0,245,255,0.4)]'
                      : 'bg-bg-tertiary text-text-secondary hover:text-white hover:bg-bg-secondary border border-white/10'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Games grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game, i) => (
              <GameCard
                key={game.id}
                game={game}
                progress={gameProgress[game.id] || 0}
                delay={i}
                onClick={() => navigate(`/play/${game.id}`)}
              />
            ))}
          </div>
        </motion.section>

        {/* Recent achievements */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10"
        >
          <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🏆</span> Recent Achievements
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-bg-secondary scrollbar-thumb-neon-cyan/30">
            {[
              { name: 'Speed Demon', icon: '⚡', desc: 'Type 40+ WPM', color: 'cyan' },
              { name: 'Math Ninja', icon: '🥷', desc: 'Perfect score', color: 'green' },
              { name: '7-Day Streak', icon: '🔥', desc: 'Week warrior', color: 'orange' },
              { name: 'First Steps', icon: '👶', desc: 'Complete tutorial', color: 'purple' },
              { name: 'Pattern Pro', icon: '🧩', desc: '10 patterns', color: 'pink' },
            ].map((achievement, i) => (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className={`
                  flex-shrink-0 w-36 p-4 rounded-2xl
                  bg-gradient-to-br from-neon-${achievement.color}/20 to-transparent
                  border border-neon-${achievement.color}/30
                  hover:border-neon-${achievement.color} hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]
                  transition-all duration-300 cursor-pointer
                `}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h3 className="font-display font-bold text-white text-sm">{achievement.name}</h3>
                <p className="text-text-muted text-xs">{achievement.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}

// Stat card component
function StatCard({
  icon,
  label,
  value,
  color,
  delay,
  showProgress,
  progress,
}: {
  icon: string;
  label: string;
  value: string;
  color: 'cyan' | 'pink' | 'green' | 'orange' | 'purple' | 'yellow';
  delay: number;
  showProgress?: boolean;
  progress?: number;
}) {
  const colorClasses = {
    cyan: 'from-neon-cyan/20 border-neon-cyan/30 text-neon-cyan',
    pink: 'from-neon-pink/20 border-neon-pink/30 text-neon-pink',
    green: 'from-neon-green/20 border-neon-green/30 text-neon-green',
    orange: 'from-neon-orange/20 border-neon-orange/30 text-neon-orange',
    purple: 'from-neon-purple/20 border-neon-purple/30 text-neon-purple',
    yellow: 'from-neon-yellow/20 border-neon-yellow/30 text-neon-yellow',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`
        relative p-4 rounded-2xl
        bg-gradient-to-br ${colorClasses[color]} to-transparent
        border
        backdrop-blur-sm
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-text-muted text-xs uppercase tracking-wider">{label}</p>
          <p className="font-display font-bold text-white">{value}</p>
        </div>
      </div>
      {showProgress && progress !== undefined && (
        <div className="mt-3 h-1.5 bg-bg-primary/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: delay + 0.3 }}
            className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
          />
        </div>
      )}
    </motion.div>
  );
}
