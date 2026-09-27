'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

export interface UserProfile {
  _id?: string;
  username: string;
  email: string;
  isVerified?: boolean;
}

interface UserState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchUser: (force?: boolean) => Promise<void>;
  setUser: (user: UserProfile | null) => void;
  clearUser: () => void;
}

const customStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(name, value);
    } catch {
      // ignore
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(name);
    } catch {
      // ignore
    }
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      fetchUser: async (force = false) => {
        // If user data already exists and not forced, avoid redundant API calls
        if (get().user && !force) {
          return;
        }

        try {
          set({ loading: true, error: null });
          const response = await axios.get('/api/users/me');
          const userData = response.data?.data;
          if (userData) {
            set({ user: userData, loading: false, error: null });
          } else {
            set({ loading: false });
          }
        } catch (err: any) {
          const errorMsg = err?.response?.data?.error || err.message || 'Failed to fetch user';
          set({ error: errorMsg, loading: false });
        }
      },

      setUser: (user) => set({ user, error: null }),

      clearUser: () => set({ user: null, error: null, loading: false }),
    }),
    {
      name: 'spendlizer-user-storage',
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useUserStore;
