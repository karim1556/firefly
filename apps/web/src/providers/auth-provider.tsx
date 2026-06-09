"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";
import { isMockToken, mockLogin, mockRefresh, mockRequest } from "@/lib/mock-api";
import type { AuthUser, Role } from "@/lib/types";

type SessionState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
};

type AuthContextValue = SessionState & {
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAsRole: (role: Role) => Promise<void>;
  logout: () => Promise<void>;
  authFetch: <T>(path: string, init?: RequestInit) => Promise<T>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "firefly.session.v1";
const ALLOW_NO_DB_MODE = process.env.NEXT_PUBLIC_ALLOW_NO_DB !== "false";

const roleCredentials: Partial<Record<Role, { email: string; password: string }>> = {
  ADMIN: { email: "admin@firefly.local", password: "Firefly@123" },
  COUNSELLOR: { email: "counsellor@firefly.local", password: "Firefly@123" },
  TEACHER: { email: "teacher@firefly.local", password: "Firefly@123" },
  PARENT: { email: "parent@firefly.local", password: "Firefly@123" },
  STUDENT: { email: "student@firefly.local", password: "Firefly@123" }
};

function readStoredSession(): SessionState {
  if (typeof window === "undefined") {
    return { user: null, accessToken: null, refreshToken: null };
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return { user: null, accessToken: null, refreshToken: null };
  }

  try {
    const parsed = JSON.parse(stored) as SessionState;
    return {
      user: parsed.user,
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken
    };
  } catch {
    return { user: null, accessToken: null, refreshToken: null };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>({ user: null, accessToken: null, refreshToken: null });
  const [isHydrated, setIsHydrated] = useState(false);

  const persistSession = useCallback((nextState: SessionState) => {
    setState(nextState);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    }
  }, []);

  const clearSession = useCallback(() => {
    const cleared = { user: null, accessToken: null, refreshToken: null };
    setState(cleared);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    setState(readStoredSession());
    setIsHydrated(true);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message ?? "Unable to sign in");
        }

        persistSession({
          user: payload.user,
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken
        });

        toast.success(`Welcome back, ${payload.user.fullName}`);
      } catch (error) {
        if (!ALLOW_NO_DB_MODE) {
          throw error;
        }

        const payload = mockLogin(email);

        persistSession({
          user: payload.user,
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken
        });

        toast.info("Preview mode enabled (running without database)");
      }
    },
    [persistSession]
  );

  const refreshAccessToken = useCallback(async () => {
    if (!state.refreshToken) {
      throw new Error("Missing refresh token");
    }

    if (isMockToken(state.refreshToken)) {
      const payload = mockRefresh();

      const nextState: SessionState = {
        user: state.user,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken
      };

      persistSession(nextState);
      return payload.accessToken;
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refreshToken: state.refreshToken })
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload?.message ?? "Session refresh failed");
    }

    const nextState: SessionState = {
      user: state.user,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken
    };

    persistSession(nextState);

    return payload.accessToken as string;
  }, [persistSession, state.refreshToken, state.user]);

  const authFetch = useCallback(
    async <T,>(path: string, init: RequestInit = {}) => {
      if (ALLOW_NO_DB_MODE && isMockToken(state.accessToken)) {
        return mockRequest<T>(path, init, state.user);
      }

      const runRequest = async (token: string | null) => {
        const headers = new Headers(init.headers ?? {});

        if (!headers.has("Content-Type") && init.body) {
          headers.set("Content-Type", "application/json");
        }

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }

        return fetch(`${API_BASE_URL}${path}`, {
          ...init,
          headers
        });
      };

      let response: Response;

      try {
        response = await runRequest(state.accessToken);
      } catch (error) {
        if (ALLOW_NO_DB_MODE) {
          return mockRequest<T>(path, init, state.user);
        }

        throw error;
      }

      if (response.status === 401 && state.refreshToken) {
        try {
          const nextAccessToken = await refreshAccessToken();
          response = await runRequest(nextAccessToken);
        } catch {
          clearSession();
          throw new Error("Session expired. Please sign in again.");
        }
      }

      if (!response.ok) {
        if (ALLOW_NO_DB_MODE && response.status >= 500) {
          return mockRequest<T>(path, init, state.user);
        }

        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody?.message ?? "Request failed");
      }

      if (response.status === 204) {
        return null as T;
      }

      return (await response.json()) as T;
    },
    [clearSession, refreshAccessToken, state.accessToken, state.refreshToken, state.user]
  ) as AuthContextValue["authFetch"];

  const loginAsRole = useCallback<AuthContextValue["loginAsRole"]>(
    async (role) => {
      const credentials = roleCredentials[role];

      if (!credentials) {
        throw new Error("No seeded credentials configured for this role");
      }

      return login(credentials.email, credentials.password);
    },
    [login]
  );

  const logout = useCallback(async () => {
    try {
      if (state.refreshToken && !isMockToken(state.refreshToken)) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ refreshToken: state.refreshToken })
        });
      }
    } finally {
      clearSession();
      toast.success("You are now logged out");
    }
  }, [clearSession, state.refreshToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      isHydrated,
      login,
      loginAsRole,
      logout,
      authFetch
    }),
    [authFetch, isHydrated, login, loginAsRole, logout, state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return context;
}
