import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface User {
  id: number;
  email: string;
  fullName: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

// Initialize from localStorage if in browser
function createAuthStore() {
  const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false
  };

  if (browser) {
    const storedUser = localStorage.getItem('user');
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedUser && storedAccessToken && storedRefreshToken) {
      initialState.user = JSON.parse(storedUser);
      initialState.accessToken = storedAccessToken;
      initialState.refreshToken = storedRefreshToken;
      initialState.isAuthenticated = true;
    }
  }

  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,
    login: (user: User, accessToken: string, refreshToken: string) => {
      if (browser) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      }
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true
      });
    },
    logout: () => {
      if (browser) {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false
      });
    },
    updateAccessToken: (newAccessToken: string) => {
      if (browser) {
        localStorage.setItem('accessToken', newAccessToken);
      }
      update(state => ({
        ...state,
        accessToken: newAccessToken
      }));
    }
  };
}

export const authStore = createAuthStore();
