import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { GamesPage } from './pages/GamesPage';
import { ShopPage } from './pages/ShopPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { GamePlayPage } from './pages/GamePlayPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes (would need auth check in real app) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />

        {/* Game play routes */}
        <Route path="/play/:gameId" element={<GamePlayPage />} />

        {/* Catch-all redirect to home */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
