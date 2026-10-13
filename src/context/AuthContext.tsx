"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  clearAuth,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { login as loginRequest, signup as signupRequest } from "@/lib/services/auth";
import type { LoginPayload, SignupPayload, User, UserRole } from "@/types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  signup: (payload: SignupPayload) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function dashboardForRole(role: UserRole) {
  return role === "brand" ? ROUTES.brand : ROUTES.creator;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getStoredUser();
    setTokenState(storedToken);
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const persistSession = useCallback((nextToken: string, nextUser: User) => {
    setToken(nextToken);
    setStoredUser(nextUser);
    setTokenState(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const data = await loginRequest(payload);
      persistSession(data.token, data.user);
      router.replace(dashboardForRole(data.user.role));
      return data.user;
    },
    [persistSession, router]
  );

  const signup = useCallback(
    async (payload: SignupPayload) => {
      const data = await signupRequest(payload);
      persistSession(data.token, data.user);
      router.replace(dashboardForRole(data.user.role));
      return data.user;
    },
    [persistSession, router]
  );

  const logout = useCallback(() => {
    clearAuth();
    setTokenState(null);
    setUser(null);
    router.replace(ROUTES.login);
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      login,
      signup,
      logout,
    }),
    [user, token, isLoading, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
