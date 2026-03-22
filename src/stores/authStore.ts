import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  email: string;
  childName: string;
  avatar: string;
  age: number;
}

interface StoredUser {
  email: string;
  password: string;
  childName: string;
  avatar: string;
  age: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  registeredUsers: StoredUser[];
  signup: (email: string, password: string, childName: string, avatar: string, age: number) => boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Simple synchronous hash for Zustand actions
// Client-side only - no real backend security needed
function hashPasswordSync(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Combine with a longer hash for better distribution
  let hash2 = 5381;
  for (let i = 0; i < password.length; i++) {
    hash2 = ((hash2 << 5) + hash2) + password.charCodeAt(i);
    hash2 = hash2 & hash2;
  }
  return `${(hash >>> 0).toString(16)}-${(hash2 >>> 0).toString(16)}`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      registeredUsers: [],

      signup: (email: string, password: string, childName: string, avatar: string, age: number): boolean => {
        const { registeredUsers } = get();

        // Check if email is already registered
        const existingUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
          return false;
        }

        const hashedPassword = hashPasswordSync(password);
        const newUser: StoredUser = {
          email: email.toLowerCase(),
          password: hashedPassword,
          childName,
          avatar,
          age,
        };

        set({
          registeredUsers: [...registeredUsers, newUser],
          isAuthenticated: true,
          user: { email: email.toLowerCase(), childName, avatar, age },
        });

        return true;
      },

      login: (email: string, password: string): boolean => {
        const { registeredUsers } = get();
        const hashedPassword = hashPasswordSync(password);

        const matchedUser = registeredUsers.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === hashedPassword
        );

        if (matchedUser) {
          set({
            isAuthenticated: true,
            user: {
              email: matchedUser.email,
              childName: matchedUser.childName,
              avatar: matchedUser.avatar,
              age: matchedUser.age,
            },
          });
          return true;
        }

        return false;
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },
    }),
    {
      name: 'brainspark-auth',
      version: 1,
    }
  )
);
