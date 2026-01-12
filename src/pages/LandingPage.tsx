import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { GameCard } from '../components/ui/GameCard';
import { GlassCard } from '../components/ui/Card';
import type { Game } from '../types';

// Game data
const games: Game[] = [
  {
    id: 'typing-master',
    name: 'Typing Master',
    description: 'Master the keyboard from home row to paragraphs. Track WPM, accuracy, and unlock new challenges.',
    icon: '⌨️',
    color: 'cyan',
    category: 'skills',
    ageRange: 'Ages 5-12',
    difficulty: 'medium',
    isHot: true,
  },
  {
    id: 'mouse-expert',
    name: 'Mouse Expert',
    description: 'Precision clicking, path tracing, and drag challenges. Become a mouse control master.',
    icon: '🖱️',
    color: 'pink',
    category: 'skills',
    ageRange: 'Ages 3-10',
    difficulty: 'easy',
  },
  {
    id: 'physics-lab',
    name: 'Physics Lab',
    description: 'Explore gravity, friction, momentum, and energy through interactive puzzle gameplay.',
    icon: '🔬',
    color: 'purple',
    category: 'academic',
    ageRange: 'Ages 6-12',
    difficulty: 'hard',
    isNew: true,
  },
  {
    id: 'math-basics',
    name: 'Math Basics',
    description: 'From counting to division. Speed math, number crunching, and story problems await.',
    icon: '➕',
    color: 'green',
    category: 'academic',
    ageRange: 'Ages 3-12',
    difficulty: 'medium',
  },
  {
    id: 'word-builder',
    name: 'Word Builder',
    description: 'Build vocabulary through spelling bees, word searches, and letter tile puzzles.',
    icon: '📝',
    color: 'orange',
    category: 'academic',
    ageRange: 'Ages 4-10',
    difficulty: 'easy',
  },
  {
    id: 'code-quest',
    name: 'Code Quest',
    description: 'Learn programming logic with visual blocks. Sequences, loops, and conditionals made fun.',
    icon: '💻',
    color: 'cyan',
    category: 'academic',
    ageRange: 'Ages 6-12',
    difficulty: 'hard',
    isNew: true,
  },
  {
    id: 'memory-matrix',
    name: 'Memory Matrix',
    description: 'Pattern recognition and memory challenges. Train your brain with increasingly complex puzzles.',
    icon: '🧠',
    color: 'pink',
    category: 'cognitive',
    ageRange: 'Ages 4-12',
    difficulty: 'medium',
  },
  {
    id: 'rhythm-reflex',
    name: 'Rhythm & Reflex',
    description: 'Beat-matching coordination training. Hit the notes, build combos, master the rhythm.',
    icon: '🎵',
    color: 'purple',
    category: 'cognitive',
    ageRange: 'Ages 5-12',
    difficulty: 'medium',
    isHot: true,
  },
];

const features = [
  {
    icon: '🎮',
    title: 'Learning Through Play',
    description: 'Kids get so immersed in gameplay that they forget they\'re learning. Every game builds real skills.',
    color: 'cyan',
  },
  {
    icon: '📊',
    title: 'Track Progress',
    description: 'Detailed analytics for parents. See exactly what your child is learning and where they excel.',
    color: 'purple',
  },
  {
    icon: '🏆',
    title: 'Earn Rewards',
    description: 'Level up, earn Sparks, unlock avatars, and compete on leaderboards. Achievement unlocked!',
    color: 'yellow',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Family Friendly',
    description: 'Multiple child profiles, parental controls, and sibling competitions. Learning is better together.',
    color: 'pink',
  },
  {
    icon: '🔒',
    title: 'Safe & Secure',
    description: 'COPPA compliant. No personal data collected from children. Parents stay in control.',
    color: 'green',
  },
  {
    icon: '📱',
    title: 'Play Anywhere',
    description: 'Install as an app on any device. Progress syncs automatically. Learn on desktop or mobile.',
    color: 'orange',
  },
];

export function LandingPage() {
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const scrollToGames = () => {
    document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-neon-cyan/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-neon-pink/10 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-neon-purple/5 blur-[150px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-10 max-w-6xl mx-auto px-4 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-purple opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-purple" />
            </span>
            <span className="text-sm font-medium">New: Physics Lab & Code Quest games now live!</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight mb-6"
          >
            <span className="block text-white">Learn.</span>
            <span className="block bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
              Play.
            </span>
            <span className="block text-white">Grow.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary mb-10"
          >
            The modern learning platform where kids{' '}
            <span className="text-neon-cyan">master real skills</span> through
            engaging games. Ages 3-12. Desktop-first. Actually fun.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="xl" glowing onClick={() => navigate('/signup')}>
              Start Learning Free
            </Button>
            <Button variant="secondary" size="xl" onClick={scrollToGames}>
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            <Stat value="8" label="Games" />
            <Stat value="50+" label="Levels" />
            <Stat value="100%" label="Fun" />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-neon-cyan rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            tag="Why BrainSpark"
            title="Learning reimagined for the digital generation"
            description="Not your typical edtech. We built something kids actually want to use."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="relative py-32">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4">
          <SectionHeader
            tag="The Games"
            title="8 games at launch. More coming soon."
            description="From typing mastery to physics puzzles, every game builds real-world skills."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {games.map((game, index) => (
              <GameCard
                key={game.id}
                game={game}
                progress={Math.floor(Math.random() * 100)}
                delay={index}
                onClick={() => navigate(`/play/${game.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader
            tag="Simple Pricing"
            title="Free to start. Premium to unlock everything."
            description="No credit card required. Cancel anytime."
          />

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <PricingCard
              tier="Free"
              price="$0"
              description="Perfect for trying out BrainSpark"
              features={[
                'All 8 games included',
                'Basic progress tracking',
                '1 child profile',
                'Daily challenges (limited)',
                'Ads between games',
              ]}
              buttonText="Start Free"
              buttonVariant="secondary"
              onButtonClick={() => navigate('/signup')}
            />
            <PricingCard
              tier="Premium"
              price="$4.99"
              period="/month"
              description="The full BrainSpark experience"
              features={[
                'Everything in Free',
                'No ads ever',
                'Up to 5 child profiles',
                'Full daily challenges & streaks',
                'Detailed parent analytics',
                'Weekly progress reports',
                'Exclusive shop items',
                'Priority new features',
              ]}
              buttonText="Go Premium"
              buttonVariant="primary"
              highlighted
              annualPrice="$35/year (save 42%)"
              onButtonClick={() => navigate('/signup')}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-12 md:p-16 rounded-3xl overflow-hidden"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 via-neon-purple/20 to-neon-pink/20" />
            <div className="absolute inset-0 backdrop-blur-xl" />

            {/* Border glow */}
            <div className="absolute inset-0 rounded-3xl border border-white/10" />
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink opacity-20 blur-xl" />

            <div className="relative z-10">
              <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6">
                Ready to spark some learning?
              </h2>
              <p className="text-xl text-text-secondary mb-10 max-w-xl mx-auto">
                Join thousands of families who've made learning fun. Start for free today.
              </p>
              <Button size="xl" glowing onClick={() => navigate('/signup')}>
                Get Started Free
              </Button>
              <p className="mt-4 text-sm text-text-muted">
                No credit card required. Works on any device.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
                  </svg>
                </div>
                <span className="font-display font-bold text-lg">
                  <span className="text-neon-cyan">Brain</span>
                  <span className="text-white">Spark</span>
                </span>
              </div>
              <p className="text-text-secondary text-sm">
                Making learning irresistibly fun for ages 3-12.
              </p>
            </div>

            <FooterColumn
              title="Product"
              links={[
                { label: 'Games', href: '#games' },
                { label: 'Features', href: '#features' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Roadmap', href: '#' },
              ]}
            />
            <FooterColumn
              title="Parents"
              links={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Progress Reports', href: '/dashboard' },
                { label: 'Parental Controls', href: '/dashboard' },
                { label: 'COPPA Info', href: '#' },
              ]}
            />
            <FooterColumn
              title="Company"
              links={[
                { label: 'About', href: '#' },
                { label: 'Blog', href: '#' },
                { label: 'Careers', href: '#' },
                { label: 'Contact', href: '#' },
              ]}
            />
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-muted text-sm">
              &copy; 2024 BrainSpark. All rights reserved.
            </p>
            <div className="flex gap-6 text-text-muted text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">COPPA</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper components

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display font-black text-3xl md:text-4xl text-neon-cyan">{value}</div>
      <div className="text-text-secondary text-sm">{label}</div>
    </div>
  );
}

function SectionHeader({
  tag,
  title,
  description,
}: {
  tag: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center max-w-3xl mx-auto"
    >
      <span className="inline-block px-4 py-1.5 rounded-full bg-neon-cyan/10 text-neon-cyan text-sm font-medium mb-4">
        {tag}
      </span>
      <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-4">
        {title}
      </h2>
      <p className="text-lg text-text-secondary">
        {description}
      </p>
    </motion.div>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: typeof features[0];
  index: number;
}) {
  const colorClasses = {
    cyan: 'from-neon-cyan/10 to-transparent border-neon-cyan/20 hover:border-neon-cyan/40',
    purple: 'from-neon-purple/10 to-transparent border-neon-purple/20 hover:border-neon-purple/40',
    yellow: 'from-neon-yellow/10 to-transparent border-neon-yellow/20 hover:border-neon-yellow/40',
    pink: 'from-neon-pink/10 to-transparent border-neon-pink/20 hover:border-neon-pink/40',
    green: 'from-neon-green/10 to-transparent border-neon-green/20 hover:border-neon-green/40',
    orange: 'from-neon-orange/10 to-transparent border-neon-orange/20 hover:border-neon-orange/40',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className={`
        relative p-6 rounded-2xl
        bg-gradient-to-b ${colorClasses[feature.color as keyof typeof colorClasses]}
        border transition-all duration-300
      `}
    >
      <div className="text-4xl mb-4">{feature.icon}</div>
      <h3 className="font-display font-bold text-xl text-white mb-2">
        {feature.title}
      </h3>
      <p className="text-text-secondary text-sm">
        {feature.description}
      </p>
    </motion.div>
  );
}

function PricingCard({
  tier,
  price,
  period,
  description,
  features,
  buttonText,
  buttonVariant,
  highlighted,
  annualPrice,
  onButtonClick,
}: {
  tier: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: 'primary' | 'secondary';
  highlighted?: boolean;
  annualPrice?: string;
  onButtonClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`
        relative p-8 rounded-3xl
        ${highlighted
          ? 'bg-gradient-to-b from-neon-purple/20 to-neon-cyan/10 border-2 border-neon-purple/50'
          : 'bg-bg-secondary border border-white/10'
        }
      `}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full text-sm font-display font-bold">
          Most Popular
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="font-display font-bold text-2xl text-white mb-2">{tier}</h3>
        <p className="text-text-secondary text-sm mb-4">{description}</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="font-display font-black text-5xl text-white">{price}</span>
          {period && <span className="text-text-muted">{period}</span>}
        </div>
        {annualPrice && (
          <p className="mt-2 text-sm text-neon-green">{annualPrice}</p>
        )}
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <svg className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>

      <Button variant={buttonVariant} fullWidth size="lg" onClick={onButtonClick}>
        {buttonText}
      </Button>
    </motion.div>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="font-display font-bold text-white mb-4">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            {link.href.startsWith('#') ? (
              <a
                href={link.href}
                className="text-text-secondary hover:text-neon-cyan transition-colors text-sm"
              >
                {link.label}
              </a>
            ) : (
              <a
                href={link.href}
                className="text-text-secondary hover:text-neon-cyan transition-colors text-sm"
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
