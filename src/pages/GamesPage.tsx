import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { GameCard } from '../components/ui/GameCard';
import type { Game } from '../types';

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

// All games data
const games: Game[] = [
  {
    id: 'typing-master',
    name: 'Typing Master',
    description: 'Master the keyboard from home row to full paragraphs. Track your WPM and accuracy!',
    icon: '⌨️',
    color: 'cyan',
    category: 'skills',
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
    category: 'skills',
    ageRange: '3-10',
    difficulty: 'easy',
  },
  {
    id: 'physics-lab',
    name: 'Physics Lab',
    description: 'Explore gravity, momentum, and energy through interactive experiments.',
    icon: '🔬',
    color: 'purple',
    category: 'academic',
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
    category: 'academic',
    ageRange: '3-12',
    difficulty: 'easy',
  },
  {
    id: 'word-builder',
    name: 'Word Builder',
    description: 'Build vocabulary and spelling skills with engaging word puzzles.',
    icon: '📝',
    color: 'orange',
    category: 'academic',
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
    category: 'academic',
    ageRange: '7-12',
    difficulty: 'hard',
  },
  {
    id: 'memory-matrix',
    name: 'Memory Matrix',
    description: 'Challenge your memory with patterns, sequences, and matching games.',
    icon: '🧠',
    color: 'pink',
    category: 'cognitive',
    ageRange: '3-12',
    difficulty: 'medium',
  },
  {
    id: 'rhythm-reflex',
    name: 'Rhythm & Reflex',
    description: 'Train timing and coordination with beat-matching challenges.',
    icon: '🎵',
    color: 'yellow',
    category: 'cognitive',
    ageRange: '5-12',
    difficulty: 'medium',
    isHot: true,
  },
  {
    id: 'space-exploration',
    name: 'Space Explorer',
    description: 'Journey through our solar system, discover planet facts, and test your space knowledge!',
    icon: '🚀',
    color: 'purple',
    category: 'academic',
    ageRange: '5-12',
    difficulty: 'medium',
    isNew: true,
  },
  {
    id: 'geography-explorer',
    name: 'Geography Explorer',
    description: 'Discover countries, capitals, flags, and landmarks from around the world!',
    icon: '🌍',
    color: 'cyan',
    category: 'academic',
    ageRange: '5-12',
    difficulty: 'medium',
    isNew: true,
  },
  {
    id: 'science-explorer',
    name: 'Science Explorer',
    description: 'Discover Biology, Chemistry, Physics, and Earth Science through fun experiments!',
    icon: '🔬',
    color: 'green',
    category: 'academic',
    ageRange: '5-12',
    difficulty: 'medium',
    isNew: true,
    isHot: true,
  },
  {
    id: 'history-heroes',
    name: 'History Heroes',
    description: 'Travel through time and discover the heroes who shaped our world!',
    icon: '🏛️',
    color: 'yellow',
    category: 'academic',
    ageRange: '6-12',
    difficulty: 'medium',
    isNew: true,
  },
  {
    id: 'animal-kingdom',
    name: 'Animal Kingdom',
    description: 'Discover amazing animals, their habitats, classifications, and fascinating wildlife facts!',
    icon: '🦁',
    color: 'green',
    category: 'academic',
    ageRange: '5-12',
    difficulty: 'medium',
    isNew: true,
    isHot: true,
  },
  {
    id: 'puzzle-world',
    name: 'Puzzle World',
    description: 'Challenge your brain with sliding puzzles, pattern matching, sequences, and jigsaws!',
    icon: '🧩',
    color: 'cyan',
    category: 'cognitive',
    ageRange: '5-12',
    difficulty: 'medium',
    isNew: true,
    isHot: true,
  },
];

// Mock progress
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

type FilterCategory = 'all' | 'easy' | 'medium' | 'hard';
type SortOption = 'name' | 'progress' | 'difficulty';

export function GamesPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [searchQuery, setSearchQuery] = useState('');

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
      <Navbar isLoggedIn={true} userProfile={mockUserProfile} />

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
              className="w-full pl-12 pr-4 py-3 bg-bg-secondary border border-white/10 rounded-xl text-white placeholder-text-muted focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-colors"
            />
          </div>

          {/* Difficulty filter */}
          <div className="flex gap-2">
            {(['all', 'easy', 'medium', 'hard'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
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
            {[
              { name: 'Art Studio', icon: '🎨', desc: 'Express your creativity' },
              { name: 'Music Maker', icon: '🎵', desc: 'Create melodies and learn music' },
              { name: 'Language Lab', icon: '🗣️', desc: 'Learn new languages with fun' },
              { name: 'Story Builder', icon: '📖', desc: 'Create interactive stories' },
            ].map((game, i) => (
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
