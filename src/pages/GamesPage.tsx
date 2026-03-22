import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { GameCard } from '../components/ui/GameCard';
import { allGames, futurePlannedGames } from '../data/games';
import { useAuthStore } from '../stores/authStore';

// Use centralized game data
const games = allGames;

// Default progress for all games
const gameProgress: Record<string, number> = Object.fromEntries(
  allGames.map(g => [g.id, 0])
);

type FilterCategory = 'all' | 'easy' | 'medium' | 'hard';
type SortOption = 'name' | 'progress' | 'difficulty';

export function GamesPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [searchQuery, setSearchQuery] = useState('');

  const userProfile = {
    nickname: user?.childName || 'Explorer',
    avatar: user?.avatar || '🚀',
    level: 1,
    xp: 0,
    xpToNextLevel: 1000,
    sparks: 0,
    streak: 0,
  };

  const filteredGames = games
    .filter(game => {
      const matchesCategory = selectedCategory === 'all' || game.difficulty === selectedCategory;
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           game.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'progress') return (gameProgress[b.id] || 0) - (gameProgress[a.id] || 0);
      if (sortBy === 'difficulty') {
        const order = { easy: 1, medium: 2, hard: 3 };
        return order[a.difficulty] - order[b.difficulty];
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar isLoggedIn={true} userProfile={userProfile} />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
            All Games
          </h1>
          <p className="text-text-secondary">
            Choose a game to start learning. New games added regularly!
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              aria-label="Search games"
              className="w-full pl-12 pr-4 py-3 bg-bg-secondary border border-white/10 rounded-xl text-white placeholder-text-muted focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-colors"
            />
          </div>

          {/* Difficulty filter */}
          <div className="flex gap-2" role="group" aria-label="Filter by difficulty">
            {(['all', 'easy', 'medium', 'hard'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className={`
                  px-4 py-3 rounded-xl text-sm font-display uppercase tracking-wider
                  transition-all duration-300
                  ${selectedCategory === cat
                    ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-[0_0_20px_rgba(0,245,255,0.4)]'
                    : 'bg-bg-secondary text-text-secondary hover:text-white hover:bg-bg-tertiary border border-white/10'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Sort games"
            className="px-4 py-3 bg-bg-secondary border border-white/10 rounded-xl text-white focus:border-neon-cyan outline-none"
          >
            <option value="name">Sort by Name</option>
            <option value="progress">Sort by Progress</option>
            <option value="difficulty">Sort by Difficulty</option>
          </select>
        </motion.div>

        {/* Games grid */}
        {filteredGames.length > 0 ? (
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
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-text-muted text-lg">No games found matching your search.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-4 text-neon-cyan hover:underline"
            >
              Clear filters
            </button>
          </motion.div>
        )}

        {/* Coming soon section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🚀</span> Coming Soon
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {futurePlannedGames.map((game, i) => (
              <motion.div
                key={game.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="p-6 bg-bg-secondary/50 border border-white/5 rounded-2xl opacity-60"
              >
                <div className="text-4xl mb-3">{game.icon}</div>
                <h3 className="font-display font-bold text-white mb-1">{game.name}</h3>
                <p className="text-text-muted text-sm">{game.desc}</p>
                <span className="inline-block mt-3 px-2 py-1 text-xs font-display uppercase bg-neon-purple/20 text-neon-purple rounded-full">
                  Coming Soon
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
