import { motion } from 'framer-motion';
import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';

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

type ShopCategory = 'avatars' | 'themes' | 'powerups' | 'accessories';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: ShopCategory;
  owned?: boolean;
  equipped?: boolean;
  isNew?: boolean;
  isHot?: boolean;
}

const shopItems: ShopItem[] = [
  // Avatars
  { id: 'avatar-dragon', name: 'Dragon', description: 'Fierce and legendary', price: 500, icon: '🐉', category: 'avatars', isNew: true },
  { id: 'avatar-unicorn', name: 'Unicorn', description: 'Magical and rare', price: 400, icon: '🦄', category: 'avatars' },
  { id: 'avatar-robot', name: 'Robot', description: 'Beep boop!', price: 350, icon: '🤖', category: 'avatars' },
  { id: 'avatar-alien', name: 'Alien', description: 'From outer space', price: 450, icon: '👽', category: 'avatars' },
  { id: 'avatar-wizard', name: 'Wizard', description: 'Master of magic', price: 600, icon: '🧙', category: 'avatars', isHot: true },
  { id: 'avatar-ninja', name: 'Ninja', description: 'Swift and silent', price: 550, icon: '🥷', category: 'avatars' },
  { id: 'avatar-astronaut', name: 'Astronaut', description: 'Space explorer', price: 500, icon: '👨‍🚀', category: 'avatars' },
  { id: 'avatar-rocket', name: 'Rocket', description: 'Ready for launch', price: 200, icon: '🚀', category: 'avatars', owned: true, equipped: true },

  // Themes
  { id: 'theme-galaxy', name: 'Galaxy Theme', description: 'Stars and nebulae', price: 800, icon: '🌌', category: 'themes', isNew: true },
  { id: 'theme-ocean', name: 'Ocean Theme', description: 'Deep sea vibes', price: 600, icon: '🌊', category: 'themes' },
  { id: 'theme-forest', name: 'Forest Theme', description: 'Nature inspired', price: 500, icon: '🌲', category: 'themes' },
  { id: 'theme-candy', name: 'Candy Theme', description: 'Sweet and colorful', price: 700, icon: '🍭', category: 'themes', isHot: true },

  // Power-ups
  { id: 'powerup-hint', name: 'Hint Pack (5)', description: 'Reveals answers', price: 100, icon: '💡', category: 'powerups' },
  { id: 'powerup-time', name: 'Time Boost (5)', description: '+30 seconds', price: 120, icon: '⏰', category: 'powerups' },
  { id: 'powerup-shield', name: 'Shield Pack (3)', description: 'Block 1 mistake', price: 150, icon: '🛡️', category: 'powerups' },
  { id: 'powerup-xp', name: '2x XP Boost (3)', description: 'Double XP', price: 200, icon: '✨', category: 'powerups', isHot: true },

  // Accessories
  { id: 'acc-crown', name: 'Golden Crown', description: 'For royalty', price: 1000, icon: '👑', category: 'accessories', isNew: true },
  { id: 'acc-glasses', name: 'Cool Shades', description: 'Too cool for school', price: 300, icon: '😎', category: 'accessories' },
  { id: 'acc-halo', name: 'Angel Halo', description: 'Perfect behavior', price: 400, icon: '😇', category: 'accessories' },
  { id: 'acc-party', name: 'Party Hat', description: 'Celebration time', price: 250, icon: '🥳', category: 'accessories' },
];

export function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>('avatars');
  const [purchaseModal, setPurchaseModal] = useState<ShopItem | null>(null);

  const filteredItems = shopItems.filter(item => item.category === selectedCategory);

  const categories: { id: ShopCategory; label: string; icon: string }[] = [
    { id: 'avatars', label: 'Avatars', icon: '😀' },
    { id: 'themes', label: 'Themes', icon: '🎨' },
    { id: 'powerups', label: 'Power-ups', icon: '⚡' },
    { id: 'accessories', label: 'Accessories', icon: '👒' },
  ];

  const handlePurchase = (item: ShopItem) => {
    if (item.owned) return;
    setPurchaseModal(item);
  };

  const confirmPurchase = () => {
    // In real app, this would update state/backend
    console.log('Purchased:', purchaseModal?.name);
    setPurchaseModal(null);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar isLoggedIn={true} userProfile={mockUserProfile} />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              Spark Shop
            </h1>
            <p className="text-text-secondary">
              Spend your Sparks on awesome items!
            </p>
          </div>

          {/* Sparks balance */}
          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-neon-yellow/20 to-neon-orange/20 border border-neon-yellow/30 rounded-2xl">
            <span className="text-3xl">⚡</span>
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider">Your Sparks</p>
              <p className="text-2xl font-display font-bold text-neon-yellow">{mockUserProfile.sparks.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8 overflow-x-auto pb-2"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-xl font-display uppercase tracking-wider whitespace-nowrap
                transition-all duration-300
                ${selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-[0_0_20px_rgba(0,245,255,0.4)]'
                  : 'bg-bg-secondary text-text-secondary hover:text-white hover:bg-bg-tertiary border border-white/10'
                }
              `}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Items grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={`
                relative p-6 rounded-2xl border transition-all duration-300
                ${item.owned
                  ? 'bg-bg-secondary/50 border-neon-green/30'
                  : 'bg-bg-secondary border-white/10 hover:border-neon-cyan/50 hover:shadow-[0_0_30px_rgba(0,245,255,0.2)]'
                }
              `}
            >
              {/* Badges */}
              <div className="absolute top-4 right-4 flex gap-2">
                {item.isNew && (
                  <span className="px-2 py-1 text-xs font-display font-bold uppercase bg-neon-green/20 text-neon-green border border-neon-green/40 rounded-full">
                    New
                  </span>
                )}
                {item.isHot && (
                  <span className="px-2 py-1 text-xs font-display font-bold uppercase bg-neon-orange/20 text-neon-orange border border-neon-orange/40 rounded-full animate-pulse">
                    Hot
                  </span>
                )}
                {item.owned && (
                  <span className="px-2 py-1 text-xs font-display font-bold uppercase bg-neon-green/20 text-neon-green border border-neon-green/40 rounded-full">
                    Owned
                  </span>
                )}
              </div>

              {/* Icon */}
              <div className="text-6xl mb-4">{item.icon}</div>

              {/* Info */}
              <h3 className="font-display font-bold text-white text-lg mb-1">{item.name}</h3>
              <p className="text-text-muted text-sm mb-4">{item.description}</p>

              {/* Price/Action */}
              {item.owned ? (
                <Button
                  variant={item.equipped ? 'secondary' : 'ghost'}
                  fullWidth
                  disabled={item.equipped}
                >
                  {item.equipped ? 'Equipped' : 'Equip'}
                </Button>
              ) : (
                <button
                  onClick={() => handlePurchase(item)}
                  disabled={mockUserProfile.sparks < item.price}
                  className={`
                    w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-display uppercase tracking-wider
                    transition-all duration-300
                    ${mockUserProfile.sparks >= item.price
                      ? 'bg-gradient-to-r from-neon-yellow to-neon-orange text-bg-primary hover:shadow-[0_0_20px_rgba(255,136,0,0.5)]'
                      : 'bg-bg-tertiary text-text-muted cursor-not-allowed'
                    }
                  `}
                >
                  <span>⚡</span>
                  <span>{item.price}</span>
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Purchase modal */}
        {purchaseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setPurchaseModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-bg-secondary border border-white/10 rounded-2xl p-8 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{purchaseModal.icon}</div>
                <h2 className="text-xl font-display font-bold text-white mb-2">
                  Purchase {purchaseModal.name}?
                </h2>
                <p className="text-text-secondary mb-6">{purchaseModal.description}</p>

                <div className="flex items-center justify-center gap-2 text-2xl font-display font-bold text-neon-yellow mb-6">
                  <span>⚡</span>
                  <span>{purchaseModal.price}</span>
                </div>

                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setPurchaseModal(null)} className="flex-1">
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={confirmPurchase} className="flex-1">
                    Buy Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
