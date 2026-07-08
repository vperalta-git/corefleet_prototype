import { AuthState, User } from './types';
import { getUsers } from './storage';

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
  const matchedUser = getUsers().find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
  );

  if (matchedUser) {
    const { password: _password, ...safeUser } = matchedUser;
    const authState: AuthState = {
      isAuthenticated: true,
      user: safeUser,
    };
    setAuthState(authState);
    return true;
  }

  // Demo credentials fallback for any older browser state.
  if (email === DEFAULT_USER.email && password === 'admin') {
    setAuthState({ isAuthenticated: true, user: DEFAULT_USER });
    return true;
  }

  return false;
}

export function logout(): void {
  setAuthState({ isAuthenticated: false, user: null });
}
