import { motion } from 'framer-motion';
import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';

// Mock user profile
const mockUserProfile = {
  nickname: 'SparkMaster',
  avatar: '🚀',
  level: 12,
  xp: 2450,
  xpToNextLevel: 3000,
  sparks: 1250,
  streak: 7,
};

type LeaderboardType = 'global' | 'weekly' | 'family';

interface LeaderboardEntry {
  rank: number;
  nickname: string;
  avatar: string;
  level: number;
  xp: number;
  isCurrentUser?: boolean;
}

const globalLeaderboard: LeaderboardEntry[] = [
  { rank: 1, nickname: 'MegaMind', avatar: '🧠', level: 45, xp: 125000 },
  { rank: 2, nickname: 'StarKid', avatar: '⭐', level: 42, xp: 118000 },
  { rank: 3, nickname: 'NinjaLearner', avatar: '🥷', level: 40, xp: 112000 },
  { rank: 4, nickname: 'RocketGirl', avatar: '🚀', level: 38, xp: 105000 },
  { rank: 5, nickname: 'DragonMaster', avatar: '🐉', level: 36, xp: 98000 },
  { rank: 6, nickname: 'UniKorn', avatar: '🦄', level: 35, xp: 94000 },
  { rank: 7, nickname: 'CoolCat', avatar: '🐱', level: 33, xp: 88000 },
  { rank: 8, nickname: 'WizardKid', avatar: '🧙', level: 31, xp: 82000 },
  { rank: 9, nickname: 'SpaceExplorer', avatar: '👨‍🚀', level: 29, xp: 76000 },
  { rank: 10, nickname: 'PixelPro', avatar: '🎮', level: 27, xp: 71000 },
  { rank: 47, nickname: 'SparkMaster', avatar: '🚀', level: 12, xp: 2450, isCurrentUser: true },
];

const weeklyLeaderboard: LeaderboardEntry[] = [
  { rank: 1, nickname: 'SpeedDemon', avatar: '⚡', level: 28, xp: 4500 },
  { rank: 2, nickname: 'QuickLearner', avatar: '📚', level: 25, xp: 4200 },
  { rank: 3, nickname: 'BrainStorm', avatar: '🌪️', level: 22, xp: 3800 },
  { rank: 4, nickname: 'SparkMaster', avatar: '🚀', level: 12, xp: 3200, isCurrentUser: true },
  { rank: 5, nickname: 'MathWiz', avatar: '🔢', level: 19, xp: 2900 },
  { rank: 6, nickname: 'WordSmith', avatar: '✍️', level: 17, xp: 2600 },
  { rank: 7, nickname: 'CodeKid', avatar: '💻', level: 15, xp: 2300 },
  { rank: 8, nickname: 'MemoryAce', avatar: '🃏', level: 14, xp: 2000 },
  { rank: 9, nickname: 'RhythmRider', avatar: '🎵', level: 13, xp: 1800 },
  { rank: 10, nickname: 'PhysicsPhenom', avatar: '🔬', level: 11, xp: 1500 },
];

const familyLeaderboard: LeaderboardEntry[] = [
  { rank: 1, nickname: 'SparkMaster', avatar: '🚀', level: 12, xp: 2450, isCurrentUser: true },
  { rank: 2, nickname: 'LittleStar', avatar: '⭐', level: 8, xp: 1200 },
  { rank: 3, nickname: 'MiniNinja', avatar: '🥷', level: 5, xp: 650 },
];

export function LeaderboardPage() {
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('global');

  const leaderboards = {
    global: globalLeaderboard,
    weekly: weeklyLeaderboard,
    family: familyLeaderboard,
  };

  const currentLeaderboard = leaderboards[leaderboardType];

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'from-yellow-500/30 to-yellow-600/10 border-yellow-500/50';
    if (rank === 2) return 'from-gray-400/30 to-gray-500/10 border-gray-400/50';
    if (rank === 3) return 'from-orange-600/30 to-orange-700/10 border-orange-600/50';
    return 'from-bg-secondary to-bg-secondary border-white/10';
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar isLoggedIn={true} userProfile={mockUserProfile} />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
            Leaderboard
          </h1>
          <p className="text-text-secondary">
            See how you rank against other learners!
          </p>
        </motion.div>

        {/* Leaderboard type tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-2 mb-8"
        >
          {[
            { id: 'global' as const, label: 'Global', icon: '🌍' },
            { id: 'weekly' as const, label: 'This Week', icon: '📅' },
            { id: 'family' as const, label: 'Family', icon: '👨‍👩‍👧‍👦' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setLeaderboardType(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-xl font-display uppercase tracking-wider
                transition-all duration-300
                ${leaderboardType === tab.id
                  ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-[0_0_20px_rgba(0,245,255,0.4)]'
                  : 'bg-bg-secondary text-text-secondary hover:text-white hover:bg-bg-tertiary border border-white/10'
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Top 3 podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center items-end gap-4 mb-8"
        >
          {/* 2nd place */}
          {currentLeaderboard[1] && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-4xl border-4 border-gray-400/50">
                {currentLeaderboard[1].avatar}
              </div>
              <p className="font-display font-bold text-white text-sm">{currentLeaderboard[1].nickname}</p>
              <p className="text-text-muted text-xs">Lvl {currentLeaderboard[1].level}</p>
              <div className="mt-2 w-20 h-16 bg-gradient-to-t from-gray-600 to-gray-500 rounded-t-lg flex items-center justify-center">
                <span className="text-2xl">🥈</span>
              </div>
            </div>
          )}

          {/* 1st place */}
          {currentLeaderboard[0] && (
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-2 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-5xl border-4 border-yellow-400/50 shadow-[0_0_30px_rgba(255,200,0,0.5)]">
                {currentLeaderboard[0].avatar}
              </div>
              <p className="font-display font-bold text-white">{currentLeaderboard[0].nickname}</p>
              <p className="text-text-muted text-xs">Lvl {currentLeaderboard[0].level}</p>
              <div className="mt-2 w-24 h-24 bg-gradient-to-t from-yellow-600 to-yellow-500 rounded-t-lg flex items-center justify-center">
                <span className="text-3xl">🥇</span>
              </div>
            </div>
          )}

          {/* 3rd place */}
          {currentLeaderboard[2] && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center text-4xl border-4 border-orange-600/50">
                {currentLeaderboard[2].avatar}
              </div>
              <p className="font-display font-bold text-white text-sm">{currentLeaderboard[2].nickname}</p>
              <p className="text-text-muted text-xs">Lvl {currentLeaderboard[2].level}</p>
              <div className="mt-2 w-20 h-12 bg-gradient-to-t from-orange-800 to-orange-700 rounded-t-lg flex items-center justify-center">
                <span className="text-2xl">🥉</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Leaderboard list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          {currentLeaderboard.slice(3).map((entry, i) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className={`
                flex items-center gap-4 p-4 rounded-xl border
                bg-gradient-to-r ${getRankStyle(entry.rank)}
                ${entry.isCurrentUser ? 'ring-2 ring-neon-cyan' : ''}
              `}
            >
              {/* Rank */}
              <div className="w-12 text-center font-display font-bold text-lg text-text-secondary">
                {getRankBadge(entry.rank)}
              </div>

              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center text-2xl">
                {entry.avatar}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className={`font-display font-bold ${entry.isCurrentUser ? 'text-neon-cyan' : 'text-white'}`}>
                  {entry.nickname}
                  {entry.isCurrentUser && <span className="ml-2 text-xs text-neon-cyan">(You)</span>}
                </p>
                <p className="text-text-muted text-sm">Level {entry.level}</p>
              </div>

              {/* XP */}
              <div className="text-right">
                <p className="font-display font-bold text-neon-purple">{entry.xp.toLocaleString()}</p>
                <p className="text-text-muted text-xs">XP</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Your rank card (if not in top 10) */}
        {leaderboardType === 'global' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 p-6 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border border-neon-cyan/30 rounded-2xl"
          >
            <p className="text-text-secondary text-sm mb-2">Your Global Rank</p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-3xl">
                {mockUserProfile.avatar}
              </div>
              <div className="flex-1">
                <p className="font-display font-bold text-white text-xl">{mockUserProfile.nickname}</p>
                <p className="text-text-muted">Level {mockUserProfile.level}</p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-4xl text-neon-cyan">#47</p>
                <p className="text-text-muted text-sm">of 10,234 learners</p>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
