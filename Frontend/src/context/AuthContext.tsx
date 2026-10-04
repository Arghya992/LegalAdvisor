import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { authService, type AuthUser } from '@/services/authService';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getCurrentUser());

  const login = useCallback(async (email: string, password: string) => {
    const u = await authService.login(email, password);
    authService.setUser(u);
    setUser(u);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const u = await authService.register(email, password, name);
    authService.setUser(u);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
