// BrainSpark Type Definitions

export interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: 'cyan' | 'pink' | 'green' | 'orange' | 'purple' | 'yellow';
  category: 'skills' | 'academic' | 'cognitive';
  ageRange: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isNew?: boolean;
  isHot?: boolean;
}

export interface UserProfile {
  id: string;
  nickname: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  sparks: number;
  streak: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export interface GameProgress {
  gameId: string;
  completionPercent: number;
  bestScore: number;
  lastPlayed?: Date;
  totalTimePlayed: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  gameId: string;
  reward: {
    xp: number;
    sparks: number;
  };
  completed: boolean;
  expiresAt: Date;
}
