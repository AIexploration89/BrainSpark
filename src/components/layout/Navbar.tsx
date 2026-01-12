import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

interface NavbarProps {
  isLoggedIn?: boolean;
  userProfile?: {
    nickname: string;
    avatar: string;
    level: number;
    xp: number;
    xpToNextLevel: number;
    sparks: number;
    streak: number;
  };
}

export function Navbar({ isLoggedIn = false, userProfile }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-bg-primary/80 backdrop-blur-xl border-b border-white/5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
              {/* Logo icon - lightning bolt */}
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-[0_0_20px_rgba(0,245,255,0.4)] group-hover:shadow-[0_0_30px_rgba(0,245,255,0.6)] transition-shadow">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
                  </svg>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-neon-cyan/50 blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
              </div>

              <span className="font-display font-bold text-xl md:text-2xl">
                <span className="text-neon-cyan">Brain</span>
                <span className="text-white">Spark</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!isLoggedIn ? (
              <>
                <NavLink href="#features">Features</NavLink>
                <NavLink href="#games">Games</NavLink>
                <NavLink href="#pricing">Pricing</NavLink>
                <NavLink href="#parents">For Parents</NavLink>
              </>
            ) : (
              <>
                <NavLink href="/dashboard" isRoute>Dashboard</NavLink>
                <NavLink href="/games" isRoute>Games</NavLink>
                <NavLink href="/shop" isRoute>Shop</NavLink>
                <NavLink href="/leaderboard" isRoute>Leaderboard</NavLink>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex"
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </Button>
              </>
            ) : (
              userProfile && <UserBadge profile={userProfile} />
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={false}
          animate={{
            height: mobileMenuOpen ? 'auto' : 0,
            opacity: mobileMenuOpen ? 1 : 0
          }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2">
            {!isLoggedIn ? (
              <>
                <MobileNavLink href="#features">Features</MobileNavLink>
                <MobileNavLink href="#games">Games</MobileNavLink>
                <MobileNavLink href="#pricing">Pricing</MobileNavLink>
                <MobileNavLink href="#parents">For Parents</MobileNavLink>
                <div className="pt-4 space-y-2 border-t border-white/10">
                  <Button variant="ghost" fullWidth onClick={() => navigate('/login')}>
                    Log In
                  </Button>
                  <Button variant="primary" fullWidth onClick={() => navigate('/signup')}>
                    Get Started Free
                  </Button>
                </div>
              </>
            ) : (
              <>
                <MobileNavLink href="/dashboard" isRoute>Dashboard</MobileNavLink>
                <MobileNavLink href="/games" isRoute>Games</MobileNavLink>
                <MobileNavLink href="/shop" isRoute>Shop</MobileNavLink>
                <MobileNavLink href="/leaderboard" isRoute>Leaderboard</MobileNavLink>
                <div className="pt-4 border-t border-white/10">
                  <Button variant="ghost" fullWidth onClick={() => navigate('/')}>
                    Log Out
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}

function NavLink({ href, children, isRoute = false }: { href: string; children: React.ReactNode; isRoute?: boolean }) {
  const content = (
    <>
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple group-hover:w-full transition-all duration-300" />
    </>
  );

  if (isRoute) {
    return (
      <Link
        to={href}
        className="relative text-text-secondary hover:text-white font-medium transition-colors group"
      >
        <motion.span whileHover={{ y: -2 }} className="inline-block">
          {content}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.a
      href={href}
      className="relative text-text-secondary hover:text-white font-medium transition-colors group"
      whileHover={{ y: -2 }}
    >
      {content}
    </motion.a>
  );
}

function MobileNavLink({ href, children, isRoute = false }: { href: string; children: React.ReactNode; isRoute?: boolean }) {
  if (isRoute) {
    return (
      <Link
        to={href}
        className="block px-4 py-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors"
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className="block px-4 py-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors"
    >
      {children}
    </a>
  );
}

function UserBadge({ profile }: { profile: NavbarProps['userProfile'] }) {
  if (!profile) return null;

  return (
    <Link to="/dashboard">
      <motion.div
        className="flex items-center gap-3 px-3 py-1.5 bg-bg-tertiary rounded-full border border-white/10 cursor-pointer"
        whileHover={{ scale: 1.02 }}
      >
        {/* Sparks */}
        <div className="flex items-center gap-1 text-neon-yellow">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
          </svg>
          <span className="font-mono text-sm font-medium">{profile.sparks.toLocaleString()}</span>
        </div>

        {/* Streak */}
        {profile.streak > 0 && (
          <div className="flex items-center gap-1 text-neon-orange">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2c.55 0 1 .45 1 1v1c0 .55-.45 1-1 1s-1-.45-1-1V3c0-.55.45-1 1-1zm0 16c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3z" />
            </svg>
            <span className="font-mono text-sm font-medium">{profile.streak}</span>
          </div>
        )}

        {/* Avatar and level */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple p-[2px]">
            <div className="w-full h-full rounded-full bg-bg-secondary flex items-center justify-center text-sm">
              {profile.avatar}
            </div>
          </div>
          {/* Level badge */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-neon-purple flex items-center justify-center text-[10px] font-bold border-2 border-bg-primary">
            {profile.level}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
