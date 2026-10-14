"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getStoredUser, getToken, saveSession } from "@/lib/auth";
import { ROUTES, dashboardRoute } from "@/lib/constants";
import { login as loginApi, signup as signupApi } from "@/lib/services/auth";
import type { LoginPayload, SignupPayload, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const stored = getStoredUser();
    setUser(token && stored ? stored : null);
    setIsLoading(false);
  }, []);

  async function login(payload: LoginPayload) {
    const { token, user: nextUser } = await loginApi(payload);
    saveSession(token, nextUser);
    setUser(nextUser);
    router.replace(dashboardRoute(nextUser.role));
  }

  async function signup(payload: SignupPayload) {
    const { token, user: nextUser } = await signupApi(payload);
    saveSession(token, nextUser);
    setUser(nextUser);
    router.replace(dashboardRoute(nextUser.role));
  }

  function logout() {
    clearSession();
    setUser(null);
    router.replace(ROUTES.login);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
