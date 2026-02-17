import { createContext, useCallback, useContext, useMemo, useState } from "react";

const JWT_KEY = "codevault_jwt";

export interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(JWT_KEY));

  const isAuthenticated = useMemo(() => !!token, [token]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulación: cualquier email/password válidos (ej. admin@codevault.com / admin)
    if (!email?.trim() || !password?.trim()) return false;
    const fakeJwt = btoa(JSON.stringify({ sub: email, iat: Date.now() }));
    localStorage.setItem(JWT_KEY, fakeJwt);
    setToken(fakeJwt);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(JWT_KEY);
    setToken(null);
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
