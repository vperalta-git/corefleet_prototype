import { AuthState, User } from './types';

const STORAGE_KEY = 'corefleet_auth';
const DEFAULT_USER: User = {
  id: 'admin-001',
  email: 'admin@corefleet.com',
  name: 'Admin User',
  role: 'admin',
};

export function getAuthState(): AuthState {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  return { isAuthenticated: false, user: null };
}

export function setAuthState(state: AuthState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

export function login(email: string, password: string): boolean {
  // Demo credentials
  if (email === 'admin@corefleet.com' && password === 'admin') {
    const authState: AuthState = {
      isAuthenticated: true,
      user: DEFAULT_USER,
    };
    setAuthState(authState);
    return true;
  }
  return false;
}

export function logout(): void {
  setAuthState({ isAuthenticated: false, user: null });
}
