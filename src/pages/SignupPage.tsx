import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    childName: '',
    childAge: '',
    avatar: '🚀',
  });
  const [isLoading, setIsLoading] = useState(false);

  const avatars = ['🚀', '🦄', '🐱', '🐶', '🦊', '🐼', '🦁', '🐸', '🦋', '🌟', '🎮', '⚡'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    setIsLoading(true);
    // Simulate signup - in real app, this would call auth API
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`Sign up with ${provider}`);
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-[0_0_20px_rgba(0,245,255,0.4)]">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
            </svg>
          </div>
          <span className="font-display font-bold text-2xl">
            <span className="text-neon-cyan">Brain</span>
            <span className="text-white">Spark</span>
          </span>
        </Link>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-3 h-3 rounded-full transition-colors ${step >= 1 ? 'bg-neon-cyan' : 'bg-bg-tertiary'}`} />
          <div className={`w-12 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-neon-cyan' : 'bg-bg-tertiary'}`} />
          <div className={`w-3 h-3 rounded-full transition-colors ${step >= 2 ? 'bg-neon-cyan' : 'bg-bg-tertiary'}`} />
        </div>

        {/* Signup card */}
        <div className="bg-bg-secondary/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          {step === 1 ? (
            <>
              <h1 className="text-2xl font-display font-bold text-white text-center mb-2">
                Create Your Account
              </h1>
              <p className="text-text-secondary text-center mb-6">
                Start your family's learning adventure today
              </p>

              {/* Social signup buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleSocialSignup('google')}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-800 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={() => handleSocialSignup('apple')}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-colors border border-white/20"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Continue with Apple
                </button>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-bg-secondary text-text-muted">or sign up with email</span>
                </div>
              </div>

              {/* Email form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                    Parent Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-primary border border-white/10 rounded-xl text-white placeholder-text-muted focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-colors"
                    placeholder="parent@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-primary border border-white/10 rounded-xl text-white placeholder-text-muted focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-colors"
                    placeholder="Create a password"
                    required
                    minLength={8}
                  />
                  <p className="mt-1 text-xs text-text-muted">At least 8 characters</p>
                </div>

                <Button type="submit" variant="primary" fullWidth>
                  Continue
                </Button>
              </form>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-2xl font-display font-bold text-white text-center mb-2">
                  Set Up Child Profile
                </h1>
                <p className="text-text-secondary text-center mb-6">
                  Create a profile for your child to start learning
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar selection */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-3">
                      Choose an Avatar
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {avatars.map((avatar) => (
                        <button
                          key={avatar}
                          type="button"
                          onClick={() => setFormData({ ...formData, avatar })}
                          className={`
                            w-12 h-12 rounded-xl text-2xl flex items-center justify-center
                            transition-all duration-200
                            ${formData.avatar === avatar
                              ? 'bg-gradient-to-br from-neon-cyan to-neon-purple scale-110 shadow-[0_0_20px_rgba(0,245,255,0.5)]'
                              : 'bg-bg-primary hover:bg-bg-tertiary border border-white/10'
                            }
                          `}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="childName" className="block text-sm font-medium text-text-secondary mb-2">
                      Child's Nickname
                    </label>
                    <input
                      type="text"
                      id="childName"
                      value={formData.childName}
                      onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                      className="w-full px-4 py-3 bg-bg-primary border border-white/10 rounded-xl text-white placeholder-text-muted focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-colors"
                      placeholder="SparkMaster"
                      required
                    />
                    <p className="mt-1 text-xs text-text-muted">This will be displayed in the app</p>
                  </div>

                  <div>
                    <label htmlFor="childAge" className="block text-sm font-medium text-text-secondary mb-2">
                      Child's Age
                    </label>
                    <select
                      id="childAge"
                      value={formData.childAge}
                      onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                      className="w-full px-4 py-3 bg-bg-primary border border-white/10 rounded-xl text-white focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-colors"
                      required
                    >
                      <option value="">Select age</option>
                      {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((age) => (
                        <option key={age} value={age}>{age} years old</option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-text-muted">Helps personalize the learning experience</p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? 'Creating...' : 'Start Learning!'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </>
          )}

          {/* Login link */}
          {step === 1 && (
            <p className="mt-6 text-center text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-neon-cyan hover:underline font-medium">
                Log in
              </Link>
            </p>
          )}
        </div>

        {/* Terms */}
        <p className="mt-6 text-center text-text-muted text-xs">
          By signing up, you agree to our{' '}
          <Link to="/terms" className="text-neon-cyan hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-neon-cyan hover:underline">Privacy Policy</Link>
        </p>

        {/* Back to home */}
        <p className="mt-4 text-center">
          <Link to="/" className="text-text-muted hover:text-white transition-colors">
            ← Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
