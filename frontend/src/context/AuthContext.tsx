"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  setActiveUser,
  syncUserJourneyWithBackend,
} from "@/lib/persistence";

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "career_compass_auth_token";
const REMEMBER_KEY = "career_compass_auth_remember";

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return (
      localStorage.getItem(TOKEN_KEY) ||
      sessionStorage.getItem(TOKEN_KEY) ||
      null
    );
  } catch {
    return null;
  }
}

function storeToken(token: string, remember: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REMEMBER_KEY, "true");
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REMEMBER_KEY);
    }
  } catch (e) {
    console.warn("Could not save auth token to storage:", e);
  }
}

function clearStoredToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.warn("Could not clear auth token:", e);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session from stored token
  useEffect(() => {
    let isMounted = true;
    const existingToken = getStoredToken();

    if (!existingToken) {
      setActiveUser(null, null);
      setIsLoading(false);
      return;
    }

    async function verifySession(t: string) {
      try {
        const res = await fetch("/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${t}`,
          },
        });

        if (res.ok) {
          const userData: User = await res.json();
          if (isMounted) {
            setUser(userData);
            setToken(t);
            setActiveUser(userData.id, t);
            // Sync journey in background
            syncUserJourneyWithBackend(t, userData.id).catch((err) =>
              console.warn("Journey sync error on init:", err)
            );
          }
        } else {
          // Token is invalid or expired
          clearStoredToken();
          if (isMounted) {
            setUser(null);
            setToken(null);
            setActiveUser(null, null);
          }
        }
      } catch (err) {
        console.warn("Session check failed (network/offline):", err);
        // Do not immediately clear token on network failure, but stop loading
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    verifySession(existingToken);

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string,
      rememberMe: boolean = true
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            remember_me: rememberMe,
          }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const message =
            data?.detail?.message ||
            data?.message ||
            "Invalid email or password. Please try again.";
          return { success: false, error: message };
        }

        const authToken: string = data.token;
        const authUser: User = data.user;

        storeToken(authToken, rememberMe);
        setUser(authUser);
        setToken(authToken);
        setActiveUser(authUser.id, authToken);

        // Safe merge and sync journey with backend
        try {
          await syncUserJourneyWithBackend(authToken, authUser.id);
        } catch (e) {
          console.warn("Journey sync after login error:", e);
        }

        return { success: true };
      } catch (e: any) {
        return {
          success: false,
          error:
            e?.message ||
            "Unable to connect to server. Please check your connection.",
        };
      }
    },
    []
  );

  const signup = useCallback(
    async (
      name: string,
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/v1/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          let message = "Registration failed. Please check your information.";
          if (data?.detail?.message) {
            message = data.detail.message;
          } else if (Array.isArray(data?.detail)) {
            message = data.detail.map((d: any) => d.msg).join(", ");
          } else if (data?.message) {
            message = data.message;
          }
          return { success: false, error: message };
        }

        const authToken: string = data.token;
        const authUser: User = data.user;

        storeToken(authToken, true);
        setUser(authUser);
        setToken(authToken);
        setActiveUser(authUser.id, authToken);

        // Safe merge and sync journey with backend
        try {
          await syncUserJourneyWithBackend(authToken, authUser.id);
        } catch (e) {
          console.warn("Journey sync after signup error:", e);
        }

        return { success: true };
      } catch (e: any) {
        return {
          success: false,
          error:
            e?.message ||
            "Unable to connect to server. Please check your connection.",
        };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    const currentToken = token || getStoredToken();
    if (currentToken) {
      fetch("/api/v1/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      }).catch(() => {});
    }

    clearStoredToken();
    setUser(null);
    setToken(null);
    setActiveUser(null, null);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
