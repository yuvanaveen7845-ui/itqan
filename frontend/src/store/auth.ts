import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin' | 'super_admin';
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isInitialized: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setInitialized: (val: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isInitialized: false,
  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isInitialized: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isInitialized: true });
  },
  setUser: (user) => set({ user }),
  setInitialized: (val) => set({ isInitialized: val }),
}));

// Initialize from localStorage
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (token && user) {
    try {
      useAuthStore.setState({ token, user: JSON.parse(user), isInitialized: true });
    } catch (e) {
      console.error('Failed to parse user from localStorage');
      useAuthStore.setState({ isInitialized: true });
    }
  } else {
    useAuthStore.setState({ isInitialized: true });
  }
}
