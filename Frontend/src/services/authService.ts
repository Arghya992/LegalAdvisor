const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  token?: string;
};

export const authService = {
  async login(email: string, password: string): Promise<AuthUser> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Invalid credentials');
    }

    return res.json();
  },

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<AuthUser> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Registration failed');
    }

    return res.json();
  },

  getCurrentUser(): AuthUser | null {
    const stored = localStorage.getItem('legal_advisor_user');
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  setUser(user: AuthUser | null) {
    if (user) {
      localStorage.setItem('legal_advisor_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('legal_advisor_user');
    }
  },

  logout() {
    this.setUser(null);
  },
};